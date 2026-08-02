import { LogicNode, type LogicNodeData } from './LogicNode';
import { LogicEdge, type LogicEdgeData } from './LogicEdge';

export class LogicGraph {
  public id: string;
  public name: string;
  private nodes: Map<string, LogicNode> = new Map();
  private edges: Map<string, LogicEdge> = new Map();

  constructor(id = 'default-graph', name = 'Main Logic Graph') {
    this.id = id;
    this.name = name;
  }

  public addNode(node: LogicNode): void {
    this.nodes.set(node.id, node);
  }

  public removeNode(nodeId: string): LogicNode | undefined {
    const node = this.nodes.get(nodeId);
    if (node) {
      this.nodes.delete(nodeId);
      // Remove connected edges
      const connectedEdges = this.getEdgesForNode(nodeId);
      for (const edge of connectedEdges) {
        this.edges.delete(edge.id);
      }
    }
    return node;
  }

  public getNode(nodeId: string): LogicNode | undefined {
    return this.nodes.get(nodeId);
  }

  public getAllNodes(): LogicNode[] {
    return Array.from(this.nodes.values());
  }

  public addEdge(edge: LogicEdge): void {
    this.edges.set(edge.id, edge);
  }

  public removeEdge(edgeId: string): LogicEdge | undefined {
    const edge = this.edges.get(edgeId);
    if (edge) {
      this.edges.delete(edgeId);
    }
    return edge;
  }

  public getEdge(edgeId: string): LogicEdge | undefined {
    return this.edges.get(edgeId);
  }

  public getAllEdges(): LogicEdge[] {
    return Array.from(this.edges.values());
  }

  public getEdgesForNode(nodeId: string): LogicEdge[] {
    return this.getAllEdges().filter(
      (e) => e.sourceNodeId === nodeId || e.targetNodeId === nodeId
    );
  }

  public getOutgoingExecutionEdges(nodeId: string, portId?: string): LogicEdge[] {
    return this.getAllEdges().filter(
      (e) =>
        e.sourceNodeId === nodeId &&
        e.type === 'execution' &&
        (!portId || e.sourcePortId === portId)
    );
  }

  public getIncomingDataEdges(nodeId: string, portId?: string): LogicEdge[] {
    return this.getAllEdges().filter(
      (e) =>
        e.targetNodeId === nodeId &&
        e.type === 'data' &&
        (!portId || e.targetPortId === portId)
    );
  }

  public clear(): void {
    this.nodes.clear();
    this.edges.clear();
  }

  public topologicalSort(): LogicNode[] {
    const visited = new Set<string>();
    const sorted: LogicNode[] = [];

    const visit = (nodeId: string) => {
      if (visited.has(nodeId)) return;
      visited.add(nodeId);

      const outgoing = this.getAllEdges().filter((e) => e.sourceNodeId === nodeId);
      for (const edge of outgoing) {
        visit(edge.targetNodeId);
      }

      const node = this.getNode(nodeId);
      if (node) sorted.unshift(node);
    };

    const entryNodes = this.getAllNodes().filter((n) => n.category === 'Events');
    const startNodes = entryNodes.length > 0 ? entryNodes : this.getAllNodes();

    for (const node of startNodes) {
      visit(node.id);
    }

    return sorted;
  }

  public toJSON(): { id: string; name: string; nodes: LogicNodeData[]; edges: LogicEdgeData[] } {
    return {
      id: this.id,
      name: this.name,
      nodes: this.getAllNodes().map((n) => n.toJSON()),
      edges: this.getAllEdges().map((e) => e.toJSON()),
    };
  }

  public fromJSON(json: { id: string; name: string; nodes: LogicNodeData[]; edges: LogicEdgeData[] }): void {
    this.id = json.id || this.id;
    this.name = json.name || this.name;
    this.clear();
    for (const n of json.nodes || []) {
      this.addNode(LogicNode.fromJSON(n));
    }
    for (const e of json.edges || []) {
      this.addEdge(LogicEdge.fromJSON(e));
    }
  }
}
