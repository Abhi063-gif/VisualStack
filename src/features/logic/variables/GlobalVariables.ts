import { variableManager } from './VariableManager';
import type { Variable } from './VariableManager';
import type { VariableType } from '../nodes/VariableNode';

/**
 * GlobalVariables — manages variables with 'global' scope.
 * These persist for the entire application lifetime.
 */
export class GlobalVariables {
  public define(name: string, type: VariableType, defaultValue: unknown = null, description?: string): Variable {
    return variableManager.create(name, type, 'global', defaultValue, description);
  }

  public get(name: string): unknown {
    return variableManager.getValue(name, 'global');
  }

  public set(name: string, value: unknown): boolean {
    return variableManager.setByName(name, 'global', value);
  }

  public delete(name: string): boolean {
    return variableManager.deleteByName(name, 'global');
  }

  public exists(name: string): boolean {
    return variableManager.exists(name, 'global');
  }

  public getAll(): Variable[] {
    return variableManager.getByScope('global');
  }

  public clear(): void {
    variableManager.clearScope('global');
  }

  public toJSON(): Variable[] {
    return this.getAll().map((v) => ({ ...v }));
  }
}

export const globalVariables = new GlobalVariables();
