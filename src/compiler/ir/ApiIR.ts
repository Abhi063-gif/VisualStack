export interface ApiIR {
  id: string;
  name: string;
  protocol: 'REST' | 'GraphQL' | 'gRPC' | 'WebSocket';
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  url: string;
  headers: Record<string, string>;
  authType: 'None' | 'Bearer' | 'APIKey' | 'Basic';
}
