import type { RuntimeStatus } from './RuntimeStatus';

export interface RuntimeSession {
  id: string;
  projectId: string;
  status: RuntimeStatus;
  logs: { timestamp: string; level: 'info' | 'warn' | 'error'; message: string }[];
}
