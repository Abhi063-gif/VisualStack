import type { DeploymentStatus } from './DeploymentStatus';

export class DeploymentHistory {
  private history: DeploymentStatus[] = [
    {
      id: 'dep_init_001',
      state: 'success',
      provider: 'Vercel',
      targetEnvironment: 'production',
      startedAt: new Date(Date.now() - 3600000).toISOString(),
      completedAt: new Date(Date.now() - 3570000).toISOString(),
      durationMs: 30000,
      commitHash: 'a8ec826',
      commitMessage: 'feat: Initial production deployment',
      deploymentUrl: 'https://visualstack-demo.vercel.app',
    },
  ];

  public getHistory(): DeploymentStatus[] {
    return [...this.history];
  }

  public recordDeployment(status: DeploymentStatus): void {
    this.history.unshift(status);
  }

  public getDeploymentById(id: string): DeploymentStatus | undefined {
    return this.history.find((d) => d.id === id);
  }
}

export const deploymentHistory = new DeploymentHistory();
