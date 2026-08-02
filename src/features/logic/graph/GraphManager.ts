import { LogicGraph } from './LogicGraph';
import { LogicNode } from './LogicNode';
import { LogicEdge } from './LogicEdge';
import type { NodeCategory } from './LogicNode';
import type { LogicPort } from '../connections/Port';
import { eventBus } from '../../../core/events/EventBus';
import { SystemEventType } from '../../../core/events/EventTypes';
import { connectionManager } from '../connections/ConnectionManager';

let _instance: GraphManager | null = null;

export class GraphManager {
  private graph: LogicGraph;

  private constructor() {
    this.graph = new LogicGraph('main-graph', 'Main Logic Graph');
  }

  public static getInstance(): GraphManager {
    if (!_instance) _instance = new GraphManager();
    return _instance;
  }

  public getGraph(): LogicGraph {
    return this.graph;
  }

  public createNode(
    id: string,
    type: string,
    category: NodeCategory,
    name: string,
    description: string,
    inputs: LogicPort[],
    outputs: LogicPort[],
    position: { x: number; y: number },
    config: Record<string, unknown> = {},
    icon = 'code',
    color = '#6366f1'
  ): LogicNode {
    const node = new LogicNode({
      id,
      type,
      category,
      name,
      description,
      inputs,
      outputs,
      position,
      config,
      icon,
      color,
    });
    this.graph.addNode(node);
    for (const input of inputs) connectionManager.registerPort(id, input);
    for (const output of outputs) connectionManager.registerPort(id, output);
    eventBus.emit(SystemEventType.LOGIC_NODE_CREATED, { nodeId: id, type });
    return node;
  }

  public deleteNode(nodeId: string): void {
    this.graph.removeNode(nodeId);
    connectionManager.unregisterNodePorts(nodeId);
    eventBus.emit(SystemEventType.LOGIC_NODE_DELETED, { nodeId });
  }

  public createEdge(
    id: string,
    sourceNodeId: string,
    sourcePortId: string,
    targetNodeId: string,
    targetPortId: string,
    type: 'execution' | 'data',
    dataType?: import('../connections/Port').DataType
  ): LogicEdge {
    const edge = new LogicEdge({ id, sourceNodeId, sourcePortId, targetNodeId, targetPortId, type, dataType });
    this.graph.addEdge(edge);
    eventBus.emit(SystemEventType.LOGIC_CONNECTION_CREATED, {
      connectionId: id,
      source: sourceNodeId,
      target: targetNodeId,
    });
    return edge;
  }

  public connectPorts(
    id: string,
    sourceNodeId: string,
    sourcePortId: string,
    targetNodeId: string,
    targetPortId: string,
    type: 'execution' | 'data' = 'execution',
    dataType?: import('../connections/Port').DataType
  ): LogicEdge {
    return this.createEdge(id, sourceNodeId, sourcePortId, targetNodeId, targetPortId, type, dataType);
  }

  public deleteEdge(edgeId: string): void {
    this.graph.removeEdge(edgeId);
    eventBus.emit(SystemEventType.LOGIC_CONNECTION_REMOVED, { connectionId: edgeId });
  }

  public getNode(nodeId: string): LogicNode | undefined {
    return this.graph.getNode(nodeId);
  }

  public getAllNodes(): LogicNode[] {
    return this.graph.getAllNodes();
  }

  public getAllEdges(): LogicEdge[] {
    return this.graph.getAllEdges();
  }

  public reset(): void {
    this.graph.clear();
  }

  public serialize(): string {
    return JSON.stringify(this.graph.toJSON(), null, 2);
  }

  public deserialize(json: string): void {
    const data = JSON.parse(json);
    this.graph.fromJSON(data);
  }
}

export const graphManager = GraphManager.getInstance();
