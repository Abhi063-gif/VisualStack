import type { NodeDefinition } from './NodeDefinition';

export const SCHEDULER_NODE_DEFINITIONS: NodeDefinition[] = [
  {
    type: 'sched_cron_trigger',
    category: 'Scheduler',
    name: 'Cron Schedule Trigger',
    description: 'Triggers workflow on a scheduled cron interval (e.g., Every 5 Minutes, Every Day at Midnight).',
    icon: 'clock',
    color: '#a855f7',
    inputs: [],
    outputs: [
      { id: 'exec', name: 'On Trigger', type: 'execution', dataType: 'execution', color: '#ffffff' },
      { id: 'timestamp', name: 'Trigger Timestamp', type: 'data', dataType: 'string', color: '#10b981' },
    ],
    defaultConfig: { cronExpression: '0 * * * *', schedulePreset: 'hourly' },
  },
  {
    type: 'sched_debounce',
    category: 'Scheduler',
    name: 'Debounce Flow',
    description: 'Delays execution until a specified quiet period has elapsed without new calls.',
    icon: 'filter',
    color: '#a855f7',
    inputs: [
      { id: 'exec', name: 'Execute', type: 'execution', dataType: 'execution' },
      { id: 'wait', name: 'Wait (ms)', type: 'data', dataType: 'number', color: '#3b82f6', defaultValue: 300 },
    ],
    outputs: [
      { id: 'exec', name: 'Then', type: 'execution', dataType: 'execution' },
    ],
    defaultConfig: { waitMs: 300 },
  },
  {
    type: 'sched_retry',
    category: 'Scheduler',
    name: 'Auto Retry',
    description: 'Retries a failed execution branch up to N times with exponential backoff.',
    icon: 'refresh-cw',
    color: '#a855f7',
    inputs: [
      { id: 'exec', name: 'Execute', type: 'execution', dataType: 'execution' },
      { id: 'maxRetries', name: 'Max Retries', type: 'data', dataType: 'number', color: '#3b82f6', defaultValue: 3 },
    ],
    outputs: [
      { id: 'tryBlock', name: 'Try Block', type: 'execution', dataType: 'execution', color: '#10b981' },
      { id: 'success', name: 'Success', type: 'execution', dataType: 'execution', color: '#10b981' },
      { id: 'exhausted', name: 'On Exhausted', type: 'execution', dataType: 'execution', color: '#ef4444' },
    ],
    defaultConfig: { maxRetries: 3, backoffMs: 1000 },
  },
];
