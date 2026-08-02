import { create } from 'zustand';
import type { CanvasState } from './interfaces/storeInterfaces';
import { CANVAS_CONSTANTS } from '../constants/CanvasConstants';

export const useCanvasStore = create<CanvasState>((set) => ({
  viewport: {
    x: 0,
    y: 0,
    zoom: CANVAS_CONSTANTS.DEFAULT_ZOOM,
    minZoom: CANVAS_CONSTANTS.MIN_ZOOM,
    maxZoom: CANVAS_CONSTANTS.MAX_ZOOM,
  },
  grid: {
    enabled: true,
    size: CANVAS_CONSTANTS.GRID_SIZE,
    snapToGrid: true,
    color: '#232733',
    type: 'dots',
  },
  activeToolId: 'select',
  setViewport: (viewport) =>
    set((state) => ({ viewport: { ...state.viewport, ...viewport } })),
  setGrid: (grid) => set((state) => ({ grid: { ...state.grid, ...grid } })),
  setActiveToolId: (toolId) => set({ activeToolId: toolId }),
}));
