import type { NodeDefinition } from './NodeDefinition';

export const WORKFLOW_NODE_DEFINITIONS: NodeDefinition[] = [
  {
    type: 'wf_try_catch',
    category: 'Workflow',
    name: 'Try / Catch Handler',
    description: 'Catches runtime exceptions and routes error objects to the Catch branch.',
    icon: 'shield-alert',
    color: '#ef4444',
    inputs: [
      { id: 'exec', name: 'Execute', type: 'execution', dataType: 'execution' },
    ],
    outputs: [
      { id: 'tryBlock', name: 'Try Block', type: 'execution', dataType: 'execution', color: '#10b981' },
      { id: 'catchBlock', name: 'Catch Block', type: 'execution', dataType: 'execution', color: '#ef4444' },
      { id: 'errorObject', name: 'Error Object', type: 'data', dataType: 'object', color: '#f59e0b' },
    ],
    defaultConfig: {},
  },
  {
    type: 'wf_throw_error',
    category: 'Workflow',
    name: 'Throw Error',
    description: 'Throws a custom runtime exception to halt workflow execution.',
    icon: 'zap-off',
    color: '#ef4444',
    inputs: [
      { id: 'exec', name: 'Execute', type: 'execution', dataType: 'execution' },
      { id: 'errorMessage', name: 'Error Message', type: 'data', dataType: 'string', color: '#10b981' },
    ],
    outputs: [],
    defaultConfig: { errorMessage: 'Workflow assertion failed' },
  },
  {
    type: 'wf_sub_workflow',
    category: 'Workflow',
    name: 'Run Sub-Workflow',
    description: 'Executes a reusable child workflow module with custom input parameters.',
    icon: 'workflow',
    color: '#6366f1',
    inputs: [
      { id: 'exec', name: 'Execute', type: 'execution', dataType: 'execution' },
      { id: 'workflowId', name: 'Workflow ID', type: 'data', dataType: 'string', color: '#10b981' },
      { id: 'params', name: 'Input Params', type: 'data', dataType: 'object', color: '#f59e0b' },
    ],
    outputs: [
      { id: 'success', name: 'Success', type: 'execution', dataType: 'execution', color: '#10b981' },
      { id: 'error', name: 'Error', type: 'execution', dataType: 'execution', color: '#ef4444' },
      { id: 'result', name: 'Return Result', type: 'data', dataType: 'any', color: '#94a3b8' },
    ],
    defaultConfig: { workflowId: '' },
  },
  {
    type: 'wf_breakpoint',
    category: 'Workflow',
    name: 'Debug Breakpoint',
    description: 'Pauses workflow execution when running in debug mode to inspect state.',
    icon: 'pause-circle',
    color: '#f59e0b',
    inputs: [
      { id: 'exec', name: 'Execute', type: 'execution', dataType: 'execution' },
    ],
    outputs: [
      { id: 'exec', name: 'Then', type: 'execution', dataType: 'execution' },
    ],
    defaultConfig: { enabled: true },
  },
];
