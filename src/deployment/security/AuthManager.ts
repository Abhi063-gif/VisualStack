export interface ProviderCredential {
  providerId: string;
  providerName: string;
  accountName?: string;
  hasToken: boolean;
}

export class AuthManager {
  private credentials: Map<string, { token: string; accountName?: string }> = new Map();

  public getCredentials(): ProviderCredential[] {
    const providers = [
      { id: 'github', name: 'GitHub' },
      { id: 'vercel', name: 'Vercel' },
      { id: 'netlify', name: 'Netlify' },
      { id: 'aws', name: 'AWS' },
      { id: 'docker', name: 'Docker Hub' },
    ];

    return providers.map((p) => {
      const entry = this.credentials.get(p.id);
      return {
        providerId: p.id,
        providerName: p.name,
        accountName: entry?.accountName,
        hasToken: Boolean(entry?.token),
      };
    });
  }

  public setToken(providerId: string, token: string, accountName?: string): void {
    this.credentials.set(providerId, { token, accountName });
  }

  public removeToken(providerId: string): void {
    this.credentials.delete(providerId);
  }

  public getToken(providerId: string): string | undefined {
    return this.credentials.get(providerId)?.token;
  }
}

export const authManager = new AuthManager();
