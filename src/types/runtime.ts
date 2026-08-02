export type ProcessStatus = 'idle' | 'starting' | 'running' | 'stopping' | 'error';

export interface LogEntry {
  id: string;
  timestamp: string;
  source: 'frontend' | 'backend' | 'compiler' | 'system';
  level: 'info' | 'warn' | 'error' | 'debug';
  message: string;
}

export interface RuntimeState {
  frontendStatus: ProcessStatus;
  backendStatus: ProcessStatus;
  frontendPort: number;
  backendPort: number;
  logs: LogEntry[];
}
