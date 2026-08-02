import { create } from 'zustand';
import type { Node, Edge } from '@xyflow/react';
import { graphManager } from '../features/logic/graph/GraphManager';
import { logicService } from '../features/logic/services/LogicService';
import { variableManager } from '../features/logic/variables/VariableManager';
import type { Variable } from '../features/logic/variables/VariableManager';

export interface LogicStoreState {
  nodes: Node[];
  edges: Edge[];
  selectedNodeId: string | null;
  executionLogs: { id: string; timestamp: string; level: 'info' | 'warn' | 'error'; message: string }[];
  variables: Variable[];

  setNodes: (nodes: Node[]) => void;
  setEdges: (edges: Edge[]) => void;
  setSelectedNodeId: (id: string | null) => void;
  addExecutionLog: (level: 'info' | 'warn' | 'error', message: string) => void;
  clearLogs: () => void;
  refreshVariables: () => void;
  syncFromGraph: () => void;
}

export const useLogicStore = create<LogicStoreState>((set) => ({
  nodes: [],
  edges: [],
  selectedNodeId: null,
  executionLogs: [],
  variables: [],

  setNodes: (nodes) => set({ nodes }),
  setEdges: (edges) => set({ edges }),
  setSelectedNodeId: (id) => set({ selectedNodeId: id }),

  addExecutionLog: (level, message) =>
    set((state) => ({
      executionLogs: [
        ...state.executionLogs,
        {
          id: `log_${Date.now()}`,
          timestamp: new Date().toISOString(),
          level,
          message,
        },
      ],
    })),

  clearLogs: () => set({ executionLogs: [] }),

  refreshVariables: () => set({ variables: variableManager.getAll() }),

  syncFromGraph: () => {
    const graphNodes = graphManager.getAllNodes();
    const graphEdges = graphManager.getAllEdges();

    const rfNodes: Node[] = graphNodes.map((n) => ({
      id: n.id,
      type: 'logicNode',
      position: n.position,
      data: {
        label: n.name,
        nodeType: n.type,
        category: n.category,
        description: n.description,
        icon: n.icon,
        color: n.color,
        inputs: n.inputs,
        outputs: n.outputs,
        config: n.config,
      },
    }));

    const rfEdges: Edge[] = graphEdges.map((e) => ({
      id: e.id,
      source: e.sourceNodeId,
      sourceHandle: e.sourcePortId,
      target: e.targetNodeId,
      targetHandle: e.targetPortId,
      type: 'logicEdge',
      data: { portType: e.type, dataType: e.dataType },
    }));

    set({ nodes: rfNodes, edges: rfEdges, variables: variableManager.getAll() });
  },
}));

// Helper: ensure service is alive and return log helper
export function initLogicStoreListeners() {
  const { addExecutionLog } = useLogicStore.getState();
  logicService;
  return addExecutionLog;
}
