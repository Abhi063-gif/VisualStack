export type AIProvider = 'openai' | 'anthropic' | 'gemini' | 'ollama';

export interface AIConfig {
  activeProvider: AIProvider;
  openaiKey: string;
  anthropicKey: string;
  geminiKey: string;
  ollamaHost: string;
  temperature: number;
}

export class AISettingsManager {
  private config: AIConfig = {
    activeProvider: 'openai',
    openaiKey: '',
    anthropicKey: '',
    geminiKey: '',
    ollamaHost: 'http://localhost:11434',
    temperature: 0.7,
  };

  private listeners: Set<(config: AIConfig) => void> = new Set();

  constructor() {
    this.loadFromStorage();
  }

  private loadFromStorage() {
    try {
      const saved = localStorage.getItem('visualstack_ai_config');
      if (saved) {
        this.config = { ...this.config, ...JSON.parse(saved) };
      }
    } catch (e) {
      console.warn('Failed to parse visualstack_ai_config', e);
    }
  }

  public getConfig(): AIConfig {
    return { ...this.config };
  }

  public updateConfig(partial: Partial<AIConfig>): void {
    this.config = { ...this.config, ...partial };
    localStorage.setItem('visualstack_ai_config', JSON.stringify(this.config));
    this.listeners.forEach((fn) => fn(this.config));
  }

  public subscribe(fn: (config: AIConfig) => void): () => void {
    this.listeners.add(fn);
    return () => this.listeners.delete(fn);
  }

  public getActiveKey(): string {
    switch (this.config.activeProvider) {
      case 'openai':
        return this.config.openaiKey;
      case 'anthropic':
        return this.config.anthropicKey;
      case 'gemini':
        return this.config.geminiKey;
      case 'ollama':
        return this.config.ollamaHost;
      default:
        return '';
    }
  }
}

export const aiSettingsManager = new AISettingsManager();
