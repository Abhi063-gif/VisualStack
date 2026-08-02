import type { NodeDefinition } from './NodeDefinition';

export const SWITCH_NODE_DEFINITIONS: NodeDefinition[] = [
  {
    type: 'switch_case',
    category: 'Logic',
    name: 'Switch / Case',
    description: 'Routes execution to branches based on matching case values.',
    icon: 'git-branch',
    color: '#f97316',
    inputs: [
      { id: 'exec', name: 'Execute', type: 'execution', dataType: 'execution' },
      { id: 'value', name: 'Value', type: 'data', dataType: 'any', color: '#94a3b8' },
    ],
    outputs: [
      { id: 'case_1', name: 'Case 1', type: 'execution', dataType: 'execution' },
      { id: 'case_2', name: 'Case 2', type: 'execution', dataType: 'execution' },
      { id: 'case_3', name: 'Case 3', type: 'execution', dataType: 'execution' },
      { id: 'default', name: 'Default', type: 'execution', dataType: 'execution', color: '#64748b' },
    ],
    defaultConfig: {
      cases: [
        { id: 'case_1', label: 'Case 1', value: '1' },
        { id: 'case_2', label: 'Case 2', value: '2' },
        { id: 'case_3', label: 'Case 3', value: '3' },
      ],
    },
  },
];
