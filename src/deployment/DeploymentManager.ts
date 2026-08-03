import type { DeploymentSession } from './DeploymentSession';
import type { DeploymentStatus } from './DeploymentStatus';
import { deploymentHistory } from './DeploymentHistory';
import { deploymentService } from './DeploymentService';

export class DeploymentManager {
  private activeSession: DeploymentSession | null = null;

  public async startDeployment(
    projectId: string,
    provider: string,
    environment: 'development' | 'testing' | 'staging' | 'production' | 'preview'
  ): Promise<DeploymentSession> {
    const id = `dep_${Date.now()}`;
    const status: DeploymentStatus = {
      id,
      state: 'queued',
      provider,
      targetEnvironment: environment,
      startedAt: new Date().toISOString(),
      durationMs: 0,
      commitHash: 'b5242ab',
      commitMessage: 'feat: Release v1.0.0 via VisualStack Studio',
    };

    const session: DeploymentSession = {
      id,
      projectId,
      status,
      logs: [],
    };

    this.activeSession = session;
    deploymentHistory.recordDeployment(status);

    // Run async background deployment
    deploymentService.executeDeployment(session).catch((err) => {
      session.status.state = 'failed';
      session.status.error = err?.message || 'Deployment error';
    });

    return session;
  }

  public getActiveSession(): DeploymentSession | null {
    return this.activeSession;
  }

  public cancelActiveSession(): boolean {
    if (this.activeSession && this.activeSession.status.state !== 'success' && this.activeSession.status.state !== 'failed') {
      this.activeSession.status.state = 'cancelled';
      return true;
    }
    return false;
  }
}

export const deploymentManager = new DeploymentManager();
