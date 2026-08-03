export interface StageLog {
  stage: string;
  durationMs: number;
  message: string;
  timestamp: string;
}

export class CompilerLogger {
  private logs: StageLog[] = [];
  private currentStageTimer: number = 0;

  public startStage(_stageName: string): void {
    this.currentStageTimer = performance.now();
  }

  public endStage(stageName: string, message: string): StageLog {
    const durationMs = Math.round(performance.now() - this.currentStageTimer);
    const log: StageLog = {
      stage: stageName,
      durationMs,
      message,
      timestamp: new Date().toISOString(),
    };
    this.logs.push(log);
    return log;
  }

  public getLogs(): StageLog[] {
    return [...this.logs];
  }

  public clear(): void {
    this.logs = [];
  }
}
