import type { NodeDefinition } from './NodeDefinition';

export const STORAGE_NODE_DEFINITIONS: NodeDefinition[] = [
  {
    type: 'storage_local_get',
    category: 'Storage',
    name: 'LocalStorage Get',
    description: 'Reads a value from browser Local Storage.',
    icon: 'hard-drive',
    color: '#f59e0b',
    inputs: [
      { id: 'key', name: 'Key', type: 'data', dataType: 'string', color: '#10b981' },
    ],
    outputs: [
      { id: 'value', name: 'Value', type: 'data', dataType: 'any', color: '#94a3b8' },
      { id: 'found', name: 'Found', type: 'data', dataType: 'boolean', color: '#ef4444' },
    ],
    defaultConfig: { key: '' },
  },
  {
    type: 'storage_local_set',
    category: 'Storage',
    name: 'LocalStorage Set',
    description: 'Writes a value to browser Local Storage.',
    icon: 'save',
    color: '#f59e0b',
    inputs: [
      { id: 'exec', name: 'Execute', type: 'execution', dataType: 'execution' },
      { id: 'key', name: 'Key', type: 'data', dataType: 'string', color: '#10b981' },
      { id: 'value', name: 'Value', type: 'data', dataType: 'any', color: '#94a3b8' },
    ],
    outputs: [
      { id: 'exec', name: 'Then', type: 'execution', dataType: 'execution' },
    ],
    defaultConfig: { key: '' },
  },
  {
    type: 'storage_local_remove',
    category: 'Storage',
    name: 'LocalStorage Remove',
    description: 'Removes a key from browser Local Storage.',
    icon: 'trash',
    color: '#ef4444',
    inputs: [
      { id: 'exec', name: 'Execute', type: 'execution', dataType: 'execution' },
      { id: 'key', name: 'Key', type: 'data', dataType: 'string', color: '#10b981' },
    ],
    outputs: [
      { id: 'exec', name: 'Then', type: 'execution', dataType: 'execution' },
    ],
    defaultConfig: { key: '' },
  },
  {
    type: 'storage_session_get',
    category: 'Storage',
    name: 'SessionStorage Get',
    description: 'Reads a value from Session Storage.',
    icon: 'clock',
    color: '#0ea5e9',
    inputs: [
      { id: 'key', name: 'Key', type: 'data', dataType: 'string', color: '#10b981' },
    ],
    outputs: [
      { id: 'value', name: 'Value', type: 'data', dataType: 'any', color: '#94a3b8' },
    ],
    defaultConfig: { key: '' },
  },
  {
    type: 'storage_session_set',
    category: 'Storage',
    name: 'SessionStorage Set',
    description: 'Writes a value to Session Storage.',
    icon: 'save',
    color: '#0ea5e9',
    inputs: [
      { id: 'exec', name: 'Execute', type: 'execution', dataType: 'execution' },
      { id: 'key', name: 'Key', type: 'data', dataType: 'string', color: '#10b981' },
      { id: 'value', name: 'Value', type: 'data', dataType: 'any', color: '#94a3b8' },
    ],
    outputs: [
      { id: 'exec', name: 'Then', type: 'execution', dataType: 'execution' },
    ],
    defaultConfig: { key: '' },
  },
  {
    type: 'storage_cookie_get',
    category: 'Storage',
    name: 'Cookie Get',
    description: 'Reads a cookie value by name.',
    icon: 'cookie',
    color: '#a855f7',
    inputs: [
      { id: 'name', name: 'Name', type: 'data', dataType: 'string', color: '#10b981' },
    ],
    outputs: [
      { id: 'value', name: 'Value', type: 'data', dataType: 'string', color: '#10b981' },
    ],
    defaultConfig: { name: '' },
  },
  {
    type: 'storage_cookie_set',
    category: 'Storage',
    name: 'Cookie Set',
    description: 'Sets a cookie with name, value, and options.',
    icon: 'cookie',
    color: '#a855f7',
    inputs: [
      { id: 'exec', name: 'Execute', type: 'execution', dataType: 'execution' },
      { id: 'name', name: 'Name', type: 'data', dataType: 'string', color: '#10b981' },
      { id: 'value', name: 'Value', type: 'data', dataType: 'string', color: '#10b981' },
    ],
    outputs: [
      { id: 'exec', name: 'Then', type: 'execution', dataType: 'execution' },
    ],
    defaultConfig: { name: '', expires: 7, secure: false, sameSite: 'Lax' },
  },
  {
    type: 'storage_indexeddb_get',
    category: 'Storage',
    name: 'IndexedDB Get',
    description: 'Reads a record from IndexedDB store.',
    icon: 'database',
    color: '#14b8a6',
    inputs: [
      { id: 'exec', name: 'Execute', type: 'execution', dataType: 'execution' },
      { id: 'key', name: 'Key', type: 'data', dataType: 'string', color: '#10b981' },
    ],
    outputs: [
      { id: 'success', name: 'Success', type: 'execution', dataType: 'execution', color: '#10b981' },
      { id: 'error', name: 'Error', type: 'execution', dataType: 'execution', color: '#ef4444' },
      { id: 'value', name: 'Value', type: 'data', dataType: 'any', color: '#94a3b8' },
    ],
    defaultConfig: { dbName: 'visualstack-db', storeName: 'data', key: '' },
  },
];
