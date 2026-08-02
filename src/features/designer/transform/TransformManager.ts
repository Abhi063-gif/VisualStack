import type { TransformEvent, TransformStrategy } from './TransformStrategy';
import { MoveStrategy } from './MoveStrategy';
import { ResizeStrategy } from './ResizeStrategy';
import { RotateStrategy } from './RotateStrategy';
import type { HandleType } from './TransformHandles';
import { snappingEngine } from './SnappingEngine';

export class TransformManager {
  private currentStrategy: TransformStrategy | null = null;
  private isTransforming: boolean = false;

  public startTransform(
    type: 'move' | 'resize' | 'rotate',
    e: TransformEvent,
    handleType?: HandleType
  ): void {
    if (this.isTransforming) return;
    this.isTransforming = true;

    switch (type) {
      case 'move':
        this.currentStrategy = new MoveStrategy();
        break;
      case 'resize':
        this.currentStrategy = new ResizeStrategy(handleType!);
        break;
      case 'rotate':
        this.currentStrategy = new RotateStrategy();
        break;
    }

    if (this.currentStrategy) {
      this.currentStrategy.start(e);
    }
  }

  public updateTransform(e: TransformEvent): void {
    if (this.isTransforming && this.currentStrategy) {
      this.currentStrategy.update(e);
    }
  }

  public endTransform(e: TransformEvent): void {
    if (this.isTransforming && this.currentStrategy) {
      this.currentStrategy.end(e);
      this.currentStrategy = null;
      this.isTransforming = false;
      snappingEngine.clear();
    }
  }

  public cancelTransform(): void {
    // Revert if needed
    this.currentStrategy = null;
    this.isTransforming = false;
    snappingEngine.clear();
  }

  public get isDragging(): boolean {
    return this.isTransforming;
  }
}

export const transformManager = new TransformManager();
