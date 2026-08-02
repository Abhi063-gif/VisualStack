export type APIProtocol = 'REST' | 'GraphQL' | 'Webhook' | 'WebSocket' | 'gRPC';

export interface APIEndpointConfig {
  id: string;
  name: string;
  protocol: APIProtocol;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  url: string;
  headers: Record<string, string>;
  authType: 'None' | 'Bearer' | 'APIKey' | 'Basic';
  requestBodySchema?: string;
  responseSchema?: string;
}

export class APIManager {
  private apis: Map<string, APIEndpointConfig> = new Map();

  constructor() {
    this.registerDefaultAPIs();
  }

  private registerDefaultAPIs(): void {
    const demoApi: APIEndpointConfig = {
      id: 'api_stripe_checkout',
      name: 'Stripe Payment Gateway API',
      protocol: 'REST',
      method: 'POST',
      url: 'https://api.stripe.com/v1/checkout/sessions',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      authType: 'Bearer',
    };

    this.apis.set(demoApi.id, demoApi);
  }

  public getAll(): APIEndpointConfig[] {
    return Array.from(this.apis.values());
  }

  public getById(id: string): APIEndpointConfig | undefined {
    return this.apis.get(id);
  }

  public saveAPI(config: APIEndpointConfig): void {
    this.apis.set(config.id, config);
  }
}

export const apiManager = new APIManager();
