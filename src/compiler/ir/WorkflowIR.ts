export interface NodeIR {
  id: string;
  type: string;
  label: string;
  category: string;
  config: Record<string, unknown>;
  inputs: { id: string; name: string; dataType: string; defaultValue?: unknown }[];
  outputs: { id: string; name: string; dataType: string }[];
}

export interface EdgeIR {
  id: string;
  sourceNodeId: string;
  sourcePortId: string;
  targetNodeId: string;
  targetPortId: string;
}

export interface WorkflowIR {
  id: string;
  name: string;
  screenId: string;
  triggerEvent: string;
  nodes: NodeIR[];
  edges: EdgeIR[];
}
