import { BaseCommand } from '../../../core/commands/Command';
import { sceneGraph } from '../scenegraph/SceneGraph';
import { useSceneStore } from '../../../stores/SceneStore';
import { eventBus } from '../../../core/events/EventBus';
import { SystemEventType } from '../../../core/events/EventTypes';

export type ArrangeAction = 'front' | 'back' | 'forward' | 'backward';

export class ArrangeCommand extends BaseCommand {
  private nodeIds: string[];
  private action: ArrangeAction;
  private previousZIndices: Map<string, number> = new Map();
  private newZIndices: Map<string, number> = new Map();

  constructor(nodeIds: string[], action: ArrangeAction) {
    super(`Arrange ${action}`);
    this.nodeIds = nodeIds;
    this.action = action;

    // Capture initial z-indices
    for (const id of nodeIds) {
      const node = sceneGraph.getNode(id);
      if (node) {
        const list = node.parent ? node.parent.children : sceneGraph.getRootNodes();
        const index = list.findIndex(n => n.node.id === id);
        this.previousZIndices.set(id, index);
      }
    }
  }

  execute(): void {
    const store = useSceneStore.getState();
    
    // Sort nodes to process them correctly based on action
    // If bringing forward, process from top to bottom
    // If sending backward, process from bottom to top
    const sortedIds = [...this.nodeIds].sort((a, b) => {
      const zA = this.previousZIndices.get(a) ?? 0;
      const zB = this.previousZIndices.get(b) ?? 0;
      return ['front', 'forward'].includes(this.action) ? zB - zA : zA - zB;
    });

    for (const id of sortedIds) {
      sceneGraph.setNodeZIndex(id, this.action);
    }
    
    // Capture new indices for redo and force store update
    for (const id of this.nodeIds) {
      const node = sceneGraph.getNode(id);
      if (node) {
        const list = node.parent ? node.parent.children : sceneGraph.getRootNodes();
        const index = list.findIndex(n => n.node.id === id);
        this.newZIndices.set(id, index);
        store.upsertNode(node.node); // Trigger React reactivity
      }
    }
    
    eventBus.emit(SystemEventType.LAYER_REORDERED, { nodeId: 'arrange' });
  }

  undo(): void {
    const store = useSceneStore.getState();
    
    // To undo, we have to restore exact index
    for (const id of this.nodeIds) {
      const node = sceneGraph.getNode(id);
      if (!node) continue;
      
      const oldIndex = this.previousZIndices.get(id);
      if (oldIndex === undefined) continue;

      const list = node.parent ? node.parent.children : sceneGraph.getRootNodes();
      const idList = node.parent ? node.parent.node.children : null;
      
      const currentIndex = list.findIndex(n => n.node.id === id);
      if (currentIndex !== -1 && currentIndex !== oldIndex) {
        list.splice(currentIndex, 1);
        if (idList) idList.splice(currentIndex, 1);
        
        list.splice(oldIndex, 0, node);
        if (idList) idList.splice(oldIndex, 0, id);
      }
      store.upsertNode(node.node);
    }

    eventBus.emit(SystemEventType.LAYER_REORDERED, { nodeId: 'arrange' });
  }
}
