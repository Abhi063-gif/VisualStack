import { CANVAS_CONSTANTS } from '../../../constants/CanvasConstants';

export class Camera {
  public x: number = 0;
  public y: number = 0;
  public zoom: number = CANVAS_CONSTANTS.DEFAULT_ZOOM;
  public minZoom: number = CANVAS_CONSTANTS.MIN_ZOOM;
  public maxZoom: number = 64.0; // 6400% zoom ceiling as specified

  constructor(x = 0, y = 0, zoom = CANVAS_CONSTANTS.DEFAULT_ZOOM) {
    this.x = x;
    this.y = y;
    this.zoom = this.clampZoom(zoom);
  }

  public clampZoom(zoom: number): number {
    return Math.min(Math.max(zoom, this.minZoom), this.maxZoom);
  }

  public setPosition(x: number, y: number): void {
    this.x = x;
    this.y = y;
  }

  public setZoom(zoom: number): void {
    this.zoom = this.clampZoom(zoom);
  }
}
