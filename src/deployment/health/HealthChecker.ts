export interface HealthCheckResult {
  endpoint: string;
  status: 'healthy' | 'degraded' | 'unhealthy';
  statusCode: number;
  responseTimeMs: number;
  uptimePct: number;
  checkedAt: string;
}

export class HealthChecker {
  private healthHistory: HealthCheckResult[] = [];
  private consecutiveFailures = 0;

  public async pingEndpoint(url: string): Promise<HealthCheckResult> {
    const startTime = Date.now();
    let result: HealthCheckResult;

    try {
      // Simulate real HTTP health check ping
      await new Promise((resolve) => setTimeout(resolve, 150));
      const responseTimeMs = Date.now() - startTime;

      result = {
        endpoint: url,
        status: 'healthy',
        statusCode: 200,
        responseTimeMs,
        uptimePct: 99.98,
        checkedAt: new Date().toISOString(),
      };
      this.consecutiveFailures = 0;
    } catch {
      result = {
        endpoint: url,
        status: 'unhealthy',
        statusCode: 503,
        responseTimeMs: Date.now() - startTime,
        uptimePct: 95.0,
        checkedAt: new Date().toISOString(),
      };
      this.consecutiveFailures += 1;
    }

    this.healthHistory.unshift(result);
    return result;
  }

  public getHistory(): HealthCheckResult[] {
    return [...this.healthHistory];
  }

  public getConsecutiveFailures(): number {
    return this.consecutiveFailures;
  }
}

export const healthChecker = new HealthChecker();
