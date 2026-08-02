import { selectionManager } from '../selection/SelectionManager';
import { HitTestService } from '../hittest/HitTestService';
import { CoordinateConverter } from '../viewport/CoordinateConverter';
import { viewportManager } from '../viewport/ViewportManager';
import { eventBus } from '../../../core/events/EventBus';
import { SystemEventType } from '../../../core/events/EventTypes';

export class SelectionInteraction {
  private isSelecting = false;

  public handleMouseDown(e: MouseEvent, containerRect: DOMRect): void {
    if (e.button !== 0) return;

    const screenPt = { x: e.clientX - containerRect.left, y: e.clientY - containerRect.top };
    const worldPt = CoordinateConverter.screenToWorld(screenPt, viewportManager.camera);

    const hitNode = HitTestService.hitTestPoint(worldPt.x, worldPt.y);

    if (hitNode) {
      selectionManager.selectNode(hitNode, e.shiftKey);
    } else {
      this.isSelecting = true;
      selectionManager.selectionBox.start(worldPt.x, worldPt.y);
      eventBus.emit(SystemEventType.SELECTION_BOX_STARTED, { startX: worldPt.x, startY: worldPt.y });

      if (!e.shiftKey) {
        selectionManager.clearSelection();
      }
    }
  }

  public handleMouseMove(e: MouseEvent, containerRect: DOMRect): void {
    if (!this.isSelecting) return;

    const screenPt = { x: e.clientX - containerRect.left, y: e.clientY - containerRect.top };
    const worldPt = CoordinateConverter.screenToWorld(screenPt, viewportManager.camera);

    selectionManager.selectionBox.update(worldPt.x, worldPt.y);

    const bounds = selectionManager.selectionBox.getNormalizedBounds();
    if (bounds) {
      const hitNodes = HitTestService.hitTestBox(bounds);
      selectionManager.selectBoxNodes(hitNodes, e.shiftKey);
    }
  }

  public handleMouseUp(): void {
    if (this.isSelecting) {
      this.isSelecting = false;
      const bounds = selectionManager.selectionBox.getNormalizedBounds();
      if (bounds) {
        eventBus.emit(SystemEventType.SELECTION_BOX_ENDED, { width: bounds.width, height: bounds.height });
      }
      selectionManager.selectionBox.clear();
    }
  }
}
