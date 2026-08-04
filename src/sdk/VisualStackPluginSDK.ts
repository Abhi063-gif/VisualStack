import { ComponentRegistry } from '../features/designer/components/registry/ComponentRegistry';
import { eventBus } from '../core/events/EventBus';
import { commandManager } from '../core/commands/CommandManager';
import { designSystemManager } from '../designsystem/DesignSystemManager';
import type { ICommand } from '../core/commands/Command';

export interface PluginManifest {
  id: string;
  name: string;
  version: string;
  author: string;
  description: string;
  category: 'UI Kits & Figma' | 'Editor Extensions' | 'Backend Connectors' | 'AI & Copilots' | 'Themes' | 'DevOps & Cloud';
  icon?: string;
}

export class VisualStackPluginSDK {
  private manifest: PluginManifest;

  constructor(manifest: PluginManifest) {
    this.manifest = manifest;
  }

  public registerComponent(name: string, category = 'Custom Plugins'): void {
    ComponentRegistry.getInstance().registerComponent({
      id: `${this.manifest.id}_${name.toLowerCase().replace(/\s+/g, '_')}`,
      displayName: name,
      description: `Plugin component from ${this.manifest.name}`,
      category,
      icon: 'Package',
      keywords: [name.toLowerCase(), this.manifest.name.toLowerCase(), 'plugin'],
      defaultWidth: 140,
      defaultHeight: 60,
      minimumWidth: 40,
      minimumHeight: 20,
      supportsChildren: true,
      supportsText: true,
      supportsImage: false,
      supportsLayout: true,
      supportsRotation: true,
      supportsEffects: true,
    });
  }

  public registerCommand(commandId: string, handler: () => void): void {
    const cmd: ICommand = {
      id: `${this.manifest.id}_${commandId}`,
      description: `${this.manifest.name}: ${commandId}`,
      timestamp: Date.now(),
      execute: async () => handler(),
      undo: async () => {},
    };
    commandManager.executeCommand(cmd);
  }

  public registerTheme(_themeId: string, colors: Record<string, string>): void {
    Object.entries(colors).forEach(([k, v]) => {
      designSystemManager.updateColorToken(k, v);
    });
  }

  public emitEvent(eventName: string, data: any): void {
    eventBus.emit(eventName as any, data);
  }

  public getManifest(): PluginManifest {
    return { ...this.manifest };
  }
}
