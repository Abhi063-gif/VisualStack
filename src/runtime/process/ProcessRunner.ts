export interface ProcessInfo {
  pid: number;
  name: string;
  command: string;
  status: 'running' | 'stopped' | 'failed';
  cpuPercent: number;
  memoryMb: number;
  startedAt: string;
}

export class ProcessRunner {
  public spawn(name: string, command: string): ProcessInfo {
    return {
      pid: Math.floor(1000 + Math.random() * 9000),
      name,
      command,
      status: 'running',
      cpuPercent: +(Math.random() * 3).toFixed(1),
      memoryMb: +(40 + Math.random() * 60).toFixed(1),
      startedAt: new Date().toISOString(),
    };
  }

  public kill(proc: ProcessInfo): void {
    proc.status = 'stopped';
    proc.cpuPercent = 0;
    proc.memoryMb = 0;
  }
}

export const processRunner = new ProcessRunner();
