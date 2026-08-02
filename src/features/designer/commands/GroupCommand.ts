import { BaseCommand } from '../../../core/commands/Command';
import { sceneGraph } from '../scenegraph/SceneGraph';
import { selectionManager } from '../selection/SelectionManager';
import { useSceneStore } from '../../../stores/SceneStore';
import { eventBus } from '../../../core/events/EventBus';
import { SystemEventType } from '../../../core/events/EventTypes';
import { ComponentFactory } from '../components/factories/ComponentFactory';
import { TransformBox } from '../selection/TransformBox';
import type { DesignerNode } from '../models/DesignerNode';

export class GroupCommand extends BaseCommand {
  private groupNode: DesignerNode;
  private childIds: string[];
  private originalParents: Record<string, string | null> = {};
  private originalPositions: Record<string, { x: number; y: number }> = {};

  constructor(nodes: DesignerNode[]) {
    super(`Group ${nodes.length} items`);
    this.childIds = nodes.map((n) => n.id);
    
    // Calculate world bounding box
    const bounds = TransformBox.calculateBounds(nodes);
    if (!bounds) {
      throw new Error('Cannot group empty selection');
    }

    const groupId = Math.random().toString(36).substring(7);
    this.groupNode = ComponentFactory.createNode('Group', {
      id: groupId,
      name: 'Group',
      position: { x: bounds.x, y: bounds.y },
      size: { width: bounds.width, height: bounds.height },
      style: { fill: 'transparent', strokeWidth: 0, stroke: 'transparent' },
    }) as DesignerNode;
    this.groupNode.nodeStyle = {
      ...this.groupNode.nodeStyle,
      fill: 'transparent',
      stroke: 'transparent',
      strokeWidth: 0,
    };
    
    for (const node of nodes) {
      this.originalParents[node.id] = node.parent;
      this.originalPositions[node.id] = { ...node.position };
    }
  }

  public execute(): void {
    const store = useSceneStore.getState();
    const allNodes = this.childIds.map(id => sceneGraph.getNode(id)?.node).filter(Boolean) as DesignerNode[];

    // 1. Add group node to scene
    sceneGraph.addNode(this.groupNode);
    store.upsertNode(this.groupNode);

    // 2. Re-parent children and adjust positions
    for (const node of allNodes) {
      const sceneNode = sceneGraph.getNode(node.id);
      if (!sceneNode) continue;
      
      const worldPos = sceneNode.getWorldPosition();
      
      if (node.parent) {
        const oldParentScene = sceneGraph.getNode(node.parent);
        if (oldParentScene) {
          oldParentScene.removeChild(node.id);
          store.upsertNode(oldParentScene.node);
        }
      }
      sceneGraph.removeNode(node.id);

      node.parent = this.groupNode.id;
      node.position = {
        x: worldPos.x - this.groupNode.position.x,
        y: worldPos.y - this.groupNode.position.y
      };

      sceneGraph.addNode(node);
      store.upsertNode(node);
    }
    
    store.upsertNode(this.groupNode);
    selectionManager.selectNode(this.groupNode, false);
    
    eventBus.emit(SystemEventType.CANVAS_NODE_ADDED, { nodeId: this.groupNode.id, type: 'Frame' });
  }

  public undo(): void {
    const store = useSceneStore.getState();
    const allNodes = this.childIds.map(id => sceneGraph.getNode(id)?.node).filter(Boolean) as DesignerNode[];

    for (const node of allNodes) {
      const sceneNode = sceneGraph.getNode(node.id);
      if (!sceneNode) continue;
      
      const oldParent = this.originalParents[node.id];
      const oldPos = this.originalPositions[node.id];

      const groupScene = sceneGraph.getNode(this.groupNode.id);
      if (groupScene) {
        groupScene.removeChild(node.id);
      }
      sceneGraph.removeNode(node.id);

      node.parent = oldParent;
      node.position = { ...oldPos };

      sceneGraph.addNode(node);
      store.upsertNode(node);
    }

    sceneGraph.removeNode(this.groupNode.id);
    store.removeNode(this.groupNode.id);

    if (allNodes.length > 0) {
      selectionManager.selectNode(allNodes[0], false);
      for (let i = 1; i < allNodes.length; i++) {
        selectionManager.selectNode(allNodes[i], true);
      }
    } else {
      selectionManager.clearSelection();
    }

    eventBus.emit(SystemEventType.CANVAS_NODE_REMOVED, { nodeId: this.groupNode.id });
  }
}
