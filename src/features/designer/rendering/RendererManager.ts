export class RendererManager {
  private static instance: RendererManager;
  private animFrameId: number | null = null;
  private isDirty = false;

  private constructor() {}

  public static getInstance(): RendererManager {
    if (!RendererManager.instance) {
      RendererManager.instance = new RendererManager();
    }
    return RendererManager.instance;
  }

  public requestRedraw(callback: () => void): void {
    this.isDirty = true;
    if (this.animFrameId === null) {
      this.animFrameId = requestAnimationFrame(() => {
        if (this.isDirty) {
          callback();
          this.isDirty = false;
        }
        this.animFrameId = null;
      });
    }
  }
}

export const rendererManager = RendererManager.getInstance();
