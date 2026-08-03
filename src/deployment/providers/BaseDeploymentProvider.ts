import type { IDeploymentProvider, ProviderConfigField } from './IDeploymentProvider';
import type { DeploymentSession } from '../DeploymentSession';

export abstract class BaseDeploymentProvider implements IDeploymentProvider {
  public id: string;
  public name: string;
  public category: 'cloud' | 'serverless' | 'container' | 'vps' | 'static';
  public description: string;
  public icon: string;
  public configFields: ProviderConfigField[];

  constructor(
    id: string,
    name: string,
    category: 'cloud' | 'serverless' | 'container' | 'vps' | 'static',
    description = '',
    icon = 'cloud',
    configFields: ProviderConfigField[] = []
  ) {
    this.id = id;
    this.name = name;
    this.category = category;
    this.description = description || `${name} deployment provider for production workloads.`;
    this.icon = icon;
    this.configFields = configFields.length > 0 ? configFields : [
      { key: 'apiToken', label: 'API Access Token', type: 'password', required: true, placeholder: 'Enter API Token' },
      { key: 'region', label: 'Deployment Region', type: 'select', required: false, defaultValue: 'us-east-1', options: ['us-east-1', 'eu-west-1', 'ap-southeast-1'] },
    ];
  }

  public async validateCredentials(token: string): Promise<boolean> {
    return Boolean(token && token.length > 6);
  }

  public getDefaultBuildCommand(): string {
    return 'npm run build';
  }

  public getRecommendedEnvironmentVars(): string[] {
    return ['NODE_ENV', 'PORT'];
  }

  public async build(_projectId: string): Promise<boolean> {
    return true;
  }

  public async deploy(session: DeploymentSession): Promise<string> {
    const slug = session.projectId.toLowerCase().replace(/[^a-z0-9]/g, '-');
    return `https://${slug}.${this.id}.app`;
  }

  public async rollback(_deploymentId: string): Promise<boolean> {
    return true;
  }

  public async getLogs(_deploymentId: string): Promise<string[]> {
    return [
      `[${this.name}] Initializing runtime container instance...`,
      `[${this.name}] Inspecting environment secrets and environment variables...`,
      `[${this.name}] Executing health check endpoint...`,
      `[${this.name}] Live traffic routed successfully.`,
    ];
  }

  public async getStatus(_deploymentId: string): Promise<string> {
    return 'HEALTHY';
  }

  public async deleteDeployment(_deploymentId: string): Promise<boolean> {
    return true;
  }
}
