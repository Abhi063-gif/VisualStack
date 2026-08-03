import type { ExecutableTool } from '../tools/ToolCallingEngine';
import type { IAIProvider } from '../core/IAIProvider';
import { toolCallingEngine } from '../tools/ToolCallingEngine';
import { providerRegistry } from '../providers/ProviderRegistry';

export interface AIPlugin {
  id: string;
  name: string;
  version: string;
  author: string;
  tools?: ExecutableTool[];
  providers?: IAIProvider[];
}

export class AIPluginAPI {
  private plugins: Map<string, AIPlugin> = new Map();

  public registerPlugin(plugin: AIPlugin): void {
    this.plugins.set(plugin.id, plugin);

    if (plugin.tools) {
      plugin.tools.forEach((tool) => toolCallingEngine.registerTool(tool));
    }

    if (plugin.providers) {
      plugin.providers.forEach((prov) => providerRegistry.registerProvider(prov));
    }
  }

  public getPlugins(): AIPlugin[] {
    return Array.from(this.plugins.values());
  }
}

export const aiPluginAPI = new AIPluginAPI();
