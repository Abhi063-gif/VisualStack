export type CanvasCursor =
  | 'default'
  | 'move'
  | 'grab'
  | 'grabbing'
  | 'crosshair'
  | 'nwse-resize'
  | 'nesw-resize'
  | 'ew-resize'
  | 'ns-resize'
  | 'rotate'
  | 'text';

export class CursorManager {
  private static instance: CursorManager;
  private currentCursor: CanvasCursor = 'default';
  private containerElement: HTMLElement | null = null;

  private constructor() {}

  public static getInstance(): CursorManager {
    if (!CursorManager.instance) {
      CursorManager.instance = new CursorManager();
    }
    return CursorManager.instance;
  }

  public setContainer(element: HTMLElement | null): void {
    this.containerElement = element;
    if (element) {
      element.style.cursor = this.currentCursor;
    }
  }

  public setCursor(cursor: CanvasCursor): void {
    if (this.currentCursor === cursor) return;
    this.currentCursor = cursor;
    if (this.containerElement) {
      this.containerElement.style.cursor = cursor;
    }
  }

  public getCursor(): CanvasCursor {
    return this.currentCursor;
  }
}

export const cursorManager = CursorManager.getInstance();
