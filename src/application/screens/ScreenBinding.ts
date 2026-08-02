import type { ScreenBinding } from './ScreenContext';

export class ScreenBindingManager {
  private bindingsByScreen: Map<string, ScreenBinding[]> = new Map();

  public getBindings(screenId: string): ScreenBinding[] {
    return this.bindingsByScreen.get(screenId) ?? [];
  }

  public setBindings(screenId: string, bindings: ScreenBinding[]): void {
    this.bindingsByScreen.set(screenId, bindings);
  }

  public addBinding(screenId: string, binding: ScreenBinding): void {
    const existing = this.getBindings(screenId);
    this.bindingsByScreen.set(screenId, [...existing, binding]);
  }

  public removeBinding(screenId: string, componentId: string, eventType: string): void {
    const existing = this.getBindings(screenId);
    const filtered = existing.filter((b) => !(b.componentId === componentId && b.eventType === eventType));
    this.bindingsByScreen.set(screenId, filtered);
  }
}

export const screenBindingManager = new ScreenBindingManager();
