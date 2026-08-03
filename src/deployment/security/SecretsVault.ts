export interface VaultSecret {
  key: string;
  maskedValue: string;
  category: 'api_key' | 'token' | 'ssh_key' | 'db_pass' | 'jwt_secret';
  updatedAt: string;
}

export class SecretsVault {
  private secrets: Map<string, { value: string; category: VaultSecret['category']; updatedAt: string }> = new Map();

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

  public deleteSecret(key: string): boolean {
    return this.secrets.delete(key);
  }

  public getDecryptedSecret(key: string): string | undefined {
    return this.secrets.get(key)?.value;
  }
}

export const secretsVault = new SecretsVault();
