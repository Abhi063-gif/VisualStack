export const themeConfig = {
  defaultMode: 'dark' as const,
  supportedModes: ['dark'] as const,
  customizationEnabled: true,
};

export const compilerConfig = {
  defaultFrontendTarget: 'react',
  defaultBackendTarget: 'express',
  optimizationLevel: 'standard',
};

export const runtimeConfig = {
  defaultFrontendPort: 3000,
  defaultBackendPort: 5000,
  healthCheckIntervalMs: 2000,
};
