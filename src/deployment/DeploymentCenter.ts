import { deploymentManager } from './DeploymentManager';
import { deploymentHistory } from './DeploymentHistory';
import { providerRegistry } from './providers/ProviderRegistry';
import type { DeploymentSession } from './DeploymentSession';
import type { DeploymentStatus } from './DeploymentStatus';

export class DeploymentCenter {
  public async createDeployment(
    projectId: string,
    provider: string,
    environment: 'development' | 'testing' | 'staging' | 'production' | 'preview'
  ): Promise<DeploymentSession> {
    return deploymentManager.startDeployment(projectId, provider, environment);
  }

  public getActiveDeployment(): DeploymentSession | null {
    return deploymentManager.getActiveSession();
  }

  public cancelDeployment(): boolean {
    return deploymentManager.cancelActiveSession();
  }

  public getDeploymentHistory(): DeploymentStatus[] {
    return deploymentHistory.getHistory();
  }

  public getSupportedProviders() {
    return providerRegistry.getAll();
  }

  public getAnalytics() {
    const history = deploymentHistory.getHistory();
    const total = history.length;
    const successful = history.filter((h) => h.state === 'success').length;
    const failed = history.filter((h) => h.state === 'failed').length;
    return {
      totalDeployments: total,
      successfulDeployments: successful,
      failedDeployments: failed,
      successRatePct: total > 0 ? Math.round((successful / total) * 100) : 100,
      avgDurationMs: 25000,
    };
  }
}

export const deploymentCenter = new DeploymentCenter();
