import type { NodeDefinition } from './NodeDefinition';

export const STRING_NODE_DEFINITIONS: NodeDefinition[] = [
  {
    type: 'str_join',
    category: 'String',
    name: 'Join',
    description: 'Concatenates two or more strings together.',
    icon: 'link',
    color: '#10b981',
    inputs: [
      { id: 'a', name: 'String A', type: 'data', dataType: 'string', color: '#10b981' },
      { id: 'b', name: 'String B', type: 'data', dataType: 'string', color: '#10b981' },
      { id: 'separator', name: 'Separator', type: 'data', dataType: 'string', color: '#10b981' },
    ],
    outputs: [
      { id: 'result', name: 'Result', type: 'data', dataType: 'string', color: '#10b981' },
    ],
    defaultConfig: { separator: '' },
  },
  {
    type: 'str_split',
    category: 'String',
    name: 'Split',
    description: 'Splits a string into an array using a delimiter.',
    icon: 'scissors',
    color: '#10b981',
    inputs: [
      { id: 'text', name: 'Text', type: 'data', dataType: 'string', color: '#10b981' },
      { id: 'delimiter', name: 'Delimiter', type: 'data', dataType: 'string', color: '#10b981' },
    ],
    outputs: [
      { id: 'result', name: 'Parts', type: 'data', dataType: 'array', color: '#a855f7' },
    ],
    defaultConfig: { delimiter: ',' },
  },
  {
    type: 'str_replace',
    category: 'String',
    name: 'Replace',
    description: 'Replaces all occurrences of a substring.',
    icon: 'find-replace',
    color: '#10b981',
    inputs: [
      { id: 'text', name: 'Text', type: 'data', dataType: 'string', color: '#10b981' },
      { id: 'search', name: 'Search', type: 'data', dataType: 'string', color: '#10b981' },
      { id: 'replacement', name: 'Replace With', type: 'data', dataType: 'string', color: '#10b981' },
    ],
    outputs: [
      { id: 'result', name: 'Result', type: 'data', dataType: 'string', color: '#10b981' },
    ],
    defaultConfig: { search: '', replacement: '', all: true },
  },
  {
    type: 'str_contains',
    category: 'String',
    name: 'Contains',
    description: 'Checks if a string contains a substring.',
    icon: 'search',
    color: '#10b981',
    inputs: [
      { id: 'text', name: 'Text', type: 'data', dataType: 'string', color: '#10b981' },
      { id: 'search', name: 'Search', type: 'data', dataType: 'string', color: '#10b981' },
    ],
    outputs: [
      { id: 'result', name: 'Contains', type: 'data', dataType: 'boolean', color: '#ef4444' },
    ],
    defaultConfig: { caseSensitive: true },
  },
  {
    type: 'str_starts_with',
    category: 'String',
    name: 'Starts With',
    description: 'Returns true if the string starts with the given prefix.',
    icon: 'arrow-right',
    color: '#10b981',
    inputs: [
      { id: 'text', name: 'Text', type: 'data', dataType: 'string', color: '#10b981' },
      { id: 'prefix', name: 'Prefix', type: 'data', dataType: 'string', color: '#10b981' },
    ],
    outputs: [
      { id: 'result', name: 'Result', type: 'data', dataType: 'boolean', color: '#ef4444' },
    ],
    defaultConfig: {},
  },
  {
    type: 'str_ends_with',
    category: 'String',
    name: 'Ends With',
    description: 'Returns true if the string ends with the given suffix.',
    icon: 'arrow-left',
    color: '#10b981',
    inputs: [
      { id: 'text', name: 'Text', type: 'data', dataType: 'string', color: '#10b981' },
      { id: 'suffix', name: 'Suffix', type: 'data', dataType: 'string', color: '#10b981' },
    ],
    outputs: [
      { id: 'result', name: 'Result', type: 'data', dataType: 'boolean', color: '#ef4444' },
    ],
    defaultConfig: {},
  },
  {
    type: 'str_trim',
    category: 'String',
    name: 'Trim',
    description: 'Removes leading and trailing whitespace.',
    icon: 'align-center',
    color: '#10b981',
    inputs: [
      { id: 'text', name: 'Text', type: 'data', dataType: 'string', color: '#10b981' },
    ],
    outputs: [
      { id: 'result', name: 'Trimmed', type: 'data', dataType: 'string', color: '#10b981' },
    ],
    defaultConfig: { side: 'both' },
  },
  {
    type: 'str_uppercase',
    category: 'String',
    name: 'Uppercase',
    description: 'Converts a string to uppercase.',
    icon: 'chevrons-up',
    color: '#10b981',
    inputs: [
      { id: 'text', name: 'Text', type: 'data', dataType: 'string', color: '#10b981' },
    ],
    outputs: [
      { id: 'result', name: 'Result', type: 'data', dataType: 'string', color: '#10b981' },
    ],
    defaultConfig: {},
  },
  {
    type: 'str_lowercase',
    category: 'String',
    name: 'Lowercase',
    description: 'Converts a string to lowercase.',
    icon: 'chevrons-down',
    color: '#10b981',
    inputs: [
      { id: 'text', name: 'Text', type: 'data', dataType: 'string', color: '#10b981' },
    ],
    outputs: [
      { id: 'result', name: 'Result', type: 'data', dataType: 'string', color: '#10b981' },
    ],
    defaultConfig: {},
  },
  {
    type: 'str_length',
    category: 'String',
    name: 'Length',
    description: 'Returns the number of characters in a string.',
    icon: 'ruler',
    color: '#10b981',
    inputs: [
      { id: 'text', name: 'Text', type: 'data', dataType: 'string', color: '#10b981' },
    ],
    outputs: [
      { id: 'result', name: 'Length', type: 'data', dataType: 'number', color: '#3b82f6' },
    ],
    defaultConfig: {},
  },
  {
    type: 'str_substring',
    category: 'String',
    name: 'Substring',
    description: 'Extracts a portion of a string.',
    icon: 'crop',
    color: '#10b981',
    inputs: [
      { id: 'text', name: 'Text', type: 'data', dataType: 'string', color: '#10b981' },
      { id: 'start', name: 'Start', type: 'data', dataType: 'number', color: '#3b82f6' },
      { id: 'end', name: 'End', type: 'data', dataType: 'number', color: '#3b82f6' },
    ],
    outputs: [
      { id: 'result', name: 'Result', type: 'data', dataType: 'string', color: '#10b981' },
    ],
    defaultConfig: { start: 0, end: undefined },
  },
];
