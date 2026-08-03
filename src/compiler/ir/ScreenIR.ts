import type { RouteIR } from './RouteIR';
import type { ComponentIR } from './ComponentIR';
import type { WorkflowIR } from './WorkflowIR';
import type { VariableIR } from './VariableIR';

export interface ScreenIR {
  id: string;
  name: string;
  route: RouteIR;
  components: ComponentIR[];
  workflow: WorkflowIR;
  variables: VariableIR[];
}
