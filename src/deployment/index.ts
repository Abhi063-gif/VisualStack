export interface IDeployAdapter {
  deploy(target: string, env: Record<string, string>): Promise<boolean>;
}
