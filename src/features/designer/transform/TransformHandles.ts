import type { Bounds, Point } from './TransformMath';
import { TransformMath } from './TransformMath';

export type HandleType = 'nw' | 'n' | 'ne' | 'e' | 'se' | 's' | 'sw' | 'w' | 'rotation';

export interface HandleSpec {
  id: string;
  type: HandleType;
  x: number;
  y: number;
  cursor: string;
}

export class TransformHandles {
  public static getHandles(bounds: Bounds, rotationDeg: number = 0): HandleSpec[] {
    const { x, y, width, height } = bounds;
    
    const center = {
      x: x + width / 2,
      y: y + height / 2
    };

    const handlePoints: Record<HandleType, Point> = {
      'nw': { x, y },
      'n': { x: x + width / 2, y },
      'ne': { x: x + width, y },
      'e': { x: x + width, y: y + height / 2 },
      'se': { x: x + width, y: y + height },
      's': { x: x + width / 2, y: y + height },
      'sw': { x, y: y + height },
      'w': { x, y: y + height / 2 },
      'rotation': { x: x + width / 2, y: y - 24 }
    };

    // Rotate the handle points if there is a rotation
    const handles: HandleSpec[] = [];
    
    // We compute cursors base on the angle. This is a simplification.
    // For a highly polished feel, the cursor should rotate with the object (e.g. N-S becomes E-W at 90deg)
    // For now, we will map based on the angle roughly.
    
    const angleIndex = Math.round(((rotationDeg % 360) + 360) % 360 / 45) % 8;
    const cursors = ['ns-resize', 'nesw-resize', 'ew-resize', 'nwse-resize', 'ns-resize', 'nesw-resize', 'ew-resize', 'nwse-resize'];
    
    // Base cursor indices for 0 deg
    const baseIndices: Record<HandleType, number> = {
      'n': 0, 'ne': 1, 'e': 2, 'se': 3, 's': 4, 'sw': 5, 'w': 6, 'nw': 7,
      'rotation': 0 // handled separately
    };

    for (const [type, pt] of Object.entries(handlePoints)) {
      const hType = type as HandleType;
      const rotatedPt = TransformMath.rotatePoint(pt, center, rotationDeg);
      
      let cursor = 'crosshair';
      if (hType !== 'rotation') {
        cursor = cursors[(baseIndices[hType] + angleIndex) % 8];
      }

      handles.push({
        id: hType,
        type: hType,
        x: rotatedPt.x,
        y: rotatedPt.y,
        cursor
      });
    }

    return handles;
  }
}
