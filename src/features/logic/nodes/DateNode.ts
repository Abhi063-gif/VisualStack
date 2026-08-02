import type { NodeDefinition } from './NodeDefinition';

export const DATE_NODE_DEFINITIONS: NodeDefinition[] = [
  {
    type: 'date_now',
    category: 'Date',
    name: 'Current Date',
    description: 'Outputs the current date and timestamp.',
    icon: 'calendar',
    color: '#f59e0b',
    inputs: [],
    outputs: [
      { id: 'timestamp', name: 'Timestamp (ms)', type: 'data', dataType: 'number', color: '#3b82f6' },
      { id: 'iso', name: 'ISO String', type: 'data', dataType: 'string', color: '#10b981' },
    ],
    defaultConfig: {},
  },
  {
    type: 'date_format',
    category: 'Date',
    name: 'Format Date',
    description: 'Formats a timestamp into a human-readable string.',
    icon: 'calendar-days',
    color: '#f59e0b',
    inputs: [
      { id: 'timestamp', name: 'Timestamp', type: 'data', dataType: 'number', color: '#3b82f6' },
      { id: 'format', name: 'Format', type: 'data', dataType: 'string', color: '#10b981' },
    ],
    outputs: [
      { id: 'result', name: 'Formatted', type: 'data', dataType: 'string', color: '#10b981' },
    ],
    defaultConfig: { format: 'YYYY-MM-DD', locale: 'en-US' },
  },
  {
    type: 'date_parse',
    category: 'Date',
    name: 'Parse Date',
    description: 'Parses a date string into a timestamp.',
    icon: 'calendar-check',
    color: '#f59e0b',
    inputs: [
      { id: 'dateString', name: 'Date String', type: 'data', dataType: 'string', color: '#10b981' },
    ],
    outputs: [
      { id: 'timestamp', name: 'Timestamp (ms)', type: 'data', dataType: 'number', color: '#3b82f6' },
      { id: 'valid', name: 'Is Valid', type: 'data', dataType: 'boolean', color: '#ef4444' },
    ],
    defaultConfig: {},
  },
  {
    type: 'date_diff',
    category: 'Date',
    name: 'Date Difference',
    description: 'Calculates the difference between two dates.',
    icon: 'calendar-minus',
    color: '#f59e0b',
    inputs: [
      { id: 'from', name: 'From', type: 'data', dataType: 'number', color: '#3b82f6' },
      { id: 'to', name: 'To', type: 'data', dataType: 'number', color: '#3b82f6' },
    ],
    outputs: [
      { id: 'days', name: 'Days', type: 'data', dataType: 'number', color: '#3b82f6' },
      { id: 'hours', name: 'Hours', type: 'data', dataType: 'number', color: '#3b82f6' },
      { id: 'minutes', name: 'Minutes', type: 'data', dataType: 'number', color: '#3b82f6' },
      { id: 'ms', name: 'Milliseconds', type: 'data', dataType: 'number', color: '#3b82f6' },
    ],
    defaultConfig: {},
  },
  {
    type: 'date_add',
    category: 'Date',
    name: 'Add to Date',
    description: 'Adds a duration to a date.',
    icon: 'calendar-plus',
    color: '#f59e0b',
    inputs: [
      { id: 'timestamp', name: 'Date', type: 'data', dataType: 'number', color: '#3b82f6' },
      { id: 'amount', name: 'Amount', type: 'data', dataType: 'number', color: '#3b82f6' },
    ],
    outputs: [
      { id: 'result', name: 'New Date', type: 'data', dataType: 'number', color: '#3b82f6' },
    ],
    defaultConfig: { unit: 'days' },
  },
];
