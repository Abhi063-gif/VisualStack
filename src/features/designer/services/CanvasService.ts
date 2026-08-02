import type { IService } from '../../../core/container/ServiceContainer';
import { viewportManager } from '../viewport/ViewportManager';
import { selectionManager } from '../selection/SelectionManager';
import { toolManager } from '../tools/ToolManager';

export class CanvasService implements IService {
  public name = 'CanvasService';

  public resetViewport(): void {
    viewportManager.camera.setPosition(0, 0);
    viewportManager.camera.setZoom(1.0);
  }

  public clearSelection(): void {
    selectionManager.clearSelection();
  }

  public selectTool(toolId: string): void {
    toolManager.setActiveTool(toolId);
  }
}

export const canvasService = new CanvasService();
