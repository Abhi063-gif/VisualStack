import type { NodeDefinition } from './NodeDefinition';
export { buildInputPorts, buildOutputPorts } from './NodeDefinition';
import { EVENT_NODE_DEFINITIONS } from './EventNode';
import { CONDITION_NODE_DEFINITIONS } from './ConditionNode';
import { ACTION_NODE_DEFINITIONS } from './ActionNode';
import { VARIABLE_NODE_DEFINITIONS } from './VariableNode';
import { API_REQUEST_NODE_DEFINITIONS } from './APIRequestNode';
import { NAVIGATE_NODE_DEFINITIONS } from './NavigateNode';
import { DELAY_NODE_DEFINITIONS } from './DelayNode';
import { STORAGE_NODE_DEFINITIONS } from './StorageNode';
import { LOOP_NODE_DEFINITIONS } from './LoopNode';
import { SWITCH_NODE_DEFINITIONS } from './SwitchNode';
import { FUNCTION_NODE_DEFINITIONS } from './FunctionNode';
import { MATH_NODE_DEFINITIONS } from './MathNode';
import { STRING_NODE_DEFINITIONS } from './StringNode';
import { DATE_NODE_DEFINITIONS } from './DateNode';
import { CUSTOM_NODE_DEFINITIONS } from './CustomNode';
import { DATABASE_NODE_DEFINITIONS } from './DatabaseNode';
import { AUTH_NODE_DEFINITIONS } from './AuthNode';
import { ECOMMERCE_NODE_DEFINITIONS } from './EcommerceNode';
import { COMMUNICATION_NODE_DEFINITIONS } from './CommunicationNode';
import { FILE_STORAGE_NODE_DEFINITIONS } from './FileStorageNode';
import { AI_INTEGRATION_NODE_DEFINITIONS } from './AIIntegrationNode';
import { JSON_DATA_NODE_DEFINITIONS } from './JSONDataNode';

import { SECURITY_NODE_DEFINITIONS } from './SecurityNode';
import { REALTIME_NODE_DEFINITIONS } from './RealtimeNode';
import { WORKFLOW_NODE_DEFINITIONS } from './WorkflowNode';
import { SCHEDULER_NODE_DEFINITIONS } from './SchedulerNode';
import { TRIGGER_NODE_DEFINITIONS } from './TriggerNode';
import { DEVICE_NODE_DEFINITIONS } from './DeviceNode';
import { ANALYTICS_NODE_DEFINITIONS } from './AnalyticsNode';

import type { NodeCategory } from '../graph/LogicNode';

export const ALL_NODE_DEFINITIONS: NodeDefinition[] = [
  ...EVENT_NODE_DEFINITIONS,
  ...CONDITION_NODE_DEFINITIONS,
  ...ACTION_NODE_DEFINITIONS,
  ...VARIABLE_NODE_DEFINITIONS,
  ...API_REQUEST_NODE_DEFINITIONS,
  ...NAVIGATE_NODE_DEFINITIONS,
  ...DELAY_NODE_DEFINITIONS,
  ...STORAGE_NODE_DEFINITIONS,
  ...LOOP_NODE_DEFINITIONS,
  ...SWITCH_NODE_DEFINITIONS,
  ...FUNCTION_NODE_DEFINITIONS,
  ...MATH_NODE_DEFINITIONS,
  ...STRING_NODE_DEFINITIONS,
  ...DATE_NODE_DEFINITIONS,
  ...CUSTOM_NODE_DEFINITIONS,
  ...DATABASE_NODE_DEFINITIONS,
  ...AUTH_NODE_DEFINITIONS,
  ...ECOMMERCE_NODE_DEFINITIONS,
  ...COMMUNICATION_NODE_DEFINITIONS,
  ...FILE_STORAGE_NODE_DEFINITIONS,
  ...AI_INTEGRATION_NODE_DEFINITIONS,
  ...JSON_DATA_NODE_DEFINITIONS,

  ...SECURITY_NODE_DEFINITIONS,
  ...REALTIME_NODE_DEFINITIONS,
  ...WORKFLOW_NODE_DEFINITIONS,
  ...SCHEDULER_NODE_DEFINITIONS,
  ...TRIGGER_NODE_DEFINITIONS,
  ...DEVICE_NODE_DEFINITIONS,
  ...ANALYTICS_NODE_DEFINITIONS,
];

export const NODE_DEFINITIONS_BY_TYPE: Map<string, NodeDefinition> = new Map(
  ALL_NODE_DEFINITIONS.map((def) => [def.type, def])
);

export const NODE_DEFINITIONS_BY_CATEGORY: Map<NodeCategory, NodeDefinition[]> = new Map();
for (const def of ALL_NODE_DEFINITIONS) {
  const existing = NODE_DEFINITIONS_BY_CATEGORY.get(def.category) ?? [];
  existing.push(def);
  NODE_DEFINITIONS_BY_CATEGORY.set(def.category, existing);
}

export function getNodeDefinition(type: string): NodeDefinition | undefined {
  return NODE_DEFINITIONS_BY_TYPE.get(type);
}

export function getNodesByCategory(category: NodeCategory): NodeDefinition[] {
  return NODE_DEFINITIONS_BY_CATEGORY.get(category) ?? [];
}

export function searchNodes(query: string): NodeDefinition[] {
  const q = query.toLowerCase().trim();
  if (!q) return ALL_NODE_DEFINITIONS;
  return ALL_NODE_DEFINITIONS.filter(
    (def) =>
      def.name.toLowerCase().includes(q) ||
      def.description.toLowerCase().includes(q) ||
      def.category.toLowerCase().includes(q) ||
      def.type.toLowerCase().includes(q)
  );
}

export const NODE_CATEGORIES: NodeCategory[] = [
  'Events',
  'Logic',
  'Variables',
  'Math',
  'String',
  'Date',
  'API',
  'Database',
  'Auth',
  'E-Commerce',
  'Communication',
  'Navigation',
  'Storage',
  'Security',
  'Realtime',
  'Device',
  'Workflow',
  'Scheduler',
  'Triggers',
  'Analytics',
  'Functions',
  'Custom',
];
