export interface UserProductivityMetrics {
  designTimeMinutes: number;
  codingTimeMinutes: number;
  buildsCompleted: number;
  deploymentsExecuted: number;
  aiPromptsExecuted: number;
  productivityScore: number;
}

export class UserAnalyticsEngine {
  private metrics: UserProductivityMetrics = {
    designTimeMinutes: 145,
    codingTimeMinutes: 210,
    buildsCompleted: 18,
    deploymentsExecuted: 5,
    aiPromptsExecuted: 42,
    productivityScore: 98,
  };

  public getMetrics(): UserProductivityMetrics {
    return { ...this.metrics };
  }
}

export const userAnalyticsEngine = new UserAnalyticsEngine();
