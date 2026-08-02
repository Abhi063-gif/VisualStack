import type { VStackProjectFile, BackendNodeMeta } from '../../types/project';
import type { ViewportState, GridSettings } from '../../types/canvas';
import type { PanelSizes, LayoutVisibility } from '../../types/layout';
import type { BottomPanelTab, ActivityBarItem } from '../../types/editor';

export interface ProjectState {
  currentProject: VStackProjectFile | null;
  isDirty: boolean;
  setProject: (project: VStackProjectFile) => void;
  markDirty: (dirty: boolean) => void;
}

export interface ViewportStoreState {
  x: number;
  y: number;
  zoom: number;
  minZoom: number;
  maxZoom: number;
  setCamera: (x: number, y: number, zoom: number) => void;
  setZoom: (zoom: number) => void;
  setPan: (x: number, y: number) => void;
}

export interface CanvasState {
  viewport: ViewportState;
  grid: GridSettings;
  activeToolId: string;
  setViewport: (viewport: Partial<ViewportState>) => void;
  setGrid: (grid: Partial<GridSettings>) => void;
  setActiveToolId: (toolId: string) => void;
}

export interface SelectionState {
  selectedComponentIds: string[];
  selectedBackendNodeIds: string[];
  selectComponents: (ids: string[]) => void;
  selectBackendNodes: (ids: string[]) => void;
  clearSelection: () => void;
}

export interface HistoryState {
  canUndo: boolean;
  canRedo: boolean;
  updateHistoryStatus: (canUndo: boolean, canRedo: boolean) => void;
}

export interface ThemeState {
  mode: 'dark';
}

export interface LayoutState {
  activeActivityItem: ActivityBarItem;
  activeBottomTab: BottomPanelTab;
  sizes: PanelSizes;
  visibility: LayoutVisibility;
  setActiveActivityItem: (item: ActivityBarItem) => void;
  setActiveBottomTab: (tab: BottomPanelTab) => void;
  setPanelSizes: (sizes: Partial<PanelSizes>) => void;
  toggleVisibility: (key: keyof LayoutVisibility) => void;
}

export interface PluginState {
  installedPlugins: string[];
  activePlugins: string[];
}

export interface RuntimeStateStore {
  isFrontendRunning: boolean;
  isBackendRunning: boolean;
  logs: string[];
  addLog: (log: string) => void;
}

export interface CompilerState {
  isCompiling: boolean;
  lastCompileTime: string | null;
  compileErrors: string[];
}

export interface BackendState {
  activeFlowId: string | null;
  nodes: BackendNodeMeta[];
  setActiveFlow: (id: string | null) => void;
}

export interface AssetState {
  assets: Array<{ id: string; name: string; url: string }>;
  addAsset: (asset: { id: string; name: string; url: string }) => void;
}
