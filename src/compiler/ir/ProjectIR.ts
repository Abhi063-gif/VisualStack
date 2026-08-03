import type { ScreenIR } from './ScreenIR';
import type { DatabaseIR } from './DatabaseIR';
import type { AuthenticationIR } from './AuthenticationIR';
import type { StorageIR } from './StorageIR';
import type { ApiIR } from './ApiIR';
import type { EnvironmentIR } from './EnvironmentIR';
import type { VariableIR } from './VariableIR';
import type { ThemeIR } from './ThemeIR';

export interface ProjectMetadataIR {
  id: string;
  name: string;
  version: string;
  targetFramework: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProjectIR {
  metadata: ProjectMetadataIR;
  theme: ThemeIR;
  screens: ScreenIR[];
  globalVariables: VariableIR[];
  databases: DatabaseIR[];
  authServices: AuthenticationIR[];
  storageBuckets: StorageIR[];
  externalApis: ApiIR[];
  environment: EnvironmentIR[];
}
