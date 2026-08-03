export interface EnvironmentIR {
  key: string;
  value: string;
  isSecret: boolean;
  targetEnv: 'development' | 'staging' | 'production' | 'all';
}
