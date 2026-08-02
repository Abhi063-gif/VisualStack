import { BaseCommand } from '../../../core/commands/Command';
import { sceneGraph } from '../scenegraph/SceneGraph';
import { useSceneStore } from '../../../stores/SceneStore';
import { selectionManager } from '../selection/SelectionManager';
import { eventBus } from '../../../core/events/EventBus';
import { SystemEventType } from '../../../core/events/EventTypes';
import { ComponentFactory } from '../components/factories/ComponentFactory';
import type { DesignerNode } from '../models/DesignerNode';
import { TransformBox } from '../selection/TransformBox';

function generateId(): string {
  return `node_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
}

export class GroupCommand extends BaseCommand {
  private groupId: string;
  private nodeIds: string[];
  private originalParents: Map<string, string | null> = new Map();
  private originalPositions: Map<string, { x: number; y: number }> = new Map();
  private originalGroupParent: string | null = null;
  private groupNode: DesignerNode | null = null;

  constructor(nodes: DesignerNode[]) {
    super(`Group ${nodes.length} items`);
    this.groupId = generateId();
    this.nodeIds = nodes.map(n => n.id);
    
    // Sort nodes to maintain relative order (by scene graph index)
    // For now we just use the provided order.
  }

  execute(): void {
    const nodes = this.nodeIds.map(id => sceneGraph.getNode(id)?.node).filter(Boolean) as DesignerNode[];
    if (nodes.length === 0) return;

    if (!this.groupNode) {
      // Calculate union bounds for the group
      const bounds = TransformBox.calculateBounds(nodes);
      if (!bounds) return;

      this.groupNode = ComponentFactory.createNode('Group', {
        id: this.groupId,
        name: 'Group',
        position: { x: bounds.x, y: bounds.y },
        size: { width: bounds.width, height: bounds.height },
        style: { fill: 'transparent', stroke: 'transparent', strokeWidth: 0 },
      });
      this.groupNode.nodeStyle = {
        ...this.groupNode.nodeStyle,
        fill: 'transparent',
        stroke: 'transparent',
        strokeWidth: 0,
      };
      
      sceneGraph.addNode(this.groupNode);
      useSceneStore.getState().upsertNode(this.groupNode);
      
      // Determine common parent. If all share the same parent, put group there.
      const firstParent = nodes[0].parent;
      const allSameParent = nodes.every(n => n.parent === firstParent);
      this.originalGroupParent = allSameParent ? firstParent : null;
    } else {
      sceneGraph.addNode(this.groupNode);
      useSceneStore.getState().upsertNode(this.groupNode);
    }

    if (this.originalGroupParent) {
      sceneGraph.reorderNode(this.groupId, this.nodeIds[0], 'before');
    }

    for (const node of nodes) {
      if (!this.originalParents.has(node.id)) {
        this.originalParents.set(node.id, node.parent);
        this.originalPositions.set(node.id, { ...node.position });
      }

      // Calculate world pos BEFORE reparenting
      const worldPos = sceneGraph.getNode(node.id)!.getWorldPosition();
      const groupWorldPos = sceneGraph.getNode(this.groupId)!.getWorldPosition();

      // Reparent to group
      sceneGraph.reorderNode(node.id, this.groupId, 'inside');
      
      // Update local position relative to group
      node.position = {
        x: worldPos.x - groupWorldPos.x,
        y: worldPos.y - groupWorldPos.y
      };
      useSceneStore.getState().upsertNode(node);
    }

    selectionManager.selectNode(this.groupNode, false);
    eventBus.emit(SystemEventType.NODE_GROUPED, { groupId: this.groupId });
    eventBus.emit(SystemEventType.CANVAS_NODE_ADDED, { nodeId: this.groupId, type: 'Group' });
  }

  undo(): void {
    const nodes = this.nodeIds.map(id => sceneGraph.getNode(id)?.node).filter(Boolean) as DesignerNode[];
    
    for (const node of nodes) {
      const origParent = this.originalParents.get(node.id) || null;
      const origPos = this.originalPositions.get(node.id);
      
      if (origParent) {
        sceneGraph.reorderNode(node.id, origParent, 'inside');
      } else {
        // Move to root - we don't have a direct "move to root" so we reorder after group
        sceneGraph.reorderNode(node.id, this.groupId, 'after');
        const sn = sceneGraph.getNode(node.id);
        if (sn && sn.parent) {
          sn.parent.removeChild(node.id);
          sn.parent = null;
          node.parent = null;
          sceneGraph.getRootNodes().push(sn);
        }
      }

      if (origPos) {
        node.position = { ...origPos };
      }
      useSceneStore.getState().upsertNode(node);
    }

    sceneGraph.removeNode(this.groupId);
    useSceneStore.getState().removeNode(this.groupId);
    
    selectionManager.clearSelection();
    nodes.forEach(n => selectionManager.selectNode(n, true));
    
    eventBus.emit(SystemEventType.NODE_UNGROUPED, { groupId: this.groupId });
    eventBus.emit(SystemEventType.CANVAS_NODE_REMOVED, { nodeId: this.groupId });
  }
}

export class UngroupCommand extends BaseCommand {
  private groupNode: DesignerNode;
  private childIds: string[];
  private originalPositions: Map<string, { x: number; y: number }> = new Map();
  private originalParent: string | null;

  constructor(groupNode: DesignerNode) {
    super(`Ungroup ${groupNode.name}`);
    this.groupNode = groupNode;
    this.childIds = [...groupNode.children];
    this.originalParent = groupNode.parent;
  }

  execute(): void {
    const children = this.childIds.map(id => sceneGraph.getNode(id)?.node).filter(Boolean) as DesignerNode[];

    for (const child of children) {
      this.originalPositions.set(child.id, { ...child.position });
      
      // Calculate world pos BEFORE reparenting
      const worldPos = sceneGraph.getNode(child.id)!.getWorldPosition();

      // Move to parent
      if (this.originalParent) {
        sceneGraph.reorderNode(child.id, this.originalParent, 'inside');
        const parentWorld = sceneGraph.getNode(this.originalParent)!.getWorldPosition();
        child.position = { x: worldPos.x - parentWorld.x, y: worldPos.y - parentWorld.y };
      } else {
        // Move to root
        sceneGraph.reorderNode(child.id, this.groupNode.id, 'after');
        child.position = { ...worldPos };
      }

      useSceneStore.getState().upsertNode(child);
    }

    sceneGraph.removeNode(this.groupNode.id);
    useSceneStore.getState().removeNode(this.groupNode.id);

    selectionManager.clearSelection();
    children.forEach(c => selectionManager.selectNode(c, true));
    
    eventBus.emit(SystemEventType.NODE_UNGROUPED, { groupId: this.groupNode.id });
    eventBus.emit(SystemEventType.CANVAS_NODE_REMOVED, { nodeId: this.groupNode.id });
  }

  undo(): void {
    sceneGraph.addNode(this.groupNode);
    useSceneStore.getState().upsertNode(this.groupNode);

    // Re-insert at original position
    if (this.originalParent) {
      sceneGraph.reorderNode(this.groupNode.id, this.originalParent, 'inside');
    }

    const children = this.childIds.map(id => sceneGraph.getNode(id)?.node).filter(Boolean) as DesignerNode[];
    for (const child of children) {
      sceneGraph.reorderNode(child.id, this.groupNode.id, 'inside');
      const origPos = this.originalPositions.get(child.id);
      if (origPos) {
        child.position = { ...origPos };
      }
      useSceneStore.getState().upsertNode(child);
    }

    selectionManager.selectNode(this.groupNode, false);
    
    eventBus.emit(SystemEventType.NODE_GROUPED, { groupId: this.groupNode.id });
    eventBus.emit(SystemEventType.CANVAS_NODE_ADDED, { nodeId: this.groupNode.id, type: 'Group' });
  }
}
