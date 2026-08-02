import { graphManager } from '../graph/GraphManager';
import { connectionManager } from '../connections/ConnectionManager';
import { eventDispatcher } from '../events/EventDispatcher';
import type { AppEventName } from '../events/EventRegistry';
import { eventBus } from '../../../core/events/EventBus';
import { SystemEventType } from '../../../core/events/EventTypes';

export class LogicService {
  // ── Graph Queries ───────────────────────────────────────────────────────────

  public getGraph() {
    return graphManager.getGraph();
  }

  public getAllNodes() {
    return graphManager.getAllNodes();
  }

  public getAllEdges() {
    return graphManager.getAllEdges();
  }

  public getNode(id: string) {
    return graphManager.getNode(id);
  }

  // ── Graph Serialization ─────────────────────────────────────────────────────

  public serialize(): string {
    return graphManager.serialize();
  }

  public deserialize(json: string): void {
    graphManager.deserialize(json);
  }

  // ── Connections ─────────────────────────────────────────────────────────────

  public connect(
    connectionId: string,
    sourceNodeId: string,
    sourcePortId: string,
    targetNodeId: string,
    targetPortId: string
  ): { success: boolean; reason?: string } {
    return connectionManager.tryConnect(
      connectionId,
      sourceNodeId,
      sourcePortId,
      targetNodeId,
      targetPortId
    );
  }

  public disconnect(connectionId: string): void {
    connectionManager.disconnect(connectionId);
  }

  // ── Event Dispatching ───────────────────────────────────────────────────────

  public triggerEvent(event: AppEventName, payload: Record<string, unknown> = {}): void {
    eventDispatcher.dispatch(event, payload);
  }

  // ── Graph Execution Lifecycle ────────────────────────────────────────────────

  public async runGraph(startNodeId?: string) {
    const { executionEngine } = await import('../execution/ExecutionEngine');
    return executionEngine.runGraph(startNodeId);
  }

  public async executeEvent(eventName: string, payload?: unknown) {
    const { executionEngine } = await import('../execution/ExecutionEngine');
    return executionEngine.triggerEvent(eventName, payload);
  }

  public notifyGraphExecuted(): void {
    eventBus.emit(SystemEventType.GRAPH_EXECUTED, {
      graphId: graphManager.getGraph().id,
      timestamp: new Date().toISOString(),
    });
  }

  // ── Reset ───────────────────────────────────────────────────────────────────

  public reset(): void {
    graphManager.reset();
  }
}

export const logicService = new LogicService();

// Dev global for browser console testing
if (typeof window !== 'undefined') {
  (window as unknown as Record<string, unknown>).visualstack = {
    graphManager,
    logicService,
    connectionManager,
    eventDispatcher,
    eventBus,
  };
}

