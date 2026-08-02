import { viewportManager } from '../viewport/ViewportManager';

export class AnimationManager {
  private static instance: AnimationManager;

  private constructor() {}

  public static getInstance(): AnimationManager {
    if (!AnimationManager.instance) {
      AnimationManager.instance = new AnimationManager();
    }
    return AnimationManager.instance;
  }

  public animateZoom(targetZoom: number, durationMs = 200): void {
    const startZoom = viewportManager.camera.zoom;
    const startTime = performance.now();
    const centerScreen = { x: window.innerWidth / 2, y: window.innerHeight / 2 };

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / durationMs, 1);
      const currentZoom = startZoom + (targetZoom - startZoom) * progress;

      viewportManager.zoomAtPoint(currentZoom, centerScreen);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }
}

export const animationManager = AnimationManager.getInstance();
