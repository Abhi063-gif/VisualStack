import type { Camera } from './Camera';

export interface Point {
  x: number;
  y: number;
}

export class CoordinateConverter {
  public static screenToWorld(screenPoint: Point, camera: Camera): Point {
    return {
      x: (screenPoint.x - camera.x) / camera.zoom,
      y: (screenPoint.y - camera.y) / camera.zoom,
    };
  }

  public static worldToScreen(worldPoint: Point, camera: Camera): Point {
    return {
      x: worldPoint.x * camera.zoom + camera.x,
      y: worldPoint.y * camera.zoom + camera.y,
    };
  }
}
