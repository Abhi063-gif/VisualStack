export interface IPluginSDK {
  registerComponent(name: string, component: unknown): void;
  registerBackendNode(name: string, node: unknown): void;
}
