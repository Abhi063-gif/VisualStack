import { gitManager } from '../../deployment/git/GitManager';
import { deploymentCenter } from '../../deployment/DeploymentCenter';
import { domainManager } from '../../deployment/domain/DomainManager';
import { dockerManager } from '../../deployment/docker/DockerManager';

export interface ProjectContextSnapshot {
  timestamp: string;
  designer: {
    activeScreen: string;
    totalElements: number;
  };
  workflow: {
    totalNodes: number;
    hasAuth: boolean;
  };
  git: {
    branch: string;
    uncommittedFilesCount: number;
    remoteUrl: string;
  };
  deployment: {
    historyCount: number;
    domainsCount: number;
    activeContainersCount: number;
  };
}

export class ContextEngine {
  public buildContextSnapshot(): ProjectContextSnapshot {
    return {
      timestamp: new Date().toISOString(),
      designer: {
        activeScreen: 'Screen_Main',
        totalElements: 12,
      },
      workflow: {
        totalNodes: 8,
        hasAuth: true,
      },
      git: {
        branch: gitManager.getCurrentBranch(),
        uncommittedFilesCount: gitManager.getUncommittedFiles().length,
        remoteUrl: gitManager.getRemoteUrl(),
      },
      deployment: {
        historyCount: deploymentCenter.getDeploymentHistory().length,
        domainsCount: domainManager.getDomains().length,
        activeContainersCount: dockerManager.getContainers().length,
      },
    };
  }

  public getSystemPromptWithContext(userInstruction: string): string {
    const snapshot = this.buildContextSnapshot();
    return `[SYSTEM CONTEXT]
Active Project State:
- Branch: ${snapshot.git.branch} (${snapshot.git.remoteUrl})
- Modified Files: ${snapshot.git.uncommittedFilesCount}
- Active Containers: ${snapshot.deployment.activeContainersCount}
- Configured Domains: ${snapshot.deployment.domainsCount}

User Request: "${userInstruction}"`;
  }
}

export const contextEngine = new ContextEngine();
