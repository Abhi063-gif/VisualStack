export interface ViewportState {
  x: number;
  y: number;
  zoom: number;
  minZoom: number;
  maxZoom: number;
}

export interface GridSettings {
  enabled: boolean;
  size: number;
  snapToGrid: boolean;
  color: string;
  type: 'dots' | 'lines';
}

export interface SelectionBounds {
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
}
