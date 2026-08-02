import { PanInteraction } from './PanInteraction';
import { ZoomInteraction } from './ZoomInteraction';
import { SelectionInteraction } from './SelectionInteraction';
import { KeyboardInteraction } from './KeyboardInteraction';
import { cursorManager } from './CursorManager';
import { eventBus } from '../../../core/events/EventBus';
import { SystemEventType } from '../../../core/events/EventTypes';

export class InteractionManager {
  private pan = new PanInteraction();
  private zoom = new ZoomInteraction();
  private selection = new SelectionInteraction();
  private keyboard = new KeyboardInteraction();

  public attach(container: HTMLElement): () => void {
    cursorManager.setContainer(container);

    const onMouseDown = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const handled = this.pan.handleMouseDown(e, this.keyboard.isSpacePressed);
      if (!handled) {
        this.selection.handleMouseDown(e, rect);
      }
      eventBus.emit(SystemEventType.CANVAS_CLICKED, { x: e.clientX - rect.left, y: e.clientY - rect.top, button: e.button });
    };

    const onMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const handled = this.pan.handleMouseMove(e);
      if (!handled) {
        this.selection.handleMouseMove(e, rect);
      }
    };

    const onMouseUp = () => {
      this.pan.handleMouseUp();
      this.selection.handleMouseUp();
    };

    const onWheel = (e: WheelEvent) => {
      const rect = container.getBoundingClientRect();
      this.zoom.handleWheel(e, rect);
    };

    const onKeyDown = (e: KeyboardEvent) => this.keyboard.handleKeyDown(e);
    const onKeyUp = (e: KeyboardEvent) => this.keyboard.handleKeyUp(e);

    container.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    container.addEventListener('wheel', onWheel, { passive: false });
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);

    return () => {
      container.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      container.removeEventListener('wheel', onWheel);
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
      cursorManager.setContainer(null);
    };
  }
}
