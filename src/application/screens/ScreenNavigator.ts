import type { ScreenRoute } from './ScreenContext';
import { screenRegistry } from './ScreenRegistry';

export interface NavigationTarget {
  screenId: string;
  path: string;
  params?: Record<string, unknown>;
}

export class ScreenNavigator {
  private activePath: string = '/login';

  public getActivePath(): string {
    return this.activePath;
  }

  public navigateTo(path: string, params?: Record<string, unknown>): NavigationTarget | null {
    const screens = screenRegistry.getAll();
    const targetScreen = screens.find((s) => s.route.path === path || s.id === path);

    if (!targetScreen) {
      console.warn(`[ScreenNavigator] Route not found for path: "${path}"`);
      return null;
    }

    this.activePath = targetScreen.route.path;
    return {
      screenId: targetScreen.id,
      path: targetScreen.route.path,
      params,
    };
  }

  public resolveRoute(path: string): ScreenRoute | undefined {
    const screens = screenRegistry.getAll();
    return screens.find((s) => s.route.path === path)?.route;
  }
}

export const screenNavigator = new ScreenNavigator();
