import type { ProjectWorkspace } from './ProjectWorkspace';
import { defaultWorkspaceSettings, type WorkspaceSettings } from './WorkspaceSettings';
import { projectWatcher } from './ProjectWatcher';

export class WorkspaceManager {
  private activeWorkspace: ProjectWorkspace | null = null;
  private recentWorkspaces: ProjectWorkspace[] = [];
  private settings: WorkspaceSettings = { ...defaultWorkspaceSettings };

  constructor() {
    this.initDefaultWorkspace();
  }

  private initDefaultWorkspace(): void {
    const defaultWs: ProjectWorkspace = {
      id: 'ws_visualstack_demo',
      name: 'VisualStack Demo Application',
      path: '/projects/visualstack-demo',
      targetFramework: 'react-express',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      lastOpenedAt: new Date().toISOString(),
      isFavorite: true,
      version: '1.0.0',
    };
    this.activeWorkspace = defaultWs;
    this.recentWorkspaces.push(defaultWs);
  }

  public getActiveWorkspace(): ProjectWorkspace | null {
    return this.activeWorkspace;
  }

  public getRecentWorkspaces(): ProjectWorkspace[] {
    return [...this.recentWorkspaces];
  }

  public createWorkspace(name: string, targetFramework: string = 'react-express'): ProjectWorkspace {
    const newWs: ProjectWorkspace = {
      id: `ws_${Date.now()}`,
      name,
      path: `/projects/${name.toLowerCase().replace(/\s+/g, '-')}`,
      targetFramework,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      lastOpenedAt: new Date().toISOString(),
      isFavorite: false,
      version: '1.0.0',
    };

    this.recentWorkspaces.unshift(newWs);
    this.activeWorkspace = newWs;
    projectWatcher.startWatching(newWs.path);
    return newWs;
  }

  public openWorkspace(id: string): ProjectWorkspace | null {
    const target = this.recentWorkspaces.find((w) => w.id === id);
    if (target) {
      target.lastOpenedAt = new Date().toISOString();
      this.activeWorkspace = target;
      projectWatcher.startWatching(target.path);
      return target;
    }
    return null;
  }

  public getSettings(): WorkspaceSettings {
    return { ...this.settings };
  }

  public updateSettings(newSettings: Partial<WorkspaceSettings>): WorkspaceSettings {
    this.settings = { ...this.settings, ...newSettings };
    return this.settings;
  }
}

export const workspaceManager = new WorkspaceManager();
