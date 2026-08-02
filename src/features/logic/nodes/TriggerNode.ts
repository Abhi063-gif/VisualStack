import type { NodeDefinition } from './NodeDefinition';

export const TRIGGER_NODE_DEFINITIONS: NodeDefinition[] = [
  {
    type: 'trig_webhook',
    category: 'Triggers',
    name: 'Webhook Endpoint Trigger',
    description: 'Listens for incoming HTTP POST/GET webhooks from external services.',
    icon: 'globe',
    color: '#f97316',
    inputs: [],
    outputs: [
      { id: 'exec', name: 'On Webhook', type: 'execution', dataType: 'execution', color: '#ffffff' },
      { id: 'payload', name: 'Request Body', type: 'data', dataType: 'object', color: '#f59e0b' },
      { id: 'headers', name: 'Headers', type: 'data', dataType: 'object', color: '#f59e0b' },
    ],
    defaultConfig: { path: '/api/v1/webhook', method: 'POST' },
  },
  {
    type: 'trig_stripe_event',
    category: 'Triggers',
    name: 'Stripe Webhook Event',
    description: 'Triggers when a Stripe event occurs (e.g. payment_intent.succeeded, customer.subscription.created).',
    icon: 'credit-card',
    color: '#8b5cf6',
    inputs: [],
    outputs: [
      { id: 'exec', name: 'On Event', type: 'execution', dataType: 'execution', color: '#ffffff' },
      { id: 'eventData', name: 'Event Data', type: 'data', dataType: 'object', color: '#f59e0b' },
      { id: 'eventType', name: 'Event Type', type: 'data', dataType: 'string', color: '#10b981' },
    ],
    defaultConfig: { eventFilter: 'payment_intent.succeeded' },
  },
  {
    type: 'trig_supabase_event',
    category: 'Triggers',
    name: 'Supabase Realtime Trigger',
    description: 'Fires when a database INSERT, UPDATE, or DELETE occurs in Supabase.',
    icon: 'database',
    color: '#10b981',
    inputs: [],
    outputs: [
      { id: 'exec', name: 'On Change', type: 'execution', dataType: 'execution', color: '#ffffff' },
      { id: 'record', name: 'New Record', type: 'data', dataType: 'object', color: '#f59e0b' },
      { id: 'oldRecord', name: 'Old Record', type: 'data', dataType: 'object', color: '#f59e0b' },
    ],
    defaultConfig: { table: 'orders', eventType: 'INSERT' },
  },
];
