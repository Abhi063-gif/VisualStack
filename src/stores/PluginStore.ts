import { create } from 'zustand';
import type { PluginState } from './interfaces/storeInterfaces';

export const usePluginStore = create<PluginState>(() => ({
  installedPlugins: [],
  activePlugins: [],
}));
