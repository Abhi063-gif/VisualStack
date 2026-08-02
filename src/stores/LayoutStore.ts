import { create } from 'zustand';
import type { LayoutState } from './interfaces/storeInterfaces';

export const useLayoutStore = create<LayoutState>((set) => ({
  activeActivityItem: 'designer',
  activeBottomTab: 'terminal',
  sizes: {
    sidebarWidth: 260,
    inspectorWidth: 300,
    bottomPanelHeight: 220,
  },
  visibility: {
    sidebarVisible: true,
    inspectorVisible: true,
    bottomPanelVisible: true,
  },
  setActiveActivityItem: (item) => set({ activeActivityItem: item }),
  setActiveBottomTab: (tab) => set({ activeBottomTab: tab }),
  setPanelSizes: (sizes) =>
    set((state) => ({ sizes: { ...state.sizes, ...sizes } })),
  toggleVisibility: (key) =>
    set((state) => ({
      visibility: {
        ...state.visibility,
        [key]: !state.visibility[key],
      },
    })),
}));
