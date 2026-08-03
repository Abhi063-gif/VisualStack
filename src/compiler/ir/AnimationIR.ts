export interface AnimationIR {
  id: string;
  name: string;
  type: 'fade' | 'slide' | 'scale' | 'rotate' | 'keyframes';
  durationMs: number;
  easing: string;
  delayMs?: number;
  keyframes?: Record<string, Record<string, string | number>>;
}
