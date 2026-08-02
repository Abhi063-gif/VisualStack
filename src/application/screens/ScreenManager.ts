import { screenRegistry } from './ScreenRegistry';
import type { ScreenContext } from './ScreenContext';
import { eventBus } from '../../core/events/EventBus';
import { SystemEventType } from '../../core/events/EventTypes';

export class ScreenManager {
  private activeScreenId: string;
  private listeners: Set<(screen: ScreenContext) => void> = new Set();

  constructor() {
    const screens = screenRegistry.getAll();
    const defaultScreen = screens.find((s) => s.isDefault) || screens[0];
    this.activeScreenId = defaultScreen ? defaultScreen.id : 'screen_login';
  }

  public getActiveScreen(): ScreenContext {
    const screen = screenRegistry.getById(this.activeScreenId);
    if (!screen) {
      const fallback = screenRegistry.getAll()[0];
      this.activeScreenId = fallback.id;
      return fallback;
    }
    return screen;
  }

  public setActiveScreen(screenId: string): ScreenContext {
    const screen = screenRegistry.getById(screenId);
    if (!screen) {
      throw new Error(`Screen with ID "${screenId}" not found in registry.`);
    }

    this.activeScreenId = screenId;
    this.notifyListeners(screen);

    eventBus.emit(SystemEventType.LAYOUT_CHANGED, {
      sidebarVisible: true,
      inspectorVisible: true,
    });

    return screen;
  }

  public subscribe(listener: (screen: ScreenContext) => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notifyListeners(screen: ScreenContext): void {
    for (const listener of this.listeners) {
      listener(screen);
    }
  }
}

export const screenManager = new ScreenManager();
