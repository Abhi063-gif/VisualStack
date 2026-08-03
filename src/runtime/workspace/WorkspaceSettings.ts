export interface WorkspaceSettings {
  autoSave: boolean;
  autoCompile: boolean;
  hotReload: boolean;
  packageManager: 'npm' | 'pnpm' | 'yarn' | 'bun';
  defaultPort: number;
  openBrowserOnStart: boolean;
  theme: 'dark' | 'light';
}

export const defaultWorkspaceSettings: WorkspaceSettings = {
  autoSave: true,
  autoCompile: true,
  hotReload: true,
  packageManager: 'npm',
  defaultPort: 3000,
  openBrowserOnStart: true,
  theme: 'dark',
};
