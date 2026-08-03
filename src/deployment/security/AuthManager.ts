export interface ProviderCredential {
  providerId: string;
  providerName: string;
  accountName: string;
  hasToken: boolean;
}

export class AuthManager {
  private credentials: Map<string, string> = new Map([
    ['vercel', 'vcl_token_encrypted_019283'],
    ['github', 'ghp_token_encrypted_981234'],
    ['aws', 'aws_key_encrypted_887123'],
  ]);

  public getCredentials(): ProviderCredential[] {
    const list: ProviderCredential[] = [
      { providerId: 'github', providerName: 'GitHub', accountName: 'Abhi063-gif', hasToken: this.credentials.has('github') },
      { providerId: 'vercel', providerName: 'Vercel', accountName: 'visualstack-team', hasToken: this.credentials.has('vercel') },
      { providerId: 'netlify', providerName: 'Netlify', accountName: 'Unlinked', hasToken: this.credentials.has('netlify') },
      { providerId: 'aws', providerName: 'AWS', accountName: 'prod-account', hasToken: this.credentials.has('aws') },
      { providerId: 'docker', providerName: 'Docker Hub', accountName: 'visualstack', hasToken: this.credentials.has('docker') },
    ];
    return list;
  }

  public setToken(providerId: string, token: string): void {
    this.credentials.set(providerId, token);
  }

  public getToken(providerId: string): string | undefined {
    return this.credentials.get(providerId);
  }
}

export const authManager = new AuthManager();
