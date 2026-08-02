import type { LogicPort } from '../connections/Port';
import type { NodeCategory } from '../graph/LogicNode';

export interface NodeDefinition {
  type: string;
  category: NodeCategory;
  name: string;
  description: string;
  icon: string;
  color: string;
  inputs: Omit<LogicPort, 'direction'>[];
  outputs: Omit<LogicPort, 'direction'>[];
  defaultConfig: Record<string, unknown>;
  docs?: string;
}

export function buildInputPorts(defs: Omit<LogicPort, 'direction'>[]): LogicPort[] {
  return defs.map((d) => ({ ...d, direction: 'input' as const }));
}

export function buildOutputPorts(defs: Omit<LogicPort, 'direction'>[]): LogicPort[] {
  return defs.map((d) => ({ ...d, direction: 'output' as const }));
}
