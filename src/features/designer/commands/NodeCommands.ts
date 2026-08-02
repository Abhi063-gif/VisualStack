import { BaseCommand } from '../../../core/commands/Command';
import { sceneGraph } from '../scenegraph/SceneGraph';
import { selectionManager } from '../selection/SelectionManager';
import { useSceneStore } from '../../../stores/SceneStore';
import { eventBus } from '../../../core/events/EventBus';
import { SystemEventType } from '../../../core/events/EventTypes';
import type { DesignerNode } from '../models/DesignerNode';

// ─── CreateNodeCommand ─────────────────────────────────────────────────────────

export class CreateNodeCommand extends BaseCommand {
  private node: DesignerNode;

  constructor(node: DesignerNode) {
    super(`Create ${node.type} "${node.name}"`);
    this.node = node;
  }

  public execute(): void {
    sceneGraph.addNode(this.node);
    useSceneStore.getState().upsertNode(this.node);
    selectionManager.selectNode(this.node, false);
    eventBus.emit(SystemEventType.CANVAS_NODE_ADDED, { nodeId: this.node.id, type: this.node.type });
  }

  public undo(): void {
    sceneGraph.removeNode(this.node.id);
    useSceneStore.getState().removeNode(this.node.id);
    selectionManager.clearSelection();
    eventBus.emit(SystemEventType.CANVAS_NODE_REMOVED, { nodeId: this.node.id });
  }
}

// ─── MoveNodeCommand ───────────────────────────────────────────────────────────

export class MoveNodeCommand extends BaseCommand {
  private nodeId: string;
  private prevPosition: { x: number; y: number };
  private newPosition: { x: number; y: number };

  constructor(
    nodeId: string,
    prevPosition: { x: number; y: number },
    newPosition: { x: number; y: number }
  ) {
    super(`Move Node`);
    this.nodeId = nodeId;
    this.prevPosition = { ...prevPosition };
    this.newPosition = { ...newPosition };
  }

  public execute(): void {
    useSceneStore.getState().updateNodeProperty(this.nodeId, { position: this.newPosition });
  }

  public undo(): void {
    useSceneStore.getState().updateNodeProperty(this.nodeId, { position: this.prevPosition });
  }
}

// ─── ReorderNodeCommand ────────────────────────────────────────────────────────

export class ReorderNodeCommand extends BaseCommand {
  private nodeId: string;
  private targetId: string;
  private position: 'before' | 'after' | 'inside';
  private originalParent: string | null;
  private originalIndex: number;
  private wasRoot: boolean;

  constructor(nodeId: string, targetId: string, position: 'before' | 'after' | 'inside') {
    super(`Reorder Node`);
    this.nodeId = nodeId;
    this.targetId = targetId;
    this.position = position;

    const node = sceneGraph.getNode(nodeId);
    this.originalParent = node?.parent?.node.id || null;
    this.wasRoot = !node?.parent;
    if (this.wasRoot) {
      this.originalIndex = sceneGraph.getRootNodes().findIndex(n => n.node.id === nodeId);
    } else {
      this.originalIndex = node?.parent?.children.findIndex(n => n.node.id === nodeId) ?? -1;
    }
  }

  public execute(): void {
    sceneGraph.reorderNode(this.nodeId, this.targetId, this.position);
    // Force a re-render by touching a property, or firing an event
    const node = sceneGraph.getNode(this.nodeId)?.node;
    if (node) {
      useSceneStore.getState().upsertNode(node);
      const parentNode = sceneGraph.getNode(this.targetId)?.parent?.node;
      if (parentNode) {
         useSceneStore.getState().upsertNode(parentNode);
      }
    }
    eventBus.emit(SystemEventType.CANVAS_NODE_REMOVED, { nodeId: 'reorder' }); // Hack to force canvas redraw
  }

  public undo(): void {
    // Basic undo: we just remove and put it back in original parent at original index
    const sceneNode = sceneGraph.getNode(this.nodeId);
    if (!sceneNode) return;
    
    // Remove
    if (sceneNode.parent) {
      sceneNode.parent.removeChild(this.nodeId);
    } else {
      sceneGraph['rootNodes'] = sceneGraph.getRootNodes().filter(n => n.node.id !== this.nodeId);
    }

    sceneNode.parent = this.originalParent ? sceneGraph.getNode(this.originalParent) || null : null;
    sceneNode.node.parent = this.originalParent;

    if (this.wasRoot) {
      sceneGraph['rootNodes'].splice(this.originalIndex, 0, sceneNode);
    } else {
      const p = sceneGraph.getNode(this.originalParent!);
      if (p) {
        p.children.splice(this.originalIndex, 0, sceneNode);
        p.node.children.splice(this.originalIndex, 0, this.nodeId);
      }
    }
    
    eventBus.emit(SystemEventType.CANVAS_NODE_REMOVED, { nodeId: 'reorder' });
  }
}

