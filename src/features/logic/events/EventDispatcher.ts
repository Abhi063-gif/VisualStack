import type { AppEventName } from './EventRegistry';
import { graphManager } from '../graph/GraphManager';

type EventHandler = (payload: Record<string, unknown>) => void;

export class EventDispatcher {
  private listeners: Map<AppEventName, EventHandler[]> = new Map();

  public on(eventName: AppEventName, handler: EventHandler): () => void {
    const existing = this.listeners.get(eventName) ?? [];
    existing.push(handler);
    this.listeners.set(eventName, existing);

    return () => {
      const handlers = this.listeners.get(eventName) ?? [];
      this.listeners.set(
        eventName,
        handlers.filter((h) => h !== handler)
      );
    };
  }

  public dispatch(eventName: AppEventName, payload: Record<string, unknown> = {}): void {
    const handlers = this.listeners.get(eventName) ?? [];
    for (const handler of handlers) {
      handler(payload);
    }

    // Find any Event nodes in the graph listening to this event and trigger execution
    const entryNodes = graphManager
      .getAllNodes()
      .filter((n) => n.category === 'Events' && n.config['eventName'] === eventName);

    for (const node of entryNodes) {
      console.info(`[EventDispatcher] Triggering entry node: ${node.name} (${node.id})`, payload);
    }

    if (entryNodes.length > 0) {
      import('../execution/ExecutionEngine').then(({ executionEngine }) => {
        executionEngine.triggerEvent(eventName, payload);
      });
    }
  }

  public dispatchAll(eventName: AppEventName, payload: Record<string, unknown> = {}): void {
    this.dispatch(eventName, payload);
  }
}

export const eventDispatcher = new EventDispatcher();
