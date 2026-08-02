import { viewportManager } from '../viewport/ViewportManager';
import { cursorManager } from './CursorManager';

export class PanInteraction {
  private isPanning = false;
  private lastX = 0;
  private lastY = 0;

  public handleMouseDown(e: MouseEvent, isSpacePressed: boolean): boolean {
    if (e.button === 1 || (e.button === 0 && isSpacePressed)) {
      this.isPanning = true;
      this.lastX = e.clientX;
      this.lastY = e.clientY;
      cursorManager.setCursor('grabbing');
      return true;
    }
    return false;
  }

  public handleMouseMove(e: MouseEvent): boolean {
    if (!this.isPanning) return false;

    const dx = e.clientX - this.lastX;
    const dy = e.clientY - this.lastY;

    this.lastX = e.clientX;
    this.lastY = e.clientY;

    viewportManager.panBy(dx, dy);
    return true;
  }

  public handleMouseUp(): boolean {
    if (this.isPanning) {
      this.isPanning = false;
      cursorManager.setCursor('default');
      return true;
    }
    return false;
  }
}
