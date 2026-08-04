import { ComponentRegistry } from '../features/designer/components/registry/ComponentRegistry';
import { eventBus } from '../core/events/EventBus';
import { commandManager } from '../core/commands/CommandManager';
import type { ICommand } from '../core/commands/Command';

export interface PluginManifest {
  id: string;
  name: string;
  version: string;
  author: string;
  description: string;
  category: 'UI Components' | 'Backend Nodes' | 'Integrations' | 'AI Models' | 'Themes';
  icon?: string;
}

export class VisualStackPluginSDK {
  private manifest: PluginManifest;

  constructor(manifest: PluginManifest) {
    this.manifest = manifest;
  }

  public registerComponent(name: string, category = 'Custom'): void {
    ComponentRegistry.getInstance().registerComponent({
      id: name,
      displayName: name,
      description: `Custom plugin component ${name}`,
      category,
      icon: 'Package',
      keywords: [name.toLowerCase(), 'plugin'],
      defaultWidth: 120,
      defaultHeight: 50,
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

  public emitEvent(eventName: string, data: any): void {
    eventBus.emit(eventName as any, data);
  }

  public getManifest(): PluginManifest {
    return { ...this.manifest };
  }
}
