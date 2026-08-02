import { create } from 'zustand';
import type { AssetState } from './interfaces/storeInterfaces';

export const useAssetStore = create<AssetState>((set) => ({
  assets: [],
  addAsset: (asset) => set((state) => ({ assets: [...state.assets, asset] })),
}));
