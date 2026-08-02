import { create } from 'zustand';
import type { ProjectState } from './interfaces/storeInterfaces';

export const useProjectStore = create<ProjectState>((set) => ({
  currentProject: {
    version: 1,
    meta: {
      id: 'default_project',
      name: 'VisualStack Application',
      version: '1.0.0',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    frontend: { pages: [], components: [], assets: [] },
    backend: { nodes: [], connections: [] },
    database: { tables: [] },
    deploy: { target: '', environment: {} },
  },
  isDirty: false,
  setProject: (project) => set({ currentProject: project, isDirty: false }),
  markDirty: (dirty) => set({ isDirty: dirty }),
}));
