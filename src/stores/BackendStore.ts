import { create } from 'zustand';
import type { BackendState } from './interfaces/storeInterfaces';

export const useBackendStore = create<BackendState>((set) => ({
  activeFlowId: null,
  nodes: [],
  setActiveFlow: (id) => set({ activeFlowId: id }),
}));
