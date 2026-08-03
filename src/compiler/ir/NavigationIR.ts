export interface NavigationRuleIR {
  id: string;
  sourceScreenId: string;
  targetScreenId: string;
  triggerEvent: string;
  params?: Record<string, string>;
  guard?: { requiresAuth: boolean; fallbackRoute: string };
}
