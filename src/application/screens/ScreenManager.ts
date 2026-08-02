import { screenRegistry } from './ScreenRegistry';
import type { ScreenContext } from './ScreenContext';
import { useLogicStore } from '../../stores/LogicStore';
import { graphManager } from '../../features/logic/graph/GraphManager';
import { eventBus } from '../../core/events/EventBus';
import { SystemEventType } from '../../core/events/EventTypes';

export class ScreenManager {
  private activeScreenId: string = 'screen_main';

  constructor() {
    this.activeScreenId = 'screen_main';
  }

  public getActiveScreenId(): string {
    return this.activeScreenId;
  }

  public getActiveScreen(): ScreenContext | undefined {
    return screenRegistry.getById(this.activeScreenId) || screenRegistry.getAll()[0];
  }

  public getAllScreens(): ScreenContext[] {
    return screenRegistry.getAll();
  }

  /**
   * Switches active screen context:
   * 1. Saves current node graph back to active screen context.
   * 2. Loads target screen context nodes and graph state.
   * 3. Syncs GraphManager & LogicStore.
   */
  public switchScreen(screenId: string): boolean {
    const targetScreen = screenRegistry.getById(screenId);
    if (!targetScreen) {
      console.warn(`[ScreenManager] Screen not found: "${screenId}"`);
      return false;
    }

    // Step 1: Save current screen state
    this.saveCurrentScreenState();

    // Step 2: Set new active screen ID
    this.activeScreenId = screenId;

    // Step 3: Load target screen graph into GraphManager & LogicStore
    this.loadScreenIntoGraph(targetScreen);

    // Notify event bus
    eventBus.emit(SystemEventType.SCREEN_SWITCHED, {
      screenId: targetScreen.id,
      name: targetScreen.name,
      route: targetScreen.route.path,
    });

    return true;
  }

  public saveCurrentScreenState(): void {
    const currentScreen = screenRegistry.getById(this.activeScreenId);
    if (!currentScreen) return;

    const { nodes, edges } = useLogicStore.getState();
    screenRegistry.updateScreen(this.activeScreenId, {
      nodes,
      edges,
    });
  }

  private loadScreenIntoGraph(screen: ScreenContext): void {
    // Reset existing graph
    graphManager.reset();

    // Re-populate graphManager nodes & edges from screen context
    const store = useLogicStore.getState();
    store.setNodes(screen.nodes);
    store.setEdges(screen.edges);

    // Sync variables
    store.refreshVariables();
  }

  public createScreen(name: string, path: string): ScreenContext {
    const id = `screen_${Date.now()}`;
    const now = new Date().toISOString();
    const newScreen: ScreenContext = {
      id,
      name,
      route: { path, isProtected: false },
      nodes: [],
      edges: [],
      bindings: [],
      variables: [],
      authConfig: { enabled: true, provider: 'jwt', requireAuth: false, redirectUnauthenticatedTo: '/login' },
      storageConfig: { provider: 'local', defaultBucket: 'public' },
      createdAt: now,
      updatedAt: now,
    };

    screenRegistry.registerScreen(newScreen);
    this.switchScreen(id);
    return newScreen;
  }
}

export const screenManager = new ScreenManager();
