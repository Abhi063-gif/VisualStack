import { graphManager } from '../graph/GraphManager';
import type { LogicGraph } from '../graph/LogicGraph';
import type { LogicNode } from '../graph/LogicNode';
import { RuntimeContext } from './RuntimeContext';
import { ExecutionQueue } from './ExecutionQueue';
import { LogicExecutor } from './LogicExecutor';
import { eventBus } from '../../../core/events/EventBus';
import { SystemEventType } from '../../../core/events/EventTypes';
import { useLogicStore } from '../../../stores/LogicStore';

export interface ExecutionReport {
  executionId: string;
  durationMs: number;
  visitedNodesCount: number;
  logs: { level: 'info' | 'warn' | 'error'; message: string; timestamp: string }[];
  aborted: boolean;
}

export class ExecutionEngine {
  private customGraph?: LogicGraph;

  constructor(graph?: LogicGraph) {
    this.customGraph = graph;
  }

  public setGraph(graph: LogicGraph): void {
    this.customGraph = graph;
  }

  public getGraph(): LogicGraph {
    return this.customGraph ?? graphManager.getGraph();
  }

  /**
   * Triggers execution starting from all Event nodes matching an eventName, or all Event nodes if not specified.
   */
  public async triggerEvent(eventName?: string, payload?: unknown): Promise<ExecutionReport> {
    const targetGraph = this.getGraph();
    const allNodes = targetGraph.getAllNodes();

    let entryNodes = allNodes.filter((n) => n.category === 'Events');
    if (eventName) {
      entryNodes = entryNodes.filter((n) => n.config?.eventName === eventName);
    }

    if (entryNodes.length === 0) {
      console.warn(`[ExecutionEngine] No matching event entry nodes found for event: "${eventName ?? 'any'}"`);
      return {
        executionId: `exec_none_${Date.now()}`,
        durationMs: 0,
        visitedNodesCount: 0,
        logs: [],
        aborted: false,
      };
    }

    const context = new RuntimeContext();
    if (payload !== undefined) {
      context.setVariable('eventPayload', payload, 'local');
    }

    return this.runFromNodes(entryNodes, context);
  }

  /**
   * Executes graph starting from a specific node ID or set of node IDs.
   */
  public async runGraph(startNodeId?: string): Promise<ExecutionReport> {
    const targetGraph = this.getGraph();
    let startNodes: LogicNode[] = [];

    if (startNodeId) {
      const node = targetGraph.getNode(startNodeId);
      if (node) startNodes = [node];
    }

    if (startNodes.length === 0) {
      const entryNodes = targetGraph.getAllNodes().filter((n) => n.category === 'Events');
      startNodes = entryNodes.length > 0 ? entryNodes : targetGraph.getAllNodes();
    }

    const context = new RuntimeContext();
    return this.runFromNodes(startNodes, context);
  }

  // ── Private Execution Loop ──────────────────────────────────────────────────

  private async runFromNodes(startNodes: LogicNode[], context: RuntimeContext): Promise<ExecutionReport> {
    const targetGraph = this.getGraph();
    const queue = new ExecutionQueue(context);
    const executor = new LogicExecutor(targetGraph, context);
    const visitedNodes = new Set<string>();

    context.info(`🚀 Starting execution of ${startNodes.length} entry point(s)...`);
    const store = useLogicStore.getState();
    store.addExecutionLog('info', `🚀 Starting graph execution...`);

    // Enqueue initial start nodes
    for (const node of startNodes) {
      this.enqueueNode(node, queue, executor, context, visitedNodes);
    }

    // Drain the execution queue
    await queue.drain();

    const report: ExecutionReport = {
      executionId: context.executionId,
      durationMs: context.elapsed(),
      visitedNodesCount: visitedNodes.size,
      logs: [...context.logs],
      aborted: context.aborted,
    };

    // Emit event bus notification
    eventBus.emit(SystemEventType.GRAPH_EXECUTED, {
      graphId: targetGraph.id,
      timestamp: new Date().toISOString(),
      executionId: report.executionId,
      durationMs: report.durationMs,
      nodesExecuted: report.visitedNodesCount,
      success: !report.aborted,
    });

    store.addExecutionLog(
      report.aborted ? 'error' : 'info',
      `🏁 ${context.summary()} — Visited ${visitedNodes.size} node(s)`
    );

    return report;
  }

  private enqueueNode(
    node: LogicNode,
    queue: ExecutionQueue,
    executor: LogicExecutor,
    context: RuntimeContext,
    visitedNodes: Set<string>
  ): void {
    queue.enqueue({
      nodeId: node.id,
      fn: async () => {
        visitedNodes.add(node.id);
        const result = await executor.execute(node);

        // Store output values in RuntimeContext for downstream data port consumers
        if (result.outputValues) {
          for (const [portId, value] of Object.entries(result.outputValues)) {
            context.setPortValue(node.id, portId, value);
          }
        }

        // If execution branch continues, follow outgoing execution edges
        if (result.nextPortId) {
          const targetGraph = this.getGraph();
          const nextEdges = targetGraph.getOutgoingExecutionEdges(node.id, result.nextPortId);
          for (const edge of nextEdges) {
            const targetNode = targetGraph.getNode(edge.targetNodeId);
            if (targetNode && !context.aborted) {
              this.enqueueNode(targetNode, queue, executor, context, visitedNodes);
            }
          }
        }
      },
    });
  }
}

export const executionEngine = new ExecutionEngine();
