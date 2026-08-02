import type { DesignerNode } from '../models/DesignerNode';

export interface BoundingBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

export class SpatialIndex {
  private static instance: SpatialIndex;
  private nodes: DesignerNode[] = [];

  private constructor() {}

  public static getInstance(): SpatialIndex {
    if (!SpatialIndex.instance) {
      SpatialIndex.instance = new SpatialIndex();
    }
    return SpatialIndex.instance;
  }

  public insert(node: DesignerNode): void {
    this.nodes.push(node);
  }

  public remove(id: string): void {
    this.nodes = this.nodes.filter((n) => n.id !== id);
  }

  public queryPoint(x: number, y: number): DesignerNode[] {
    return this.nodes.filter((node) => node.containsPoint(x, y));
  }

  public queryBox(box: BoundingBox): DesignerNode[] {
    return this.nodes.filter((node) => {
      const b = node.getBounds();
      return (
        b.x < box.x + box.width &&
        b.x + b.width > box.x &&
        b.y < box.y + box.height &&
        b.y + b.height > box.y
      );
    });
  }

  public clear(): void {
    this.nodes = [];
  }
}

export const spatialIndex = SpatialIndex.getInstance();
