export type SecretCategory = 'api_key' | 'token' | 'ssh_key' | 'db_pass' | 'jwt_secret' | 'certificate';

export interface VaultSecret {
  key: string;
  maskedValue: string;
  category: SecretCategory;
  environment: 'development' | 'testing' | 'staging' | 'production' | 'preview';
  updatedAt: string;
}

export class SecretsVault {
  private secrets: Map<string, { encryptedValue: string; category: SecretCategory; environment: VaultSecret['environment']; updatedAt: string }> = new Map();

  /** Simple local encryption simulating AES-GCM / WebCrypto encryption */
  private encrypt(value: string): string {
    return btoa(`enc:${value}`);
  }

  private decrypt(encrypted: string): string {
    try {
      const raw = atob(encrypted);
      return raw.startsWith('enc:') ? raw.slice(4) : raw;
    } catch {
      return encrypted;
    }
  }

  public getSecrets(targetEnv?: VaultSecret['environment']): VaultSecret[] {
    const list: VaultSecret[] = [];
    this.secrets.forEach((val, key) => {
      if (targetEnv && val.environment !== targetEnv) return;
      const decrypted = this.decrypt(val.encryptedValue);
      const masked = decrypted.length > 8 ? `${decrypted.slice(0, 4)}...${decrypted.slice(-4)}` : '********';
      list.push({
        key,
        maskedValue: masked,
        category: val.category,
        environment: val.environment,
        updatedAt: val.updatedAt,
      });
    });
    return list;
  }

  public setSecret(key: string, value: string, category: SecretCategory, environment: VaultSecret['environment'] = 'production'): void {
    const encryptedValue = this.encrypt(value);
    this.secrets.set(key, { encryptedValue, category, environment, updatedAt: new Date().toISOString() });
  }

  public deleteSecret(key: string): boolean {
    return this.secrets.delete(key);
  }

  public getDecryptedSecret(key: string): string | undefined {
    const entry = this.secrets.get(key);
    return entry ? this.decrypt(entry.encryptedValue) : undefined;
  }

  public exportVaultJson(): string {
    const exportObj: Record<string, any> = {};
    this.secrets.forEach((val, key) => {
      exportObj[key] = val;
    });
    return JSON.stringify(exportObj, null, 2);
  }

  public importVaultJson(jsonString: string): boolean {
    try {
      const parsed = JSON.parse(jsonString);
      Object.keys(parsed).forEach((key) => {
        if (parsed[key]?.encryptedValue && parsed[key]?.category) {
          this.secrets.set(key, parsed[key]);
        }
      });
      return true;
    } catch {
      return false;
    }
  }
}

export const secretsVault = new SecretsVault();
