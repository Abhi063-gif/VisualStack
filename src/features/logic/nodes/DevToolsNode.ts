import type { NodeDefinition } from './NodeDefinition';

export const DEVTOOLS_NODE_DEFINITIONS: NodeDefinition[] = [
  {
    type: 'dev_git_commit_push',
    category: 'DevTools',
    name: 'Git Commit & Push',
    description: 'Automatically stages, commits, and pushes repository changes to GitHub/GitLab.',
    icon: 'git-commit',
    color: '#f05032',
    inputs: [
      { id: 'exec', name: 'Execute', type: 'execution', dataType: 'execution' },
      { id: 'commitMessage', name: 'Commit Message', type: 'data', dataType: 'string', color: '#10b981' },
      { id: 'branch', name: 'Branch Name', type: 'data', dataType: 'string', color: '#10b981', defaultValue: 'main' },
    ],
    outputs: [
      { id: 'success', name: 'Success', type: 'execution', dataType: 'execution', color: '#10b981' },
      { id: 'commitHash', name: 'Commit Hash', type: 'data', dataType: 'string', color: '#10b981' },
    ],
    defaultConfig: { branch: 'main' },
  },
  {
    type: 'dev_terminal_cmd',
    category: 'DevTools',
    name: 'Run Terminal Command',
    description: 'Executes a CLI command in the background terminal environment.',
    icon: 'terminal',
    color: '#64748b',
    inputs: [
      { id: 'exec', name: 'Execute', type: 'execution', dataType: 'execution' },
      { id: 'command', name: 'CLI Command', type: 'data', dataType: 'string', color: '#10b981' },
    ],
    outputs: [
      { id: 'success', name: 'Success', type: 'execution', dataType: 'execution', color: '#10b981' },
      { id: 'stdout', name: 'Output (stdout)', type: 'data', dataType: 'string', color: '#10b981' },
      { id: 'exitCode', name: 'Exit Code', type: 'data', dataType: 'number', color: '#3b82f6' },
    ],
    defaultConfig: { cwd: '.' },
  },
  {
    type: 'dev_hot_reload',
    category: 'DevTools',
    name: 'Trigger Hot Reload',
    description: 'Triggers live UI hot reload and state synchronization across preview windows.',
    icon: 'refresh-cw',
    color: '#10b981',
    inputs: [
      { id: 'exec', name: 'Execute', type: 'execution', dataType: 'execution' },
    ],
    outputs: [
      { id: 'exec', name: 'Then', type: 'execution', dataType: 'execution' },
    ],
    defaultConfig: {},
  },
];
