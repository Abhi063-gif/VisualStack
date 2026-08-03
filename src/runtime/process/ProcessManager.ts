import { processRunner, type ProcessInfo } from './ProcessRunner';
import { processRegistry } from './ProcessRegistry';

export class ProcessManager {
  public spawnProcess(name: string, command: string): ProcessInfo {
    const proc = processRunner.spawn(name, command);
    processRegistry.register(proc);
    return proc;
  }

  public killProcess(pid: number): void {
    const proc = processRegistry.get(pid);
    if (proc) {
      processRunner.kill(proc);
    }
  }

  public listProcesses(): ProcessInfo[] {
    return processRegistry.getAll();
  }
}

export const processManager = new ProcessManager();
