export interface UsageRecord {
  id: string;
  providerId: string;
  model: string;
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
  costUsd: number;
  latencyMs: number;
  timestamp: string;
}

export interface AnalyticsSummary {
  totalRequests: number;
  totalTokens: number;
  totalCostUsd: number;
  avgLatencyMs: number;
}

export class ModelUsageAnalytics {
  private records: UsageRecord[] = [];

  public recordUsage(providerId: string, model: string, promptTokens: number, completionTokens: number, latencyMs: number): UsageRecord {
    const totalTokens = promptTokens + completionTokens;
    // Estimate cost based on standard rate ($0.003 / 1k tokens)
    const costUsd = (totalTokens / 1000) * 0.003;

    const record: UsageRecord = {
      id: `usg_${Date.now().toString(36)}`,
      providerId,
      model,
      promptTokens,
      completionTokens,
      totalTokens,
      costUsd,
      latencyMs,
      timestamp: new Date().toISOString(),
    };

    this.records.unshift(record);
    return record;
  }

  public getSummary(): AnalyticsSummary {
    if (this.records.length === 0) {
      return { totalRequests: 0, totalTokens: 0, totalCostUsd: 0, avgLatencyMs: 0 };
    }

    const totalTokens = this.records.reduce((acc, r) => acc + r.totalTokens, 0);
    const totalCostUsd = this.records.reduce((acc, r) => acc + r.costUsd, 0);
    const totalLatency = this.records.reduce((acc, r) => acc + r.latencyMs, 0);

    return {
      totalRequests: this.records.length,
      totalTokens,
      totalCostUsd,
      avgLatencyMs: Math.round(totalLatency / this.records.length),
    };
  }

  public getHistory(): UsageRecord[] {
    return [...this.records];
  }
}

export const modelUsageAnalytics = new ModelUsageAnalytics();
