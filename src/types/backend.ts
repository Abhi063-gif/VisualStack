export interface FlowViewportState {
  x: number;
  y: number;
  zoom: number;
}

export type BackendCategory = 'Auth' | 'Data' | 'Integration' | 'ControlFlow' | 'Logic' | 'Output';

export interface FlowNodeDefinition {
  type: string;
  category: BackendCategory;
  label: string;
  description: string;
  defaultConfig: Record<string, unknown>;
}
