import type { RuntimeSession } from './RuntimeSession';
import { defaultRuntimeConfig, type RuntimeConfiguration } from './RuntimeConfiguration';
import { runtimeEngine } from './RuntimeEngine';

export class RuntimeManager {
  private activeSession: RuntimeSession | null = null;
  private config: RuntimeConfiguration = { ...defaultRuntimeConfig };

  constructor() {
    this.initDefaultSession();
  }

  private initDefaultSession(): void {
    this.activeSession = {
      id: 'session_default',
      projectId: 'visualstack_demo',
      status: {
        state: 'running',
        port: 3000,
        processId: 4821,
        startedAt: new Date().toISOString(),
        uptimeSeconds: 120,
        cpuPercent: 1.8,
        memoryMb: 76.2,
        targetFramework: 'React 19 + Express',
      },
      logs: [
        {
          timestamp: new Date().toLocaleTimeString(),
          level: 'info',
          message: '[VisualStack Runtime] Server running at http://localhost:3000',
        },
      ],
    };
  }

  public getActiveSession(): RuntimeSession | null {
    return this.activeSession;
  }

  public async startSession(targetFramework: string = 'React 19 + Express', port: number = 3000): Promise<RuntimeSession> {
    if (!this.activeSession) {
      this.activeSession = {
        id: `session_${Date.now()}`,
        projectId: 'project_current',
        status: {
          state: 'stopped',
          port,
          uptimeSeconds: 0,
          cpuPercent: 0,
          memoryMb: 0,
          targetFramework,
        },
        logs: [],
      };
    }

    this.activeSession.status.targetFramework = targetFramework;
    this.activeSession.status.port = port;
    this.config.port = port;

    await runtimeEngine.start(this.activeSession, this.config);
    return this.activeSession;
  }

  public async stopSession(): Promise<void> {
    if (this.activeSession) {
      await runtimeEngine.stop(this.activeSession);
    }
  }

  public async restartSession(): Promise<void> {
    if (this.activeSession) {
      await runtimeEngine.restart(this.activeSession, this.config);
    }
  }
}

export const runtimeManager = new RuntimeManager();
