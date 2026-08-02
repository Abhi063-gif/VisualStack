import type { NodeDefinition } from './NodeDefinition';

export const LOOP_NODE_DEFINITIONS: NodeDefinition[] = [
  {
    type: 'loop_for',
    category: 'Logic',
    name: 'For Loop',
    description: 'Repeats execution a specified number of times.',
    icon: 'repeat',
    color: '#f59e0b',
    inputs: [
      { id: 'exec', name: 'Execute', type: 'execution', dataType: 'execution' },
      { id: 'start', name: 'Start', type: 'data', dataType: 'number', color: '#3b82f6' },
      { id: 'end', name: 'End', type: 'data', dataType: 'number', color: '#3b82f6' },
      { id: 'step', name: 'Step', type: 'data', dataType: 'number', color: '#3b82f6' },
    ],
    outputs: [
      { id: 'loop_body', name: 'Loop Body', type: 'execution', dataType: 'execution', color: '#f59e0b' },
      { id: 'completed', name: 'Completed', type: 'execution', dataType: 'execution', color: '#10b981' },
      { id: 'index', name: 'Index', type: 'data', dataType: 'number', color: '#3b82f6' },
    ],
    defaultConfig: { start: 0, end: 10, step: 1 },
  },
  {
    type: 'loop_foreach',
    category: 'Logic',
    name: 'For Each',
    description: 'Iterates over each element in an array.',
    icon: 'list',
    color: '#10b981',
    inputs: [
      { id: 'exec', name: 'Execute', type: 'execution', dataType: 'execution' },
      { id: 'array', name: 'Array', type: 'data', dataType: 'array', color: '#a855f7' },
    ],
    outputs: [
      { id: 'loop_body', name: 'Loop Body', type: 'execution', dataType: 'execution', color: '#f59e0b' },
      { id: 'completed', name: 'Completed', type: 'execution', dataType: 'execution', color: '#10b981' },
      { id: 'item', name: 'Item', type: 'data', dataType: 'any', color: '#94a3b8' },
      { id: 'index', name: 'Index', type: 'data', dataType: 'number', color: '#3b82f6' },
    ],
    defaultConfig: {},
  },
  {
    type: 'loop_while',
    category: 'Logic',
    name: 'While Loop',
    description: 'Repeats execution while a condition is true.',
    icon: 'refresh-cw',
    color: '#8b5cf6',
    inputs: [
      { id: 'exec', name: 'Execute', type: 'execution', dataType: 'execution' },
      { id: 'condition', name: 'Condition', type: 'data', dataType: 'boolean', color: '#ef4444' },
    ],
    outputs: [
      { id: 'loop_body', name: 'Loop Body', type: 'execution', dataType: 'execution', color: '#f59e0b' },
      { id: 'completed', name: 'Completed', type: 'execution', dataType: 'execution', color: '#10b981' },
    ],
    defaultConfig: { maxIterations: 1000 },
  },
  {
    type: 'loop_break',
    category: 'Logic',
    name: 'Break',
    description: 'Exits the current loop immediately.',
    icon: 'square',
    color: '#ef4444',
    inputs: [
      { id: 'exec', name: 'Execute', type: 'execution', dataType: 'execution' },
    ],
    outputs: [],
    defaultConfig: {},
  },
  {
    type: 'loop_continue',
    category: 'Logic',
    name: 'Continue',
    description: 'Skips to the next iteration of the current loop.',
    icon: 'skip-forward',
    color: '#64748b',
    inputs: [
      { id: 'exec', name: 'Execute', type: 'execution', dataType: 'execution' },
    ],
    outputs: [],
    defaultConfig: {},
  },
];
