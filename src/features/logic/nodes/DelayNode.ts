import type { NodeDefinition } from './NodeDefinition';

export const DELAY_NODE_DEFINITIONS: NodeDefinition[] = [
  {
    type: 'delay_wait',
    category: 'Logic',
    name: 'Delay / Wait',
    description: 'Pauses execution for a specified duration in milliseconds.',
    icon: 'clock',
    color: '#a855f7',
    inputs: [
      { id: 'exec', name: 'Execute', type: 'execution', dataType: 'execution' },
      { id: 'duration', name: 'Duration (ms)', type: 'data', dataType: 'number', color: '#3b82f6' },
    ],
    outputs: [
      { id: 'exec', name: 'Then', type: 'execution', dataType: 'execution' },
    ],
    defaultConfig: { duration: 1000 },
  },
  {
    type: 'delay_debounce',
    category: 'Logic',
    name: 'Debounce',
    description: 'Delays execution until calls stop for the specified duration.',
    icon: 'timer',
    color: '#ec4899',
    inputs: [
      { id: 'exec', name: 'Execute', type: 'execution', dataType: 'execution' },
      { id: 'wait', name: 'Wait (ms)', type: 'data', dataType: 'number', color: '#3b82f6' },
    ],
    outputs: [
      { id: 'exec', name: 'Then', type: 'execution', dataType: 'execution' },
    ],
    defaultConfig: { wait: 300 },
  },
];
