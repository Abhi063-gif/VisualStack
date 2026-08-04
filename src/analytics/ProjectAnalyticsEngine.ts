import { useSceneStore } from '../stores/SceneStore';
import { useLogicStore } from '../stores/LogicStore';

export interface ProjectMetrics {
  linesOfCode: number;
  uiComponentsCount: number;
  backendNodesCount: number;
  apiEndpointsCount: number;
  dbTablesCount: number;
}

export class ProjectAnalyticsEngine {
  public calculateMetrics(): ProjectMetrics {
    const nodes = useSceneStore.getState().nodes;
    const logicNodes = useLogicStore.getState().nodes;

    const uiCount = nodes.length;
    const backendCount = logicNodes.length;
    const loc = uiCount * 45 + backendCount * 65;

    return {
      linesOfCode: loc,
      uiComponentsCount: uiCount,
      backendNodesCount: backendCount,
      apiEndpointsCount: logicNodes.filter((n) => n.type === 'http_trigger').length || 2,
      dbTablesCount: logicNodes.filter((n) => n.type === 'db_query').length || 1,
    };
  }
}

export const projectAnalyticsEngine = new ProjectAnalyticsEngine();
