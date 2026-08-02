import { BaseCommand } from '../../../core/commands/Command';
import { sceneGraph } from '../scenegraph/SceneGraph';
import { eventBus } from '../../../core/events/EventBus';
import { SystemEventType } from '../../../core/events/EventTypes';
import { ReorderNodeCommand } from './NodeCommands';

export type ArrangeDirection = 'forward' | 'backward' | 'front' | 'back';

export class ArrangeCommand extends BaseCommand {
  private innerCommand: ReorderNodeCommand | null = null;

  private nodeId: string;
  
  constructor(nodeId: string, direction: ArrangeDirection) {
    super(`Arrange ${direction}`);
    this.nodeId = nodeId;
    
    // Compute the target and position based on direction
    const sceneNode = sceneGraph.getNode(nodeId);
    if (!sceneNode) return;

    const siblings = sceneNode.parent ? sceneNode.parent.children : sceneGraph.getRootNodes();
    const currentIndex = siblings.findIndex(n => n.node.id === nodeId);
    
    if (currentIndex === -1) return;

    let targetId: string | null = null;
    let position: 'before' | 'after' | 'inside' = 'after';

    if (direction === 'forward' && currentIndex < siblings.length - 1) {
      targetId = siblings[currentIndex + 1].node.id;
      position = 'after';
    } else if (direction === 'backward' && currentIndex > 0) {
      targetId = siblings[currentIndex - 1].node.id;
      position = 'before';
    } else if (direction === 'front' && currentIndex < siblings.length - 1) {
      targetId = siblings[siblings.length - 1].node.id;
      position = 'after';
    } else if (direction === 'back' && currentIndex > 0) {
      targetId = siblings[0].node.id;
      position = 'before';
    }

    if (targetId) {
      this.innerCommand = new ReorderNodeCommand(nodeId, targetId, position);
    }
  }

  execute(): void {
    if (this.innerCommand) {
      this.innerCommand.execute();
      eventBus.emit(SystemEventType.LAYER_REORDERED, { nodeId: this.nodeId });
    }
  }

  undo(): void {
    if (this.innerCommand) {
      this.innerCommand.undo();
      eventBus.emit(SystemEventType.LAYER_REORDERED, { nodeId: this.nodeId });
    }
  }
}
