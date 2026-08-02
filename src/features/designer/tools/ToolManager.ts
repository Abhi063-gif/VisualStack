import type { ITool } from './Tool';
import { SelectTool, HandTool, FrameTool, RectangleTool, TextTool, GenericCreationTool, ZoomTool } from './SelectTool';
import { eventBus } from '../../../core/events/EventBus';
import { SystemEventType } from '../../../core/events/EventTypes';
import { useCanvasStore } from '../../../stores/CanvasStore';

export class ToolManager {
  private static instance: ToolManager;
  private tools: Map<string, ITool> = new Map();
  private activeTool: ITool;

  private constructor() {
    const selectTool = new SelectTool();
    this.registerTool(selectTool);
    this.registerTool(new HandTool());
    this.registerTool(new FrameTool());
    this.registerTool(new RectangleTool());
    this.registerTool(new TextTool());
    this.registerTool(new GenericCreationTool('ellipse', 'Ellipse Tool'));
    this.registerTool(new GenericCreationTool('line', 'Line Tool'));
    this.registerTool(new GenericCreationTool('arrow', 'Arrow Tool'));
    this.registerTool(new GenericCreationTool('image', 'Image Tool'));
    this.registerTool(new GenericCreationTool('button', 'Button Tool'));
    this.registerTool(new GenericCreationTool('input', 'Input Tool'));
    this.registerTool(new GenericCreationTool('container', 'Container Tool'));
    this.registerTool(new GenericCreationTool('stack', 'Stack Tool'));
    this.registerTool(new GenericCreationTool('component', 'Component Tool'));
    this.registerTool(new GenericCreationTool('icon', 'Icon Tool'));
    this.registerTool(new ZoomTool());

    this.activeTool = selectTool;
  }

  public static getInstance(): ToolManager {
    if (!ToolManager.instance) {
      ToolManager.instance = new ToolManager();
    }
    return ToolManager.instance;
  }

  public registerTool(tool: ITool): void {
    this.tools.set(tool.id, tool);
  }

  public setActiveTool(toolId: string): void {
    const nextTool = this.tools.get(toolId);
    if (!nextTool || nextTool.id === this.activeTool.id) return;

    this.activeTool.onDeactivate?.();
    this.activeTool = nextTool;
    this.activeTool.onActivate?.();

    useCanvasStore.getState().setActiveToolId(toolId);
    eventBus.emit(SystemEventType.ACTIVE_TOOL_CHANGED, { toolId });
  }

  public getActiveTool(): ITool {
    return this.activeTool;
  }
}

export const toolManager = ToolManager.getInstance();
