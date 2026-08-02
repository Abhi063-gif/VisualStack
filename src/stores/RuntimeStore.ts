import { create } from 'zustand';
import type { RuntimeStateStore } from './interfaces/storeInterfaces';

export const useRuntimeStore = create<RuntimeStateStore>((set) => ({
  isFrontendRunning: false,
  isBackendRunning: false,
  logs: [],
  addLog: (log) => set((state) => ({ logs: [...state.logs, log] })),
}));
