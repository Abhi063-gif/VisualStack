import type { LogicPort } from '../connections/Port';

export type NodeCategory =
  | 'Events'
  | 'Logic'
  | 'Variables'
  | 'Math'
  | 'String'
  | 'Date'
  | 'API'
  | 'Database'
  | 'Auth'
  | 'E-Commerce'
  | 'Communication'
  | 'Navigation'
  | 'Storage'
  | 'Animation'
  | 'Functions'
  | 'Custom';

export interface LogicNodeData {
  id: string;
  type: string;
  category: NodeCategory;
  name: string;
  description: string;
  icon?: string;
  color?: string;
  position: { x: number; y: number };
  inputs: LogicPort[];
  outputs: LogicPort[];
  config: Record<string, unknown>;
  state?: Record<string, unknown>;
}

export class LogicNode {
  public id: string;
  public type: string;
  public category: NodeCategory;
  public name: string;
  public description: string;
  public icon: string;
  public color: string;
  public position: { x: number; y: number };
  public inputs: LogicPort[];
  public outputs: LogicPort[];
  public config: Record<string, unknown>;
  public state: Record<string, unknown>;

  constructor(data: Partial<LogicNodeData> & { id: string; type: string; category: NodeCategory }) {
    this.id = data.id;
    this.type = data.type;
    this.category = data.category;
    this.name = data.name || data.type;
    this.description = data.description || '';
    this.icon = data.icon || 'code';
    this.color = data.color || '#6366f1';
    this.position = data.position || { x: 0, y: 0 };
    this.inputs = data.inputs || [];
    this.outputs = data.outputs || [];
    this.config = data.config || {};
    this.state = data.state || {};
  }

  public toJSON(): LogicNodeData {
    return {
      id: this.id,
      type: this.type,
      category: this.category,
      name: this.name,
      description: this.description,
      icon: this.icon,
      color: this.color,
      position: { ...this.position },
      inputs: this.inputs.map((p) => ({ ...p })),
      outputs: this.outputs.map((p) => ({ ...p })),
      config: { ...this.config },
      state: { ...this.state },
    };
  }

  public static fromJSON(data: LogicNodeData): LogicNode {
    return new LogicNode(data);
  }
}
