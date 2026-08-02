import type { NodeDefinition } from './NodeDefinition';

export const NAVIGATE_NODE_DEFINITIONS: NodeDefinition[] = [
  {
    type: 'nav_go_to',
    category: 'Navigation',
    name: 'Go To Screen',
    description: 'Navigates to a specified screen/route.',
    icon: 'arrow-right',
    color: '#6366f1',
    inputs: [
      { id: 'exec', name: 'Execute', type: 'execution', dataType: 'execution' },
      { id: 'screenId', name: 'Screen', type: 'data', dataType: 'string', color: '#10b981' },
      { id: 'params', name: 'Params', type: 'data', dataType: 'object', color: '#f59e0b' },
    ],
    outputs: [
      { id: 'exec', name: 'Then', type: 'execution', dataType: 'execution' },
    ],
    defaultConfig: { screenId: '', replace: false },
  },
  {
    type: 'nav_back',
    category: 'Navigation',
    name: 'Go Back',
    description: 'Navigates back to the previous screen.',
    icon: 'arrow-left',
    color: '#64748b',
    inputs: [
      { id: 'exec', name: 'Execute', type: 'execution', dataType: 'execution' },
    ],
    outputs: [
      { id: 'exec', name: 'Then', type: 'execution', dataType: 'execution' },
    ],
    defaultConfig: {},
  },
  {
    type: 'nav_replace',
    category: 'Navigation',
    name: 'Replace Screen',
    description: 'Replaces the current screen in the navigation stack.',
    icon: 'repeat',
    color: '#f97316',
    inputs: [
      { id: 'exec', name: 'Execute', type: 'execution', dataType: 'execution' },
      { id: 'screenId', name: 'Screen', type: 'data', dataType: 'string', color: '#10b981' },
    ],
    outputs: [
      { id: 'exec', name: 'Then', type: 'execution', dataType: 'execution' },
    ],
    defaultConfig: { screenId: '' },
  },
  {
    type: 'nav_open_modal',
    category: 'Navigation',
    name: 'Open Modal',
    description: 'Opens a modal dialog.',
    icon: 'layers',
    color: '#8b5cf6',
    inputs: [
      { id: 'exec', name: 'Execute', type: 'execution', dataType: 'execution' },
      { id: 'modalId', name: 'Modal ID', type: 'data', dataType: 'string', color: '#10b981' },
      { id: 'data', name: 'Data', type: 'data', dataType: 'object', color: '#f59e0b' },
    ],
    outputs: [
      { id: 'exec', name: 'Then', type: 'execution', dataType: 'execution' },
      { id: 'result', name: 'Result', type: 'data', dataType: 'any', color: '#94a3b8' },
    ],
    defaultConfig: { modalId: '' },
  },
  {
    type: 'nav_close_modal',
    category: 'Navigation',
    name: 'Close Modal',
    description: 'Closes the currently open modal.',
    icon: 'x',
    color: '#ef4444',
    inputs: [
      { id: 'exec', name: 'Execute', type: 'execution', dataType: 'execution' },
      { id: 'result', name: 'Result', type: 'data', dataType: 'any', color: '#94a3b8' },
    ],
    outputs: [
      { id: 'exec', name: 'Then', type: 'execution', dataType: 'execution' },
    ],
    defaultConfig: {},
  },
  {
    type: 'nav_bottom_sheet',
    category: 'Navigation',
    name: 'Bottom Sheet',
    description: 'Opens a bottom sheet panel.',
    icon: 'panel-bottom',
    color: '#0ea5e9',
    inputs: [
      { id: 'exec', name: 'Execute', type: 'execution', dataType: 'execution' },
      { id: 'sheetId', name: 'Sheet ID', type: 'data', dataType: 'string', color: '#10b981' },
    ],
    outputs: [
      { id: 'exec', name: 'Then', type: 'execution', dataType: 'execution' },
    ],
    defaultConfig: { sheetId: '', snapPoints: ['50%', '90%'] },
  },
  {
    type: 'nav_drawer',
    category: 'Navigation',
    name: 'Open Drawer',
    description: 'Opens a navigation drawer.',
    icon: 'menu',
    color: '#14b8a6',
    inputs: [
      { id: 'exec', name: 'Execute', type: 'execution', dataType: 'execution' },
      { id: 'side', name: 'Side', type: 'data', dataType: 'string', color: '#10b981' },
    ],
    outputs: [
      { id: 'exec', name: 'Then', type: 'execution', dataType: 'execution' },
    ],
    defaultConfig: { side: 'left' },
  },
];
