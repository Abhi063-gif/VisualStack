import type { NodeDefinition } from './NodeDefinition';

export const ACTION_NODE_DEFINITIONS: NodeDefinition[] = [
  {
    type: 'action_set_property',
    category: 'Logic',
    name: 'Set Property',
    description: 'Sets a property on a UI element by ID.',
    icon: 'settings',
    color: '#6366f1',
    inputs: [
      { id: 'exec', name: 'Execute', type: 'execution', dataType: 'execution' },
      { id: 'elementId', name: 'Element ID', type: 'data', dataType: 'string', color: '#10b981' },
      { id: 'property', name: 'Property', type: 'data', dataType: 'string', color: '#10b981' },
      { id: 'value', name: 'Value', type: 'data', dataType: 'any', color: '#94a3b8' },
    ],
    outputs: [
      { id: 'exec', name: 'Then', type: 'execution', dataType: 'execution' },
    ],
    defaultConfig: { elementId: '', property: 'text', value: '' },
  },
  {
    type: 'action_show_toast',
    category: 'Logic',
    name: 'Show Toast',
    description: 'Displays a toast notification message.',
    icon: 'bell',
    color: '#f59e0b',
    inputs: [
      { id: 'exec', name: 'Execute', type: 'execution', dataType: 'execution' },
      { id: 'message', name: 'Message', type: 'data', dataType: 'string', color: '#10b981' },
    ],
    outputs: [
      { id: 'exec', name: 'Then', type: 'execution', dataType: 'execution' },
    ],
    defaultConfig: { type: 'success', duration: 3000 },
  },
  {
    type: 'action_show_error',
    category: 'Logic',
    name: 'Show Error',
    description: 'Universal Error Node — displays any type of error (Login Error, Account Not Found, Validation Error, API Failure, etc.) to the user.',
    icon: 'alert-circle',
    color: '#ef4444',
    inputs: [
      { id: 'exec', name: 'Execute', type: 'execution', dataType: 'execution' },
      { id: 'errorType', name: 'Error Type', type: 'data', dataType: 'string', color: '#10b981', defaultValue: 'Login Error' },
      { id: 'message', name: 'Error Message', type: 'data', dataType: 'string', color: '#10b981', defaultValue: 'Account not found. Please check your credentials.' },
      { id: 'errorCode', name: 'Error Code', type: 'data', dataType: 'string', color: '#10b981', defaultValue: 'ERR_ACCOUNT_NOT_FOUND' },
    ],
    outputs: [
      { id: 'exec', name: 'Then', type: 'execution', dataType: 'execution' },
      { id: 'onError', name: 'On Error', type: 'execution', dataType: 'execution', color: '#ef4444' },
      { id: 'errorMessage', name: 'Message Text', type: 'data', dataType: 'string', color: '#10b981' },
    ],
    defaultConfig: {
      errorType: 'Login Error',
      message: 'Account not found. Please check your credentials.',
      errorCode: 'ERR_ACCOUNT_NOT_FOUND',
      displayStyle: 'alert_banner',
    },
  },
  {
    type: 'action_log',
    category: 'Logic',
    name: 'Log',
    description: 'Logs a value to the execution console.',
    icon: 'terminal',
    color: '#64748b',
    inputs: [
      { id: 'exec', name: 'Execute', type: 'execution', dataType: 'execution' },
      { id: 'value', name: 'Value', type: 'data', dataType: 'any', color: '#94a3b8' },
    ],
    outputs: [
      { id: 'exec', name: 'Then', type: 'execution', dataType: 'execution' },
    ],
    defaultConfig: { label: 'Log' },
  },
];
