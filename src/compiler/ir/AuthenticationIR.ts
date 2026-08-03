export interface AuthenticationIR {
  id: string;
  name: string;
  provider: 'jwt' | 'oauth2' | 'firebase' | 'supabase';
  enabled: boolean;
  jwtSecret?: string;
  clientId?: string;
  clientSecret?: string;
  tokenExpirySeconds: number;
  socialProviders: string[];
}
