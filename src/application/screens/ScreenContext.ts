import type { Node, Edge } from '@xyflow/react';

export interface ScreenRoute {
  path: string;
  isProtected: boolean;
  requiredRole?: string;
  redirectToOnDenied?: string;
}

export interface ScreenBinding {
  componentId: string;
  componentName: string;
  componentType: string;
  eventType: string;
  targetNodeId: string;
}

export interface ScreenVariable {
  id: string;
  name: string;
  type: 'string' | 'number' | 'boolean' | 'object' | 'array';
  value: unknown;
  scope: 'screen' | 'global';
}

export interface ScreenAuthConfig {
  enabled: boolean;
  provider: 'firebase' | 'supabase' | 'jwt' | 'oauth2' | 'custom';
  requireAuth: boolean;
  redirectUnauthenticatedTo: string;
}

export interface ScreenStorageConfig {
  provider: 's3' | 'firebase' | 'supabase' | 'cloudinary' | 'local';
  defaultBucket: string;
}

export interface ScreenContext {
  id: string;
  name: string;
  route: ScreenRoute;
  nodes: Node[];
  edges: Edge[];
  bindings: ScreenBinding[];
  variables: ScreenVariable[];
  authConfig: ScreenAuthConfig;
  storageConfig: ScreenStorageConfig;
  createdAt: string;
  updatedAt: string;
}
