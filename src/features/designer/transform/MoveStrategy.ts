import type { TransformEvent, TransformStrategy } from './TransformStrategy';
import { selectionManager } from '../selection/SelectionManager';
import { sceneGraph } from '../scenegraph/SceneGraph';
import { useSceneStore } from '../../../stores/SceneStore';
import { commandManager } from '../../../core/commands/CommandManager';
import { MoveNodesCommand } from '../commands/TransformCommands';
import type { DesignerNode } from '../models/DesignerNode';
import { snappingEngine } from './SnappingEngine';
import { viewportManager } from '../viewport/ViewportManager';
import { layoutEngine } from '../layout/LayoutEngine';
import { eventBus } from '../../../core/events/EventBus';
import { SystemEventType } from '../../../core/events/EventTypes';

export class MoveStrategy implements TransformStrategy {
  private initialPositions: Map<string, { x: number; y: number }> = new Map();
  private selectedNodes: DesignerNode[] = [];
  private startEvent: TransformEvent | null = null;
  private hasMoved: boolean = false;

  start(e: TransformEvent): void {
    this.startEvent = e;
    this.selectedNodes = selectionManager.selectedIds
      .map(id => sceneGraph.getNode(id)?.node)
      .filter((n): n is DesignerNode => !!n);
    
    // Alt-Drag to duplicate will be handled here (creating duplicates and selecting them)
    if (e.altKey) {
      // TODO: Duplicate logic
    }

    for (const node of this.selectedNodes) {
      this.initialPositions.set(node.id, { ...node.position });
    }
    this.hasMoved = false;
  }

  update(e: TransformEvent): void {
    if (!this.startEvent) return;

    const dx = e.clientX - this.startEvent.clientX;
    const dy = e.clientY - this.startEvent.clientY;
    
    // Shift key constraint for strictly horizontal/vertical can be added here
    let finalDx = dx;
    let finalDy = dy;
    if (e.shiftKey) {
      if (Math.abs(dx) > Math.abs(dy)) {
        finalDy = 0;
      } else {
        finalDx = 0;
      }
    }
    
    if (!e.ctrlKey) {
      const allNodes = sceneGraph.getAllNodes().map(n => n.node);
      const snapResult = snappingEngine.snap(
        this.selectedNodes,
        allNodes,
        finalDx,
        finalDy,
        viewportManager.camera.zoom
      );
      finalDx = snapResult.dx;
      finalDy = snapResult.dy;
    } else {
      snappingEngine.clear();
    }

    if (finalDx !== 0 || finalDy !== 0) {
      this.hasMoved = true;
    }

    const store = useSceneStore.getState();
    for (const node of this.selectedNodes) {
      const initialPos = this.initialPositions.get(node.id)!;
      store.updateNodeProperty(node.id, {
        position: { x: initialPos.x + finalDx, y: initialPos.y + finalDy }
      });
      eventBus.emit(SystemEventType.NODE_MOVED, { nodeId: node.id });
    }
  }

  end(e: TransformEvent): void {
    if (!this.startEvent || !this.hasMoved) return;

    const dx = e.clientX - this.startEvent.clientX;
    const dy = e.clientY - this.startEvent.clientY;
    
    let finalDx = dx;
    let finalDy = dy;
    if (e.shiftKey) {
      if (Math.abs(dx) > Math.abs(dy)) {
        finalDy = 0;
      } else {
        finalDx = 0;
      }
    }

    // Since we already updated visually, we need to revert back to initial positions 
    // before running the command, so that the command properly records the execution.
    // Actually, CommandManager doesn't care if the state is already mutated, it just saves the undo/redo.
    // However, it's safer to revert and apply through CommandManager for consistency.
    const store = useSceneStore.getState();
    for (const node of this.selectedNodes) {
      const initialPos = this.initialPositions.get(node.id)!;
      store.updateNodeProperty(node.id, { position: { ...initialPos } });
    }

    const command = new MoveNodesCommand(this.selectedNodes, finalDx, finalDy);
    commandManager.executeCommand(command).then(() => {
      for (const node of this.selectedNodes) {
        const sceneNode = sceneGraph.getNode(node.id);
        if (sceneNode) {
          const worldPos = sceneNode.getWorldPosition();
          const centerX = worldPos.x + node.size.width / 2;
          const centerY = worldPos.y + node.size.height / 2;

          const candidates = sceneGraph.getAllNodes().filter(sn => {
            if (sn.node.id === node.id) return false;
            const isContainer = ['Frame', 'Container', 'Group', 'Stack', 'FlexRow', 'FlexColumn'].includes(sn.node.type) || sn.node.layoutConfig?.enabled;
            if (!isContainer) return false;

            const cWorld = sn.getWorldPosition();
            return (
              centerX >= cWorld.x &&
              centerX <= cWorld.x + sn.node.size.width &&
              centerY >= cWorld.y &&
              centerY <= cWorld.y + sn.node.size.height
            );
          });

          if (candidates.length > 0) {
            candidates.sort((a, b) => (a.node.size.width * a.node.size.height) - (b.node.size.width * b.node.size.height));
            const targetContainer = candidates[0];
            if (sceneNode.parent?.node.id !== targetContainer.node.id) {
              const cWorld = targetContainer.getWorldPosition();
              sceneGraph.reorderNode(node.id, targetContainer.node.id, 'inside');
              node.position = {
                x: Math.round(worldPos.x - cWorld.x),
                y: Math.round(worldPos.y - cWorld.y)
              };
              useSceneStore.getState().upsertNode(node);
              layoutEngine.updateLayout(targetContainer);
            } else if (targetContainer.node.layoutConfig?.enabled) {
              layoutEngine.updateLayout(targetContainer);
            }
          } else {
            if (node.parent) {
              layoutEngine.updateLayout(node.parent);
            }
            if (node.layoutConfig?.enabled) {
              layoutEngine.updateLayout(node.id);
            }
          }
        }
      }
    });
  }
}
