import type { NodeDefinition } from './NodeDefinition';

export const MATH_NODE_DEFINITIONS: NodeDefinition[] = [
  {
    type: 'math_add',
    category: 'Math',
    name: 'Add (+)',
    description: 'Adds two numbers together.',
    icon: 'plus',
    color: '#3b82f6',
    inputs: [
      { id: 'a', name: 'A', type: 'data', dataType: 'number', color: '#3b82f6' },
      { id: 'b', name: 'B', type: 'data', dataType: 'number', color: '#3b82f6' },
    ],
    outputs: [
      { id: 'result', name: 'Result', type: 'data', dataType: 'number', color: '#3b82f6' },
    ],
    defaultConfig: {},
  },
  {
    type: 'math_subtract',
    category: 'Math',
    name: 'Subtract (−)',
    description: 'Subtracts B from A.',
    icon: 'minus',
    color: '#3b82f6',
    inputs: [
      { id: 'a', name: 'A', type: 'data', dataType: 'number', color: '#3b82f6' },
      { id: 'b', name: 'B', type: 'data', dataType: 'number', color: '#3b82f6' },
    ],
    outputs: [
      { id: 'result', name: 'Result', type: 'data', dataType: 'number', color: '#3b82f6' },
    ],
    defaultConfig: {},
  },
  {
    type: 'math_multiply',
    category: 'Math',
    name: 'Multiply (×)',
    description: 'Multiplies two numbers.',
    icon: 'x',
    color: '#3b82f6',
    inputs: [
      { id: 'a', name: 'A', type: 'data', dataType: 'number', color: '#3b82f6' },
      { id: 'b', name: 'B', type: 'data', dataType: 'number', color: '#3b82f6' },
    ],
    outputs: [
      { id: 'result', name: 'Result', type: 'data', dataType: 'number', color: '#3b82f6' },
    ],
    defaultConfig: {},
  },
  {
    type: 'math_divide',
    category: 'Math',
    name: 'Divide (÷)',
    description: 'Divides A by B.',
    icon: 'divide',
    color: '#3b82f6',
    inputs: [
      { id: 'a', name: 'A', type: 'data', dataType: 'number', color: '#3b82f6' },
      { id: 'b', name: 'B', type: 'data', dataType: 'number', color: '#3b82f6' },
    ],
    outputs: [
      { id: 'result', name: 'Result', type: 'data', dataType: 'number', color: '#3b82f6' },
    ],
    defaultConfig: {},
  },
  {
    type: 'math_modulo',
    category: 'Math',
    name: 'Modulo (%)',
    description: 'Returns the remainder of A divided by B.',
    icon: 'percent',
    color: '#6366f1',
    inputs: [
      { id: 'a', name: 'A', type: 'data', dataType: 'number', color: '#3b82f6' },
      { id: 'b', name: 'B', type: 'data', dataType: 'number', color: '#3b82f6' },
    ],
    outputs: [
      { id: 'result', name: 'Result', type: 'data', dataType: 'number', color: '#3b82f6' },
    ],
    defaultConfig: {},
  },
  {
    type: 'math_round',
    category: 'Math',
    name: 'Round',
    description: 'Rounds a number to the nearest integer or specified decimals.',
    icon: 'circle',
    color: '#8b5cf6',
    inputs: [
      { id: 'value', name: 'Value', type: 'data', dataType: 'number', color: '#3b82f6' },
      { id: 'decimals', name: 'Decimals', type: 'data', dataType: 'number', color: '#3b82f6' },
    ],
    outputs: [
      { id: 'result', name: 'Result', type: 'data', dataType: 'number', color: '#3b82f6' },
    ],
    defaultConfig: { decimals: 0 },
  },
  {
    type: 'math_clamp',
    category: 'Math',
    name: 'Clamp',
    description: 'Clamps a value between a minimum and maximum.',
    icon: 'sliders',
    color: '#f59e0b',
    inputs: [
      { id: 'value', name: 'Value', type: 'data', dataType: 'number', color: '#3b82f6' },
      { id: 'min', name: 'Min', type: 'data', dataType: 'number', color: '#3b82f6' },
      { id: 'max', name: 'Max', type: 'data', dataType: 'number', color: '#3b82f6' },
    ],
    outputs: [
      { id: 'result', name: 'Result', type: 'data', dataType: 'number', color: '#3b82f6' },
    ],
    defaultConfig: { min: 0, max: 100 },
  },
  {
    type: 'math_random',
    category: 'Math',
    name: 'Random',
    description: 'Generates a random number between min and max.',
    icon: 'shuffle',
    color: '#ec4899',
    inputs: [
      { id: 'min', name: 'Min', type: 'data', dataType: 'number', color: '#3b82f6' },
      { id: 'max', name: 'Max', type: 'data', dataType: 'number', color: '#3b82f6' },
    ],
    outputs: [
      { id: 'result', name: 'Result', type: 'data', dataType: 'number', color: '#3b82f6' },
    ],
    defaultConfig: { min: 0, max: 1, integer: false },
  },
  {
    type: 'math_min',
    category: 'Math',
    name: 'Min',
    description: 'Returns the smaller of two numbers.',
    icon: 'chevron-down',
    color: '#14b8a6',
    inputs: [
      { id: 'a', name: 'A', type: 'data', dataType: 'number', color: '#3b82f6' },
      { id: 'b', name: 'B', type: 'data', dataType: 'number', color: '#3b82f6' },
    ],
    outputs: [
      { id: 'result', name: 'Result', type: 'data', dataType: 'number', color: '#3b82f6' },
    ],
    defaultConfig: {},
  },
  {
    type: 'math_max',
    category: 'Math',
    name: 'Max',
    description: 'Returns the larger of two numbers.',
    icon: 'chevron-up',
    color: '#14b8a6',
    inputs: [
      { id: 'a', name: 'A', type: 'data', dataType: 'number', color: '#3b82f6' },
      { id: 'b', name: 'B', type: 'data', dataType: 'number', color: '#3b82f6' },
    ],
    outputs: [
      { id: 'result', name: 'Result', type: 'data', dataType: 'number', color: '#3b82f6' },
    ],
    defaultConfig: {},
  },
  {
    type: 'math_average',
    category: 'Math',
    name: 'Average',
    description: 'Calculates the average of an array of numbers.',
    icon: 'bar-chart-2',
    color: '#0ea5e9',
    inputs: [
      { id: 'values', name: 'Values', type: 'data', dataType: 'array', color: '#a855f7' },
    ],
    outputs: [
      { id: 'result', name: 'Result', type: 'data', dataType: 'number', color: '#3b82f6' },
    ],
    defaultConfig: {},
  },
];
