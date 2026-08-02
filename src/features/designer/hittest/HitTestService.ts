import { spatialIndex } from '../spatial/SpatialIndex';
import type { BoundingBox } from '../spatial/SpatialIndex';
import type { DesignerNode } from '../models/DesignerNode';

export class HitTestService {
  public static hitTestPoint(x: number, y: number): DesignerNode | null {
    const candidates = spatialIndex.queryPoint(x, y);
    return candidates.length > 0 ? candidates[candidates.length - 1] : null;
  }

  public static hitTestBox(box: BoundingBox): DesignerNode[] {
    return spatialIndex.queryBox(box);
  }
}
