export interface RouteIR {
  id: string;
  path: string;
  screenId: string;
  screenName: string;
  isProtected: boolean;
  requiredRole?: string;
  params?: { name: string; type: string }[];
  queryParams?: { name: string; type: string }[];
}
