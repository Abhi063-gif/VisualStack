export type AuthProviderType =
  | 'firebase'
  | 'supabase'
  | 'jwt'
  | 'oauth2'
  | 'auth0'
  | 'clerk'
  | 'nextauth'
  | 'custom';

export interface AuthProviderConfig {
  id: string;
  name: string;
  provider: AuthProviderType;
  enabled: boolean;
  clientId?: string;
  clientSecret?: string;
  jwtSecret?: string;
  tokenExpirySeconds: number;
  socialProviders: ('google' | 'github' | 'apple' | 'microsoft')[];
}

export class AuthManager {
  private authConfigs: Map<string, AuthProviderConfig> = new Map();

  constructor() {
    this.registerDefaultConfigs();
  }

  private registerDefaultConfigs(): void {
    const jwtConfig: AuthProviderConfig = {
      id: 'auth_primary_jwt',
      name: 'Primary JWT Authentication',
      provider: 'jwt',
      enabled: true,
      jwtSecret: 'super-secret-jwt-key-visualstack',
      tokenExpirySeconds: 86400,
      socialProviders: ['google', 'github'],
    };

    this.authConfigs.set(jwtConfig.id, jwtConfig);
  }

  public getAll(): AuthProviderConfig[] {
    return Array.from(this.authConfigs.values());
  }

  public getById(id: string): AuthProviderConfig | undefined {
    return this.authConfigs.get(id);
  }

  public saveConfig(config: AuthProviderConfig): void {
    this.authConfigs.set(config.id, config);
  }
}

export const authManager = new AuthManager();
