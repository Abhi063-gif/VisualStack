import type { ScreenRoute } from '../screens/ScreenContext';

export interface NavigationGuardDecision {
  allowed: boolean;
  redirectTo?: string;
  reason?: string;
}

export class NavigationGuard {
  public checkRouteAccess(route: ScreenRoute, isAuthenticated: boolean): NavigationGuardDecision {
    if (route.isProtected && !isAuthenticated) {
      return {
        allowed: false,
        redirectTo: '/login',
        reason: 'Authentication required for protected route.',
      };
    }
    return { allowed: true };
  }

  public resolvePathWithParams(pathPattern: string, params: Record<string, string>): string {
    let resolved = pathPattern;
    for (const [key, val] of Object.entries(params)) {
      resolved = resolved.replace(`:${key}`, encodeURIComponent(val));
    }
    return resolved;
  }
}

export const navigationGuard = new NavigationGuard();
