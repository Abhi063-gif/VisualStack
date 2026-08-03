export interface VaultSecret {
  key: string;
  maskedValue: string;
  category: 'api_key' | 'token' | 'ssh_key' | 'db_pass' | 'jwt_secret';
  updatedAt: string;
}

export class SecretsVault {
  private secrets: Map<string, { value: string; category: VaultSecret['category']; updatedAt: string }> = new Map([
    ['DATABASE_URL', { value: 'postgres://user:pass@db.visualstack.io:5432/app', category: 'db_pass', updatedAt: new Date().toISOString() }],
    ['JWT_SECRET_KEY', { value: 'super_secret_jwt_encryption_key_2026', category: 'jwt_secret', updatedAt: new Date().toISOString() }],
    ['STRIPE_API_KEY', { value: 'sk_live_51M00192837482910', category: 'api_key', updatedAt: new Date().toISOString() }],
  ]);

  public getSecrets(): VaultSecret[] {
    const list: VaultSecret[] = [];
    this.secrets.forEach((val, key) => {
      const masked = val.value.length > 8 ? `${val.value.slice(0, 4)}...${val.value.slice(-4)}` : '********';
      list.push({
        key,
        maskedValue: masked,
        category: val.category,
        updatedAt: val.updatedAt,
      });
    });
    return list;
  }

  public setSecret(key: string, value: string, category: VaultSecret['category']): void {
    this.secrets.set(key, { value, category, updatedAt: new Date().toISOString() });
  }

  public getDecryptedSecret(key: string): string | undefined {
    return this.secrets.get(key)?.value;
  }
}

export const secretsVault = new SecretsVault();
