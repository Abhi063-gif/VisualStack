import { BaseCommand } from '../../../core/commands/Command';
import { sceneGraph } from '../scenegraph/SceneGraph';
import { useSceneStore } from '../../../stores/SceneStore';
import { selectionManager } from '../selection/SelectionManager';
import { eventBus } from '../../../core/events/EventBus';
import { SystemEventType } from '../../../core/events/EventTypes';
import { componentStore } from '../../../stores/ComponentStore';
import type { ComponentDefinition } from '../../../stores/ComponentStore';
import { ComponentInstanceNode } from '../nodes/ComponentInstanceNode';
import type { DesignerNode } from '../models/DesignerNode';

function serializeSubtree(nodeId: string): Record<string, unknown> {
  const sn = sceneGraph.getNode(nodeId);
  if (!sn) return {};
  const data = sn.node.serialize();
  const children: Record<string, unknown>[] = [];
  for (const child of sn.children) {
    children.push(serializeSubtree(child.node.id));
  }
  return { ...data, _children: children };
}

function generateId(): string {
  return `comp_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
}

export class MakeComponentCommand extends BaseCommand {
  private sourceNodeId: string;
  private componentId: string;
  private instanceId: string;
  private componentDef: ComponentDefinition | null = null;
  private instanceNode: ComponentInstanceNode | null = null;
  private originalNode: DesignerNode | null = null;
  private originalParentId: string | null = null;

  constructor(sourceNodeId: string) {
    super('Make Component');
    this.sourceNodeId = sourceNodeId;
    this.componentId = generateId();
    this.instanceId = `inst_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
  }

  execute(): void {
    const sn = sceneGraph.getNode(this.sourceNodeId);
    if (!sn) return;

    this.originalNode = sn.node;
    this.originalParentId = sn.parent?.node.id ?? null;

    // 1. Serialize the full subtree into a ComponentDefinition
    if (!this.componentDef) {
      const tree = serializeSubtree(this.sourceNodeId);
      this.componentDef = {
        id: this.componentId,
        name: sn.node.name || 'Component',
        serializedTree: tree,
        rootNodeId: this.sourceNodeId,
        createdAt: Date.now(),
      };
    }

    // 2. Register in ComponentStore
    componentStore.register(this.componentDef);

    // 3. Create a ComponentInstance in the same position/size
    if (!this.instanceNode) {
      this.instanceNode = new ComponentInstanceNode({
        id: this.instanceId,
        name: `${this.componentDef.name}`,
        position: { ...sn.node.position },
        size: { ...sn.node.size },
        componentId: this.componentId,
        overrides: {},
        parent: this.originalParentId,
      });
      this.instanceNode.nodeStyle = { ...sn.node.nodeStyle };
    }

    // 4. Remove original node subtree from SceneGraph, add instance in its place
    sceneGraph.removeNode(this.sourceNodeId);
    useSceneStore.getState().removeNode(this.sourceNodeId);

    sceneGraph.addNode(this.instanceNode);
    useSceneStore.getState().upsertNode(this.instanceNode);

    selectionManager.selectNode(this.instanceNode, false);
    eventBus.emit(SystemEventType.CANVAS_NODE_ADDED, { nodeId: this.instanceId, type: 'ComponentInstance' });
  }

  undo(): void {
    if (!this.originalNode || !this.instanceNode) return;

    // Remove instance
    sceneGraph.removeNode(this.instanceId);
    useSceneStore.getState().removeNode(this.instanceId);

    // Restore original node
    sceneGraph.addNode(this.originalNode);
    useSceneStore.getState().upsertNode(this.originalNode);

    // Unregister component
    componentStore.unregister(this.componentId);

    selectionManager.selectNode(this.originalNode, false);
    eventBus.emit(SystemEventType.CANVAS_NODE_ADDED, { nodeId: this.sourceNodeId, type: this.originalNode.type });
  }
}

export class DetachInstanceCommand extends BaseCommand {
  private instanceId: string;
  private componentId: string = '';
  private overrides: Record<string, unknown> = {};

  constructor(instanceId: string) {
    super('Detach Instance');
    this.instanceId = instanceId;
  }

  execute(): void {
    const sn = sceneGraph.getNode(this.instanceId);
    if (!sn || sn.node.type !== 'ComponentInstance') return;

    const inst = sn.node as ComponentInstanceNode;
    this.componentId = inst.componentId;
    this.overrides = { ...inst.overrides };

    // Convert to a plain Frame node by changing type and clearing component link
    inst.type = 'Frame';
    (inst as any).componentId = '';
    (inst as any).isDetached = true;

    useSceneStore.getState().upsertNode(inst);
    eventBus.emit(SystemEventType.CANVAS_NODE_UPDATED, { nodeId: this.instanceId, changes: {} });
  }

  undo(): void {
    const sn = sceneGraph.getNode(this.instanceId);
    if (!sn) return;

    const node = sn.node as ComponentInstanceNode;
    node.type = 'ComponentInstance';
    (node as any).componentId = this.componentId;
    (node as any).overrides = this.overrides;
    (node as any).isDetached = false;

    useSceneStore.getState().upsertNode(node);
    eventBus.emit(SystemEventType.CANVAS_NODE_UPDATED, { nodeId: this.instanceId, changes: {} });
  }
}
