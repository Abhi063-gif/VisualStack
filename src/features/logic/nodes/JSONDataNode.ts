import type { NodeDefinition } from './NodeDefinition';

export const JSON_DATA_NODE_DEFINITIONS: NodeDefinition[] = [
  {
    type: 'json_parse',
    category: 'String',
    name: 'JSON Parse',
    description: 'Parses a JSON string into a JavaScript Object or Array.',
    icon: 'code',
    color: '#10b981',
    inputs: [
      { id: 'jsonString', name: 'JSON String', type: 'data', dataType: 'string', color: '#10b981' },
    ],
    outputs: [
      { id: 'object', name: 'Parsed Output', type: 'data', dataType: 'any', color: '#94a3b8' },
      { id: 'valid', name: 'Is Valid JSON', type: 'data', dataType: 'boolean', color: '#ef4444' },
    ],
    defaultConfig: {},
  },
  {
    type: 'json_stringify',
    category: 'String',
    name: 'JSON Stringify',
    description: 'Serializes an object or array into a JSON string.',
    icon: 'file-code',
    color: '#10b981',
    inputs: [
      { id: 'data', name: 'Data', type: 'data', dataType: 'any', color: '#94a3b8' },
    ],
    outputs: [
      { id: 'jsonString', name: 'JSON String', type: 'data', dataType: 'string', color: '#10b981' },
    ],
    defaultConfig: { pretty: false },
  },
  {
    type: 'object_get_key',
    category: 'Variables',
    name: 'Get Object Property',
    description: 'Reads a property value from an object by key name (supports dot notation like user.address.city).',
    icon: 'key',
    color: '#6366f1',
    inputs: [
      { id: 'object', name: 'Object', type: 'data', dataType: 'object', color: '#f59e0b' },
      { id: 'key', name: 'Key Path', type: 'data', dataType: 'string', color: '#10b981' },
    ],
    outputs: [
      { id: 'value', name: 'Value', type: 'data', dataType: 'any', color: '#94a3b8' },
      { id: 'exists', name: 'Exists', type: 'data', dataType: 'boolean', color: '#ef4444' },
    ],
    defaultConfig: { key: '' },
  },
  {
    type: 'object_merge',
    category: 'Variables',
    name: 'Merge Objects',
    description: 'Merges two or more objects together.',
    icon: 'combine',
    color: '#6366f1',
    inputs: [
      { id: 'objA', name: 'Object A', type: 'data', dataType: 'object', color: '#f59e0b' },
      { id: 'objB', name: 'Object B', type: 'data', dataType: 'object', color: '#f59e0b' },
    ],
    outputs: [
      { id: 'result', name: 'Merged Object', type: 'data', dataType: 'object', color: '#f59e0b' },
    ],
    defaultConfig: {},
  },
  {
    type: 'array_filter',
    category: 'Logic',
    name: 'Filter Array',
    description: 'Filters array items by field value or condition.',
    icon: 'filter',
    color: '#10b981',
    inputs: [
      { id: 'array', name: 'Array', type: 'data', dataType: 'array', color: '#a855f7' },
      { id: 'field', name: 'Property Name', type: 'data', dataType: 'string', color: '#10b981' },
      { id: 'value', name: 'Match Value', type: 'data', dataType: 'any', color: '#94a3b8' },
    ],
    outputs: [
      { id: 'filtered', name: 'Filtered Array', type: 'data', dataType: 'array', color: '#a855f7' },
      { id: 'count', name: 'Matching Count', type: 'data', dataType: 'number', color: '#3b82f6' },
    ],
    defaultConfig: { operator: '==' },
  },
  {
    type: 'array_sort',
    category: 'Logic',
    name: 'Sort Array',
    description: 'Sorts an array of objects by field in ascending or descending order.',
    icon: 'arrow-down-up',
    color: '#10b981',
    inputs: [
      { id: 'array', name: 'Array', type: 'data', dataType: 'array', color: '#a855f7' },
      { id: 'field', name: 'Sort Field', type: 'data', dataType: 'string', color: '#10b981' },
    ],
    outputs: [
      { id: 'sorted', name: 'Sorted Array', type: 'data', dataType: 'array', color: '#a855f7' },
    ],
    defaultConfig: { order: 'asc' },
  },
];
