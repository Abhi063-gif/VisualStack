import Konva from 'konva';
import { LayerManager } from './LayerManager';
import { viewportManager } from '../viewport/ViewportManager';
import { selectionManager } from '../selection/SelectionManager';
import { GridRenderer } from '../rendering/GridRenderer';
import { SelectionRenderer, HandleRenderer } from '../rendering/SelectionRenderer';
import { TransformBox } from '../selection/TransformBox';
import { sceneGraph } from '../scenegraph/SceneGraph';
import type { DesignerNode } from '../models/DesignerNode';
import { snappingEngine } from '../transform/SnappingEngine';
import { eventBus } from '../../../core/events/EventBus';
import { SystemEventType } from '../../../core/events/EventTypes';
import { componentStore } from '../../../stores/ComponentStore';

// Handle position types for resize interaction
export type HandleType =
  | 'nw' | 'n' | 'ne'
  | 'w'  |       'e'
  | 'sw' | 's' | 'se'
  | 'rotation';

export interface HandleSpec {
  type: HandleType;
  x: number;
  y: number;
  cursor: string;
}



export class CanvasEngine {
  public stage: Konva.Stage | null = null;
  public layerManager: LayerManager | null = null;

  // Ghost preview for drag-to-create
  private ghostX = 0;
  private ghostY = 0;
  private ghostW = 0;
  private ghostH = 0;
  private showGhost = false;
  private ghostTool = '';

  // Cache for loaded images
  private imageCache: Map<string, HTMLImageElement> = new Map();

  // Hover sync
  private hoveredNodeId: string | null = null;

  // Node currently being inline edited
  public editingNodeId: string | null = null;

  public initialize(container: HTMLDivElement): void {
    this.stage = new Konva.Stage({
      container,
      width: container.offsetWidth,
      height: container.offsetHeight,
    });
    this.layerManager = new LayerManager(this.stage);
    
    eventBus.on(SystemEventType.LAYER_HOVERED, (payload) => {
      this.hoveredNodeId = payload.layerId;
      this.render();
    });
    
    this.render();
  }

  public setGhost(x: number, y: number, w: number, h: number, toolId: string): void {
    this.ghostX = x;
    this.ghostY = y;
    this.ghostW = w;
    this.ghostH = h;
    this.showGhost = true;
    this.ghostTool = toolId;
  }

  public clearGhost(): void {
    this.showGhost = false;
  }

