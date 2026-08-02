import { create } from 'zustand';
import type { HistoryState } from './interfaces/storeInterfaces';

export const useHistoryStore = create<HistoryState>((set) => ({
  canUndo: false,
  canRedo: false,
  updateHistoryStatus: (canUndo, canRedo) => set({ canUndo, canRedo }),
}));
