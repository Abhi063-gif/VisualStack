import { create } from 'zustand';
import { variableManager } from './VariableManager';
import type { Variable } from './VariableManager';
import type { VariableType, VariableScope } from '../nodes/VariableNode';
import { eventBus } from '../../../core/events/EventBus';
import { SystemEventType } from '../../../core/events/EventTypes';

// ── Reactive App State Store ─────────────────────────────────────────────────

export interface AppStateStore {
  variables: Variable[];

  // Actions
  createVariable: (name: string, type: VariableType, scope: VariableScope, defaultValue?: unknown, description?: string) => Variable;
  setVariable: (name: string, scope: VariableScope, value: unknown) => boolean;
  getVariable: (name: string, scope: VariableScope) => unknown;
  deleteVariable: (name: string, scope: VariableScope) => boolean;
  renameVariable: (id: string, newName: string) => boolean;
  resetVariable: (id: string) => boolean;
  refreshVariables: () => void;
  getByScope: (scope: VariableScope) => Variable[];
  clearScope: (scope: VariableScope) => void;
}

export const useAppState = create<AppStateStore>((set, get) => ({
  variables: [],

  createVariable: (name, type, scope, defaultValue = null, description) => {
    const variable = variableManager.create(name, type, scope, defaultValue, description);
    set({ variables: variableManager.getAll() });
    return variable;
  },

  setVariable: (name, scope, value) => {
    const ok = variableManager.setByName(name, scope, value);
    if (ok) set({ variables: variableManager.getAll() });
    return ok;
  },

  getVariable: (name, scope) => {
    return variableManager.getValue(name, scope);
  },

  deleteVariable: (name, scope) => {
    const ok = variableManager.deleteByName(name, scope);
    if (ok) set({ variables: variableManager.getAll() });
    return ok;
  },

  renameVariable: (id, newName) => {
    const ok = variableManager.rename(id, newName);
    if (ok) set({ variables: variableManager.getAll() });
    return ok;
  },

  resetVariable: (id) => {
    const ok = variableManager.reset(id);
    if (ok) set({ variables: variableManager.getAll() });
    return ok;
  },

  refreshVariables: () => {
    set({ variables: variableManager.getAll() });
  },

  getByScope: (scope) => {
    return get().variables.filter((v) => v.scope === scope);
  },

  clearScope: (scope) => {
    variableManager.clearScope(scope);
    set({ variables: variableManager.getAll() });
  },
}));

// ── Convenience helpers for non-React contexts ────────────────────────────────

export const appState = {
  get: (name: string, scope: VariableScope = 'app') => variableManager.getValue(name, scope),

  set: (name: string, value: unknown, scope: VariableScope = 'app') => {
    const ok = variableManager.setByName(name, scope, value);
    if (ok) {
      useAppState.getState().refreshVariables();
      eventBus.emit(SystemEventType.VARIABLE_CHANGED, { name, value, scope });
    }
    return ok;
  },

  create: (name: string, type: VariableType, scope: VariableScope = 'app', defaultValue: unknown = null) => {
    const v = variableManager.create(name, type, scope, defaultValue);
    useAppState.getState().refreshVariables();
    return v;
  },

  getAll: () => variableManager.getAll(),

  getScope: (scope: VariableScope) => variableManager.getByScope(scope),
};

// ── Seed default app-level variables ────────────────────────────────────────

export function initAppState(): void {
  const defaults: Array<{ name: string; type: VariableType; scope: VariableScope; value: unknown }> = [
    { name: 'currentUser', type: 'object', scope: 'app', value: null },
    { name: 'isAuthenticated', type: 'boolean', scope: 'app', value: false },
    { name: 'currentScreen', type: 'string', scope: 'app', value: 'home' },
    { name: 'theme', type: 'string', scope: 'session', value: 'dark' },
    { name: 'locale', type: 'string', scope: 'session', value: 'en-US' },
  ];

  for (const d of defaults) {
    if (!variableManager.exists(d.name, d.scope)) {
      variableManager.create(d.name, d.type, d.scope, d.value);
    }
  }

  useAppState.getState().refreshVariables();
}
