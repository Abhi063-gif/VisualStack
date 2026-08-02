import { cursorManager } from './CursorManager';
import { selectionManager } from '../selection/SelectionManager';
import { commandManager } from '../../../core/commands/CommandManager';
import { toolManager } from '../tools/ToolManager';

export class KeyboardInteraction {
  public isSpacePressed = false;

  public handleKeyDown(e: KeyboardEvent): void {
    if (e.key === ' ' && !this.isSpacePressed) {
      this.isSpacePressed = true;
      cursorManager.setCursor('grab');
    }

    if (e.key === 'Escape') {
      selectionManager.clearSelection();
      toolManager.setActiveTool('select');
    }

    if (e.key === 'Delete' || e.key === 'Backspace') {
      if (selectionManager.selectedIds.length > 0) {
        selectionManager.clearSelection();
      }
    }

    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z') {
      e.preventDefault();
      if (e.shiftKey) {
        commandManager.redo();
      } else {
        commandManager.undo();
      }
    }

    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'y') {
      e.preventDefault();
      commandManager.redo();
    }
  }

  public handleKeyUp(e: KeyboardEvent): void {
    if (e.key === ' ') {
      this.isSpacePressed = false;
      cursorManager.setCursor('default');
    }
  }
}
