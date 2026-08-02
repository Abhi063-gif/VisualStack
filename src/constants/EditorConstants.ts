export const EDITOR_CONSTANTS = {
  APP_NAME: 'VisualStack Studio',
  VERSION: '0.1.0-module01',
  DEFAULT_FILE_EXTENSION: '.vstack',
  AUTOSAVE_INTERVAL_MS: 5000,
  DEFAULT_MONACO_THEME: 'vs-dark',
} as const;

export const CANVAS_CONSTANTS = {
  MIN_ZOOM: 0.1,
  MAX_ZOOM: 5.0,
  DEFAULT_ZOOM: 1.0,
  GRID_SIZE: 16,
  SNAP_THRESHOLD: 5,
} as const;

export const BACKEND_CONSTANTS = {
  DEFAULT_NODE_WIDTH: 200,
  DEFAULT_NODE_HEIGHT: 120,
  GRID_SNAP: [16, 16] as [number, number],
} as const;

export const COMPILER_CONSTANTS = {
  TARGET_REACT_VERSION: '19.0.0',
  TARGET_NODE_VERSION: '20.0.0',
} as const;
