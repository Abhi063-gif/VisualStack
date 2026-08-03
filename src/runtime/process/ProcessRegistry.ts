import type { ProcessInfo } from './ProcessRunner';

export class ProcessRegistry {
  private processes: Map<number, ProcessInfo> = new Map();

  public register(proc: ProcessInfo): void {
    this.processes.set(proc.pid, proc);
  }

  public get(pid: number): ProcessInfo | undefined {
    return this.processes.get(pid);
  }

  public getAll(): ProcessInfo[] {
    return Array.from(this.processes.values());
  }

  public unregister(pid: number): void {
    this.processes.delete(pid);
  }
}

export const processRegistry = new ProcessRegistry();
