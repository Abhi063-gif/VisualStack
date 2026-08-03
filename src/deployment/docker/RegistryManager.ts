export interface RegistryConfig {
  id: string;
  name: string;
  url: string;
  authenticated: boolean;
}

export class RegistryManager {
  private registries: RegistryConfig[] = [
    { id: 'dockerhub', name: 'Docker Hub', url: 'docker.io', authenticated: true },
    { id: 'ghcr', name: 'GitHub Container Registry (GHCR)', url: 'ghcr.io', authenticated: true },
    { id: 'ecr', name: 'AWS ECR', url: 'public.ecr.aws', authenticated: false },
    { id: 'acr', name: 'Azure Container Registry (ACR)', url: 'azurecr.io', authenticated: false },
    { id: 'gcr', name: 'Google Artifact Registry', url: 'gcr.io', authenticated: false },
  ];

  public getRegistries(): RegistryConfig[] {
    return [...this.registries];
  }

  public authenticate(id: string, _token: string): boolean {
    const reg = this.registries.find((r) => r.id === id);
    if (reg) {
      reg.authenticated = true;
      return true;
    }
    return false;
  }
}

export const registryManager = new RegistryManager();
