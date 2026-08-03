export interface ToolCallDefinition {
  name: string;
  description: string;
  parameters: Record<string, any>;
}

export interface AIMessage {
  role: 'system' | 'user' | 'assistant' | 'tool';
  content: string;
  name?: string;
  toolCalls?: Array<{ id: string; name: string; args: Record<string, any> }>;
}

export interface AIRequest {
  model: string;
  messages: AIMessage[];
  temperature?: number;
  topP?: number;
  maxTokens?: number;
  stream?: boolean;
  reasoningMode?: boolean;
  tools?: ToolCallDefinition[];
}

export interface AIResponse {
  id: string;
  model: string;
  content: string;
  finishReason: 'stop' | 'length' | 'tool_calls' | 'content_filter';
  usage: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
  toolCalls?: Array<{ id: string; name: string; args: Record<string, any> }>;
  reasoningContent?: string;
}

export interface StreamChunk {
  id: string;
  delta: string;
  finished: boolean;
}

export interface IAIProvider {
  id: string;
  name: string;
  category: 'cloud' | 'local' | 'custom';
  supportedModels: string[];

  Generate(request: AIRequest): Promise<AIResponse>;
  Stream(request: AIRequest, onChunk: (chunk: StreamChunk) => void): Promise<AIResponse>;
  Embed(text: string): Promise<number[]>;
  Chat(messages: AIMessage[], options?: Partial<AIRequest>): Promise<AIResponse>;
  Reason(prompt: string, context?: string): Promise<string>;
  ToolCall(prompt: string, tools: ToolCallDefinition[]): Promise<AIResponse>;
  Cancel(): void;
}
