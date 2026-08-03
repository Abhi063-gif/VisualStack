import type { DeploymentStatus } from './DeploymentStatus';

export interface DeploymentLogEntry {
  timestamp: string;
  stage: string;
  level: 'info' | 'warn' | 'error';
  message: string;
}

export interface DeploymentSession {
  id: string;
  projectId: string;
  status: DeploymentStatus;
  logs: DeploymentLogEntry[];
}
