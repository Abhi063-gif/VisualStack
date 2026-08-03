import type { DeploymentStatus } from './DeploymentStatus';

export class DeploymentHistory {
  private history: DeploymentStatus[] = [];

  public getHistory(): DeploymentStatus[] {
    return [...this.history];
  }

  public recordDeployment(status: DeploymentStatus): void {
    this.history.unshift(status);
  }

  public getDeploymentById(id: string): DeploymentStatus | undefined {
    return this.history.find((d) => d.id === id);
  }

  public clearHistory(): void {
    this.history = [];
  }
}

export const deploymentHistory = new DeploymentHistory();
