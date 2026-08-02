import { screenManager } from '../screens/ScreenManager';
import { databaseManager } from '../resources/DatabaseManager';
import { authManager } from '../resources/AuthManager';
import { storageManager } from '../resources/StorageManager';
import { apiManager } from '../resources/APIManager';
import { environmentManager } from '../resources/EnvironmentManager';

export interface UnifiedProjectIR {
  metadata: {
    projectId: string;
    version: string;
    exportTimestamp: string;
    targetFramework: 'React + Node.js / Express + Vite';
  };
  screens: ReturnType<typeof screenManager.getAllScreens>;
  resources: {
    databases: ReturnType<typeof databaseManager.getAllConnections>;
    auth: ReturnType<typeof authManager.getAll>;
    storage: ReturnType<typeof storageManager.getAll>;
    apis: ReturnType<typeof apiManager.getAll>;
    environment: ReturnType<typeof environmentManager.getAll>;
  };
}

export class ProjectModelExporter {
  public exportUnifiedIR(): UnifiedProjectIR {
    return {
      metadata: {
        projectId: 'project_visualstack_studio',
        version: '1.0.0',
        exportTimestamp: new Date().toISOString(),
        targetFramework: 'React + Node.js / Express + Vite',
      },
      screens: screenManager.getAllScreens(),
      resources: {
        databases: databaseManager.getAllConnections(),
        auth: authManager.getAll(),
        storage: storageManager.getAll(),
        apis: apiManager.getAll(),
        environment: environmentManager.getAll(),
      },
    };
  }

  public exportJSONString(): string {
    return JSON.stringify(this.exportUnifiedIR(), null, 2);
  }
}

export const projectModelExporter = new ProjectModelExporter();
