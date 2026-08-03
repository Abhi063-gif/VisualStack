import type { DeploymentStatus } from '../DeploymentStatus';
import { deploymentHistory } from '../DeploymentHistory';

export class RollbackEngine {
  public async rollbackTo(targetId: string): Promise<DeploymentStatus | null> {
    const target = deploymentHistory.getDeploymentById(targetId);
    if (!target) return null;

    const rollbackStatus: DeploymentStatus = {
      id: `dep_rollback_${Date.now()}`,
      state: 'success',
      provider: target.provider,
      targetEnvironment: target.targetEnvironment,
      startedAt: new Date().toISOString(),
      completedAt: new Date().toISOString(),
      durationMs: 5000,
      commitHash: target.commitHash,
      commitMessage: `Rollback to ${target.id} (${target.commitMessage})`,
      deploymentUrl: target.deploymentUrl,
    };

    deploymentHistory.recordDeployment(rollbackStatus);
    return rollbackStatus;
  }
}

export const rollbackEngine = new RollbackEngine();
