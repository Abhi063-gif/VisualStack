import type { ScreenContext } from './ScreenContext';

export class ScreenRegistry {
  private screens: Map<string, ScreenContext> = new Map();

  constructor() {
    this.registerDefaultScreens();
  }

  private registerDefaultScreens(): void {
    const defaultScreens: Omit<ScreenContext, 'createdAt' | 'updatedAt'>[] = [
      {
        id: 'screen_landing',
        name: 'Landing Page',
        route: { path: '/', isProtected: false },
        nodes: [
          {
            id: 'node_event_app_start',
            type: 'logicNode',
            position: { x: 100, y: 150 },
            data: {
              label: 'App Started',
              nodeType: 'event_app_started',
              category: 'Events',
              description: 'Entry point when application launches.',
              icon: 'zap',
              color: '#f59e0b',
              inputs: [],
              outputs: [{ id: 'exec', name: 'Then', type: 'execution', dataType: 'execution', color: '#ffffff' }],
              config: { eventName: 'app_started' },
            },
          },
        ],
        edges: [],
        bindings: [],
        variables: [],
        authConfig: { enabled: false, provider: 'jwt', requireAuth: false, redirectUnauthenticatedTo: '/login' },
        storageConfig: { provider: 'local', defaultBucket: 'public' },
      },
      {
        id: 'screen_login',
        name: 'Login Screen',
        route: { path: '/login', isProtected: false },
        nodes: [
          {
            id: 'node_event_form_login',
            type: 'logicNode',
            position: { x: 100, y: 150 },
            data: {
              label: 'Form Submitted',
              nodeType: 'event_form_submitted',
              category: 'Events',
              description: 'Fires when user submits login form.',
              icon: 'send',
              color: '#8b5cf6',
              inputs: [],
              outputs: [
                { id: 'exec', name: 'Then', type: 'execution', dataType: 'execution', color: '#ffffff' },
                { id: 'data', name: 'Form Data', type: 'data', dataType: 'object', color: '#f59e0b' },
              ],
              config: { eventName: 'login_form_submitted' },
            },
          },
          {
            id: 'node_auth_login',
            type: 'logicNode',
            position: { x: 380, y: 150 },
            data: {
              label: 'User Login',
              nodeType: 'auth_login',
              category: 'Auth',
              description: 'Authenticates credentials.',
              icon: 'log-in',
              color: '#3b82f6',
              inputs: [
                { id: 'exec', name: 'Execute', type: 'execution', dataType: 'execution' },
                { id: 'email', name: 'Email', type: 'data', dataType: 'string', color: '#10b981' },
                { id: 'password', name: 'Password', type: 'data', dataType: 'string', color: '#10b981' },
              ],
              outputs: [
                { id: 'success', name: 'Success', type: 'execution', dataType: 'execution', color: '#10b981' },
                { id: 'failed', name: 'Failed', type: 'execution', dataType: 'execution', color: '#ef4444' },
                { id: 'user', name: 'User Object', type: 'data', dataType: 'object', color: '#f59e0b' },
              ],
              config: {},
            },
          },
          {
            id: 'node_nav_dashboard',
            type: 'logicNode',
            position: { x: 680, y: 100 },
            data: {
              label: 'Go To Screen',
              nodeType: 'nav_go_to',
              category: 'Navigation',
              description: 'Navigate to dashboard upon successful login.',
              icon: 'navigation',
              color: '#6366f1',
              inputs: [
                { id: 'exec', name: 'Execute', type: 'execution', dataType: 'execution' },
                { id: 'screen', name: 'Screen Path', type: 'data', dataType: 'string', color: '#10b981', defaultValue: '/dashboard' },
              ],
              outputs: [{ id: 'exec', name: 'Then', type: 'execution', dataType: 'execution' }],
              config: { screen: '/dashboard' },
            },
          },
          {
            id: 'node_show_error',
            type: 'logicNode',
            position: { x: 680, y: 260 },
            data: {
              label: 'Show Error',
              nodeType: 'action_show_error',
              category: 'Logic',
              description: 'Display error alert on invalid credentials.',
              icon: 'alert-triangle',
              color: '#ef4444',
              inputs: [
                { id: 'exec', name: 'Execute', type: 'execution', dataType: 'execution' },
                { id: 'message', name: 'Error Message', type: 'data', dataType: 'string', color: '#10b981', defaultValue: 'Account not found. Please verify your credentials.' },
              ],
              outputs: [{ id: 'exec', name: 'Then', type: 'execution', dataType: 'execution' }],
              config: { errorType: 'Login Error', errorMessage: 'Account not found. Please verify your credentials.' },
            },
          },
        ],
        edges: [
          {
            id: 'edge_login_exec',
            source: 'node_event_form_login',
            sourceHandle: 'exec',
            target: 'node_auth_login',
            targetHandle: 'exec',
            type: 'logicEdge',
          },
          {
            id: 'edge_login_success',
            source: 'node_auth_login',
            sourceHandle: 'success',
            target: 'node_nav_dashboard',
            targetHandle: 'exec',
            type: 'logicEdge',
          },
          {
            id: 'edge_login_failed',
            source: 'node_auth_login',
            sourceHandle: 'failed',
            target: 'node_show_error',
            targetHandle: 'exec',
            type: 'logicEdge',
          },
        ],
        bindings: [
          {
            componentId: 'btn_login_submit',
            componentName: 'Login Button',
            componentType: 'button',
            eventType: 'click',
            targetNodeId: 'node_event_form_login',
          },
        ],
        variables: [
          { id: 'var_email', name: 'input_email', type: 'string', value: '', scope: 'screen' },
          { id: 'var_pass', name: 'input_password', type: 'string', value: '', scope: 'screen' },
        ],
        authConfig: { enabled: true, provider: 'jwt', requireAuth: false, redirectUnauthenticatedTo: '/login' },
        storageConfig: { provider: 'local', defaultBucket: 'users' },
      },
      {
        id: 'screen_register',
        name: 'Register Screen',
        route: { path: '/register', isProtected: false },
        nodes: [],
        edges: [],
        bindings: [],
        variables: [],
        authConfig: { enabled: true, provider: 'jwt', requireAuth: false, redirectUnauthenticatedTo: '/login' },
        storageConfig: { provider: 'local', defaultBucket: 'users' },
      },
      {
        id: 'screen_dashboard',
        name: 'Dashboard',
        route: { path: '/dashboard', isProtected: true, requiredRole: 'user', redirectToOnDenied: '/login' },
        nodes: [],
        edges: [],
        bindings: [],
        variables: [],
        authConfig: { enabled: true, provider: 'jwt', requireAuth: true, redirectUnauthenticatedTo: '/login' },
        storageConfig: { provider: 's3', defaultBucket: 'analytics' },
      },
      {
        id: 'screen_profile',
        name: 'User Profile',
        route: { path: '/profile', isProtected: true },
        nodes: [],
        edges: [],
        bindings: [],
        variables: [],
        authConfig: { enabled: true, provider: 'jwt', requireAuth: true, redirectUnauthenticatedTo: '/login' },
        storageConfig: { provider: 's3', defaultBucket: 'avatars' },
      },
      {
        id: 'screen_checkout',
        name: 'Checkout Screen',
        route: { path: '/checkout', isProtected: true },
        nodes: [],
        edges: [],
        bindings: [],
        variables: [],
        authConfig: { enabled: true, provider: 'jwt', requireAuth: true, redirectUnauthenticatedTo: '/login' },
        storageConfig: { provider: 'local', defaultBucket: 'invoices' },
      },
      {
        id: 'screen_admin',
        name: 'Admin Panel',
        route: { path: '/admin', isProtected: true, requiredRole: 'admin', redirectToOnDenied: '/dashboard' },
        nodes: [],
        edges: [],
        bindings: [],
        variables: [],
        authConfig: { enabled: true, provider: 'jwt', requireAuth: true, redirectUnauthenticatedTo: '/login' },
        storageConfig: { provider: 's3', defaultBucket: 'admin-logs' },
      },
      {
        id: 'screen_settings',
        name: 'Settings',
        route: { path: '/settings', isProtected: true },
        nodes: [],
        edges: [],
        bindings: [],
        variables: [],
        authConfig: { enabled: true, provider: 'jwt', requireAuth: true, redirectUnauthenticatedTo: '/login' },
        storageConfig: { provider: 'local', defaultBucket: 'configs' },
      },
    ];

    const now = new Date().toISOString();
    for (const scr of defaultScreens) {
      this.screens.set(scr.id, {
        ...scr,
        createdAt: now,
        updatedAt: now,
      });
    }
  }

  public getAll(): ScreenContext[] {
    return Array.from(this.screens.values());
  }

  public getById(id: string): ScreenContext | undefined {
    return this.screens.get(id);
  }

  public registerScreen(screen: ScreenContext): void {
    this.screens.set(screen.id, screen);
  }

  public updateScreen(id: string, updates: Partial<ScreenContext>): ScreenContext | undefined {
    const existing = this.screens.get(id);
    if (!existing) return undefined;

    const updated: ScreenContext = {
      ...existing,
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    this.screens.set(id, updated);
    return updated;
  }

  public deleteScreen(id: string): boolean {
    return this.screens.delete(id);
  }
}

export const screenRegistry = new ScreenRegistry();
