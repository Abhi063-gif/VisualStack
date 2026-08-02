import type { DataType, PortType } from '../connections/Port';

export interface LogicEdgeData {
  id: string;
  sourceNodeId: string;
  sourcePortId: string;
  targetNodeId: string;
  targetPortId: string;
  type: PortType;
  dataType?: DataType;
}

export class LogicEdge {
  public id: string;
  public sourceNodeId: string;
  public sourcePortId: string;
  public targetNodeId: string;
  public targetPortId: string;
  public type: PortType;
  public dataType?: DataType;

  constructor(data: LogicEdgeData) {
    this.id = data.id;
    this.sourceNodeId = data.sourceNodeId;
    this.sourcePortId = data.sourcePortId;
    this.targetNodeId = data.targetNodeId;
    this.targetPortId = data.targetPortId;
    this.type = data.type;
    this.dataType = data.dataType;
  }

  public toJSON(): LogicEdgeData {
    return {
      id: this.id,
      sourceNodeId: this.sourceNodeId,
      sourcePortId: this.sourcePortId,
      targetNodeId: this.targetNodeId,
      targetPortId: this.targetPortId,
      type: this.type,
      dataType: this.dataType,
    };
  }

  public static fromJSON(data: LogicEdgeData): LogicEdge {
    return new LogicEdge(data);
  }
}
