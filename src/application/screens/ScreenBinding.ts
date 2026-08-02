import type { ScreenBindingRule } from './ScreenContext';

export class ScreenBindingEngine {
  private bindings: Map<string, ScreenBindingRule> = new Map();

  public addBinding(rule: ScreenBindingRule): void {
    this.bindings.set(rule.id, rule);
  }

  public removeBinding(id: string): void {
    this.bindings.delete(id);
  }

  public getBindingsForComponent(componentId: string): ScreenBindingRule[] {
    return Array.from(this.bindings.values()).filter((b) => b.componentId === componentId);
  }

  public getBindingsForEvent(componentId: string, eventType: string): ScreenBindingRule | undefined {
    return Array.from(this.bindings.values()).find(
      (b) => b.componentId === componentId && b.eventType === eventType
    );
  }

  public getAll(): ScreenBindingRule[] {
    return Array.from(this.bindings.values());
  }
}

export const screenBindingEngine = new ScreenBindingEngine();
