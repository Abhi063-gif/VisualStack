import { BaseCommand } from '../../../core/commands/Command';
import type { DesignerNode } from '../models/DesignerNode';
import { useSceneStore } from '../../../stores/SceneStore';

export class VisibilityCommand extends BaseCommand {
  private node: DesignerNode;
  private visible: boolean;

  constructor(node: DesignerNode, visible: boolean) {
    super(`${visible ? 'Show' : 'Hide'} ${node.name}`);
    this.node = node;
    this.visible = visible;
  }

  execute(): void {
    useSceneStore.getState().updateNodeProperty(this.node.id, { visibility: this.visible });
  }

  undo(): void {
    useSceneStore.getState().updateNodeProperty(this.node.id, { visibility: !this.visible });
  }
}

export class LockCommand extends BaseCommand {
  private node: DesignerNode;
  private locked: boolean;

  constructor(node: DesignerNode, locked: boolean) {
    super(`${locked ? 'Lock' : 'Unlock'} ${node.name}`);
    this.node = node;
    this.locked = locked;
  }

  execute(): void {
    useSceneStore.getState().updateNodeProperty(this.node.id, { locked: this.locked });
  }

  undo(): void {
    useSceneStore.getState().updateNodeProperty(this.node.id, { locked: !this.locked });
  }
}

export class RenameCommand extends BaseCommand {
  private node: DesignerNode;
  private newName: string;
  private originalName: string;

  constructor(node: DesignerNode, newName: string) {
    super(`Rename ${node.name} to ${newName}`);
    this.node = node;
    this.newName = newName;
    this.originalName = node.name;
  }

  execute(): void {
    useSceneStore.getState().updateNodeProperty(this.node.id, { name: this.newName });
  }

  undo(): void {
    useSceneStore.getState().updateNodeProperty(this.node.id, { name: this.originalName });
  }
}
