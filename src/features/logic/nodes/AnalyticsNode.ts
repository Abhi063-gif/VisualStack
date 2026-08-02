import type { NodeDefinition } from './NodeDefinition';

export const ANALYTICS_NODE_DEFINITIONS: NodeDefinition[] = [
  {
    type: 'analytics_track_event',
    category: 'Analytics',
    name: 'Track Event',
    description: 'Tracks custom analytics event to Mixpanel, Google Analytics, or PostHog.',
    icon: 'bar-chart-2',
    color: '#ec4899',
    inputs: [
      { id: 'exec', name: 'Execute', type: 'execution', dataType: 'execution' },
      { id: 'eventName', name: 'Event Name', type: 'data', dataType: 'string', color: '#10b981' },
      { id: 'properties', name: 'Properties', type: 'data', dataType: 'object', color: '#f59e0b' },
    ],
    outputs: [
      { id: 'exec', name: 'Then', type: 'execution', dataType: 'execution' },
    ],
    defaultConfig: { provider: 'mixpanel' },
  },
  {
    type: 'analytics_conversion',
    category: 'Analytics',
    name: 'Track Conversion',
    description: 'Records a sales or sign-up conversion for funnels and revenue tracking.',
    icon: 'trending-up',
    color: '#ec4899',
    inputs: [
      { id: 'exec', name: 'Execute', type: 'execution', dataType: 'execution' },
      { id: 'conversionValue', name: 'Value ($)', type: 'data', dataType: 'number', color: '#3b82f6' },
      { id: 'currency', name: 'Currency', type: 'data', dataType: 'string', color: '#10b981', defaultValue: 'USD' },
    ],
    outputs: [
      { id: 'exec', name: 'Then', type: 'execution', dataType: 'execution' },
    ],
    defaultConfig: { conversionName: 'purchase_completed' },
  },
];
