import type { ScreenContext } from './ScreenContext';

export class ScreenRegistry {
  private screens: Map<string, ScreenContext> = new Map();

  constructor() {
    this.registerDefaultScreens();
  }

  /**
   * Initializes screen registry with clean root screen.
   * Eliminates hardcoded dummy demo screens.
   */
  private registerDefaultScreens(): void {
    const now = new Date().toISOString();
    const mainScreen: ScreenContext = {
      id: 'screen_main',
      name: 'Main Screen',
      route: { path: '/', isProtected: false },
      nodes: [],
      edges: [],
      bindings: [],
      variables: [],
      authConfig: { enabled: false, provider: 'jwt', requireAuth: false, redirectUnauthenticatedTo: '/login' },
      storageConfig: { provider: 'local', defaultBucket: 'public' },
      createdAt: now,
      updatedAt: now,
    };

    this.screens.set(mainScreen.id, mainScreen);
  }

  public registerScreen(screen: ScreenContext): void {
    this.screens.set(screen.id, screen);
  }

  public getById(id: string): ScreenContext | undefined {
    return this.screens.get(id);
  }

  public getByRoute(path: string): ScreenContext | undefined {
    return Array.from(this.screens.values()).find((s) => s.route.path === path);
  }

  public getAll(): ScreenContext[] {
    return Array.from(this.screens.values());
  }

  public updateScreen(id: string, updates: Partial<ScreenContext>): void {
    const existing = this.screens.get(id);
    if (existing) {
      this.screens.set(id, {
        ...existing,
        ...updates,
        updatedAt: new Date().toISOString(),
      });
    }
  }

  public deleteScreen(id: string): boolean {
    if (this.screens.size <= 1) {
      return false; // Prevent deleting last remaining screen
    }
    return this.screens.delete(id);
  }

  public clearAll(): void {
    this.screens.clear();
    this.registerDefaultScreens();
  }
}

export const screenRegistry = new ScreenRegistry();
