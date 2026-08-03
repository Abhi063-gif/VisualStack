export interface StyleIR {
  id: string;
  className?: string;
  cssProperties: Record<string, string | number>;
  mediaQueries?: { query: string; properties: Record<string, string | number> }[];
  hover?: Record<string, string | number>;
  focus?: Record<string, string | number>;
  active?: Record<string, string | number>;
  isShared: boolean;
}
