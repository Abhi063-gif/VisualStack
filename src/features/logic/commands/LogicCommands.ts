import { BaseCommand } from '../../../core/commands/Command';
import { graphManager } from '../graph/GraphManager';
import { LogicNode } from '../graph/LogicNode';
import { LogicEdge } from '../graph/LogicEdge';
import type { NodeCategory } from '../graph/LogicNode';
import type { LogicPort, DataType } from '../connections/Port';

// ── Create Logic Node Command ───────────────────────────────────────────────
export class CreateLogicNodeCommand extends BaseCommand {
  private node: LogicNode;

  constructor(
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
  ) {
    super(`Create node: ${name}`);
    this.node = new LogicNode({
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
  }

  public execute(): void {
    graphManager.getGraph().addNode(this.node);
  }

  public undo(): void {
    graphManager.deleteNode(this.node.id);
  }
}

// ── Delete Logic Node Command ───────────────────────────────────────────────
export class DeleteLogicNodeCommand extends BaseCommand {
  private nodeId: string;
  private deletedNode: LogicNode | null = null;
  private deletedEdges: LogicEdge[] = [];

  constructor(nodeId: string) {
    super(`Delete node: ${nodeId}`);
    this.nodeId = nodeId;
  }

  public execute(): void {
    const node = graphManager.getNode(this.nodeId);
    if (node) {
      this.deletedNode = node;
      this.deletedEdges = graphManager.getGraph().getEdgesForNode(this.nodeId);
    }
    graphManager.deleteNode(this.nodeId);
  }

  public undo(): void {
    if (this.deletedNode) {
      graphManager.getGraph().addNode(this.deletedNode);
      for (const edge of this.deletedEdges) {
        graphManager.getGraph().addEdge(edge);
      }
    }
  }
}

// ── Connect Logic Ports Command ─────────────────────────────────────────────
export class ConnectLogicPortsCommand extends BaseCommand {
  private edge: LogicEdge;

  constructor(
    id: string,
    sourceNodeId: string,
    sourcePortId: string,
    targetNodeId: string,
    targetPortId: string,
    type: 'execution' | 'data' = 'execution',
    dataType?: DataType
  ) {
    super(`Connect: ${sourceNodeId}.${sourcePortId} → ${targetNodeId}.${targetPortId}`);
    this.edge = new LogicEdge({
      id,
      sourceNodeId,
      sourcePortId,
      targetNodeId,
      targetPortId,
      type,
      dataType,
    });
  }

  public execute(): void {
    graphManager.getGraph().addEdge(this.edge);
  }

  public undo(): void {
    graphManager.deleteEdge(this.edge.id);
  }
}

// ── Disconnect Logic Ports Command ──────────────────────────────────────────
export class DisconnectLogicPortsCommand extends BaseCommand {
  private edgeId: string;
  private deletedEdge: LogicEdge | null = null;

  constructor(edgeId: string) {
    super(`Disconnect edge: ${edgeId}`);
    this.edgeId = edgeId;
  }

  public execute(): void {
    this.deletedEdge = graphManager.getGraph().getEdge(this.edgeId) ?? null;
    graphManager.deleteEdge(this.edgeId);
  }

  public undo(): void {
    if (this.deletedEdge) {
      graphManager.getGraph().addEdge(this.deletedEdge);
    }
  }
}

// ── Move Logic Node Command ─────────────────────────────────────────────────
export class MoveLogicNodeCommand extends BaseCommand {
  private nodeId: string;
  private oldPosition: { x: number; y: number };
  private newPosition: { x: number; y: number };

  constructor(nodeId: string, oldPos: { x: number; y: number }, newPos: { x: number; y: number }) {
    super(`Move node: ${nodeId}`);
    this.nodeId = nodeId;
    this.oldPosition = { ...oldPos };
    this.newPosition = { ...newPos };
  }

  public execute(): void {
    const node = graphManager.getNode(this.nodeId);
    if (node) node.position = { ...this.newPosition };
  }

  public undo(): void {
    const node = graphManager.getNode(this.nodeId);
    if (node) node.position = { ...this.oldPosition };
  }
}

// ── Rename Logic Node Command ───────────────────────────────────────────────
export class RenameLogicNodeCommand extends BaseCommand {
  private nodeId: string;
  private oldName: string;
  private newName: string;

  constructor(nodeId: string, oldName: string, newName: string) {
    super(`Rename node: ${oldName} → ${newName}`);
    this.nodeId = nodeId;
    this.oldName = oldName;
    this.newName = newName;
  }

  public execute(): void {
    const node = graphManager.getNode(this.nodeId);
    if (node) node.name = this.newName;
  }

  public undo(): void {
    const node = graphManager.getNode(this.nodeId);
    if (node) node.name = this.oldName;
  }
}
