import type { StyleIR } from './StyleIR';

export interface ComponentIR {
  id: string;
  name: string;
  type: string;
  category: string;
  props: Record<string, unknown>;
  style: StyleIR;
  children: ComponentIR[];
  events: { eventName: string; workflowId: string }[];
}
