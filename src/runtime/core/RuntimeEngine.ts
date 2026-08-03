import type { RuntimeSession } from './RuntimeSession';
import type { RuntimeConfiguration } from './RuntimeConfiguration';

export class RuntimeEngine {
  public async start(session: RuntimeSession, _config: RuntimeConfiguration): Promise<void> {
    session.status.state = 'starting';
    session.logs.push({
      timestamp: new Date().toLocaleTimeString(),
      level: 'info',
      message: `[RuntimeEngine] Starting development runtime session on port ${session.status.port}...`,
    });

    // Simulate startup phase
    await new Promise((resolve) => setTimeout(resolve, 300));

    session.status.state = 'running';
    session.status.processId = Math.floor(1000 + Math.random() * 9000);
    session.status.startedAt = new Date().toISOString();
    session.status.cpuPercent = 2.4;
    session.status.memoryMb = 84.5;

    session.logs.push({
      timestamp: new Date().toLocaleTimeString(),
      level: 'info',
      message: `[RuntimeEngine] Server ready! Local preview running at http://localhost:${session.status.port}`,
    });
  }

  public async stop(session: RuntimeSession): Promise<void> {
    session.status.state = 'terminating';
    session.logs.push({
      timestamp: new Date().toLocaleTimeString(),
      level: 'info',
      message: '[RuntimeEngine] Stopping runtime session...',
    });

    await new Promise((resolve) => setTimeout(resolve, 100));

    session.status.state = 'stopped';
    session.status.processId = undefined;
    session.logs.push({
      timestamp: new Date().toLocaleTimeString(),
      level: 'info',
      message: '[RuntimeEngine] Runtime process terminated cleanly.',
    });
  }

  public async restart(session: RuntimeSession, config: RuntimeConfiguration): Promise<void> {
    await this.stop(session);
    await this.start(session, config);
  }
}

export const runtimeEngine = new RuntimeEngine();
