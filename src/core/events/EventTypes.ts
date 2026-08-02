export type EventCallback<T = unknown> = (payload: T) => void;

export const SystemEventType = {
  PROJECT_LOADED: 'PROJECT_LOADED',
  PROJECT_SAVED: 'PROJECT_SAVED',
  CANVAS_NODE_ADDED: 'CANVAS_NODE_ADDED',
  CANVAS_NODE_UPDATED: 'CANVAS_NODE_UPDATED',
  CANVAS_NODE_REMOVED: 'CANVAS_NODE_REMOVED',
  SELECTION_CHANGED: 'SELECTION_CHANGED',
  BACKEND_NODE_ADDED: 'BACKEND_NODE_ADDED',
  BACKEND_CONNECTION_ADDED: 'BACKEND_CONNECTION_ADDED',
  COMMAND_EXECUTED: 'COMMAND_EXECUTED',
  COMMAND_UNDONE: 'COMMAND_UNDONE',
  COMMAND_REDONE: 'COMMAND_REDONE',
  THEME_CHANGED: 'THEME_CHANGED',
  LAYOUT_CHANGED: 'LAYOUT_CHANGED',
  RUNTIME_STATUS_CHANGED: 'RUNTIME_STATUS_CHANGED',
  LOG_EMITTED: 'LOG_EMITTED',
  SCREEN_SWITCHED: 'SCREEN_SWITCHED',
  // Module 02 Canvas Events
  CANVAS_CLICKED: 'CANVAS_CLICKED',
  ZOOM_CHANGED: 'ZOOM_CHANGED',
  PAN_CHANGED: 'PAN_CHANGED',
  VIEWPORT_UPDATED: 'VIEWPORT_UPDATED',
  SELECTION_BOX_STARTED: 'SELECTION_BOX_STARTED',
  SELECTION_BOX_ENDED: 'SELECTION_BOX_ENDED',
  ACTIVE_TOOL_CHANGED: 'ACTIVE_TOOL_CHANGED',
  BEFORE_SELECTION: 'BEFORE_SELECTION',
  AFTER_SELECTION: 'AFTER_SELECTION',
  BEFORE_ZOOM: 'BEFORE_ZOOM',
  AFTER_ZOOM: 'AFTER_ZOOM',
  BEFORE_PAN: 'BEFORE_PAN',
  AFTER_PAN: 'AFTER_PAN',
  // Module 02.5 Events
  TOOL_CHANGED: 'TOOL_CHANGED',
  INSPECTOR_CHANGED: 'INSPECTOR_CHANGED',
  LAYER_SELECTED: 'LAYER_SELECTED',
  PANEL_RESIZED: 'PANEL_RESIZED',
  SIDEBAR_TAB_CHANGED: 'SIDEBAR_TAB_CHANGED',
  STATUS_CHANGED: 'STATUS_CHANGED',
  // Module 03 Part 02 Events
  NODE_MOVED: 'NODE_MOVED',
  NODE_RESIZED: 'NODE_RESIZED',
  NODE_ROTATED: 'NODE_ROTATED',
  NODE_GROUPED: 'NODE_GROUPED',
  NODE_UNGROUPED: 'NODE_UNGROUPED',
  NODE_RENAMED: 'NODE_RENAMED',
  NODE_LOCKED: 'NODE_LOCKED',
  NODE_VISIBILITY_CHANGED: 'NODE_VISIBILITY_CHANGED',
  LAYER_REORDERED: 'LAYER_REORDERED',
  LAYER_HOVERED: 'LAYER_HOVERED',
  // Module 04 Visual Logic & State Events
  LOGIC_NODE_CREATED: 'LOGIC_NODE_CREATED',
  LOGIC_NODE_DELETED: 'LOGIC_NODE_DELETED',
  LOGIC_CONNECTION_CREATED: 'LOGIC_CONNECTION_CREATED',
  LOGIC_CONNECTION_REMOVED: 'LOGIC_CONNECTION_REMOVED',
  GRAPH_EXECUTED: 'GRAPH_EXECUTED',
  VARIABLE_CHANGED: 'VARIABLE_CHANGED',
  FUNCTION_CREATED: 'FUNCTION_CREATED',
  FUNCTION_CALLED: 'FUNCTION_CALLED',
} as const;

export type SystemEventType = (typeof SystemEventType)[keyof typeof SystemEventType];

