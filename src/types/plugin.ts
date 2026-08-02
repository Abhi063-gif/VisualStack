export interface PluginManifest {
  id: string;
  name: string;
  version: string;
  description: string;
  author: string;
  permissions: Array<'fs' | 'terminal' | 'network' | 'store'>;
}

export interface InstalledPlugin {
  manifest: PluginManifest;
  enabled: boolean;
  installedAt: string;
}
