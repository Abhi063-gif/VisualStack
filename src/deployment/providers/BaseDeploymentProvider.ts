import type { IDeploymentProvider } from './IDeploymentProvider';
import type { DeploymentSession } from '../DeploymentSession';

export abstract class BaseDeploymentProvider implements IDeploymentProvider {
  public id: string;
  public name: string;
  public category: 'cloud' | 'serverless' | 'container' | 'vps' | 'static';

  constructor(id: string, name: string, category: 'cloud' | 'serverless' | 'container' | 'vps' | 'static') {
    this.id = id;
    this.name = name;
    this.category = category;
  }

  public async build(_projectId: string): Promise<boolean> {
    return true;
  }

  public async deploy(session: DeploymentSession): Promise<string> {
    const domainSlug = session.projectId.toLowerCase().replace(/[^a-z0-9]/g, '-');
    return `https://${domainSlug}.${this.id}.app`;
  }

  public async rollback(_deploymentId: string): Promise<boolean> {
    return true;
  }

  public async getLogs(_deploymentId: string): Promise<string[]> {
    return [`[${this.name}] Initializing container instance...`, `[${this.name}] Application live and healthy.`];
  }

  public async getStatus(_deploymentId: string): Promise<string> {
    return 'READY';
  }

  public async deleteDeployment(_deploymentId: string): Promise<boolean> {
    return true;
  }
}
