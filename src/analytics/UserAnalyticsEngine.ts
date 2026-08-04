export interface UserProductivityMetrics {
  sessionDurationMinutes: number;
  canvasMutationsCount: number;
  codeLinesGenerated: number;
  aiPromptsExecuted: number;
  activeRole: string;
  efficiencyScore: number;
}

export class UserAnalyticsEngine {
  private startTime: number = Date.now();
  private mutationsCount: number = 24;
  private promptsCount: number = 8;

  public getMetrics(): UserProductivityMetrics {
    const elapsedMinutes = Math.max(1, Math.floor((Date.now() - this.startTime) / 60000));
    return {
      sessionDurationMinutes: elapsedMinutes,
      canvasMutationsCount: this.mutationsCount,
      codeLinesGenerated: this.mutationsCount * 42,
      aiPromptsExecuted: this.promptsCount,
      activeRole: 'Owner & Fullstack Architect',
      efficiencyScore: 98,
    };
  }

  public trackMutation() {
    this.mutationsCount++;
  }

  public trackAiPrompt() {
    this.promptsCount++;
  }
}

export const userAnalyticsEngine = new UserAnalyticsEngine();
