import type { NodeDefinition } from './NodeDefinition';

export const CONDITION_NODE_DEFINITIONS: NodeDefinition[] = [
  {
    type: 'cond_if',
    category: 'Logic',
    name: 'IF',
    description: 'Branches execution based on a boolean condition.',
    icon: 'git-branch',
    color: '#ef4444',
    inputs: [
      { id: 'exec', name: 'Execute', type: 'execution', dataType: 'execution' },
      { id: 'condition', name: 'Condition', type: 'data', dataType: 'boolean', color: '#ef4444' },
    ],
    outputs: [
      { id: 'true', name: 'True', type: 'execution', dataType: 'execution', color: '#10b981' },
      { id: 'false', name: 'False', type: 'execution', dataType: 'execution', color: '#ef4444' },
    ],
    defaultConfig: {},
  },
  {
    type: 'cond_switch',
    category: 'Logic',
    name: 'Switch',
    description: 'Routes execution to one of multiple branches based on a value.',
    icon: 'shuffle',
    color: '#f97316',
    inputs: [
      { id: 'exec', name: 'Execute', type: 'execution', dataType: 'execution' },
      { id: 'value', name: 'Value', type: 'data', dataType: 'any', color: '#94a3b8' },
    ],
    outputs: [
      { id: 'case1', name: 'Case 1', type: 'execution', dataType: 'execution' },
      { id: 'case2', name: 'Case 2', type: 'execution', dataType: 'execution' },
      { id: 'default', name: 'Default', type: 'execution', dataType: 'execution' },
    ],
    defaultConfig: { cases: ['case1', 'case2'] },
  },
  {
    type: 'cond_compare',
    category: 'Logic',
    name: 'Compare',
    description: 'Compares two values with a specified operator.',
    icon: 'equal',
    color: '#8b5cf6',
    inputs: [
      { id: 'a', name: 'A', type: 'data', dataType: 'any', color: '#94a3b8' },
      { id: 'b', name: 'B', type: 'data', dataType: 'any', color: '#94a3b8' },
    ],
    outputs: [
      { id: 'result', name: 'Result', type: 'data', dataType: 'boolean', color: '#ef4444' },
    ],
    defaultConfig: { operator: '==' },
    docs: 'Operators: ==, !=, >, <, >=, <=',
  },
  {
    type: 'cond_and',
    category: 'Logic',
    name: 'AND',
    description: 'Returns true only if all inputs are true.',
    icon: 'check-check',
    color: '#10b981',
    inputs: [
      { id: 'a', name: 'A', type: 'data', dataType: 'boolean', color: '#ef4444' },
      { id: 'b', name: 'B', type: 'data', dataType: 'boolean', color: '#ef4444' },
    ],
    outputs: [
      { id: 'result', name: 'Result', type: 'data', dataType: 'boolean', color: '#ef4444' },
    ],
    defaultConfig: {},
  },
  {
    type: 'cond_or',
    category: 'Logic',
    name: 'OR',
    description: 'Returns true if any input is true.',
    icon: 'git-merge',
    color: '#f59e0b',
    inputs: [
      { id: 'a', name: 'A', type: 'data', dataType: 'boolean', color: '#ef4444' },
      { id: 'b', name: 'B', type: 'data', dataType: 'boolean', color: '#ef4444' },
    ],
    outputs: [
      { id: 'result', name: 'Result', type: 'data', dataType: 'boolean', color: '#ef4444' },
    ],
    defaultConfig: {},
  },
  {
    type: 'cond_not',
    category: 'Logic',
    name: 'NOT',
    description: 'Inverts a boolean value.',
    icon: 'x-circle',
    color: '#64748b',
    inputs: [
      { id: 'value', name: 'Value', type: 'data', dataType: 'boolean', color: '#ef4444' },
    ],
    outputs: [
      { id: 'result', name: 'Result', type: 'data', dataType: 'boolean', color: '#ef4444' },
    ],
    defaultConfig: {},
  },
];
