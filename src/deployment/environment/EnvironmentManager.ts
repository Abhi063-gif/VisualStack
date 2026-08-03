export type DeploymentEnvTarget = 'development' | 'testing' | 'staging' | 'production' | 'preview';

export interface EnvVariableItem {
  key: string;
  value: string;
  target: DeploymentEnvTarget;
  isSecret: boolean;
}

export class EnvironmentManager {
  private variables: EnvVariableItem[] = [];

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

  public removeVariable(key: string, target: DeploymentEnvTarget): void {
    this.variables = this.variables.filter((v) => !(v.key === key && v.target === target));
  }
}

export const environmentManager = new EnvironmentManager();
