import { screenManager } from '../screens/ScreenManager';
import { useLogicStore } from '../../stores/LogicStore';
import { databaseManager } from '../resources/DatabaseManager';

export interface StepSimulationResult {
  stepId: string;
  nodeId: string;
  nodeName: string;
  category: string;
  status: 'Success' | 'Failed';
  logs: string[];
}

export class RuntimeSimulatorEngine {
  public simulateComponentTrigger(componentId: string, eventType: string): StepSimulationResult[] {
    const activeScreen = screenManager.getActiveScreen();
    if (!activeScreen) return [];

    const results: StepSimulationResult[] = [];
    const store = useLogicStore.getState();

    store.addExecutionLog(
      'info',
      `[Runtime Simulator] Triggered event "${eventType}" on component "${componentId}" in screen "${activeScreen.name}".`
    );

    // Simulate step execution across nodes
    for (let i = 0; i < activeScreen.nodes.length; i++) {
      const node = activeScreen.nodes[i];
      const stepId = `sim_step_${Date.now()}_${i}`;
      const nodeName = String(node.data?.label || node.type || `Node_${node.id}`);
      const nodeType = String(node.type || 'logic');
      const category = String(node.data?.category || 'Logic');

      store.addExecutionStep({
        nodeId: node.id,
        nodeName,
        nodeType,
        category,
        status: 'Success',
      });

      results.push({
        stepId,
        nodeId: node.id,
        nodeName,
        category,
        status: 'Success',
        logs: [`Executed node ${nodeName} successfully.`],
      });
    }

    const dbs = databaseManager.getAllConnections();
    if (dbs.length > 0) {
      store.addExecutionLog(
        'info',
        `[Runtime Simulator] Connected to database "${dbs[0].name}" (${dbs[0].type}). Simulated query execution.`
      );
    }

    return results;
  }
}

export const runtimeSimulatorEngine = new RuntimeSimulatorEngine();
