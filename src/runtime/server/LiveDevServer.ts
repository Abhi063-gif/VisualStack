import { hotReloadEngine } from './HotReloadEngine';

export interface DevServerConfig {
  framework: string;
  port: number;
  host: string;
  isAutoPort: boolean;
}

export class LiveDevServer {
  private isRunning: boolean = false;
  private currentPort: number = 3000;

  public async startServer(targetFramework: string = 'React 19 + Express', port: number = 3000): Promise<DevServerConfig> {
    this.currentPort = port;
    this.isRunning = true;

    hotReloadEngine.triggerReload(`http://localhost:${this.currentPort}`);

    return {
      framework: targetFramework,
      port: this.currentPort,
      host: 'localhost',
      isAutoPort: true,
    };
  }

  public stopServer(): void {
    this.isRunning = false;
  }

  public getStatus(): { isRunning: boolean; port: number; url: string } {
    return {
      isRunning: this.isRunning,
      port: this.currentPort,
      url: `http://localhost:${this.currentPort}`,
    };
  }
}

export const liveDevServer = new LiveDevServer();