// ─── MultiMoveNodeCommand ──────────────────────────────────────────────────────

export class MultiMoveNodeCommand extends BaseCommand {
  private moves: Array<{ id: string; prevPosition: { x: number; y: number }; newPosition: { x: number; y: number } }>;

  constructor(moves: Array<{ id: string; prevPosition: { x: number; y: number }; newPosition: { x: number; y: number } }>) {
    super(`Move ${moves.length} Nodes`);
    this.moves = moves.map(m => ({
      id: m.id,
      prevPosition: { ...m.prevPosition },
      newPosition: { ...m.newPosition }
    }));
  }

  public execute(): void {
    const store = useSceneStore.getState();
    for (const move of this.moves) {
      store.updateNodeProperty(move.id, { position: move.newPosition });
    }
  }

  public undo(): void {
    const store = useSceneStore.getState();
    for (const move of this.moves) {
      store.updateNodeProperty(move.id, { position: move.prevPosition });
    }
  }
}

// ─── ResizeNodeCommand ─────────────────────────────────────────────────────────

export class ResizeNodeCommand extends BaseCommand {
  private nodeId: string;
  private prevBounds: { position: { x: number; y: number }; size: { width: number; height: number } };
  private newBounds: { position: { x: number; y: number }; size: { width: number; height: number } };

  constructor(
    nodeId: string,
    prevBounds: { position: { x: number; y: number }; size: { width: number; height: number } },
    newBounds: { position: { x: number; y: number }; size: { width: number; height: number } }
  ) {
    super(`Resize Node`);
    this.nodeId = nodeId;
    this.prevBounds = { position: { ...prevBounds.position }, size: { ...prevBounds.size } };
    this.newBounds = { position: { ...newBounds.position }, size: { ...newBounds.size } };
  }

  public execute(): void {
    useSceneStore.getState().updateNodeProperty(this.nodeId, {
      position: this.newBounds.position,
      size: this.newBounds.size,
    });
  }

  public undo(): void {
    useSceneStore.getState().updateNodeProperty(this.nodeId, {
      position: this.prevBounds.position,
      size: this.prevBounds.size,
    });
  }
}

// ─── DeleteNodeCommand ─────────────────────────────────────────────────────────

export class DeleteNodeCommand extends BaseCommand {
  private node: DesignerNode;

  constructor(node: DesignerNode) {
    super(`Delete ${node.type} "${node.name}"`);
    this.node = node;
  }

  public execute(): void {
    sceneGraph.removeNode(this.node.id);
    useSceneStore.getState().removeNode(this.node.id);
    selectionManager.clearSelection();
    eventBus.emit(SystemEventType.CANVAS_NODE_REMOVED, { nodeId: this.node.id });
  }

  public undo(): void {
    sceneGraph.addNode(this.node);
    useSceneStore.getState().upsertNode(this.node);
    selectionManager.selectNode(this.node, false);
    eventBus.emit(SystemEventType.CANVAS_NODE_ADDED, { nodeId: this.node.id, type: this.node.type });
  }
}

// ─── DuplicateNodeCommand ──────────────────────────────────────────────────────

export class DuplicateNodeCommand extends BaseCommand {
  private originalNode: DesignerNode;
  private duplicatedNode: DesignerNode;

  constructor(originalNode: DesignerNode, duplicatedNode: DesignerNode) {
    super(`Duplicate ${originalNode.type} "${originalNode.name}"`);
    this.originalNode = originalNode;
    this.duplicatedNode = duplicatedNode;
  }

  public execute(): void {
    sceneGraph.addNode(this.duplicatedNode);
    useSceneStore.getState().upsertNode(this.duplicatedNode);
    selectionManager.selectNode(this.duplicatedNode, false);
    eventBus.emit(SystemEventType.CANVAS_NODE_ADDED, {
      nodeId: this.duplicatedNode.id,
      type: this.duplicatedNode.type,
    });
  }

  public undo(): void {
    sceneGraph.removeNode(this.duplicatedNode.id);
    useSceneStore.getState().removeNode(this.duplicatedNode.id);
    selectionManager.selectNode(this.originalNode, false);
    eventBus.emit(SystemEventType.CANVAS_NODE_REMOVED, { nodeId: this.duplicatedNode.id });
  }
}

