import type { NodeDefinition } from './NodeDefinition';

export type VariableType = 'string' | 'number' | 'boolean' | 'object' | 'array' | 'date' | 'color' | 'image' | 'any';
export type VariableScope = 'local' | 'global' | 'component' | 'page' | 'app' | 'session';

export interface VariableDefinition {
  name: string;
  type: VariableType;
  scope: VariableScope;
  defaultValue?: unknown;
}

export const VARIABLE_NODE_DEFINITIONS: NodeDefinition[] = [
  {
    type: 'var_get',
    category: 'Variables',
    name: 'Get Variable',
    description: 'Reads the current value of a variable.',
    icon: 'database',
    color: '#0ea5e9',
    inputs: [],
    outputs: [
      { id: 'value', name: 'Value', type: 'data', dataType: 'any', color: '#94a3b8' },
    ],
    defaultConfig: { variableName: '', scope: 'local' },
  },
  {
    type: 'var_set',
    category: 'Variables',
    name: 'Set Variable',
    description: 'Sets a variable to a new value.',
    icon: 'save',
    color: '#6366f1',
    inputs: [
      { id: 'exec', name: 'Execute', type: 'execution', dataType: 'execution' },
      { id: 'value', name: 'Value', type: 'data', dataType: 'any', color: '#94a3b8' },
    ],
    outputs: [
      { id: 'exec', name: 'Then', type: 'execution', dataType: 'execution' },
    ],
    defaultConfig: { variableName: '', scope: 'local' },
  },
  {
    type: 'var_update',
    category: 'Variables',
    name: 'Update Variable',
    description: 'Applies a transformation to an existing variable.',
    icon: 'refresh-cw',
    color: '#8b5cf6',
    inputs: [
      { id: 'exec', name: 'Execute', type: 'execution', dataType: 'execution' },
      { id: 'input', name: 'New Value', type: 'data', dataType: 'any', color: '#94a3b8' },
    ],
    outputs: [
      { id: 'exec', name: 'Then', type: 'execution', dataType: 'execution' },
      { id: 'previous', name: 'Previous Value', type: 'data', dataType: 'any', color: '#94a3b8' },
    ],
    defaultConfig: { variableName: '', scope: 'local' },
  },
  {
    type: 'var_create',
    category: 'Variables',
    name: 'Create Variable',
    description: 'Creates a new variable at runtime.',
    icon: 'plus-circle',
    color: '#10b981',
    inputs: [
      { id: 'exec', name: 'Execute', type: 'execution', dataType: 'execution' },
      { id: 'default', name: 'Default Value', type: 'data', dataType: 'any', color: '#94a3b8' },
    ],
    outputs: [
      { id: 'exec', name: 'Then', type: 'execution', dataType: 'execution' },
    ],
    defaultConfig: { variableName: '', type: 'string', scope: 'local' },
  },
];
