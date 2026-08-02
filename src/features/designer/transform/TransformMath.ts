export interface Point {
  x: number;
  y: number;
}

export interface Bounds {
  x: number;
  y: number;
  width: number;
  height: number;
}

export class TransformMath {
  public static degToRad(degrees: number): number {
    return degrees * (Math.PI / 180);
  }

  public static radToDeg(radians: number): number {
    return radians * (180 / Math.PI);
  }

  /**
   * Rotates a point around a center by a given angle in degrees.
   */
  public static rotatePoint(point: Point, center: Point, angleDeg: number): Point {
    const rad = this.degToRad(angleDeg);
    const cos = Math.cos(rad);
    const sin = Math.sin(rad);

    const nx = (cos * (point.x - center.x)) + (sin * (point.y - center.y)) + center.x;
    const ny = (cos * (point.y - center.y)) - (sin * (point.x - center.x)) + center.y;

    return { x: nx, y: ny };
  }

  /**
   * Computes the bounding box of a rotated rectangle.
   */
  public static computeRotatedBounds(bounds: Bounds, rotationDeg: number): Bounds {
    if (rotationDeg === 0) return { ...bounds };

    const center = {
      x: bounds.x + bounds.width / 2,
      y: bounds.y + bounds.height / 2
    };

    const p1 = this.rotatePoint({ x: bounds.x, y: bounds.y }, center, rotationDeg);
    const p2 = this.rotatePoint({ x: bounds.x + bounds.width, y: bounds.y }, center, rotationDeg);
    const p3 = this.rotatePoint({ x: bounds.x + bounds.width, y: bounds.y + bounds.height }, center, rotationDeg);
    const p4 = this.rotatePoint({ x: bounds.x, y: bounds.y + bounds.height }, center, rotationDeg);

    const minX = Math.min(p1.x, p2.x, p3.x, p4.x);
    const maxX = Math.max(p1.x, p2.x, p3.x, p4.x);
    const minY = Math.min(p1.y, p2.y, p3.y, p4.y);
    const maxY = Math.max(p1.y, p2.y, p3.y, p4.y);

    return {
      x: minX,
      y: minY,
      width: maxX - minX,
      height: maxY - minY
    };
  }

  /**
   * Computes the union bounds for multiple bounding boxes.
   */
  public static computeUnionBounds(boundsList: Bounds[]): Bounds | null {
    if (boundsList.length === 0) return null;

    let minX = Infinity;
    let minY = Infinity;
    let maxX = -Infinity;
    let maxY = -Infinity;

    for (const b of boundsList) {
      minX = Math.min(minX, b.x);
      minY = Math.min(minY, b.y);
      maxX = Math.max(maxX, b.x + b.width);
      maxY = Math.max(maxY, b.y + b.height);
    }

    return {
      x: minX,
      y: minY,
      width: maxX - minX,
      height: maxY - minY
    };
  }

  public static snapAngle(angle: number, step: number = 15): number {
    return Math.round(angle / step) * step;
  }
}
