import type { IService } from '../core/container/ServiceContainer';

export class LoggerService implements IService {
  public name = 'LoggerService';

  public info(message: string, ...args: any[]): void {
    console.info(`[INFO] ${message}`, ...args);
  }

  public warn(message: string, ...args: any[]): void {
    console.warn(`[WARN] ${message}`, ...args);
  }

  public error(message: string, error?: any): void {
    console.error(`[ERROR] ${message}`, error ?? '');
  }

  public debug(message: string, ...args: any[]): void {
    console.debug(`[DEBUG] ${message}`, ...args);
  }
}

export const loggerService = new LoggerService();
