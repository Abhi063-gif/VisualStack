export interface EnvVariable {
  key: string;
  value: string;
  isSecret: boolean;
  targetEnv: 'all' | 'development' | 'production';
}

export class EnvironmentManager {
  private envVars: Map<string, EnvVariable> = new Map();

  constructor() {
    this.registerDefaultVars();
  }

  private registerDefaultVars(): void {
    const defaultVars: EnvVariable[] = [
      { key: 'VITE_API_BASE_URL', value: 'http://localhost:3000/api/v1', isSecret: false, targetEnv: 'all' },
      { key: 'DATABASE_URL', value: 'postgresql://admin:secret@localhost:5432/visualstack_db', isSecret: true, targetEnv: 'production' },
      { key: 'JWT_SECRET', value: 'super-secret-jwt-key-visualstack', isSecret: true, targetEnv: 'all' },
    ];

    for (const v of defaultVars) {
      this.envVars.set(v.key, v);
    }
  }

  public getAll(): EnvVariable[] {
    return Array.from(this.envVars.values());
  }

  public setVar(key: string, value: string, isSecret: boolean = false, targetEnv: EnvVariable['targetEnv'] = 'all'): void {
    this.envVars.set(key, { key, value, isSecret, targetEnv });
  }

  public generateDotEnv(targetEnv: EnvVariable['targetEnv'] = 'all'): string {
    const lines: string[] = [];
    for (const v of this.envVars.values()) {
      if (v.targetEnv === 'all' || v.targetEnv === targetEnv) {
        lines.push(`${v.key}=${v.value}`);
      }
    }
    return lines.join('\n');
  }
}

export const environmentManager = new EnvironmentManager();
