import { ScreenContext } from './ScreenContext';

const nowISO = new Date().toISOString();
const nowMs = Date.now();

export const DEFAULT_PROJECT_SCREENS: ScreenContext[] = [
  new ScreenContext({
    id: 'screen_login',
    name: 'Login Screen',
    route: '/login',
    description: 'User authentication & sign-in portal',
    icon: 'log-in',
    isDefault: true,
    variables: [
      { id: 'v_email', name: 'email', value: '', defaultValue: '', scope: 'local', type: 'string', createdAt: nowMs, updatedAt: nowMs },
      { id: 'v_password', name: 'password', value: '', defaultValue: '', scope: 'local', type: 'string', createdAt: nowMs, updatedAt: nowMs },
    ],
    bindings: [
      { id: 'b_login_btn', componentId: 'btn_submit', componentName: 'Login Button', eventType: 'onClick' },
    ],
    createdAt: nowISO,
    updatedAt: nowISO,
  }),
  new ScreenContext({
    id: 'screen_home',
    name: 'Home Screen',
    route: '/',
    description: 'Main landing page & feature overview',
    icon: 'home',
    variables: [],
    bindings: [],
    createdAt: nowISO,
    updatedAt: nowISO,
  }),
  new ScreenContext({
    id: 'screen_dashboard',
    name: 'Dashboard',
    route: '/dashboard',
    description: 'Analytics, metrics & management console',
    icon: 'layout-dashboard',
    variables: [
      { id: 'v_user_count', name: 'userCount', value: 1250, defaultValue: 0, scope: 'global', type: 'number', createdAt: nowMs, updatedAt: nowMs },
    ],
    bindings: [],
    createdAt: nowISO,
    updatedAt: nowISO,
  }),
  new ScreenContext({
    id: 'screen_profile',
    name: 'User Profile',
    route: '/profile',
    description: 'User settings, account info & avatar',
    icon: 'user',
    variables: [],
    bindings: [],
    createdAt: nowISO,
    updatedAt: nowISO,
  }),
  new ScreenContext({
    id: 'screen_settings',
    name: 'Settings',
    route: '/settings',
    description: 'App preferences, themes & API keys',
    icon: 'settings',
    variables: [],
    bindings: [],
    createdAt: nowISO,
    updatedAt: nowISO,
  }),
  new ScreenContext({
    id: 'screen_checkout',
    name: 'Checkout',
    route: '/checkout',
    description: 'Shopping cart checkout & payment processing',
    icon: 'shopping-cart',
    variables: [],
    bindings: [],
    createdAt: nowISO,
    updatedAt: nowISO,
  }),
];

export class ScreenRegistry {
  private screens: Map<string, ScreenContext> = new Map();
  private listeners: Set<() => void> = new Set();

  constructor() {
    for (const screen of DEFAULT_PROJECT_SCREENS) {
      this.screens.set(screen.id, screen);
    }
  }

  public getAll(): ScreenContext[] {
    return Array.from(this.screens.values());
  }

  public getById(id: string): ScreenContext | undefined {
    return this.screens.get(id);
  }

  public getByRoute(route: string): ScreenContext | undefined {
    return this.getAll().find((s) => s.route === route);
  }

  public register(screen: ScreenContext): void {
    this.screens.set(screen.id, screen);
    this.notify();
  }

  public createScreen(name: string, route: string): ScreenContext {
    const id = `screen_${Date.now()}`;
    const formattedRoute = route.startsWith('/') ? route : `/${route}`;
    const screen = new ScreenContext({
      id,
      name,
      route: formattedRoute,
      description: `User generated page: ${name}`,
      icon: 'file-text',
      variables: [],
      bindings: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    this.register(screen);
    return screen;
  }

  public remove(id: string): boolean {
    const deleted = this.screens.delete(id);
    if (deleted) this.notify();
    return deleted;
  }

  public subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify(): void {
    for (const listener of this.listeners) {
      listener();
    }
  }
}

export const screenRegistry = new ScreenRegistry();
