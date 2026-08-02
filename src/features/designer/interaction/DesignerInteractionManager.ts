import { viewportManager } from '../viewport/ViewportManager';
import { selectionManager } from '../selection/SelectionManager';
import { sceneGraph } from '../scenegraph/SceneGraph';
import { commandManager } from '../../../core/commands/CommandManager';
import { CreateNodeCommand, UpdateNodePropertyCommand, MoveNodeCommand, MultiMoveNodeCommand } from '../commands/NodeCommands';
import { GroupCommand, UngroupCommand } from '../commands/GroupCommands';
import { ComponentFactory } from '../components/factories/ComponentFactory';
import { cursorManager } from './CursorManager';
import { toolManager } from '../tools/ToolManager';
import { CoordinateConverter } from '../viewport/CoordinateConverter';
import { eventBus } from '../../../core/events/EventBus';
import { SystemEventType } from '../../../core/events/EventTypes';
import type { CanvasEngine } from '../canvas/CanvasEngine';
import type { DesignerNode } from '../models/DesignerNode';
import { clipboardManager } from '../services/ClipboardManager';
import { ArrangeCommand } from '../commands/ArrangeCommand';
import { TransformBox } from '../selection/TransformBox';
import { useContextMenuStore } from '../../../stores/ContextMenuStore';
import { transformManager } from '../transform/TransformManager';
import type { TransformEvent } from '../transform/TransformStrategy';

type InteractionState =
  | 'IDLE'
  | 'DRAWING'
  | 'TRANSFORMING'
  | 'MARQUEE'
  | 'PANNING';


export class DesignerInteractionManager {
  private state: InteractionState = 'IDLE';
  private canvasEngine: CanvasEngine;

  // DRAWING state
  private drawStartWorld: { x: number; y: number } = { x: 0, y: 0 };

  // TRANSFORM state
  private transformStartWorld: { x: number; y: number } = { x: 0, y: 0 };

  // PANNING
  private panLastScreen = { x: 0, y: 0 };

  constructor(canvasEngine: CanvasEngine) {
    this.canvasEngine = canvasEngine;
  }

