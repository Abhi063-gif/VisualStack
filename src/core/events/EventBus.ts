import { SystemEventType } from './EventTypes';
import type { EventPayloadMap, EventCallback } from './EventTypes';

export class EventBus {
  private static instance: EventBus;
  private listeners: Map<SystemEventType, Set<EventCallback<any>>> = new Map();

  private constructor() {}

  public static getInstance(): EventBus {
    if (!EventBus.instance) {
      EventBus.instance = new EventBus();
    }
    return EventBus.instance;
  }

  public on<T extends SystemEventType>(event: T, callback: EventCallback<EventPayloadMap[T]>): () => void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)!.add(callback);

    return () => this.off(event, callback);
  }

  public off<T extends SystemEventType>(event: T, callback: EventCallback<EventPayloadMap[T]>): void {
    const callbacks = this.listeners.get(event);
    if (callbacks) {
      callbacks.delete(callback);
    }
  }

  public emit<T extends SystemEventType>(event: T, payload: EventPayloadMap[T]): void {
    const callbacks = this.listeners.get(event);
    if (callbacks) {
      callbacks.forEach((cb) => {
        try {
          cb(payload);
        } catch (err) {
          console.error(`[EventBus] Error handling event ${event}:`, err);
        }
      });
    }
  }

  public removeAllListeners(): void {
    this.listeners.clear();
  }
}

export const eventBus = EventBus.getInstance();
