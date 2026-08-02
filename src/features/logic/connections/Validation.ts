import type { LogicPort } from './Port';

export interface ValidationResult {
  valid: boolean;
  reason?: string;
}

export class ConnectionValidator {
  public static canConnectPorts(source: LogicPort, target: LogicPort): ValidationResult {
    if (source.direction !== 'output') {
      return { valid: false, reason: 'Source port must be an output port (right side)' };
    }
    if (target.direction !== 'input') {
      return { valid: false, reason: 'Target port must be an input port (left side)' };
    }

    if (source.type !== target.type) {
      return {
        valid: false,
        reason: `Cannot connect ${source.type} flow port to ${target.type} data port`,
      };
    }

    // Execution Flow Ports (white/red dots) connect to Execution Ports
    if (source.type === 'execution' && target.type === 'execution') {
      return { valid: true };
    }

    // Data Parameter Ports (colored dots) connect to all Data Ports with automatic type coercion
    if (source.type === 'data' && target.type === 'data') {
      return { valid: true };
    }

    return { valid: true };
  }
}
