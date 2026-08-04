import type { NodeDefinition } from './NodeDefinition';
export { buildInputPorts, buildOutputPorts } from './NodeDefinition';
import type { NodeCategory } from '../graph/LogicNode';

export const START_NODE_DEFINITION: NodeDefinition = {
  type: 'event_start',
  category: 'Events',
  name: 'Start',
  description: 'Entry point of the flow',
  icon: 'zap',
  color: '#f59e0b',
  inputs: [],
  outputs: [
    { id: 'exec', name: 'Then', type: 'execution', dataType: 'execution', color: '#ffffff' },
  ],
  defaultConfig: { eventName: 'start' },
  docs: 'Root trigger point to start the backend execution workflow.',
};

export const AUTH_NODE_DEFINITION: NodeDefinition = {
  type: 'user_login',
  category: 'Auth',
  name: 'Authentication',
  description: 'Login, Signup, Logout',
  icon: 'shield',
  color: '#6366f1',
  inputs: [
    { id: 'exec', name: 'Exec', type: 'execution', dataType: 'execution', color: '#ffffff' },
    { id: 'email', name: 'Email', type: 'data', dataType: 'string', color: '#10b981' },
    { id: 'password', name: 'Password', type: 'data', dataType: 'string', color: '#10b981' },
  ],
  outputs: [
    { id: 'exec', name: 'Then', type: 'execution', dataType: 'execution', color: '#ffffff' },
    { id: 'user', name: 'User Object', type: 'data', dataType: 'object', color: '#f59e0b' },
  ],
  defaultConfig: {
    mode: 'login',
    askVerification: true,
    storeOnDatabase: true,
    storeOnLocalVariable: false,
    nextPage: 'Dashboard Screen',
  },
  docs: 'Handles user authentication, login verification, signup, and user credential management.',
};

export const DATABASE_NODE_DEFINITION: NodeDefinition = {
  type: 'db_query',
  category: 'Database',
  name: 'Database',
  description: 'Store and manage data',
  icon: 'database',
  color: '#10b981',
  inputs: [
    { id: 'exec', name: 'Exec', type: 'execution', dataType: 'execution', color: '#ffffff' },
    { id: 'query', name: 'Query / Input', type: 'data', dataType: 'object', color: '#f59e0b' },
  ],
  outputs: [
    { id: 'exec', name: 'Then', type: 'execution', dataType: 'execution', color: '#ffffff' },
    { id: 'result', name: 'Result Data', type: 'data', dataType: 'object', color: '#10b981' },
  ],
  defaultConfig: {
    dbName: 'User Profile',
    dbApiUrl: 'https://api.mydb.com/v1',
    dbType: 'PostgreSQL',
    isPrivate: true,
    fields: [
      { name: 'username', type: 'Text', val: 'Input.username', isPrivate: false },
      { name: 'email', type: 'Email', val: 'Input.email', isPrivate: false },
      { name: 'password', type: 'Password', val: 'Input.password', isPrivate: true },
      { name: 'age', type: 'Integer', val: '18', isPrivate: false },
    ],
    storeLocalVar: true,
    varName: 'userData',
    nextPage: 'Dashboard Screen',
  },
  docs: 'Performs database storage operations, custom queries, schema field management, and local variable mapping.',
};

export const ALL_NODE_DEFINITIONS: NodeDefinition[] = [
  START_NODE_DEFINITION,
  AUTH_NODE_DEFINITION,
  DATABASE_NODE_DEFINITION,
];

export const NODE_DEFINITIONS_BY_TYPE: Map<string, NodeDefinition> = new Map([
  [START_NODE_DEFINITION.type, START_NODE_DEFINITION],
  ['event_app_started', START_NODE_DEFINITION],
  ['app_started', START_NODE_DEFINITION],
  ['start', START_NODE_DEFINITION],

  [AUTH_NODE_DEFINITION.type, AUTH_NODE_DEFINITION],
  ['auth', AUTH_NODE_DEFINITION],
  ['auth_flow', AUTH_NODE_DEFINITION],
  ['user_signup', AUTH_NODE_DEFINITION],

  [DATABASE_NODE_DEFINITION.type, DATABASE_NODE_DEFINITION],
  ['database', DATABASE_NODE_DEFINITION],
  ['db', DATABASE_NODE_DEFINITION],
  ['db_create', DATABASE_NODE_DEFINITION],
]);

export const NODE_DEFINITIONS_BY_CATEGORY: Map<NodeCategory, NodeDefinition[]> = new Map([
  ['Events', [START_NODE_DEFINITION]],
  ['Auth', [AUTH_NODE_DEFINITION]],
  ['Database', [DATABASE_NODE_DEFINITION]],
]);

export function getNodeDefinition(type: string): NodeDefinition | undefined {
  if (NODE_DEFINITIONS_BY_TYPE.has(type)) {
    return NODE_DEFINITIONS_BY_TYPE.get(type);
  }
  const lower = type.toLowerCase();
  if (lower.includes('auth') || lower.includes('login') || lower.includes('signup')) {
    return AUTH_NODE_DEFINITION;
  }
  if (lower.includes('db') || lower.includes('database') || lower.includes('data')) {
    return DATABASE_NODE_DEFINITION;
  }
  if (lower.includes('event') || lower.includes('start') || lower.includes('app')) {
    return START_NODE_DEFINITION;
  }
  return START_NODE_DEFINITION;
}

export function getNodesByCategory(category: NodeCategory): NodeDefinition[] {
  return NODE_DEFINITIONS_BY_CATEGORY.get(category) ?? [];
}

export function searchNodes(query: string): NodeDefinition[] {
  const q = query.toLowerCase().trim();
  if (!q) return ALL_NODE_DEFINITIONS;
  return ALL_NODE_DEFINITIONS.filter(
    (def) =>
      def.name.toLowerCase().includes(q) ||
      def.description.toLowerCase().includes(q) ||
      def.category.toLowerCase().includes(q) ||
      def.type.toLowerCase().includes(q)
  );
}

export const NODE_CATEGORIES: NodeCategory[] = [
  'Events',
  'Auth',
  'Database',
];
