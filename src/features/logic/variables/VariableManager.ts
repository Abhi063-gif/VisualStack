import type { VariableType, VariableScope } from '../nodes/VariableNode';
import { eventBus } from '../../../core/events/EventBus';
import { SystemEventType } from '../../../core/events/EventTypes';

export interface Variable {
  id: string;
  name: string;
  type: VariableType;
  scope: VariableScope;
  value: unknown;
  defaultValue: unknown;
  description?: string;
  readonly?: boolean;
  createdAt: number;
  updatedAt: number;
}

export type VariableChangeListener = (variable: Variable, oldValue: unknown) => void;

export class VariableManager {
  private variables: Map<string, Variable> = new Map();
  private listeners: Map<string, VariableChangeListener[]> = new Map();
  private globalListeners: VariableChangeListener[] = [];

  // ── CRUD ────────────────────────────────────────────────────────────────────

  public create(
    name: string,
    type: VariableType,
    scope: VariableScope,
    defaultValue: unknown = null,
    description?: string
  ): Variable {
    const existing = this.findByName(name, scope);
    if (existing) {
      console.warn(`[VariableManager] Variable "${name}" in scope "${scope}" already exists.`);
      return existing;
    }

    const id = `var_${scope}_${name}_${Date.now()}`;
    const variable: Variable = {
      id,
      name,
      type,
      scope,
      value: defaultValue,
      defaultValue,
      description,
      readonly: false,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    this.variables.set(id, variable);
    eventBus.emit(SystemEventType.VARIABLE_CHANGED, {
      name,
      value: defaultValue,
      scope,
    });
    return variable;
  }

  public get(id: string): Variable | undefined {
    return this.variables.get(id);
  }

  public getByName(name: string, scope: VariableScope): Variable | undefined {
    return this.findByName(name, scope);
  }

  public getValue(name: string, scope: VariableScope): unknown {
    return this.findByName(name, scope)?.value ?? undefined;
  }

  public set(id: string, value: unknown): boolean {
    const variable = this.variables.get(id);
    if (!variable) return false;
    if (variable.readonly) {
      console.warn(`[VariableManager] Variable "${variable.name}" is read-only.`);
      return false;
    }

    const oldValue = variable.value;
    variable.value = value;
    variable.updatedAt = Date.now();

    this.emit(variable, oldValue);
    eventBus.emit(SystemEventType.VARIABLE_CHANGED, {
      name: variable.name,
      value,
      scope: variable.scope,
    });
    return true;
  }

  public setByName(name: string, scope: VariableScope, value: unknown): boolean {
    const variable = this.findByName(name, scope);
    if (!variable) return false;
    return this.set(variable.id, value);
  }

  public update(id: string, updates: Partial<Pick<Variable, 'name' | 'description' | 'type' | 'defaultValue' | 'readonly'>>): boolean {
    const variable = this.variables.get(id);
    if (!variable) return false;
    Object.assign(variable, updates, { updatedAt: Date.now() });
    return true;
  }

  public rename(id: string, newName: string): boolean {
    const variable = this.variables.get(id);
    if (!variable) return false;
    variable.name = newName;
    variable.updatedAt = Date.now();
    return true;
  }

  public delete(id: string): boolean {
    return this.variables.delete(id);
  }

  public deleteByName(name: string, scope: VariableScope): boolean {
    const variable = this.findByName(name, scope);
    if (!variable) return false;
    return this.delete(variable.id);
  }

  public reset(id: string): boolean {
    const variable = this.variables.get(id);
    if (!variable) return false;
    return this.set(id, variable.defaultValue);
  }

  // ── Queries ─────────────────────────────────────────────────────────────────

  public getAll(): Variable[] {
    return Array.from(this.variables.values());
  }

  public getByScope(scope: VariableScope): Variable[] {
    return this.getAll().filter((v) => v.scope === scope);
  }

  public getByType(type: VariableType): Variable[] {
    return this.getAll().filter((v) => v.type === type);
  }

  public exists(name: string, scope: VariableScope): boolean {
    return !!this.findByName(name, scope);
  }

  public clearScope(scope: VariableScope): void {
    for (const [id, variable] of this.variables) {
      if (variable.scope === scope) this.variables.delete(id);
    }
  }

  public clearAll(): void {
    this.variables.clear();
  }

  // ── Listeners ───────────────────────────────────────────────────────────────

  public onVariableChange(variableId: string, listener: VariableChangeListener): () => void {
    const existing = this.listeners.get(variableId) ?? [];
    existing.push(listener);
    this.listeners.set(variableId, existing);
    return () => {
      const handlers = this.listeners.get(variableId) ?? [];
      this.listeners.set(variableId, handlers.filter((h) => h !== listener));
    };
  }

  public onAnyVariableChange(listener: VariableChangeListener): () => void {
    this.globalListeners.push(listener);
    return () => {
      this.globalListeners = this.globalListeners.filter((h) => h !== listener);
    };
  }

  // ── Serialization ────────────────────────────────────────────────────────────

  public toJSON(): Variable[] {
    return this.getAll().map((v) => ({ ...v }));
  }

  public fromJSON(variables: Variable[]): void {
    this.clearAll();
    for (const v of variables) {
      this.variables.set(v.id, { ...v });
    }
  }

  // ── Private ─────────────────────────────────────────────────────────────────

  private findByName(name: string, scope: VariableScope): Variable | undefined {
    return this.getAll().find((v) => v.name === name && v.scope === scope);
  }

  private emit(variable: Variable, oldValue: unknown): void {
    const handlers = this.listeners.get(variable.id) ?? [];
    for (const h of handlers) h(variable, oldValue);
    for (const h of this.globalListeners) h(variable, oldValue);
  }
}

export const variableManager = new VariableManager();

if (typeof window !== 'undefined') {
  const win = window as unknown as { visualstack?: Record<string, unknown> };
  win.visualstack = win.visualstack || {};
  win.visualstack.variableManager = variableManager;
}
