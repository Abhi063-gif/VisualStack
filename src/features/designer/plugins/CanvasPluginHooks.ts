import { eventBus } from '../../../core/events/EventBus';
import { SystemEventType } from '../../../core/events/EventTypes';

export class CanvasPluginHooks {
  public static triggerBeforeSelection(targetIds: string[]): void {
    eventBus.emit(SystemEventType.BEFORE_SELECTION, { targetIds });
  }

  public static triggerAfterSelection(selectedIds: string[]): void {
    eventBus.emit(SystemEventType.AFTER_SELECTION, { selectedIds });
  }

  public static triggerBeforeZoom(currentZoom: number, targetZoom: number): void {
    eventBus.emit(SystemEventType.BEFORE_ZOOM, { currentZoom, targetZoom });
  }

  public static triggerAfterZoom(zoom: number): void {
    eventBus.emit(SystemEventType.AFTER_ZOOM, { zoom });
  }

  public static triggerBeforePan(currentX: number, currentY: number): void {
    eventBus.emit(SystemEventType.BEFORE_PAN, { currentX, currentY });
  }

  public static triggerAfterPan(x: number, y: number): void {
    eventBus.emit(SystemEventType.AFTER_PAN, { x, y });
  }
}
