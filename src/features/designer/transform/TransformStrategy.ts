export interface TransformEvent {
  clientX: number;
  clientY: number;
  shiftKey: boolean;
  altKey: boolean;
  ctrlKey: boolean;
  metaKey: boolean;
  startX: number;
  startY: number;
}

export interface TransformStrategy {
  /**
   * Initializes the strategy with the starting point.
   */
  start(e: TransformEvent): void;

  /**
   * Updates the transformation during the pointer movement.
   */
  update(e: TransformEvent): void;

  /**
   * Completes the transformation and generates a command.
   */
  end(e: TransformEvent): void;
}
