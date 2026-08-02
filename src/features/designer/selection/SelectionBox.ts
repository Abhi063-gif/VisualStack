export interface SelectionBoxBounds {
  startX: number;
  startY: number;
  currentX: number;
  currentY: number;
  isDragging: boolean;
}

export class SelectionBox {
  public bounds: SelectionBoxBounds | null = null;

  public start(x: number, y: number): void {
    this.bounds = {
      startX: x,
      startY: y,
      currentX: x,
      currentY: y,
      isDragging: true,
    };
  }

  public update(x: number, y: number): void {
    if (this.bounds) {
      this.bounds.currentX = x;
      this.bounds.currentY = y;
    }
  }

  public getNormalizedBounds(): { x: number; y: number; width: number; height: number } | null {
    if (!this.bounds) return null;

    const x = Math.min(this.bounds.startX, this.bounds.currentX);
    const y = Math.min(this.bounds.startY, this.bounds.currentY);
    const width = Math.abs(this.bounds.currentX - this.bounds.startX);
    const height = Math.abs(this.bounds.currentY - this.bounds.startY);

    return { x, y, width, height };
  }

  public clear(): void {
    this.bounds = null;
  }
}
