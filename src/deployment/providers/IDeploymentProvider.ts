import type { DeploymentSession } from '../DeploymentSession';

export interface ProviderConfigField {
  key: string;
  label: string;
  type: 'text' | 'password' | 'select' | 'boolean';
  required: boolean;
  defaultValue?: string;
  options?: string[];
  placeholder?: string;
}

export interface IDeploymentProvider {
  id: string;
  name: string;
  category: 'cloud' | 'serverless' | 'container' | 'vps' | 'static';
  description: string;
  icon: string;
  configFields: ProviderConfigField[];

  validateCredentials(token: string): Promise<boolean>;
  getDefaultBuildCommand(): string;
  getRecommendedEnvironmentVars(): string[];
  build(projectId: string): Promise<boolean>;
  deploy(session: DeploymentSession): Promise<string>;
  rollback(deploymentId: string): Promise<boolean>;
  getLogs(deploymentId: string): Promise<string[]>;
  getStatus(deploymentId: string): Promise<string>;
  deleteDeployment(deploymentId: string): Promise<boolean>;
}
