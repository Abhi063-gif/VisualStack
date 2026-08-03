import type { DeploymentSession } from '../DeploymentSession';

export interface IDeploymentProvider {
  id: string;
  name: string;
  category: 'cloud' | 'serverless' | 'container' | 'vps' | 'static';
  
  build(projectId: string): Promise<boolean>;
  deploy(session: DeploymentSession): Promise<string>;
  rollback(deploymentId: string): Promise<boolean>;
  getLogs(deploymentId: string): Promise<string[]>;
  getStatus(deploymentId: string): Promise<string>;
  deleteDeployment(deploymentId: string): Promise<boolean>;
}
