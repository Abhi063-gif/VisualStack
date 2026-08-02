import type { LogicGraph } from '../../features/logic/graph/LogicGraph';
import type { Variable } from '../../features/logic/variables/VariableManager';

export interface ScreenBindingRule {
  id: string;
  componentId: string;
  componentName: string;
  eventType: string;
  targetNodeId?: string;
}

export interface ScreenContextData {
  id: string;
  name: string;
  route: string;
  description: string;
  icon?: string;
  isDefault?: boolean;
  variables: Variable[];
  bindings: ScreenBindingRule[];
  workflowGraph?: LogicGraph;
  createdAt: string;
  updatedAt: string;
}

export class ScreenContext {
  public id: string;
  public name: string;
  public route: string;
  public description: string;
  public icon: string;
  public isDefault: boolean;
  public variables: Variable[];
  public bindings: ScreenBindingRule[];
  public workflowGraph?: LogicGraph;
  public createdAt: string;
  public updatedAt: string;

  constructor(data: ScreenContextData) {
    this.id = data.id;
    this.name = data.name;
    this.route = data.route;
    this.description = data.description || '';
    this.icon = data.icon || 'layout';
    this.isDefault = Boolean(data.isDefault);
    this.variables = data.variables || [];
    this.bindings = data.bindings || [];
    this.workflowGraph = data.workflowGraph;
    this.createdAt = data.createdAt || new Date().toISOString();
    this.updatedAt = data.updatedAt || new Date().toISOString();
  }

  public toJSON(): ScreenContextData {
    return {
      id: this.id,
      name: this.name,
      route: this.route,
      description: this.description,
      icon: this.icon,
      isDefault: this.isDefault,
      variables: this.variables,
      bindings: this.bindings,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
