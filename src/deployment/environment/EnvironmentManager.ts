export type DeploymentEnvTarget = 'development' | 'testing' | 'staging' | 'production' | 'preview';

export interface EnvVariableItem {
  key: string;
  value: string;
  target: DeploymentEnvTarget;
  isSecret: boolean;
}

export class EnvironmentManager {
  private variables: EnvVariableItem[] = [
    { key: 'VITE_API_URL', value: 'https://api.visualstack.io', target: 'production', isSecret: false },
    { key: 'PORT', value: '8080', target: 'production', isSecret: false },
    { key: 'NODE_ENV', value: 'production', target: 'production', isSecret: false },
  ];

  public getVariables(target?: DeploymentEnvTarget): EnvVariableItem[] {
    if (!target) return [...this.variables];
    return this.variables.filter((v) => v.target === target);
  }

  public setVariable(item: EnvVariableItem): void {
    const existingIndex = this.variables.findIndex((v) => v.key === item.key && v.target === item.target);
    if (existingIndex >= 0) {
      this.variables[existingIndex] = item;
    } else {
      this.variables.push(item);
    }
  }
}

export const environmentManager = new EnvironmentManager();
