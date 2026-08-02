import { variableManager } from './VariableManager';
import type { Variable } from './VariableManager';
import type { VariableType } from '../nodes/VariableNode';

/**
 * LocalVariables — manages short-lived variables with 'local' scope.
 * Used within a single function execution, loop body, or logic block.
 * Cleared automatically between executions.
 */
export class LocalVariables {
  private executionId: string = 'default';

  public beginExecution(executionId: string): void {
    this.executionId = executionId;
    // Clear any stale locals from the previous execution
    this.clear();
  }

  public define(name: string, type: VariableType, defaultValue: unknown = null): Variable {
    const scopedName = this.scopedName(name);
    return variableManager.create(scopedName, type, 'local', defaultValue);
  }

  public get(name: string): unknown {
    return variableManager.getValue(this.scopedName(name), 'local');
  }

  public set(name: string, value: unknown): boolean {
    return variableManager.setByName(this.scopedName(name), 'local', value);
  }

  public getOrDefault(name: string, fallback: unknown = null): unknown {
    const val = this.get(name);
    return val !== undefined ? val : fallback;
  }

  public exists(name: string): boolean {
    return variableManager.exists(this.scopedName(name), 'local');
  }

  public delete(name: string): boolean {
    return variableManager.deleteByName(this.scopedName(name), 'local');
  }

  public getAll(): Variable[] {
    return variableManager
      .getByScope('local')
      .filter((v) => v.name.startsWith(`${this.executionId}:`));
  }

  public clear(): void {
    const locals = this.getAll();
    for (const v of locals) variableManager.delete(v.id);
  }

  private scopedName(name: string): string {
    return `${this.executionId}:${name}`;
  }
}

export const localVariables = new LocalVariables();