  public attach(container: HTMLElement): () => void {
    cursorManager.setContainer(container);

    let isSpaceDown = false;

    const getRect = () => container.getBoundingClientRect();

    const screenPt = (e: MouseEvent) => ({
      x: e.clientX - getRect().left,
      y: e.clientY - getRect().top,
    });

    const toWorld = (s: { x: number; y: number }) =>
      CoordinateConverter.screenToWorld(s, viewportManager.camera);

    const createTransformEvent = (e: MouseEvent, wp: {x: number, y: number}): TransformEvent => ({
      clientX: wp.x,
      clientY: wp.y,
      shiftKey: e.shiftKey,
      altKey: e.altKey,
      ctrlKey: e.ctrlKey,
      metaKey: e.metaKey,
      startX: this.transformStartWorld.x,
      startY: this.transformStartWorld.y
    });

    // ── Command listener for real-time updates ───────────────────────────────
    const onCommandExecuted = () => this.canvasEngine.render();
    eventBus.on(SystemEventType.COMMAND_EXECUTED, onCommandExecuted);
    eventBus.on(SystemEventType.COMMAND_UNDONE, onCommandExecuted);
    eventBus.on(SystemEventType.COMMAND_REDONE, onCommandExecuted);

    // ── KeyDown ──────────────────────────────────────────────────────────────
    const onKeyDown = (e: KeyboardEvent) => {
      const activeEl = document.activeElement as HTMLElement;
      const isInput = activeEl?.tagName === 'INPUT' || activeEl?.tagName === 'TEXTAREA' || activeEl?.isContentEditable;
      if (isInput) return;

      // Space → temp hand
      if (e.code === 'Space' && !isSpaceDown) {
        isSpaceDown = true;
        cursorManager.setCursor('grab');
      }

      // Escape → select tool + clear selection
      if (e.key === 'Escape') {
        toolManager.setActiveTool('select');
        selectionManager.clearSelection();
        this.canvasEngine.clearGhost();
        this.canvasEngine.render();
      }

      // Delete / Backspace → delete selected nodes
      if (e.key === 'Delete' || e.key === 'Backspace') {
        this.deleteSelected();
      }

      // Ctrl shortcuts
      if (e.ctrlKey || e.metaKey) {
        if (e.key === 'z') { e.preventDefault(); e.shiftKey ? commandManager.redo() : commandManager.undo(); this.canvasEngine.render(); }
        if (e.key === 'y') { e.preventDefault(); commandManager.redo(); this.canvasEngine.render(); }
        if (e.key === 'a') { e.preventDefault(); this.selectAll(); }
        if (e.key === 'c') { e.preventDefault(); clipboardManager.copy(); }
        if (e.key === 'x') { e.preventDefault(); clipboardManager.cut(); }
        if (e.key === 'v') { e.preventDefault(); clipboardManager.paste(); }
        if (e.key === 'd') { e.preventDefault(); clipboardManager.duplicate(); }
        if (e.key === 'g') {
          e.preventDefault();
          if (e.shiftKey) {
            // Ungroup
            const selectedGroups = selectionManager.selectedIds
              .map(id => sceneGraph.getNode(id)?.node)
              .filter(n => n && n.type === 'Group');
            for (const g of selectedGroups) {
              commandManager.executeCommand(new UngroupCommand(g!));
            }
          } else {
            // Group
            const selected = selectionManager.selectedIds
              .map(id => sceneGraph.getNode(id)?.node)
              .filter(Boolean) as DesignerNode[];
            if (selected.length > 1) {
              commandManager.executeCommand(new GroupCommand(selected));
            }
          }
          this.canvasEngine.render();
        }
        
        // Arrange shortcuts
        if (e.key === ']') {
          e.preventDefault();
          const selected = selectionManager.selectedIds;
          if (selected.length > 0) {
            commandManager.executeCommand(new ArrangeCommand(selected, e.shiftKey ? 'front' : 'forward'));
            this.canvasEngine.render();
          }
        }
        if (e.key === '[') {
          e.preventDefault();
          const selected = selectionManager.selectedIds;
          if (selected.length > 0) {
            commandManager.executeCommand(new ArrangeCommand(selected, e.shiftKey ? 'back' : 'backward'));
            this.canvasEngine.render();
          }
        }
      }

      // Zoom shortcuts
      if (e.shiftKey && e.key === '!') { // Shift + 1
        e.preventDefault();
        const rootNodes = sceneGraph.getRootNodes().map(n => n.node);
        const bounds = TransformBox.calculateBounds(rootNodes);
        if (bounds) {
          const rect = getRect();
          viewportManager.zoomToBounds(bounds, rect.width, rect.height);
          this.canvasEngine.render();
        }
      }
      
      if (e.shiftKey && e.key === '@') { // Shift + 2
        e.preventDefault();
        const selectedNodes = selectionManager.selectedIds
          .map(id => sceneGraph.getNode(id)?.node)
          .filter((n): n is DesignerNode => n !== undefined);
        const bounds = TransformBox.calculateBounds(selectedNodes);
        if (bounds) {
          const rect = getRect();
          viewportManager.zoomToBounds(bounds, rect.width, rect.height);
          this.canvasEngine.render();
        }
      }

      // Arrow keys for movement (or camera pan if no selection)
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        e.preventDefault();
        const amount = e.shiftKey ? 10 : 1;
        let dx = 0, dy = 0;
        if (e.key === 'ArrowUp') dy = -amount;
        if (e.key === 'ArrowDown') dy = amount;
        if (e.key === 'ArrowLeft') dx = -amount;
        if (e.key === 'ArrowRight') dx = amount;

        if (selectionManager.selectedIds.length > 0) {
          const moves: Array<{ id: string; prevPosition: { x: number; y: number }; newPosition: { x: number; y: number } }> = [];
          for (const id of selectionManager.selectedIds) {
            const sn = sceneGraph.getNode(id);
            if (sn && !sn.node.locked) {
              moves.push({
                id,
                prevPosition: { ...sn.node.position },
                newPosition: { x: Math.round(sn.node.position.x + dx), y: Math.round(sn.node.position.y + dy) }
              });
            }
          }
          if (moves.length === 1) {
            commandManager.executeCommand(new MoveNodeCommand(moves[0].id, moves[0].prevPosition, moves[0].newPosition));
          } else if (moves.length > 1) {
            commandManager.executeCommand(new MultiMoveNodeCommand(moves));
          }
        } else {
          // Pan camera if no element is selected
          viewportManager.panBy(-dx * 20, -dy * 20);
        }
        this.canvasEngine.render();
      }

      // Tool shortcuts (only when not in input)
      const shortcuts: Record<string, string> = {
        v: 'select', f: 'frame', r: 'rectangle', o: 'ellipse',
        l: 'line', t: 'text', h: 'hand', z: 'zoom',
      };
      const shortcutTool = shortcuts[e.key.toLowerCase()];
      if (shortcutTool && !e.ctrlKey && !e.metaKey) {
        toolManager.setActiveTool(shortcutTool);
        eventBus.emit(SystemEventType.TOOL_CHANGED, { toolId: shortcutTool, name: shortcutTool });
        this.canvasEngine.render();
      }
    };

