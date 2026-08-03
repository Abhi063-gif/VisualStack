import type { GeneratedFile } from '../CompilerContext';

export interface GeneratorOutput {
  targetFramework: string;
  files: GeneratedFile[];
  summary: {
    totalFiles: number;
    frontendPages: number;
    backendControllers: number;
    databaseModels: number;
  };
}
