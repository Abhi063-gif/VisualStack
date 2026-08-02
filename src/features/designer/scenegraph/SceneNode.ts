import type { DesignerNode } from '../models/DesignerNode';

export class SceneNode {
  public node: DesignerNode;
  public parent: SceneNode | null = null;
  public children: SceneNode[] = [];

  constructor(node: DesignerNode) {
    this.node = node;
  }

  public addChild(child: SceneNode): void {
    child.parent = this;
    this.children.push(child);
    if (!this.node.children.includes(child.node.id)) {
      this.node.children.push(child.node.id);
    }
  }

  public removeChild(childId: string): void {
    this.children = this.children.filter((c) => c.node.id !== childId);
    this.node.children = this.node.children.filter((id) => id !== childId);
  }

  public getWorldPosition(): { x: number; y: number } {
    if (!this.parent) {
      return { x: this.node.position.x, y: this.node.position.y };
    }
    const parentPos = this.parent.getWorldPosition();
    return {
      x: parentPos.x + this.node.position.x,
      y: parentPos.y + this.node.position.y,
    };
  }
}