// ─── UpdateNodePropertyCommand ─────────────────────────────────────────────────

export class UpdateNodePropertyCommand extends BaseCommand {
  private nodeId: string;
  private prevPatch: Record<string, unknown>;
  private newPatch: Record<string, unknown>;

  constructor(nodeId: string, prevPatch: Record<string, unknown>, newPatch: Record<string, unknown>) {
    super(`Update Node Property`);
    this.nodeId = nodeId;
    this.prevPatch = { ...prevPatch };
    this.newPatch = { ...newPatch };
  }

  public execute(): void {
    useSceneStore.getState().updateNodeProperty(this.nodeId, this.newPatch as Partial<import('../../../stores/SceneStore').SceneNodeSnapshot>);
  }

  public undo(): void {
    useSceneStore.getState().updateNodeProperty(this.nodeId, this.prevPatch as Partial<import('../../../stores/SceneStore').SceneNodeSnapshot>);
  }
}

// ─── MultiUpdateNodePropertyCommand ──────────────────────────────────────────

export class MultiUpdateNodePropertyCommand extends BaseCommand {
  private updates: Array<{ nodeId: string; prevPatch: Record<string, unknown>; newPatch: Record<string, unknown> }>;

  constructor(updates: Array<{ nodeId: string; prevPatch: Record<string, unknown>; newPatch: Record<string, unknown> }>) {
    super(`Update ${updates.length} Objects`);
    this.updates = updates.map(u => ({
      nodeId: u.nodeId,
      prevPatch: { ...u.prevPatch },
      newPatch: { ...u.newPatch },
    }));
  }

  public execute(): void {
    const store = useSceneStore.getState();
    for (const u of this.updates) {
      store.updateNodeProperty(u.nodeId, u.newPatch as any);
    }
  }

  public undo(): void {
    const store = useSceneStore.getState();
    for (const u of this.updates) {
      store.updateNodeProperty(u.nodeId, u.prevPatch as any);
    }
  }
}

// ─── PasteNodesCommand ─────────────────────────────────────────────────────────

export class PasteNodesCommand extends BaseCommand {
  private nodes: DesignerNode[];

  constructor(nodes: DesignerNode[]) {
    super(nodes.length === 1 ? `Paste ${nodes[0].name}` : `Paste ${nodes.length} items`);
    this.nodes = nodes;
  }

  execute(): void {
    const store = useSceneStore.getState();
    const newSelection: string[] = [];

    for (const node of this.nodes) {
      sceneGraph.addNode(node);
      store.upsertNode(node);
      newSelection.push(node.id);
      eventBus.emit(SystemEventType.CANVAS_NODE_ADDED, { nodeId: node.id, type: node.type });
    }

    selectionManager.clearSelection();
    for (const id of newSelection) {
      const sceneNode = sceneGraph.getNode(id);
      if (sceneNode) selectionManager.selectNode(sceneNode.node, false);
    }
  }

  undo(): void {
    const store = useSceneStore.getState();
    for (const node of this.nodes) {
      sceneGraph.removeNode(node.id);
      store.removeNode(node.id);
      eventBus.emit(SystemEventType.CANVAS_NODE_REMOVED, { nodeId: node.id });
    }
    selectionManager.clearSelection();
  }
}

// ─── MultiDeleteNodeCommand ────────────────────────────────────────────────────

export class MultiDeleteNodeCommand extends BaseCommand {
  private nodes: DesignerNode[];

  constructor(nodes: DesignerNode[]) {
    super(`Delete ${nodes.length} items`);
    this.nodes = nodes;
  }

  public execute(): void {
    const store = useSceneStore.getState();
    for (const node of this.nodes) {
      sceneGraph.removeNode(node.id);
      store.removeNode(node.id);
      eventBus.emit(SystemEventType.CANVAS_NODE_REMOVED, { nodeId: node.id });
    }
    selectionManager.clearSelection();
  }

  public undo(): void {
    const store = useSceneStore.getState();
    for (const node of this.nodes) {
      sceneGraph.addNode(node);
      store.upsertNode(node);
      eventBus.emit(SystemEventType.CANVAS_NODE_ADDED, { nodeId: node.id, type: node.type });
    }
    selectionManager.clearSelection();
    for (const node of this.nodes) {
      selectionManager.selectNode(node, false);
    }
  }
}
