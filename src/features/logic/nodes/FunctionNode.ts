import type { NodeDefinition } from './NodeDefinition';

export const FUNCTION_NODE_DEFINITIONS: NodeDefinition[] = [
  {
    type: 'fn_define',
    category: 'Functions',
    name: 'Define Function',
    description: 'Defines a reusable named function with inputs and outputs.',
    icon: 'code-2',
    color: '#6366f1',
    inputs: [],
    outputs: [
      { id: 'exec', name: 'Function Body', type: 'execution', dataType: 'execution' },
    ],
    defaultConfig: {
      functionName: 'myFunction',
      parameters: [] as { id: string; name: string; type: string }[],
      returnType: 'any',
      isAsync: false,
    },
  },
  {
    type: 'fn_call',
    category: 'Functions',
    name: 'Call Function',
    description: 'Calls a previously defined function by name.',
    icon: 'play-circle',
    color: '#10b981',
    inputs: [
      { id: 'exec', name: 'Execute', type: 'execution', dataType: 'execution' },
      { id: 'arg0', name: 'Arg 1', type: 'data', dataType: 'any', color: '#94a3b8' },
      { id: 'arg1', name: 'Arg 2', type: 'data', dataType: 'any', color: '#94a3b8' },
    ],
    outputs: [
      { id: 'exec', name: 'Then', type: 'execution', dataType: 'execution' },
      { id: 'return', name: 'Return Value', type: 'data', dataType: 'any', color: '#94a3b8' },
    ],
    defaultConfig: { functionName: '', args: [] as unknown[] },
  },
  {
    type: 'fn_return',
    category: 'Functions',
    name: 'Return',
    description: 'Returns a value from the current function.',
    icon: 'corner-up-left',
    color: '#f97316',
    inputs: [
      { id: 'exec', name: 'Execute', type: 'execution', dataType: 'execution' },
      { id: 'value', name: 'Value', type: 'data', dataType: 'any', color: '#94a3b8' },
    ],
    outputs: [],
    defaultConfig: {},
  },
  {
    type: 'fn_async',
    category: 'Functions',
    name: 'Async Function',
    description: 'Defines an async function that returns a Promise.',
    icon: 'loader',
    color: '#a855f7',
    inputs: [],
    outputs: [
      { id: 'exec', name: 'Function Body', type: 'execution', dataType: 'execution' },
    ],
    defaultConfig: {
      functionName: 'myAsyncFunction',
      parameters: [] as { id: string; name: string; type: string }[],
      returnType: 'any',
      isAsync: true,
    },
  },
];
