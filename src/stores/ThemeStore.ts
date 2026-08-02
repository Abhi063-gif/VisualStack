import { create } from 'zustand';
import type { ThemeState } from './interfaces/storeInterfaces';

export const useThemeStore = create<ThemeState>(() => ({
  mode: 'dark',
}));
