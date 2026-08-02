import { viewportManager } from '../viewport/ViewportManager';

export class ZoomInteraction {
  public handleWheel(e: WheelEvent, containerRect: DOMRect): boolean {
    e.preventDefault();

    const cursorScreenPoint = {
      x: e.clientX - containerRect.left,
      y: e.clientY - containerRect.top,
    };

    if (e.ctrlKey || e.metaKey) {
      // Pinch or Ctrl+Wheel zoom
      const zoomFactor = Math.pow(1.0015, -e.deltaY);
      const targetZoom = viewportManager.camera.zoom * zoomFactor;
      viewportManager.zoomAtPoint(targetZoom, cursorScreenPoint);
      return true;
    } else {
      // Panning with wheel
      viewportManager.panBy(-e.deltaX, -e.deltaY);
      return true;
    }
  }
}
