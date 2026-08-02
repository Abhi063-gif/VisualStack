import type { IService } from '../core/container/ServiceContainer';
import type { VStackProjectFile } from '../types/project';

export class ProjectService implements IService {
  public name = 'ProjectService';

  public async createProject(name: string): Promise<VStackProjectFile> {
    return {
      version: 1,
      meta: {
        id: `proj_${Date.now()}`,
        name,
        version: '1.0.0',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      frontend: { pages: [], components: [], assets: [] },
      backend: { nodes: [], connections: [] },
      database: { tables: [] },
      deploy: { target: '', environment: {} },
    };
  }

  public async saveProject(_project: VStackProjectFile): Promise<boolean> {
    return true;
  }
}

export class StorageService implements IService {
  public name = 'StorageService';

  public get<T>(key: string, defaultValue: T): T {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch {
      return defaultValue;
    }
  }

  public set<T>(key: string, value: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.error('[StorageService] Error saving key', key, e);
    }
  }
}

export class ThemeService implements IService {
  public name = 'ThemeService';

  public applyTheme(): void {
    document.documentElement.classList.add('dark');
  }
}

export class SettingsService implements IService {
  public name = 'SettingsService';

  public getSettings(): Record<string, unknown> {
    return {};
  }
}

export const projectService = new ProjectService();
export const storageService = new StorageService();
export const themeService = new ThemeService();
export const settingsService = new SettingsService();