  public render(): void {
    if (!this.stage || !this.layerManager) return;

    const width = this.stage.width();
    const height = this.stage.height();
    const camera = viewportManager.camera;

    // ── Pass 1: Grid ─────────────────────────────────────────────────────────
    const gridLayer = this.layerManager.gridLayer;
    gridLayer.destroyChildren();

    const gridLines = GridRenderer.calculateGridLines(camera, width, height);
    for (const line of gridLines) {
      gridLayer.add(new Konva.Line({
        points: [line.x1, line.y1, line.x2, line.y2],
        stroke: line.isMajor ? '#363c4e' : '#232733',
        strokeWidth: line.isMajor ? 1 : 0.5,
        opacity: line.opacity,
        listening: false,
      }));
    }

    // ── Pass 2: Scene Nodes (Konva shapes for every SceneGraph node) ──────────
    const componentLayer = this.layerManager.componentLayer;
    componentLayer.destroyChildren();

    const drawRecursive = (sceneNode: any, parentContainer: Konva.Layer | Konva.Group) => {
      const node = sceneNode.node;
      if (!node.visibility) return;

      const worldPos = sceneNode.getWorldPosition();
      const screenX = worldPos.x * camera.zoom + camera.x;
      const screenY = worldPos.y * camera.zoom + camera.y;
      const screenW = node.size.width * camera.zoom;
      const screenH = node.size.height * camera.zoom;

      this.drawNode(node, parentContainer, screenX, screenY, screenW, screenH, camera.zoom);

      let childrenContainer = parentContainer;

      if (node.type === 'Frame' || node.type === 'Group') {
        const group = new Konva.Group({
          x: 0,
          y: 0,
        });
        
        if (node.type === 'Frame') {
          group.clip({
            x: screenX,
            y: screenY,
            width: screenW,
            height: screenH
          });
        }
        
        parentContainer.add(group);
        childrenContainer = group;
      }

      for (const child of sceneNode.children) {
        drawRecursive(child, childrenContainer);
      }
    };

    const rootNodes = sceneGraph.getRootNodes();
    for (const root of rootNodes) {
      drawRecursive(root, componentLayer);
    }

    // ── Pass 3: Ghost Preview for drag-to-create ──────────────────────────────
    const uiLayer = this.layerManager.uiLayer;
    const selectionLayer = this.layerManager.selectionLayer;
    uiLayer.destroyChildren();
    selectionLayer.destroyChildren();

    if (this.showGhost && this.ghostW > 4 && this.ghostH > 4) {
      const ghostShape = new Konva.Rect({
        x: this.ghostX,
        y: this.ghostY,
        width: this.ghostW,
        height: this.ghostH,
        stroke: '#6366f1',
        strokeWidth: 1.5,
        fill: this.ghostTool === 'frame' ? 'rgba(30,32,48,0.5)' : 'rgba(99,102,241,0.15)',
        dash: [4, 4],
        listening: false,
        cornerRadius: this.ghostTool === 'rectangle' ? 2 : 0,
      });
      uiLayer.add(ghostShape);
    }

    // ── Pass 4: Marquee selection box ─────────────────────────────────────────
    const boxBounds = selectionManager.selectionBox.getNormalizedBounds();
    if (boxBounds) {
      const boxStyle = SelectionRenderer.getSelectionBoxStyle();
      selectionLayer.add(new Konva.Rect({
        x: boxBounds.x * camera.zoom + camera.x,
        y: boxBounds.y * camera.zoom + camera.y,
        width: boxBounds.width * camera.zoom,
        height: boxBounds.height * camera.zoom,
        fill: boxStyle.fill,
        stroke: boxStyle.stroke,
        strokeWidth: boxStyle.strokeWidth,
        listening: false,
      }));
    }

    // ── Pass 4.5: Hovered Node Indicator ───────────────────────────────────────
    if (this.hoveredNodeId && !selectionManager.selectedIds.includes(this.hoveredNodeId)) {
      const hoveredSceneNode = sceneGraph.getNode(this.hoveredNodeId);
      if (hoveredSceneNode && hoveredSceneNode.node.visibility) {
        const bounds = TransformBox.calculateBounds([hoveredSceneNode.node]);
        if (bounds) {
          const sx = bounds.x * camera.zoom + camera.x;
          const sy = bounds.y * camera.zoom + camera.y;
          const sw = bounds.width * camera.zoom;
          const sh = bounds.height * camera.zoom;

          uiLayer.add(new Konva.Rect({
            x: sx,
            y: sy,
            width: sw,
            height: sh,
            stroke: '#6366f1',
            strokeWidth: 2,
            listening: false,
          }));
        }
      }
    }

    // ── Pass 5: Selection bounding box, Group outline & resize handles ────────
    const selectedNodes = selectionManager.selectedIds
      .map((id) => sceneGraph.getNode(id)?.node)
      .filter((n): n is DesignerNode => n !== undefined);

    if (selectedNodes.length > 0) {
      // 1. Draw dashed bounding box for parent groups of selected nodes
      const parentGroupIds = new Set<string>();
      for (const id of selectionManager.selectedIds) {
        const sceneNode = sceneGraph.getNode(id);
        if (sceneNode?.parent && (sceneNode.parent.node.type === 'Group' || sceneNode.parent.node.name === 'Group')) {
          parentGroupIds.add(sceneNode.parent.node.id);
        } else if (sceneNode?.node.type === 'Group' || sceneNode?.node.name === 'Group') {
          parentGroupIds.add(sceneNode.node.id);
        }
      }

      for (const groupId of parentGroupIds) {
        const groupSceneNode = sceneGraph.getNode(groupId);
        if (groupSceneNode) {
          const groupChildNodes = groupSceneNode.children.map(c => c.node);
          const groupBounds = TransformBox.calculateBounds(groupChildNodes.length > 0 ? groupChildNodes : [groupSceneNode.node]);
          if (groupBounds) {
            const gx = groupBounds.x * camera.zoom + camera.x;
            const gy = groupBounds.y * camera.zoom + camera.y;
            const gw = groupBounds.width * camera.zoom;
            const gh = groupBounds.height * camera.zoom;

            // Dashed outline rectangle for group (matching 3rd image)
            uiLayer.add(new Konva.Rect({
              x: gx - 4,
              y: gy - 4,
              width: gw + 8,
              height: gh + 8,
              stroke: '#ffffff',
              strokeWidth: 1,
              dash: [4, 4],
              listening: false,
              cornerRadius: 2,
            }));
          }
        }
      }

      // 2. Draw active selection bounding box & 8 resize handles for selected elements
      const bounds = TransformBox.calculateBounds(selectedNodes);
      if (bounds) {
        const sx = bounds.x * camera.zoom + camera.x;
        const sy = bounds.y * camera.zoom + camera.y;
        const sw = bounds.width * camera.zoom;
        const sh = bounds.height * camera.zoom;

        const selectionGroup = new Konva.Group({
          x: sx + sw / 2, y: sy + sh / 2,
          offsetX: sw / 2, offsetY: sh / 2,
          rotation: selectedNodes.length === 1 ? selectedNodes[0].rotation || 0 : 0,
        });

        // Selection outline
        selectionGroup.add(new Konva.Rect({
          x: 0, y: 0, width: sw, height: sh,
          stroke: '#6366f1', strokeWidth: 1.5,
          listening: false,
        }));

        // 8 resize handles + rotation handle
        const handles = this.getHandleSpecs(0, 0, sw, sh);
        for (const h of handles) {
          const isRotation = h.type === 'rotation';
          const style = HandleRenderer.getHandleStyle(isRotation);

          if (isRotation) {
            selectionGroup.add(new Konva.Line({
              points: [sw / 2, 0, sw / 2, -20],
              stroke: '#6366f1', strokeWidth: 1.5, listening: false,
            }));
            selectionGroup.add(new Konva.Circle({
              x: h.x, y: h.y, radius: 5,
              fill: style.fill, stroke: style.stroke, strokeWidth: style.strokeWidth,
              listening: false,
            }));
          } else {
            selectionGroup.add(new Konva.Rect({
              x: h.x - 4, y: h.y - 4, width: 8, height: 8,
              fill: style.fill, stroke: style.stroke, strokeWidth: style.strokeWidth,
              listening: false,
            }));
          }
        }
        uiLayer.add(selectionGroup);
      }
    }

    // ── Pass 6: Smart Guides (Snapping) ──────────────────────────────────────
    if (snappingEngine.activeLines.length > 0) {
      for (const line of snappingEngine.activeLines) {
        if (line.axis === 'x') {
          const sx = line.value * camera.zoom + camera.x;
          uiLayer.add(new Konva.Line({
            points: [sx, 0, sx, height],
            stroke: '#a855f7',
            strokeWidth: 1.5,
            listening: false,
          }));
        } else {
          const sy = line.value * camera.zoom + camera.y;
          uiLayer.add(new Konva.Line({
            points: [0, sy, width, sy],
            stroke: '#a855f7',
            strokeWidth: 1.5,
            listening: false,
          }));
        }
      }
    }

    this.layerManager.batchDraw();
  }

