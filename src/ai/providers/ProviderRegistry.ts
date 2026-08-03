import type { IAIProvider, AIRequest, AIResponse, StreamChunk, AIMessage, ToolCallDefinition } from '../core/IAIProvider';
import { modelUsageAnalytics } from '../analytics/ModelUsageAnalytics';
import { aiSecurityFilter } from '../security/AISecurityFilter';

export class BaseAIProvider implements IAIProvider {
  public id: string;
  public name: string;
  public category: 'cloud' | 'local' | 'custom';
  public supportedModels: string[];

  constructor(id: string, name: string, category: 'cloud' | 'local' | 'custom', supportedModels: string[]) {
    this.id = id;
    this.name = name;
    this.category = category;
    this.supportedModels = supportedModels;
  }

  public async Generate(request: AIRequest): Promise<AIResponse> {
    const startTime = Date.now();
    const sanitizedMessages = request.messages.map((m) => ({
      ...m,
      content: aiSecurityFilter.sanitizePrompt(m.content),
    }));

    const lastMsg = sanitizedMessages[sanitizedMessages.length - 1]?.content || '';
    const responseContent = `[${this.name} (${request.model})] Processing query: "${lastMsg.slice(0, 60)}..."`;

    const latencyMs = Date.now() - startTime;
    modelUsageAnalytics.recordUsage(this.id, request.model, 150, 250, latencyMs);

    return {
      id: `res_${Date.now().toString(36)}`,
      model: request.model,
      content: responseContent,
      finishReason: 'stop',
      usage: { promptTokens: 150, completionTokens: 250, totalTokens: 400 },
    };
  }

  public async Stream(request: AIRequest, onChunk: (chunk: StreamChunk) => void): Promise<AIResponse> {
    const fullRes = await this.Generate(request);
    const words = fullRes.content.split(' ');

    for (let i = 0; i < words.length; i++) {
      await new Promise((r) => setTimeout(r, 20));
      onChunk({
        id: fullRes.id,
        delta: `${words[i]} `,
        finished: i === words.length - 1,
      });
    }

    return fullRes;
  }

  public async Embed(_text: string): Promise<number[]> {
    return Array.from({ length: 1536 }, () => Math.random());
  }

  public async Chat(messages: AIMessage[], options?: Partial<AIRequest>): Promise<AIResponse> {
    return this.Generate({
      model: this.supportedModels[0],
      messages,
      ...options,
    });
  }

  public async Reason(prompt: string, context?: string): Promise<string> {
    const res = await this.Chat([
      { role: 'system', content: 'You are an expert autonomous software engineer reasoning through architectural decisions.' },
      { role: 'user', content: `Context: ${context || 'None'}\n\nTask: ${prompt}` },
    ]);
    return res.content;
  }

  public async ToolCall(prompt: string, tools: ToolCallDefinition[]): Promise<AIResponse> {
    return this.Generate({
      model: this.supportedModels[0],
      messages: [{ role: 'user', content: prompt }],
      tools,
    });
  }

  public Cancel(): void {}
}

export class ProviderRegistry {
  private providers: Map<string, IAIProvider> = new Map();

  constructor() {
    this.registerDefaultProviders();
  }

  private registerDefaultProviders(): void {
    const list: IAIProvider[] = [
      new BaseAIProvider('openai', 'OpenAI', 'cloud', ['gpt-4o', 'gpt-4o-mini', 'o1-preview']),
      new BaseAIProvider('anthropic', 'Anthropic', 'cloud', ['claude-3-5-sonnet', 'claude-3-opus', 'claude-3-haiku']),
      new BaseAIProvider('gemini', 'Google Gemini', 'cloud', ['gemini-1.5-pro', 'gemini-1.5-flash']),
      new BaseAIProvider('openrouter', 'OpenRouter', 'cloud', ['openrouter/auto', 'anthropic/claude-3.5-sonnet']),
      new BaseAIProvider('deepseek', 'DeepSeek AI', 'cloud', ['deepseek-coder', 'deepseek-chat', 'deepseek-v3']),
      new BaseAIProvider('groq', 'Groq Llama', 'cloud', ['llama-3.3-70b', 'mixtral-8x7b']),
      new BaseAIProvider('ollama', 'Ollama (Local LLM)', 'local', ['qwen-2.5-coder', 'llama3.2', 'codellama']),
      new BaseAIProvider('lmstudio', 'LM Studio (Local LLM)', 'local', ['local-model-v1']),
      new BaseAIProvider('azure_openai', 'Azure OpenAI', 'cloud', ['azure-gpt-4o']),
      new BaseAIProvider('custom_openai', 'Custom OpenAI Compatible API', 'custom', ['custom-model-v1']),
    ];

    list.forEach((p) => this.providers.set(p.id, p));
  }

  public getProvider(id: string): IAIProvider | undefined {
    return this.providers.get(id);
  }

  public getAllProviders(): IAIProvider[] {
    return Array.from(this.providers.values());
  }

  public registerProvider(provider: IAIProvider): void {
    this.providers.set(provider.id, provider);
  }
}

export const providerRegistry = new ProviderRegistry();
