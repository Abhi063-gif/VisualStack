import { Camera } from './Camera';
import { CoordinateConverter } from './CoordinateConverter';
import type { Point } from './CoordinateConverter';
import { useViewportStore } from '../../../stores/ViewportStore';
import { eventBus } from '../../../core/events/EventBus';
import { SystemEventType } from '../../../core/events/EventTypes';
import { CanvasPluginHooks } from '../plugins/CanvasPluginHooks';

export class ViewportManager {
  private static instance: ViewportManager;
  public camera: Camera = new Camera();

  private constructor() {}

  public static getInstance(): ViewportManager {
    if (!ViewportManager.instance) {
      ViewportManager.instance = new ViewportManager();
    }
    return ViewportManager.instance;
  }

  public panBy(dx: number, dy: number): void {
    CanvasPluginHooks.triggerBeforePan(this.camera.x, this.camera.y);

    this.camera.setPosition(this.camera.x + dx, this.camera.y + dy);
    this.syncState();

    eventBus.emit(SystemEventType.PAN_CHANGED, { x: this.camera.x, y: this.camera.y });
    CanvasPluginHooks.triggerAfterPan(this.camera.x, this.camera.y);
  }

  public zoomAtPoint(targetZoom: number, cursorScreenPoint: Point): void {
    const prevZoom = this.camera.zoom;
    const clampedZoom = this.camera.clampZoom(targetZoom);

    if (clampedZoom === prevZoom) return;

    CanvasPluginHooks.triggerBeforeZoom(prevZoom, clampedZoom);

    // Cursor-anchored zoom formula
    const worldCursor = CoordinateConverter.screenToWorld(cursorScreenPoint, this.camera);
    this.camera.setZoom(clampedZoom);

    const newScreenCursor = CoordinateConverter.worldToScreen(worldCursor, this.camera);
    const dx = cursorScreenPoint.x - newScreenCursor.x;
    const dy = cursorScreenPoint.y - newScreenCursor.y;

    this.camera.setPosition(this.camera.x + dx, this.camera.y + dy);
    this.syncState();

    eventBus.emit(SystemEventType.ZOOM_CHANGED, { zoom: clampedZoom, prevZoom });
    CanvasPluginHooks.triggerAfterZoom(clampedZoom);
  }

  private syncState(): void {
    useViewportStore.getState().setCamera(this.camera.x, this.camera.y, this.camera.zoom);
    eventBus.emit(SystemEventType.VIEWPORT_UPDATED, {
      x: this.camera.x,
      y: this.camera.y,
      zoom: this.camera.zoom,
    });
  }

  public zoomToBounds(
    bounds: { x: number; y: number; width: number; height: number },
    screenWidth: number,
    screenHeight: number,
    padding = 50
  ): void {
    if (bounds.width === 0 || bounds.height === 0) return;

    const zoomX = (screenWidth - padding * 2) / bounds.width;
    const zoomY = (screenHeight - padding * 2) / bounds.height;
    
    let targetZoom = Math.min(zoomX, zoomY);
    targetZoom = this.camera.clampZoom(targetZoom);

    const newX = (screenWidth / 2) - ((bounds.x + bounds.width / 2) * targetZoom);
    const newY = (screenHeight / 2) - ((bounds.y + bounds.height / 2) * targetZoom);

    const prevZoom = this.camera.zoom;
    this.camera.setZoom(targetZoom);
    this.camera.setPosition(newX, newY);
    this.syncState();

    eventBus.emit(SystemEventType.ZOOM_CHANGED, { zoom: targetZoom, prevZoom });
  }
}

export const viewportManager = ViewportManager.getInstance();
