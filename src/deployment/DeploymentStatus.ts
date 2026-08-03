export type DeploymentState =
  | 'idle'
  | 'queued'
  | 'building'
  | 'packaging'
  | 'containerizing'
  | 'uploading'
  | 'deploying'
  | 'verifying'
  | 'success'
  | 'failed'
  | 'cancelled'
  | 'rolling_back';

export interface DeploymentStatus {
  id: string;
  state: DeploymentState;
  provider: string;
  targetEnvironment: 'development' | 'testing' | 'staging' | 'production' | 'preview';
  startedAt: string;
  completedAt?: string;
  durationMs: number;
  commitHash?: string;
  commitMessage?: string;
  deploymentUrl?: string;
  error?: string;
}
