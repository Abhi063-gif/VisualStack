import type { TransformEvent, TransformStrategy } from './TransformStrategy';
import { selectionManager } from '../selection/SelectionManager';
import { sceneGraph } from '../scenegraph/SceneGraph';
import { useSceneStore } from '../../../stores/SceneStore';
import { commandManager } from '../../../core/commands/CommandManager';
import { RotateNodesCommand } from '../commands/TransformCommands';
import type { DesignerNode } from '../models/DesignerNode';
import { TransformMath } from './TransformMath';

export class RotateStrategy implements TransformStrategy {
  private initialStates: Map<string, { rotation: number, x: number, y: number }> = new Map();
  private selectedNodes: DesignerNode[] = [];
  private startEvent: TransformEvent | null = null;
  private hasRotated: boolean = false;
  private center: { x: number; y: number } = { x: 0, y: 0 };
  private startAngle: number = 0;

  start(e: TransformEvent): void {
    this.startEvent = e;
    this.selectedNodes = selectionManager.selectedIds
      .map(id => sceneGraph.getNode(id)?.node)
      .filter((n): n is DesignerNode => !!n);
    
    // Calculate the center of the selection to rotate around
    // For single node, it's the node's center. 
    // For multi-node, it's the union bounds center.
    if (this.selectedNodes.length === 0) return;
    
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    for (const node of this.selectedNodes) {
      this.initialStates.set(node.id, {
        rotation: node.rotation || 0,
        x: node.position.x,
        y: node.position.y
      });
      minX = Math.min(minX, node.position.x);
      minY = Math.min(minY, node.position.y);
      maxX = Math.max(maxX, node.position.x + node.size.width);
      maxY = Math.max(maxY, node.position.y + node.size.height);
    }
    this.center = { x: minX + (maxX - minX) / 2, y: minY + (maxY - minY) / 2 };
    
    this.startAngle = TransformMath.radToDeg(Math.atan2(e.clientY - this.center.y, e.clientX - this.center.x));
    this.hasRotated = false;
  }

  update(e: TransformEvent): void {
    if (!this.startEvent) return;

    const currentAngle = TransformMath.radToDeg(Math.atan2(e.clientY - this.center.y, e.clientX - this.center.x));
    let deltaAngle = currentAngle - this.startAngle;
    
    if (e.shiftKey) {
      deltaAngle = TransformMath.snapAngle(deltaAngle, 15);
    }

    if (deltaAngle !== 0) {
      this.hasRotated = true;
    }

    const store = useSceneStore.getState();
    
    for (const node of this.selectedNodes) {
      const initial = this.initialStates.get(node.id)!;
      let newRotation = initial.rotation + deltaAngle;
      
      // If rotating multiple nodes around a common center, we must also update their positions
      let newX = initial.x;
      let newY = initial.y;

      if (this.selectedNodes.length > 1) {
        // Find the node's center
        const nodeCenter = {
          x: initial.x + node.size.width / 2,
          y: initial.y + node.size.height / 2
        };
        // Rotate the node's center around the common center
        const rotatedNodeCenter = TransformMath.rotatePoint(nodeCenter, this.center, deltaAngle);
        // Translate back to top-left position
        newX = rotatedNodeCenter.x - node.size.width / 2;
        newY = rotatedNodeCenter.y - node.size.height / 2;
      }

      store.updateNodeProperty(node.id, {
        rotation: newRotation,
        position: { x: newX, y: newY }
      });
    }
  }

  end(_e: TransformEvent): void {
    if (!this.startEvent || !this.hasRotated) return;
    
    const store = useSceneStore.getState();
    const newStates = new Map<DesignerNode, { rotation: number, x: number, y: number }>();

    for (const node of this.selectedNodes) {
      const sn = store.getNodeById(node.id);
      if (sn) {
        newStates.set(node, {
          rotation: sn.rotation,
          x: sn.position.x,
          y: sn.position.y
        });
      }
      
      const initial = this.initialStates.get(node.id)!;
      store.updateNodeProperty(node.id, {
        rotation: initial.rotation,
        position: { x: initial.x, y: initial.y }
      });
    }

    const command = new RotateNodesCommand(this.selectedNodes, newStates);
    commandManager.executeCommand(command);
  }
}
