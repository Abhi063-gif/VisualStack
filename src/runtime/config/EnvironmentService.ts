export interface EnvVariable {
  key: string;
  value: string;
  isSecret?: boolean;
}

export class EnvironmentService {
  private variables: EnvVariable[] = [
    { key: 'PORT', value: '3000', isSecret: false },
    { key: 'NODE_ENV', value: 'development', isSecret: false },
    { key: 'DATABASE_URL', value: 'file:./dev.db', isSecret: true },
    { key: 'JWT_SECRET', value: 'super-secret-jwt-key-2026', isSecret: true },
    { key: 'API_KEY', value: 'sk_live_948291048102831', isSecret: true },
  ];

  public getVariables(): EnvVariable[] {
    return [...this.variables];
  }

  public setVariable(key: string, value: string, isSecret: boolean = false): void {
    const existing = this.variables.find((v) => v.key === key);
    if (existing) {
      existing.value = value;
      existing.isSecret = isSecret;
    } else {
      this.variables.push({ key, value, isSecret });
    }
  }

  public deleteVariable(key: string): void {
    this.variables = this.variables.filter((v) => v.key !== key);
  }
}

export const environmentService = new EnvironmentService();
