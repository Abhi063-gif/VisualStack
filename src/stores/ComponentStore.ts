import { create } from 'zustand';

export interface ComponentDefinition {
  id: string;
  name: string;
  description?: string;
  serializedTree: Record<string, unknown>; // Serialized subtree (root + all children recursively)
  rootNodeId: string;
  thumbnail?: string; // base64 preview
  createdAt: number;
}

interface ComponentStoreState {
  mainComponents: Record<string, ComponentDefinition>;
  registerComponent: (def: ComponentDefinition) => void;
  unregisterComponent: (id: string) => void;
  getComponent: (id: string) => ComponentDefinition | undefined;
  getAllComponents: () => ComponentDefinition[];
}

export const useComponentStore = create<ComponentStoreState>((set, get) => ({
  mainComponents: {},

  registerComponent: (def) => {
    set((state) => ({
      mainComponents: { ...state.mainComponents, [def.id]: def },
    }));
  },

  unregisterComponent: (id) => {
    set((state) => {
      const next = { ...state.mainComponents };
      delete next[id];
      return { mainComponents: next };
    });
  },

  getComponent: (id) => get().mainComponents[id],

  getAllComponents: () => Object.values(get().mainComponents),
}));

export const componentStore = {
  register: (def: ComponentDefinition) => useComponentStore.getState().registerComponent(def),
  unregister: (id: string) => useComponentStore.getState().unregisterComponent(id),
  get: (id: string) => useComponentStore.getState().getComponent(id),
  getAll: () => useComponentStore.getState().getAllComponents(),
};
