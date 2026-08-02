import type { NodeDefinition } from './NodeDefinition';

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
export type ResponseFormat = 'json' | 'xml' | 'text' | 'blob';

export interface APIRequestConfig {
  url: string;
  method: HttpMethod;
  headers: Record<string, string>;
  params: Record<string, string>;
  body: string;
  auth: { type: 'none' | 'bearer' | 'basic'; token?: string; username?: string; password?: string };
  timeout: number;
  retries: number;
  responseFormat: ResponseFormat;
}

export const API_REQUEST_NODE_DEFINITIONS: NodeDefinition[] = [
  {
    type: 'api_get',
    category: 'API',
    name: 'HTTP GET',
    description: 'Makes an HTTP GET request to a URL.',
    icon: 'download',
    color: '#10b981',
    inputs: [
      { id: 'exec', name: 'Execute', type: 'execution', dataType: 'execution' },
      { id: 'url', name: 'URL', type: 'data', dataType: 'string', color: '#10b981' },
      { id: 'headers', name: 'Headers', type: 'data', dataType: 'object', color: '#f59e0b' },
      { id: 'params', name: 'Params', type: 'data', dataType: 'object', color: '#f59e0b' },
    ],
    outputs: [
      { id: 'success', name: 'Success', type: 'execution', dataType: 'execution', color: '#10b981' },
      { id: 'error', name: 'Error', type: 'execution', dataType: 'execution', color: '#ef4444' },
      { id: 'data', name: 'Response', type: 'data', dataType: 'any', color: '#94a3b8' },
      { id: 'status', name: 'Status Code', type: 'data', dataType: 'number', color: '#3b82f6' },
    ],
    defaultConfig: { url: '', method: 'GET', headers: {}, params: {}, timeout: 10000, retries: 0, responseFormat: 'json', auth: { type: 'none' } },
  },
  {
    type: 'api_post',
    category: 'API',
    name: 'HTTP POST',
    description: 'Makes an HTTP POST request with a body payload.',
    icon: 'upload',
    color: '#3b82f6',
    inputs: [
      { id: 'exec', name: 'Execute', type: 'execution', dataType: 'execution' },
      { id: 'url', name: 'URL', type: 'data', dataType: 'string', color: '#10b981' },
      { id: 'headers', name: 'Headers', type: 'data', dataType: 'object', color: '#f59e0b' },
      { id: 'body', name: 'Body', type: 'data', dataType: 'object', color: '#f59e0b' },
    ],
    outputs: [
      { id: 'success', name: 'Success', type: 'execution', dataType: 'execution', color: '#10b981' },
      { id: 'error', name: 'Error', type: 'execution', dataType: 'execution', color: '#ef4444' },
      { id: 'data', name: 'Response', type: 'data', dataType: 'any', color: '#94a3b8' },
      { id: 'status', name: 'Status Code', type: 'data', dataType: 'number', color: '#3b82f6' },
    ],
    defaultConfig: { url: '', method: 'POST', headers: {}, body: '{}', timeout: 10000, retries: 0, responseFormat: 'json', auth: { type: 'none' } },
  },
  {
    type: 'api_put',
    category: 'API',
    name: 'HTTP PUT',
    description: 'Makes an HTTP PUT request to update a resource.',
    icon: 'arrow-up-circle',
    color: '#f59e0b',
    inputs: [
      { id: 'exec', name: 'Execute', type: 'execution', dataType: 'execution' },
      { id: 'url', name: 'URL', type: 'data', dataType: 'string', color: '#10b981' },
      { id: 'body', name: 'Body', type: 'data', dataType: 'object', color: '#f59e0b' },
    ],
    outputs: [
      { id: 'success', name: 'Success', type: 'execution', dataType: 'execution', color: '#10b981' },
      { id: 'error', name: 'Error', type: 'execution', dataType: 'execution', color: '#ef4444' },
      { id: 'data', name: 'Response', type: 'data', dataType: 'any', color: '#94a3b8' },
    ],
    defaultConfig: { url: '', method: 'PUT', headers: {}, body: '{}', timeout: 10000, retries: 0, responseFormat: 'json', auth: { type: 'none' } },
  },
  {
    type: 'api_patch',
    category: 'API',
    name: 'HTTP PATCH',
    description: 'Makes an HTTP PATCH request for partial updates.',
    icon: 'edit-2',
    color: '#8b5cf6',
    inputs: [
      { id: 'exec', name: 'Execute', type: 'execution', dataType: 'execution' },
      { id: 'url', name: 'URL', type: 'data', dataType: 'string', color: '#10b981' },
      { id: 'body', name: 'Body', type: 'data', dataType: 'object', color: '#f59e0b' },
    ],
    outputs: [
      { id: 'success', name: 'Success', type: 'execution', dataType: 'execution', color: '#10b981' },
      { id: 'error', name: 'Error', type: 'execution', dataType: 'execution', color: '#ef4444' },
      { id: 'data', name: 'Response', type: 'data', dataType: 'any', color: '#94a3b8' },
    ],
    defaultConfig: { url: '', method: 'PATCH', headers: {}, body: '{}', timeout: 10000, retries: 0, responseFormat: 'json', auth: { type: 'none' } },
  },
  {
    type: 'api_delete',
    category: 'API',
    name: 'HTTP DELETE',
    description: 'Makes an HTTP DELETE request to remove a resource.',
    icon: 'trash-2',
    color: '#ef4444',
    inputs: [
      { id: 'exec', name: 'Execute', type: 'execution', dataType: 'execution' },
      { id: 'url', name: 'URL', type: 'data', dataType: 'string', color: '#10b981' },
    ],
    outputs: [
      { id: 'success', name: 'Success', type: 'execution', dataType: 'execution', color: '#10b981' },
      { id: 'error', name: 'Error', type: 'execution', dataType: 'execution', color: '#ef4444' },
      { id: 'status', name: 'Status Code', type: 'data', dataType: 'number', color: '#3b82f6' },
    ],
    defaultConfig: { url: '', method: 'DELETE', headers: {}, timeout: 10000, retries: 0, responseFormat: 'json', auth: { type: 'none' } },
  },
];
