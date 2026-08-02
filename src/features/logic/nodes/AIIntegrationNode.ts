import type { NodeDefinition } from './NodeDefinition';

export const AI_INTEGRATION_NODE_DEFINITIONS: NodeDefinition[] = [
  {
    type: 'ai_openai_chat',
    category: 'Custom',
    name: 'OpenAI Chat (GPT-4)',
    description: 'Generates text responses using OpenAI GPT-4 / GPT-3.5 APIs.',
    icon: 'bot',
    color: '#10a37f',
    inputs: [
      { id: 'exec', name: 'Execute', type: 'execution', dataType: 'execution' },
      { id: 'prompt', name: 'User Prompt', type: 'data', dataType: 'string', color: '#10b981' },
      { id: 'systemPrompt', name: 'System Instructions', type: 'data', dataType: 'string', color: '#10b981' },
      { id: 'apiKey', name: 'API Key', type: 'data', dataType: 'string', color: '#10b981' },
    ],
    outputs: [
      { id: 'success', name: 'Success', type: 'execution', dataType: 'execution', color: '#10b981' },
      { id: 'error', name: 'Error', type: 'execution', dataType: 'execution', color: '#ef4444' },
      { id: 'response', name: 'AI Response Text', type: 'data', dataType: 'string', color: '#10b981' },
    ],
    defaultConfig: { model: 'gpt-4o', temperature: 0.7 },
  },
  {
    type: 'ai_openai_embeddings',
    category: 'Custom',
    name: 'OpenAI Embeddings',
    description: 'Generates vector embeddings for similarity search or RAG.',
    icon: 'cpu',
    color: '#10a37f',
    inputs: [
      { id: 'exec', name: 'Execute', type: 'execution', dataType: 'execution' },
      { id: 'text', name: 'Input Text', type: 'data', dataType: 'string', color: '#10b981' },
      { id: 'apiKey', name: 'API Key', type: 'data', dataType: 'string', color: '#10b981' },
    ],
    outputs: [
      { id: 'success', name: 'Success', type: 'execution', dataType: 'execution', color: '#10b981' },
      { id: 'embedding', name: 'Vector Array', type: 'data', dataType: 'array', color: '#a855f7' },
    ],
    defaultConfig: { model: 'text-embedding-3-small' },
  },
  {
    type: 'ai_anthropic_claude',
    category: 'Custom',
    name: 'Anthropic Claude',
    description: 'Generates responses using Anthropic Claude 3.5 Sonnet.',
    icon: 'sparkles',
    color: '#d97706',
    inputs: [
      { id: 'exec', name: 'Execute', type: 'execution', dataType: 'execution' },
      { id: 'prompt', name: 'Prompt', type: 'data', dataType: 'string', color: '#10b981' },
      { id: 'apiKey', name: 'API Key', type: 'data', dataType: 'string', color: '#10b981' },
    ],
    outputs: [
      { id: 'success', name: 'Success', type: 'execution', dataType: 'execution', color: '#10b981' },
      { id: 'response', name: 'Response Text', type: 'data', dataType: 'string', color: '#10b981' },
    ],
    defaultConfig: { model: 'claude-3-5-sonnet-20241022' },
  },
  {
    type: 'graphql_query',
    category: 'API',
    name: 'GraphQL Request',
    description: 'Executes a GraphQL Query or Mutation.',
    icon: 'share-2',
    color: '#e10098',
    inputs: [
      { id: 'exec', name: 'Execute', type: 'execution', dataType: 'execution' },
      { id: 'endpoint', name: 'GraphQL Endpoint', type: 'data', dataType: 'string', color: '#10b981' },
      { id: 'query', name: 'Query String', type: 'data', dataType: 'string', color: '#10b981' },
      { id: 'variables', name: 'Variables (Object)', type: 'data', dataType: 'object', color: '#f59e0b' },
    ],
    outputs: [
      { id: 'success', name: 'Success', type: 'execution', dataType: 'execution', color: '#10b981' },
      { id: 'error', name: 'Error', type: 'execution', dataType: 'execution', color: '#ef4444' },
      { id: 'data', name: 'Response Data', type: 'data', dataType: 'any', color: '#94a3b8' },
    ],
    defaultConfig: {},
  },
  {
    type: 'rate_limiter',
    category: 'Logic',
    name: 'Rate Limiter',
    description: 'Limits execution frequency per client IP or user token.',
    icon: 'shield-alert',
    color: '#ef4444',
    inputs: [
      { id: 'exec', name: 'Execute', type: 'execution', dataType: 'execution' },
      { id: 'key', name: 'Identifier (IP/User)', type: 'data', dataType: 'string', color: '#10b981' },
    ],
    outputs: [
      { id: 'allowed', name: 'Allowed', type: 'execution', dataType: 'execution', color: '#10b981' },
      { id: 'rate_limited', name: 'Rate Limited (429)', type: 'execution', dataType: 'execution', color: '#ef4444' },
    ],
    defaultConfig: { maxRequests: 60, windowSeconds: 60 },
  },
];
