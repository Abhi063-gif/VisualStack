export type RuntimeState = 'stopped' | 'starting' | 'running' | 'paused' | 'error' | 'terminating';

export interface RuntimeStatus {
  state: RuntimeState;
  port: number;
  processId?: number;
  startedAt?: string;
  uptimeSeconds: number;
  cpuPercent: number;
  memoryMb: number;
  targetFramework: string;
}