export interface EventPayloadMap {
  [SystemEventType.PROJECT_LOADED]: { projectId: string; name: string };
  [SystemEventType.PROJECT_SAVED]: { projectId: string; timestamp: string };
  [SystemEventType.CANVAS_NODE_ADDED]: { nodeId: string; type: string };
  [SystemEventType.CANVAS_NODE_UPDATED]: { nodeId: string; changes: Record<string, unknown> };
  [SystemEventType.CANVAS_NODE_REMOVED]: { nodeId: string };
  [SystemEventType.SELECTION_CHANGED]: { selectedIds: string[] };
  [SystemEventType.BACKEND_NODE_ADDED]: { nodeId: string; type: string };
  [SystemEventType.BACKEND_CONNECTION_ADDED]: { connectionId?: string; edgeId?: string; source?: string; target?: string; sourcePort?: string; targetPort?: string };
  [SystemEventType.COMMAND_EXECUTED]: { commandId: string; description: string };
  [SystemEventType.COMMAND_UNDONE]: { commandId: string };
  [SystemEventType.COMMAND_REDONE]: { commandId: string };
  [SystemEventType.THEME_CHANGED]: { mode: 'dark' };
  [SystemEventType.LAYOUT_CHANGED]: { sidebarVisible?: boolean; inspectorVisible?: boolean; screenId?: string };
  [SystemEventType.RUNTIME_STATUS_CHANGED]: { component: 'frontend' | 'backend'; status: string };
  [SystemEventType.LOG_EMITTED]: { level: string; message: string };
  [SystemEventType.SCREEN_SWITCHED]: { screenId: string; name: string; route: string };
  // Module 02 Payload Specs
  [SystemEventType.CANVAS_CLICKED]: { x: number; y: number; button: number };
  [SystemEventType.ZOOM_CHANGED]: { zoom: number; prevZoom: number };
  [SystemEventType.PAN_CHANGED]: { x: number; y: number };
  [SystemEventType.VIEWPORT_UPDATED]: { x: number; y: number; zoom: number };
  [SystemEventType.SELECTION_BOX_STARTED]: { startX: number; startY: number };
  [SystemEventType.SELECTION_BOX_ENDED]: { width: number; height: number };
  [SystemEventType.ACTIVE_TOOL_CHANGED]: { toolId: string };
  [SystemEventType.BEFORE_SELECTION]: { targetIds: string[] };
  [SystemEventType.AFTER_SELECTION]: { selectedIds: string[] };
  [SystemEventType.BEFORE_ZOOM]: { currentZoom: number; targetZoom: number };
  [SystemEventType.AFTER_ZOOM]: { zoom: number };
  [SystemEventType.BEFORE_PAN]: { currentX: number; currentY: number };
  [SystemEventType.AFTER_PAN]: { x: number; y: number };
  // Module 02.5 Payload Specs
  [SystemEventType.TOOL_CHANGED]: { toolId: string; name: string };
  [SystemEventType.INSPECTOR_CHANGED]: { property: string; value: unknown };
  [SystemEventType.LAYER_SELECTED]: { layerId: string };
  [SystemEventType.PANEL_RESIZED]: { panel: string; size: number };
  [SystemEventType.SIDEBAR_TAB_CHANGED]: { tabId: string };
  [SystemEventType.STATUS_CHANGED]: { zoom?: number; cursorX?: number; cursorY?: number };
  // Module 03 Part 02 Payload Specs
  [SystemEventType.NODE_MOVED]: { nodeId: string };
  [SystemEventType.NODE_RESIZED]: { nodeId: string; width?: number; height?: number };
  [SystemEventType.NODE_ROTATED]: { nodeId: string; rotation?: number };
  [SystemEventType.NODE_GROUPED]: { groupId: string; childIds?: string[] };
  [SystemEventType.NODE_UNGROUPED]: { groupId: string; childIds?: string[] };
  [SystemEventType.NODE_RENAMED]: { nodeId: string; name: string };
  [SystemEventType.NODE_LOCKED]: { nodeId: string; isLocked?: boolean };
  [SystemEventType.NODE_VISIBILITY_CHANGED]: { nodeId: string; isVisible?: boolean };
  [SystemEventType.LAYER_REORDERED]: { nodeId: string; newIndex?: number };
  [SystemEventType.LAYER_HOVERED]: { layerId: string | null };
  // Module 04 Visual Logic Specs
  [SystemEventType.LOGIC_NODE_CREATED]: { nodeId: string; type: string };
  [SystemEventType.LOGIC_NODE_DELETED]: { nodeId: string };
  [SystemEventType.LOGIC_CONNECTION_CREATED]: { edgeId?: string; connectionId?: string; source?: string; target?: string; sourcePort?: string; targetPort?: string };
  [SystemEventType.LOGIC_CONNECTION_REMOVED]: { edgeId?: string; connectionId?: string };
  [SystemEventType.GRAPH_EXECUTED]: { graphId: string; timestamp: string; executionId?: string; durationMs?: number; nodesExecuted?: number; success?: boolean };
  [SystemEventType.VARIABLE_CHANGED]: { name: string; value: unknown; scope?: string };
  [SystemEventType.FUNCTION_CREATED]: { name: string };
  [SystemEventType.FUNCTION_CALLED]: { name: string };
}
