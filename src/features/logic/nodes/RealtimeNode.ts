import type { NodeDefinition } from './NodeDefinition';

export const REALTIME_NODE_DEFINITIONS: NodeDefinition[] = [
  {
    type: 'realtime_socket_connect',
    category: 'Realtime',
    name: 'Socket Connect',
    description: 'Establishes a real-time WebSocket connection to a server.',
    icon: 'radio',
    color: '#06b6d4',
    inputs: [
      { id: 'exec', name: 'Execute', type: 'execution', dataType: 'execution' },
      { id: 'url', name: 'WebSocket URL', type: 'data', dataType: 'string', color: '#10b981' },
    ],
    outputs: [
      { id: 'connected', name: 'Connected', type: 'execution', dataType: 'execution', color: '#10b981' },
      { id: 'error', name: 'On Error', type: 'execution', dataType: 'execution', color: '#ef4444' },
      { id: 'socketId', name: 'Socket ID', type: 'data', dataType: 'string', color: '#10b981' },
    ],
    defaultConfig: { autoReconnect: true },
  },
  {
    type: 'realtime_socket_emit',
    category: 'Realtime',
    name: 'Socket Emit Event',
    description: 'Emits a real-time WebSocket payload event to connected clients.',
    icon: 'send',
    color: '#06b6d4',
    inputs: [
      { id: 'exec', name: 'Execute', type: 'execution', dataType: 'execution' },
      { id: 'eventName', name: 'Event Name', type: 'data', dataType: 'string', color: '#10b981' },
      { id: 'payload', name: 'Payload Object', type: 'data', dataType: 'object', color: '#f59e0b' },
    ],
    outputs: [
      { id: 'exec', name: 'Then', type: 'execution', dataType: 'execution' },
    ],
    defaultConfig: { eventName: 'chat_message' },
  },
  {
    type: 'realtime_socket_listen',
    category: 'Realtime',
    name: 'Socket Listen Event',
    description: 'Triggers when a specific real-time WebSocket event message is received.',
    icon: 'rss',
    color: '#06b6d4',
    inputs: [],
    outputs: [
      { id: 'exec', name: 'On Received', type: 'execution', dataType: 'execution', color: '#ffffff' },
      { id: 'data', name: 'Event Data', type: 'data', dataType: 'object', color: '#f59e0b' },
    ],
    defaultConfig: { eventName: 'chat_message' },
  },
  {
    type: 'realtime_typing_indicator',
    category: 'Realtime',
    name: 'Typing Indicator',
    description: 'Emits or listens to user typing indicators in real-time chat.',
    icon: 'edit-3',
    color: '#06b6d4',
    inputs: [
      { id: 'exec', name: 'Execute', type: 'execution', dataType: 'execution' },
      { id: 'isTyping', name: 'Is Typing', type: 'data', dataType: 'boolean', color: '#ef4444' },
    ],
    outputs: [
      { id: 'exec', name: 'Then', type: 'execution', dataType: 'execution' },
    ],
    defaultConfig: {},
  },
];
