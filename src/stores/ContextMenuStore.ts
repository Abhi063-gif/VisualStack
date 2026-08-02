import { create } from 'zustand';

export interface ContextMenuState {
  x: number;
  y: number;
  isVisible: boolean;
  targetId: string | null;
  show: (x: number, y: number, targetId: string | null) => void;
  hide: () => void;
}

export const useContextMenuStore = create<ContextMenuState>((set) => ({
  x: 0,
  y: 0,
  isVisible: false,
  targetId: null,
  show: (x, y, targetId) => set({ x, y, isVisible: true, targetId }),
  hide: () => set({ isVisible: false, targetId: null }),
}));
