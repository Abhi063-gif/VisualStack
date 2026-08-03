export interface RuntimeConfiguration {
  port: number;
  environmentVariables: Record<string, string>;
  command: string;
  args: string[];
  workingDirectory: string;
  autoRestartOnCrash: boolean;
}

export const defaultRuntimeConfig: RuntimeConfiguration = {
  port: 3000,
  environmentVariables: { NODE_ENV: 'development' },
  command: 'npm',
  args: ['run', 'dev'],
  workingDirectory: './',
  autoRestartOnCrash: true,
};
