export interface ModelConfig {
  modelId: string;
  providerId: string;
  displayName: string;
  temperature: number;
  topP: number;
  contextLength: number;
  maxTokens: number;
  streaming: boolean;
  reasoningMode: boolean;
  visionMode: boolean;
  functionCalling: boolean;
}

export class AIModelManager {
  private activeModelId = 'gpt-4o';
  private activeProviderId = 'openai';
  private configMap: Map<string, ModelConfig> = new Map();

  constructor() {
    this.registerDefaultModels();
  }

  private registerDefaultModels(): void {
    const defaults: ModelConfig[] = [
      { modelId: 'gpt-4o', providerId: 'openai', displayName: 'OpenAI GPT-4o', temperature: 0.7, topP: 1.0, contextLength: 128000, maxTokens: 4096, streaming: true, reasoningMode: false, visionMode: true, functionCalling: true },
      { modelId: 'claude-3-5-sonnet', providerId: 'anthropic', displayName: 'Claude 3.5 Sonnet', temperature: 0.5, topP: 1.0, contextLength: 200000, maxTokens: 8192, streaming: true, reasoningMode: true, visionMode: true, functionCalling: true },
      { modelId: 'gemini-1.5-pro', providerId: 'gemini', displayName: 'Google Gemini 1.5 Pro', temperature: 0.4, topP: 0.95, contextLength: 1000000, maxTokens: 8192, streaming: true, reasoningMode: false, visionMode: true, functionCalling: true },
      { modelId: 'deepseek-coder', providerId: 'deepseek', displayName: 'DeepSeek Coder V2.5', temperature: 0.2, topP: 0.9, contextLength: 64000, maxTokens: 4096, streaming: true, reasoningMode: true, visionMode: false, functionCalling: true },
      { modelId: 'llama-3.3-70b', providerId: 'groq', displayName: 'Groq Llama 3.3 70B', temperature: 0.6, topP: 0.9, contextLength: 128000, maxTokens: 4096, streaming: true, reasoningMode: false, visionMode: false, functionCalling: true },
      { modelId: 'qwen-2.5-coder', providerId: 'ollama', displayName: 'Ollama Qwen 2.5 Coder (Local)', temperature: 0.3, topP: 0.9, contextLength: 32000, maxTokens: 2048, streaming: true, reasoningMode: false, visionMode: false, functionCalling: true },
    ];

    defaults.forEach((cfg) => this.configMap.set(cfg.modelId, cfg));
  }

  public getActiveModel(): ModelConfig {
    return this.configMap.get(this.activeModelId) || Array.from(this.configMap.values())[0];
  }

  public getActiveProviderId(): string {
    return this.activeProviderId;
  }

  public setActiveModel(modelId: string, providerId: string): void {
    this.activeModelId = modelId;
    this.activeProviderId = providerId;
  }

  public getAllModels(): ModelConfig[] {
    return Array.from(this.configMap.values());
  }

  public updateModelConfig(modelId: string, updates: Partial<ModelConfig>): void {
    const existing = this.configMap.get(modelId);
    if (existing) {
      this.configMap.set(modelId, { ...existing, ...updates });
    }
  }
}

export const aiModelManager = new AIModelManager();