  private drawNode(
    node: DesignerNode,
    layer: Konva.Layer | Konva.Group,
    x: number, y: number, w: number, h: number,
    zoom: number
  ): void {
    if (this.editingNodeId && node.id === this.editingNodeId) {
      return; // Skip rendering node on canvas while inline text editor overlay is active
    }

    const ns = node.nodeStyle;

    const commonAttrs = {
      x: (x || 0) + (w || 0) / 2, y: (y || 0) + (h || 0) / 2, width: w || 0, height: h || 0,
      offsetX: (w || 0) / 2, offsetY: (h || 0) / 2,
      rotation: node.rotation || 0,
      opacity: node.opacity ?? 1,
      listening: false, // We do manual hit testing for performance
    };

    if (node.type === 'Group' || node.name === 'Group') {
      // Invisible organizational container: renders no fill, stroke, or label text when unselected
      return;
    }

    if (['Rectangle', 'Shape', 'Container', 'Section', 'Navbar', 'Sidebar', 'Tabs', 'Grid', 'FlexRow', 'FlexColumn', 'Card', 'Accordion', 'Modal', 'Drawer', 'Toast', 'Badge', 'Chip', 'Progress'].includes(node.type)) {
      layer.add(new Konva.Rect({
        ...commonAttrs,
        fill: ns.fill,
        stroke: ns.strokeWidth > 0 ? ns.stroke : 'transparent',
        strokeWidth: ns.strokeWidth,
        cornerRadius: ns.cornerRadius * zoom,
        shadowEnabled: ns.shadow,
        shadowColor: ns.shadowColor,
        shadowBlur: ns.shadowBlur,
        shadowOffsetX: ns.shadowOffsetX,
        shadowOffsetY: ns.shadowOffsetY,
      }));
    } else if (['Ellipse', 'Circle', 'Avatar'].includes(node.type)) {
      layer.add(new Konva.Ellipse({
        ...commonAttrs,
        offsetX: 0,
        offsetY: 0,
        radiusX: w / 2, radiusY: h / 2,
        fill: ns.fill,
        stroke: ns.strokeWidth > 0 ? ns.stroke : 'transparent',
        strokeWidth: ns.strokeWidth,
        opacity: node.opacity,
        listening: false,
      }));
    } else if (node.type === 'Frame') {
      layer.add(new Konva.Rect({
        ...commonAttrs,
        fill: ns.fill,
        stroke: '#363c4e',
        strokeWidth: 1,
        cornerRadius: ns.cornerRadius * zoom,
      }));
      // Frame label
      if (zoom > 0.4) {
        layer.add(new Konva.Text({
          x: x + w / 2, y: y + h / 2 - 18 * zoom,
          offsetX: w / 2, offsetY: h / 2,
          rotation: node.rotation || 0,
          text: node.name,
          fontSize: 11 * zoom,
          fill: '#6b7280',
          listening: false,
        }));
      }
    } else if (['Text', 'Heading', 'Paragraph'].includes(node.type)) {
      layer.add(new Konva.Text({
        ...commonAttrs,
        height: h || 0,
        text: node.textContent || 'Text',
        fontSize: (ns.fontSize || 16) * zoom,
        fontFamily: ns.fontFamily || 'Inter',
        fontStyle: String(ns.fontWeight || 400),
        align: ns.textAlign || 'left',
        fill: ns.fill === 'transparent' ? '#f3f4f6' : (ns.fill || '#ffffff'),
        listening: false,
      }));
    } else if (['Image', 'Video'].includes(node.type)) {
      const imgNode = node as any; // Cast to access src property
      if (imgNode.src) {
        if (this.imageCache.has(imgNode.src)) {
          layer.add(new Konva.Image({
            ...commonAttrs,
            image: this.imageCache.get(imgNode.src),
            cornerRadius: ns.cornerRadius * zoom,
          }));
        } else {
          // Render loading background
          layer.add(new Konva.Rect({ ...commonAttrs, fill: '#14161b', cornerRadius: ns.cornerRadius * zoom }));
          
          const img = new window.Image();
          img.src = imgNode.src;
          img.onload = () => {
            this.imageCache.set(imgNode.src, img);
            this.render(); // Re-render when image is loaded
          };
        }
      } else {
        layer.add(new Konva.Rect({
          ...commonAttrs,
          fill: ns.fill,
          stroke: ns.stroke,
          strokeWidth: ns.strokeWidth,
          cornerRadius: ns.cornerRadius * zoom,
        }));
        // Image placeholder icon
        layer.add(new Konva.Text({
          x: x + w / 2 - 10, y: y + h / 2 - 8,
          text: '🖼',
          fontSize: Math.min(20 * zoom, 32),
          listening: false,
        }));
      }
    } else if (node.type === 'Component') {
      layer.add(new Konva.Rect({
        ...commonAttrs,
        fill: ns.fill,
        stroke: ns.stroke,
        strokeWidth: ns.strokeWidth,
        cornerRadius: ns.cornerRadius * zoom,
        dash: [4, 2],
      }));
    } else if (node.type === 'Line') {
      layer.add(new Konva.Line({
        x: x + w / 2, y: y + h / 2,
        offsetX: w / 2, offsetY: h / 2,
        rotation: node.rotation || 0,
        points: [0, h / 2, w, h / 2],
        stroke: ns.stroke,
        strokeWidth: ns.strokeWidth * zoom,
        opacity: node.opacity,
        listening: false,
      }));
    } else if (node.type === 'Arrow') {
      layer.add(new Konva.Arrow({
        x: x + w / 2, y: y + h / 2,
        offsetX: w / 2, offsetY: h / 2,
        rotation: node.rotation || 0,
        points: [0, h / 2, w, h / 2],
        pointerLength: 10 * zoom,
        pointerWidth: 10 * zoom,
        fill: ns.stroke,
        stroke: ns.stroke,
        strokeWidth: ns.strokeWidth * zoom,
        opacity: node.opacity,
        listening: false,
      }));
    } else if (node.type === 'Button') {
      layer.add(new Konva.Rect({
        ...commonAttrs,
        fill: ns.fill,
        stroke: ns.stroke,
        strokeWidth: ns.strokeWidth,
        cornerRadius: ns.cornerRadius * zoom,
      }));
      layer.add(new Konva.Text({
        ...commonAttrs,
        text: node.textContent || 'Button',
        fontSize: 14 * zoom,
        fill: '#ffffff',
        align: 'center',
        verticalAlign: 'middle',
        listening: false,
      }));
    } else if (['Input', 'Textarea', 'Checkbox', 'Radio', 'Switch', 'Toggle', 'Spinner'].includes(node.type)) {
      layer.add(new Konva.Rect({
        ...commonAttrs,
        fill: ns.fill,
        stroke: ns.stroke,
        strokeWidth: ns.strokeWidth,
        cornerRadius: ns.cornerRadius * zoom,
      }));
      if (['Input', 'Textarea'].includes(node.type)) {
        layer.add(new Konva.Text({
          ...commonAttrs,
          x: commonAttrs.x + 12 * zoom, width: w - 24 * zoom,
          text: node.textContent || 'Type here...',
          fontSize: 14 * zoom,
          fill: '#9ca3af',
          verticalAlign: 'middle',
          listening: false,
        }));
      }
    } else if (node.type === 'Stack') {
      layer.add(new Konva.Rect({
        ...commonAttrs,
        fill: ns.fill,
        stroke: ns.stroke,
        strokeWidth: ns.strokeWidth,
        cornerRadius: ns.cornerRadius * zoom,
      }));
      // Stack icon
      layer.add(new Konva.Text({
        ...commonAttrs,
        x: commonAttrs.x + 8 * zoom, y: commonAttrs.y + 8 * zoom,
        text: '☰',
        fontSize: 12 * zoom,
        fill: ns.stroke,
        listening: false,
      }));
    } else if (node.type === 'Icon') {
      const iconNode = node as any;
      // Render SVG icon if svgPath is stored, otherwise use text symbol
      if (iconNode.svgPath) {
        // Render SVG as image using data URI
        const svgStr = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 24 24" fill="none" stroke="${encodeURIComponent(ns.fill || '#e5e7eb')}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${iconNode.svgPath}</svg>`;
        const dataUri = `data:image/svg+xml;charset=utf-8,${svgStr}`;
        const cacheKey = `icon_${iconNode.svgPath}_${ns.fill}_${Math.round(w)}_${Math.round(h)}`;
        if (this.imageCache.has(cacheKey)) {
          layer.add(new Konva.Image({ ...commonAttrs, image: this.imageCache.get(cacheKey), listening: false }));
        } else {
          const img = new window.Image();
          img.src = dataUri;
          img.onload = () => { this.imageCache.set(cacheKey, img); this.render(); };
          // Placeholder
          layer.add(new Konva.Rect({ ...commonAttrs, fill: 'transparent', listening: false }));
        }
      } else {
        layer.add(new Konva.Text({
          ...commonAttrs,
          text: '★',
          fontSize: Math.min(w, h),
          fill: ns.fill || '#e5e7eb',
          align: 'center',
          verticalAlign: 'middle',
          listening: false,
        }));
      }
    } else if (node.type === 'ComponentInstance') {
      const inst = node as any;
      const compDef = componentStore.get(inst.componentId);
      const fillColor = (inst.overrides?.fill as string) ?? ns.fill ?? '#6d28d9';
      const textContent = (inst.overrides?.textContent as string) ?? node.textContent;
      const instOpacity = (inst.overrides?.opacity as number) ?? (node.opacity ?? 1);

      // Render as a purple-tinted rect (component body)
      layer.add(new Konva.Rect({
        ...commonAttrs,
        fill: fillColor,
        stroke: '#22c55e',
        strokeWidth: 1.5 / zoom,
        cornerRadius: ns.cornerRadius * zoom,
        opacity: instOpacity,
      }));

      // Render text content if present
      if (textContent) {
        layer.add(new Konva.Text({
          ...commonAttrs,
          text: textContent,
          fontSize: (ns.fontSize || 14) * zoom,
          fontFamily: ns.fontFamily || 'Inter',
          fill: '#ffffff',
          align: 'center',
          verticalAlign: 'middle',
          listening: false,
        }));
      }

      // Component ◇ badge in top-left corner
      if (zoom > 0.35) {
        const badgeSize = Math.max(8, 10 * zoom);
        layer.add(new Konva.Text({
          x: x + 3,
          y: y + 2,
          text: compDef ? '◇' : '◈',
          fontSize: badgeSize,
          fill: '#22c55e',
          listening: false,
        }));
      }
    } else {
      // Generic fallback rect
      layer.add(new Konva.Rect({
        ...commonAttrs,
        fill: ns.fill,
        stroke: ns.stroke,
        strokeWidth: ns.strokeWidth,
        cornerRadius: ns.cornerRadius * zoom,
      }));
    }
  }

  public getHandleSpecs(sx: number, sy: number, sw: number, sh: number): HandleSpec[] {
    const cx = sx + sw / 2;
    const cy = sy + sh / 2;
    const ex = sx + sw;
    const ey = sy + sh;

    return [
      { type: 'nw', x: sx, y: sy, cursor: 'nwse-resize' },
      { type: 'n',  x: cx, y: sy, cursor: 'ns-resize' },
      { type: 'ne', x: ex, y: sy, cursor: 'nesw-resize' },
      { type: 'w',  x: sx, y: cy, cursor: 'ew-resize' },
      { type: 'e',  x: ex, y: cy, cursor: 'ew-resize' },
      { type: 'sw', x: sx, y: ey, cursor: 'nesw-resize' },
      { type: 's',  x: cx, y: ey, cursor: 'ns-resize' },
      { type: 'se', x: ex, y: ey, cursor: 'nwse-resize' },
      { type: 'rotation', x: cx, y: sy - 24, cursor: 'crosshair' },
    ];
  }

  /** Returns which handle is under the given screen point, or null */
  public hitTestHandle(
    screenX: number, screenY: number,
    sx: number, sy: number, sw: number, sh: number,
    threshold = 8
  ): HandleSpec | null {
    const handles = this.getHandleSpecs(sx, sy, sw, sh);
    for (const h of handles) {
      const dx = screenX - h.x;
      const dy = screenY - h.y;
      if (Math.sqrt(dx * dx + dy * dy) <= threshold) return h;
    }
    return null;
  }

  /** Returns nodeId under the screen point, or null */
  public hitTestNode(screenX: number, screenY: number): string | null {
    const camera = viewportManager.camera;
    const worldX = (screenX - camera.x) / camera.zoom;
    const worldY = (screenY - camera.y) / camera.zoom;

    // Iterate in reverse (topmost first)
    const allNodes = sceneGraph.getAllNodes().reverse();
    for (const sceneNode of allNodes) {
      const node = sceneNode.node;
      if (!node.visibility || node.locked) continue;
      if (node.type === 'Group' || node.name === 'Group') continue;

      const worldPos = sceneNode.getWorldPosition();
      if (node.containsPoint(worldX, worldY, worldPos.x, worldPos.y)) {
        // If element belongs to a Group, single-click selects the Group node
        let current = sceneNode;
        let highestGroup = null;
        while (current.parent) {
          current = current.parent;
          if (current.node.type === 'Group' || current.node.name === 'Group' || (current.node as any).isGroup) {
            highestGroup = current;
          }
        }
        return highestGroup ? highestGroup.node.id : node.id;
      }
    }
    return null;
  }

  public resize(width: number, height: number): void {
    if (this.stage) {
      this.stage.width(width);
      this.stage.height(height);
      this.render();
    }
  }

  public destroy(): void {
    if (this.stage) {
      this.stage.destroy();
      this.stage = null;
      this.layerManager = null;
    }
  }
}
