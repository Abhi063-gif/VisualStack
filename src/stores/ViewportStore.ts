import { create } from 'zustand';
import type { ViewportStoreState } from './interfaces/storeInterfaces';
import { CANVAS_CONSTANTS } from '../constants/CanvasConstants';

export const useViewportStore = create<ViewportStoreState>((set) => ({
  x: 0,
  y: 0,
  zoom: CANVAS_CONSTANTS.DEFAULT_ZOOM,
  minZoom: CANVAS_CONSTANTS.MIN_ZOOM,
  maxZoom: CANVAS_CONSTANTS.MAX_ZOOM,
  setCamera: (x, y, zoom) => set({ x, y, zoom }),
  setZoom: (zoom) => set({ zoom }),
  setPan: (x, y) => set({ x, y }),
}));
