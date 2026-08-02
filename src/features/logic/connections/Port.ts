export type PortType = 'execution' | 'data';

export type DataType =
  | 'boolean'
  | 'number'
  | 'string'
  | 'array'
  | 'object'
  | 'any'
  | 'execution';

export type PortDirection = 'input' | 'output';

export interface LogicPort {
  id: string;
  name: string;
  type: PortType;
  dataType: DataType;
  direction: PortDirection;
  color?: string;
  description?: string;
  defaultValue?: unknown;
  allowMultipleConnections?: boolean;
}

export function getPortColor(dataType: DataType, type: PortType): string {
  if (type === 'execution') return '#ffffff';
  switch (dataType) {
    case 'boolean':
      return '#ef4444'; // Red
    case 'number':
      return '#3b82f6'; // Blue
    case 'string':
      return '#10b981'; // Green
    case 'array':
      return '#a855f7'; // Purple
    case 'object':
      return '#f59e0b'; // Orange
    case 'any':
      return '#94a3b8'; // Slate
    default:
      return '#ffffff';
  }
}
