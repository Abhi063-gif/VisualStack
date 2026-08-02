import { create } from 'zustand';
import type { SelectionState } from './interfaces/storeInterfaces';

export const useSelectionStore = create<SelectionState>((set) => ({
  selectedComponentIds: [],
  selectedBackendNodeIds: [],
  selectComponents: (ids) => set({ selectedComponentIds: ids }),
  selectBackendNodes: (ids) => set({ selectedBackendNodeIds: ids }),
  clearSelection: () => set({ selectedComponentIds: [], selectedBackendNodeIds: [] }),
}));
