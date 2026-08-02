import type { DesignerNode } from '../models/DesignerNode';
import { sceneGraph } from '../scenegraph/SceneGraph';
import type { Bounds } from '../transform/TransformMath';
import { TransformHandles, type HandleSpec, type HandleType } from '../transform/TransformHandles';

export type { HandleSpec as HandlePoint, HandleType };

export class TransformBox {
  public static calculateBounds(nodes: DesignerNode[]): Bounds | null {
    if (nodes.length === 0) return null;

    let minX = Infinity;
    let minY = Infinity;
    let maxX = -Infinity;
    let maxY = -Infinity;

    for (const node of nodes) {
      const sceneNode = sceneGraph.getNode(node.id);
      const b = node.getBounds();
      const worldPos = sceneNode ? sceneNode.getWorldPosition() : { x: b.x, y: b.y };
      
      minX = Math.min(minX, worldPos.x);
      minY = Math.min(minY, worldPos.y);
      maxX = Math.max(maxX, worldPos.x + b.width);
      maxY = Math.max(maxY, worldPos.y + b.height);
    }

    return {
      x: minX,
      y: minY,
      width: maxX - minX,
      height: maxY - minY,
    };
  }

  public static getHandles(bounds: Bounds, rotationDeg: number = 0): HandleSpec[] {
    return TransformHandles.getHandles(bounds, rotationDeg);
  }
}