    const onKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        isSpaceDown = false;
        cursorManager.setCursor('default');
      }
    };

    // ── MouseDown ────────────────────────────────────────────────────────────
    const onMouseDown = (e: MouseEvent) => {
      // Blur active sidebar input & focus canvas container for keyboard events
      if (document.activeElement && document.activeElement !== container) {
        (document.activeElement as HTMLElement).blur();
      }
      container.focus();

      const sp = screenPt(e);
      const activeTool = toolManager.getActiveTool().id;

      // Right click → context menu
      if (e.button === 2) return;

      // Hide context menu if clicking anywhere else
      useContextMenuStore.getState().hide();

      // Middle mouse or Space+drag → PAN
      if (e.button === 1 || (e.button === 0 && isSpaceDown) || activeTool === 'hand') {
        this.state = 'PANNING';
        this.panLastScreen = sp;
        cursorManager.setCursor('grabbing');
        return;
      }

      // Zoom Tool
      if (activeTool === 'zoom') {
        const factor = e.shiftKey ? 0.5 : 2; // Shift to zoom out
        viewportManager.zoomAtPoint(viewportManager.camera.zoom * factor, sp);
        this.canvasEngine.render();
        return;
      }

      // Creation tools
      const CREATION_TOOLS = ['rectangle', 'ellipse', 'frame', 'text', 'image', 'button', 'container', 'line', 'arrow', 'input', 'stack', 'component', 'icon'];
      if (CREATION_TOOLS.includes(activeTool)) {
        this.state = 'DRAWING';
        this.drawStartWorld = toWorld(sp);
        this.canvasEngine.setGhost(sp.x, sp.y, 0, 0, activeTool);
        return;
      }

      // Select tool
      if (activeTool === 'select') {
        // Check resize handles first
        const selectedIds = selectionManager.selectedIds;
        if (selectedIds.length > 0) {
          const bounds = this.getSelectionScreenBounds(selectedIds);
          if (bounds) {
            const handle = this.canvasEngine.hitTestHandle(sp.x, sp.y, bounds.x, bounds.y, bounds.w, bounds.h);
            if (handle) {
              this.state = 'TRANSFORMING';
              this.transformStartWorld = toWorld(sp);
              const type = handle.type === 'rotation' ? 'rotate' : 'resize';
              transformManager.startTransform(type, createTransformEvent(e, this.transformStartWorld), handle.type as any);
              cursorManager.setCursor(handle.cursor as ReturnType<typeof cursorManager.getCursor>);
              return;
            }
          }
        }

        // Hit test node
        const hitId = this.canvasEngine.hitTestNode(sp.x, sp.y);
        if (hitId) {
          const node = sceneGraph.getNode(hitId)?.node;
          if (!node) return;
          if (node.locked) return;

          if (!selectionManager.selectedIds.includes(hitId)) {
            selectionManager.selectNode(node, e.shiftKey);
          }
          this.state = 'TRANSFORMING';
          this.transformStartWorld = toWorld(sp);
          transformManager.startTransform('move', createTransformEvent(e, this.transformStartWorld));
          cursorManager.setCursor('move');
          this.canvasEngine.render();
          return;
        }

        // Marquee on empty
        if (!e.shiftKey) selectionManager.clearSelection();
        this.state = 'MARQUEE';
        const wp = toWorld(sp);
        selectionManager.selectionBox.start(wp.x, wp.y);
        eventBus.emit(SystemEventType.SELECTION_BOX_STARTED, { startX: wp.x, startY: wp.y });
        this.canvasEngine.render();
      }
    };

    // ── MouseMove ────────────────────────────────────────────────────────────
    const onMouseMove = (e: MouseEvent) => {
      const sp = screenPt(e);
      const camera = viewportManager.camera;

      if (this.state === 'PANNING') {
        const dx = sp.x - this.panLastScreen.x;
        const dy = sp.y - this.panLastScreen.y;
        this.panLastScreen = sp;
        viewportManager.panBy(dx, dy);
        this.canvasEngine.render();
        return;
      }

      if (this.state === 'DRAWING') {
        const startScreen = CoordinateConverter.worldToScreen(this.drawStartWorld, camera);
        const gx = Math.min(startScreen.x, sp.x);
        const gy = Math.min(startScreen.y, sp.y);
        const gw = Math.abs(sp.x - startScreen.x);
        const gh = Math.abs(sp.y - startScreen.y);
        this.canvasEngine.setGhost(gx, gy, gw, gh, toolManager.getActiveTool().id);
        this.canvasEngine.render();
        return;
      }

      if (this.state === 'TRANSFORMING') {
        const wp = toWorld(sp);
        transformManager.updateTransform(createTransformEvent(e, wp));
        this.canvasEngine.render();
        return;
      }

      if (this.state === 'MARQUEE') {
        const wp = toWorld(sp);
        selectionManager.selectionBox.update(wp.x, wp.y);
        const bounds = selectionManager.selectionBox.getNormalizedBounds();
        if (bounds) {
          const allNodes = sceneGraph.getAllNodes().map((sn) => sn.node);
          const hits = allNodes.filter((n) =>
            n.visibility && !n.locked &&
            n.position.x < bounds.x + bounds.width &&
            n.position.x + n.size.width > bounds.x &&
            n.position.y < bounds.y + bounds.height &&
            n.position.y + n.size.height > bounds.y
          );
          selectionManager.selectBoxNodes(hits, e.shiftKey);
        }
        this.canvasEngine.render();
      }
    };

    // ── MouseUp ──────────────────────────────────────────────────────────────
    const onMouseUp = (e: MouseEvent) => {
      const sp = screenPt(e);
      const camera = viewportManager.camera;
      const prevState = this.state;
      this.state = 'IDLE';
      cursorManager.setCursor('default');

      if (prevState === 'DRAWING') {
        this.canvasEngine.clearGhost();
        const startScreen = CoordinateConverter.worldToScreen(this.drawStartWorld, camera);
        let gw = Math.abs(sp.x - startScreen.x) / camera.zoom;
        let gh = Math.abs(sp.y - startScreen.y) / camera.zoom;

        let wx = Math.min(this.drawStartWorld.x, (sp.x - camera.x) / camera.zoom);
        let wy = Math.min(this.drawStartWorld.y, (sp.y - camera.y) / camera.zoom);

        // If it's a click or tiny drag, insert default size
        if (gw < 8 && gh < 8) {
          gw = 100;
          gh = 100;
          wx = this.drawStartWorld.x;
          wy = this.drawStartWorld.y;
        }

        const createdNode = this.createNode(toolManager.getActiveTool().id, wx, wy, gw, gh);

        if (toolManager.getActiveTool().id === 'image') {
          const input = document.createElement('input');
          input.type = 'file';
          input.accept = 'image/*';
          input.onchange = (ev) => {
            const file = (ev.target as HTMLInputElement).files?.[0];
            if (file) {
              const reader = new FileReader();
              reader.onload = (e) => {
                const src = e.target?.result as string;
                commandManager.executeCommand(new UpdateNodePropertyCommand(createdNode.id, { src: '' }, { src }));
                this.canvasEngine.render();
              };
              reader.readAsDataURL(file);
            }
          };
          input.click();
        }

        toolManager.setActiveTool('select');
        this.canvasEngine.render();
        return;
      }

      if (prevState === 'TRANSFORMING') {
        const wp = toWorld(sp);
        transformManager.endTransform(createTransformEvent(e, wp));
        this.canvasEngine.render();
        return;
      }

      if (prevState === 'MARQUEE') {
        selectionManager.selectionBox.clear();
        eventBus.emit(SystemEventType.SELECTION_BOX_ENDED, { width: 0, height: 0 });
        this.canvasEngine.render();
      }
    };

    // ── Wheel ────────────────────────────────────────────────────────────────
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const rect = getRect();
      const sp = { x: e.clientX - rect.left, y: e.clientY - rect.top };

      if (e.ctrlKey || e.metaKey) {
        const factor = Math.pow(1.002, -e.deltaY);
        viewportManager.zoomAtPoint(viewportManager.camera.zoom * factor, sp);
      } else {
        viewportManager.panBy(-e.deltaX, -e.deltaY);
      }
      this.canvasEngine.render();
    };

    // ── Context menu ─────────────────────────────────────────────────────────
    const onContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      const sp = screenPt(e);
      const hitId = this.canvasEngine.hitTestNode(sp.x, sp.y);
      if (hitId) {
        const isSelected = selectionManager.selectedIds.includes(hitId);
        if (!isSelected) {
          selectionManager.selectNode(sceneGraph.getNode(hitId)!.node, false);
        }
      } else {
        selectionManager.clearSelection();
      }
      this.canvasEngine.render();
      useContextMenuStore.getState().show(e.clientX, e.clientY, hitId);
    };

    // ── Double click ─────────────────────────────────────────────────────────
    const onDblClick = (e: MouseEvent) => {
      const sp = screenPt(e);
      const camera = viewportManager.camera;
      const worldPt = {
        x: (sp.x - camera.x) / camera.zoom,
        y: (sp.y - camera.y) / camera.zoom,
      };

      const isTextEditable = (n: DesignerNode) =>
        ['Text', 'Heading', 'Paragraph', 'Button', 'Input', 'Textarea'].includes(n.type) ||
        n.textContent !== undefined;

      // 1. Search all scene nodes directly under cursor (topmost first)
      const allNodes = sceneGraph.getAllNodes().reverse();
      for (const sn of allNodes) {
        if (!sn.node.visibility || sn.node.locked || sn.node.type === 'Group') continue;
        const worldPos = sn.getWorldPosition();
        if (sn.node.containsPoint(worldPt.x, worldPt.y, worldPos.x, worldPos.y)) {
          if (isTextEditable(sn.node)) {
            selectionManager.selectNode(sn.node, false);
            window.dispatchEvent(new CustomEvent('designer:startTextEdit', {
              detail: { nodeId: sn.node.id }
            }));
            this.canvasEngine.render();
            return;
          }
        }
      }

      // 2. If double clicking on a Group or selected group, find text child inside group
      const selectedIds = selectionManager.selectedIds;
      for (const id of selectedIds) {
        const sn = sceneGraph.getNode(id);
        if (sn && (sn.node.type === 'Group' || sn.node.name === 'Group')) {
          const findTextChild = (sceneNode: any): any => {
            if (isTextEditable(sceneNode.node)) return sceneNode.node;
            for (const child of sceneNode.children || []) {
              const res = findTextChild(child);
              if (res) return res;
            }
            return null;
          };

          const textNode = findTextChild(sn);
          if (textNode) {
            selectionManager.selectNode(textNode, false);
            window.dispatchEvent(new CustomEvent('designer:startTextEdit', {
              detail: { nodeId: textNode.id }
            }));
            this.canvasEngine.render();
            return;
          }
        }
      }
    };

    const onDragOver = (e: DragEvent) => {
      e.preventDefault();
      if (e.dataTransfer?.types.includes('application/x-visualstack-component')) {
        e.dataTransfer.dropEffect = 'copy';
      }
    };

    const onDrop = (e: DragEvent) => {
      e.preventDefault();
      const sp = { x: e.clientX - getRect().left, y: e.clientY - getRect().top };
      const wp = toWorld(sp);

      const componentType = e.dataTransfer?.getData('application/x-visualstack-component');
      const iconData = e.dataTransfer?.getData('application/x-visualstack-icon');
      const imageData = e.dataTransfer?.getData('application/x-visualstack-image');

      if (componentType) {
        const node = ComponentFactory.createNode(componentType, {
          position: { x: wp.x, y: wp.y }
        });
        commandManager.executeCommand(new CreateNodeCommand(node));
        this.canvasEngine.render();
      } else if (iconData) {
        try {
          const parsed = JSON.parse(iconData);
          const node = ComponentFactory.createNode('Icon', {
            name: parsed.name || 'Icon',
            position: { x: wp.x, y: wp.y },
            size: { width: 32, height: 32 }
          }) as any;
          node.svgPath = parsed.svgPath;
          commandManager.executeCommand(new CreateNodeCommand(node));
          this.canvasEngine.render();
        } catch (err) {
          // ignore parse error
        }
      } else if (imageData) {
        try {
          const parsed = JSON.parse(imageData);
          const node = ComponentFactory.createNode('Image', {
            name: parsed.name || 'Image',
            position: { x: wp.x, y: wp.y },
            size: { width: 160, height: 160 }
          }) as any;
          node.src = parsed.src;
          commandManager.executeCommand(new CreateNodeCommand(node));
          this.canvasEngine.render();
        } catch (err) {
          // ignore parse error
        }
      }
    };

    container.addEventListener('mousedown', onMouseDown);
    container.addEventListener('contextmenu', onContextMenu);
    container.addEventListener('dblclick', onDblClick);
    container.addEventListener('wheel', onWheel, { passive: false });
    container.addEventListener('dragover', onDragOver);
    container.addEventListener('drop', onDrop);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);

    return () => {
      container.removeEventListener('mousedown', onMouseDown);
      container.removeEventListener('contextmenu', onContextMenu);
      container.removeEventListener('dblclick', onDblClick);
      container.removeEventListener('wheel', onWheel);
      container.removeEventListener('dragover', onDragOver);
      container.removeEventListener('drop', onDrop);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
      
      eventBus.off(SystemEventType.COMMAND_EXECUTED, onCommandExecuted);
      eventBus.off(SystemEventType.COMMAND_UNDONE, onCommandExecuted);
      eventBus.off(SystemEventType.COMMAND_REDONE, onCommandExecuted);
      
      cursorManager.setContainer(null);
    };
  }

  // ── Node factory ──────────────────────────────────────────────────────────
  private createNode(toolId: string, x: number, y: number, w: number, h: number): DesignerNode {
    // Map toolId to new Component types for backward compatibility with the drawing tools
    const typeMap: Record<string, string> = {
      'rectangle': 'Rectangle',
      'ellipse': 'Ellipse',
      'frame': 'Frame',
      'text': 'Text',
      'image': 'Image',
      'line': 'Line',
      'arrow': 'Arrow',
      'button': 'Button',
      'input': 'Input',
      'container': 'Container',
      'stack': 'Stack',
      'icon': 'Icon',
      'component': 'Component'
    };
    
    const type = typeMap[toolId] || 'Rectangle';
    
    const node = ComponentFactory.createNode(type, {
      position: { x, y },
      size: { width: w, height: h }
    }) as DesignerNode;
    
    commandManager.executeCommand(new CreateNodeCommand(node));
    return node;
  }

  // ── Utility actions ───────────────────────────────────────────────────────
  private deleteSelected(): void {
    clipboardManager.delete();
    this.canvasEngine.render();
  }

  private selectAll(): void {
    const allNodes = sceneGraph.getAllNodes().map((sn) => sn.node);
    for (const n of allNodes) {
      selectionManager.selectNode(n, true);
    }
    this.canvasEngine.render();
  }




  private getSelectionScreenBounds(ids: string[]): { x: number; y: number; w: number; h: number } | null {
    if (ids.length === 0) return null;
    const camera = viewportManager.camera;
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;

    for (const id of ids) {
      const sn = sceneGraph.getNode(id);
      if (!sn) continue;
      const n = sn.node;
      const sx = n.position.x * camera.zoom + camera.x;
      const sy = n.position.y * camera.zoom + camera.y;
      const ex = sx + n.size.width * camera.zoom;
      const ey = sy + n.size.height * camera.zoom;
      minX = Math.min(minX, sx); minY = Math.min(minY, sy);
      maxX = Math.max(maxX, ex); maxY = Math.max(maxY, ey);
    }

    return { x: minX, y: minY, w: maxX - minX, h: maxY - minY };
  }
}
