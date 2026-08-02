import type { NodeDefinition } from './NodeDefinition';

export const CUSTOM_NODE_DEFINITIONS: NodeDefinition[] = [
  {
    type: 'custom_code',
    category: 'Custom',
    name: 'Custom Code',
    description: 'Executes a custom JavaScript snippet. Use `inputs` and `return` to pass data.',
    icon: 'terminal',
    color: '#64748b',
    inputs: [
      { id: 'exec', name: 'Execute', type: 'execution', dataType: 'execution' },
      { id: 'in0', name: 'Input 1', type: 'data', dataType: 'any', color: '#94a3b8' },
      { id: 'in1', name: 'Input 2', type: 'data', dataType: 'any', color: '#94a3b8' },
    ],
    outputs: [
      { id: 'exec', name: 'Then', type: 'execution', dataType: 'execution' },
      { id: 'error', name: 'Error', type: 'execution', dataType: 'execution', color: '#ef4444' },
      { id: 'result', name: 'Result', type: 'data', dataType: 'any', color: '#94a3b8' },
    ],
    defaultConfig: {
      code: `// inputs.in0, inputs.in1 are available\n// return a value to pass to 'result' port\nreturn inputs.in0;`,
    },
    docs: 'Use `inputs.portId` to access input values. Return a value from the snippet to wire to the Result port.',
  },
  {
    type: 'custom_transform',
    category: 'Custom',
    name: 'Transform',
    description: 'Transforms a value using a custom expression.',
    icon: 'wand-2',
    color: '#a855f7',
    inputs: [
      { id: 'value', name: 'Value', type: 'data', dataType: 'any', color: '#94a3b8' },
    ],
    outputs: [
      { id: 'result', name: 'Result', type: 'data', dataType: 'any', color: '#94a3b8' },
    ],
    defaultConfig: { expression: 'value' },
    docs: 'Use `value` in your expression. Example: `value.toUpperCase()`',
  },
];
