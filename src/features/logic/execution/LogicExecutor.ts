import type { LogicNode } from '../graph/LogicNode';
import type { LogicGraph } from '../graph/LogicGraph';
import type { RuntimeContext } from './RuntimeContext';
import { variableManager } from '../variables/VariableManager';

export type ExecutionResult = {
  nextPortId: string | null;   // which execution output port to follow
  outputValues: Record<string, unknown>; // portId -> value for data output ports
};

export class LogicExecutor {
  private graph: LogicGraph;
  private context: RuntimeContext;

  constructor(graph: LogicGraph, context: RuntimeContext) {
    this.graph = graph;
    this.context = context;
  }

  public async execute(node: LogicNode): Promise<ExecutionResult> {
    const { type, config } = node;

    // Resolve input data port values from connected edges
    const inputs = this.resolveInputs(node);
    this.context.info(`▶ Executing: ${node.name} [${type}]`);

    try {
      return await this.dispatch(type, config, inputs, node);
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      this.context.error(`✗ ${node.name}: ${msg}`);
      return { nextPortId: 'error', outputValues: {} };
    }
  }

  // ── Input Resolution ────────────────────────────────────────────────────────

  private resolveInputs(node: LogicNode): Record<string, unknown> {
    const result: Record<string, unknown> = {};
    const incoming = this.graph.getIncomingDataEdges(node.id);

    for (const edge of incoming) {
      // Read from context: the source node's output port value
      const value = this.context.getPortValue(edge.sourceNodeId, edge.sourcePortId);
      result[edge.targetPortId] = value;
    }

    // Merge with node config defaults for unconnected inputs
    for (const port of node.inputs) {
      if (!(port.id in result) && port.defaultValue !== undefined) {
        result[port.id] = port.defaultValue;
      }
    }

    return result;
  }

  // ── Main Dispatcher ─────────────────────────────────────────────────────────

  private async dispatch(
    type: string,
    config: Record<string, unknown>,
    inputs: Record<string, unknown>,
    _node: LogicNode
  ): Promise<ExecutionResult> {
    // ── Event Nodes (entry points, no-op execution) ──────────────────────────
    if (type.startsWith('event_')) {
      return { nextPortId: 'exec', outputValues: {} };
    }

    // ── Logic / Condition Nodes ──────────────────────────────────────────────
    if (type === 'cond_if') {
      const condition = Boolean(inputs['condition'] ?? false);
      this.context.info(`  IF condition = ${condition}`);
      return { nextPortId: condition ? 'true' : 'false', outputValues: {} };
    }

    if (type === 'cond_compare') {
      const a = inputs['a'];
      const b = inputs['b'];
      const op = (config['operator'] as string) ?? '==';
      const result = this.compare(a, b, op);
      this.context.info(`  Compare: ${a} ${op} ${b} = ${result}`);
      return { nextPortId: null, outputValues: { result } };
    }

    if (type === 'cond_and') {
      const result = Boolean(inputs['a']) && Boolean(inputs['b']);
      return { nextPortId: null, outputValues: { result } };
    }

    if (type === 'cond_or') {
      const result = Boolean(inputs['a']) || Boolean(inputs['b']);
      return { nextPortId: null, outputValues: { result } };
    }

    if (type === 'cond_not') {
      const result = !Boolean(inputs['value']);
      return { nextPortId: null, outputValues: { result } };
    }

    if (type === 'cond_switch' || type === 'switch_case') {
      const value = String(inputs['value'] ?? '');
      const cases = (config['cases'] as { id: string; value: string }[]) ?? [];
      const matched = cases.find((c) => c.value === value);
      return { nextPortId: matched ? matched.id : 'default', outputValues: {} };
    }

    // ── Action Nodes ─────────────────────────────────────────────────────────
    if (type === 'action_log') {
      const label = (config['label'] as string) ?? 'Log';
      const val = inputs['value'];
      this.context.info(`  [${label}] ${JSON.stringify(val)}`);
      return { nextPortId: 'exec', outputValues: {} };
    }

    if (type === 'action_show_toast') {
      const message = (inputs['message'] as string) ?? (config['message'] as string) ?? '';
      this.context.info(`  Toast: "${message}"`);
      return { nextPortId: 'exec', outputValues: {} };
    }

    if (type === 'action_show_error') {
      const errorType = (inputs['errorType'] as string) ?? (config['errorType'] as string) ?? 'Login Error';
      const message = (inputs['message'] as string) ?? (config['message'] as string) ?? 'Account not found. Please check your credentials.';
      const errorCode = (inputs['errorCode'] as string) ?? (config['errorCode'] as string) ?? 'ERR_ACCOUNT_NOT_FOUND';
      this.context.error(`  [Show Error] ${errorType} (${errorCode}): "${message}"`);
      return { nextPortId: 'exec', outputValues: { errorType, message, errorCode, errorMessage: message } };
    }

    if (type === 'action_set_property') {
      const elementId = inputs['elementId'] ?? config['elementId'];
      const property = inputs['property'] ?? config['property'];
      const value = inputs['value'] ?? config['value'];
      this.context.info(`  SetProperty: [${elementId}].${property} = ${value}`);
      return { nextPortId: 'exec', outputValues: {} };
    }

    // ── Variable Nodes ───────────────────────────────────────────────────────
    if (type === 'var_get') {
      const name = config['variableName'] as string;
      const scope = (config['scope'] as 'local' | 'global' | 'app' | 'session') ?? 'local';
      const value = variableManager.getValue(name, scope);
      this.context.info(`  GetVar: ${scope}.${name} = ${value}`);
      return { nextPortId: null, outputValues: { value } };
    }

    if (type === 'var_set') {
      const name = config['variableName'] as string;
      const scope = (config['scope'] as 'local' | 'global' | 'app' | 'session') ?? 'local';
      const value = inputs['value'];
      variableManager.setByName(name, scope, value);
      this.context.info(`  SetVar: ${scope}.${name} = ${value}`);
      return { nextPortId: 'exec', outputValues: {} };
    }

    if (type === 'var_update') {
      const name = config['variableName'] as string;
      const scope = (config['scope'] as 'local' | 'global' | 'app' | 'session') ?? 'local';
      const previous = variableManager.getValue(name, scope);
      const newValue = inputs['input'];
      variableManager.setByName(name, scope, newValue);
      this.context.info(`  UpdateVar: ${scope}.${name}: ${previous} → ${newValue}`);
      return { nextPortId: 'exec', outputValues: { previous } };
    }

    // ── Math Nodes ───────────────────────────────────────────────────────────
    if (type === 'math_add')      return this.mathResult((inputs['a'] as number ?? 0) + (inputs['b'] as number ?? 0));
    if (type === 'math_subtract') return this.mathResult((inputs['a'] as number ?? 0) - (inputs['b'] as number ?? 0));
    if (type === 'math_multiply') return this.mathResult((inputs['a'] as number ?? 0) * (inputs['b'] as number ?? 0));
    if (type === 'math_divide') {
      const b = inputs['b'] as number ?? 1;
      if (b === 0) { this.context.warn('  Divide by zero'); return { nextPortId: null, outputValues: { result: null } }; }
      return this.mathResult((inputs['a'] as number ?? 0) / b);
    }
    if (type === 'math_modulo')   return this.mathResult((inputs['a'] as number ?? 0) % (inputs['b'] as number ?? 1));
    if (type === 'math_round') {
      const decimals = (inputs['decimals'] as number ?? config['decimals'] as number ?? 0);
      const factor = Math.pow(10, decimals);
      return this.mathResult(Math.round((inputs['value'] as number ?? 0) * factor) / factor);
    }
    if (type === 'math_clamp') {
      const val = inputs['value'] as number ?? 0;
      const min = inputs['min'] as number ?? (config['min'] as number ?? 0);
      const max = inputs['max'] as number ?? (config['max'] as number ?? 100);
      return this.mathResult(Math.min(Math.max(val, min), max));
    }
    if (type === 'math_random') {
      const min = inputs['min'] as number ?? (config['min'] as number ?? 0);
      const max = inputs['max'] as number ?? (config['max'] as number ?? 1);
      const integer = config['integer'] as boolean ?? false;
      const r = Math.random() * (max - min) + min;
      return this.mathResult(integer ? Math.floor(r) : r);
    }
    if (type === 'math_min') return this.mathResult(Math.min(inputs['a'] as number ?? 0, inputs['b'] as number ?? 0));
    if (type === 'math_max') return this.mathResult(Math.max(inputs['a'] as number ?? 0, inputs['b'] as number ?? 0));
    if (type === 'math_average') {
      const arr = (inputs['values'] as number[]) ?? [];
      if (arr.length === 0) return { nextPortId: null, outputValues: { result: 0 } };
      return this.mathResult(arr.reduce((a, b) => a + b, 0) / arr.length);
    }

    // ── String Nodes ─────────────────────────────────────────────────────────
    if (type === 'str_join') {
      const sep = (inputs['separator'] as string ?? config['separator'] as string ?? '');
      return { nextPortId: null, outputValues: { result: String(inputs['a'] ?? '') + sep + String(inputs['b'] ?? '') } };
    }
    if (type === 'str_split') {
      const text = String(inputs['text'] ?? '');
      const delim = String(inputs['delimiter'] ?? config['delimiter'] ?? ',');
      return { nextPortId: null, outputValues: { result: text.split(delim) } };
    }
    if (type === 'str_replace') {
      const text = String(inputs['text'] ?? '');
      const search = String(inputs['search'] ?? config['search'] ?? '');
      const rep = String(inputs['replacement'] ?? config['replacement'] ?? '');
      const all = config['all'] !== false;
      return { nextPortId: null, outputValues: { result: all ? text.replaceAll(search, rep) : text.replace(search, rep) } };
    }
    if (type === 'str_contains') {
      const result = String(inputs['text'] ?? '').includes(String(inputs['search'] ?? ''));
      return { nextPortId: null, outputValues: { result } };
    }
    if (type === 'str_starts_with') {
      const result = String(inputs['text'] ?? '').startsWith(String(inputs['prefix'] ?? ''));
      return { nextPortId: null, outputValues: { result } };
    }
    if (type === 'str_ends_with') {
      const result = String(inputs['text'] ?? '').endsWith(String(inputs['suffix'] ?? ''));
      return { nextPortId: null, outputValues: { result } };
    }
    if (type === 'str_trim')      return { nextPortId: null, outputValues: { result: String(inputs['text'] ?? '').trim() } };
    if (type === 'str_uppercase') return { nextPortId: null, outputValues: { result: String(inputs['text'] ?? '').toUpperCase() } };
    if (type === 'str_lowercase') return { nextPortId: null, outputValues: { result: String(inputs['text'] ?? '').toLowerCase() } };
    if (type === 'str_length')    return { nextPortId: null, outputValues: { result: String(inputs['text'] ?? '').length } };
    if (type === 'str_substring') {
      const text = String(inputs['text'] ?? '');
      const start = inputs['start'] as number ?? 0;
      const end = inputs['end'] as number | undefined;
      return { nextPortId: null, outputValues: { result: end !== undefined ? text.substring(start, end) : text.substring(start) } };
    }

    // ── Date Nodes ───────────────────────────────────────────────────────────
    if (type === 'date_now') {
      const now = Date.now();
      return { nextPortId: null, outputValues: { timestamp: now, iso: new Date(now).toISOString() } };
    }
    if (type === 'date_format') {
      const ts = inputs['timestamp'] as number ?? Date.now();
      return { nextPortId: null, outputValues: { result: new Date(ts).toLocaleString() } };
    }
    if (type === 'date_parse') {
      const d = new Date(String(inputs['dateString'] ?? ''));
      const valid = !isNaN(d.getTime());
      return { nextPortId: null, outputValues: { timestamp: valid ? d.getTime() : 0, valid } };
    }
    if (type === 'date_diff') {
      const from = inputs['from'] as number ?? 0;
      const to = inputs['to'] as number ?? Date.now();
      const ms = Math.abs(to - from);
      return { nextPortId: null, outputValues: { ms, days: Math.floor(ms / 86400000), hours: Math.floor(ms / 3600000), minutes: Math.floor(ms / 60000) } };
    }
    if (type === 'date_add') {
      const ts = inputs['timestamp'] as number ?? Date.now();
      const amount = inputs['amount'] as number ?? 0;
      const unit = config['unit'] as string ?? 'days';
      const multipliers: Record<string, number> = { ms: 1, seconds: 1000, minutes: 60000, hours: 3600000, days: 86400000 };
      return { nextPortId: null, outputValues: { result: ts + amount * (multipliers[unit] ?? 86400000) } };
    }

    // ── Storage Nodes ─────────────────────────────────────────────────────────
    if (type === 'storage_local_get') {
      const key = String(inputs['key'] ?? config['key'] ?? '');
      const raw = localStorage.getItem(key);
      const value = raw !== null ? this.tryParse(raw) : undefined;
      return { nextPortId: null, outputValues: { value, found: raw !== null } };
    }
    if (type === 'storage_local_set') {
      const key = String(inputs['key'] ?? config['key'] ?? '');
      const value = inputs['value'];
      localStorage.setItem(key, JSON.stringify(value));
      this.context.info(`  LocalStorage.set("${key}")`);
      return { nextPortId: 'exec', outputValues: {} };
    }
    if (type === 'storage_local_remove') {
      const key = String(inputs['key'] ?? config['key'] ?? '');
      localStorage.removeItem(key);
      return { nextPortId: 'exec', outputValues: {} };
    }
    if (type === 'storage_session_get') {
      const key = String(inputs['key'] ?? config['key'] ?? '');
      const raw = sessionStorage.getItem(key);
      return { nextPortId: null, outputValues: { value: raw !== null ? this.tryParse(raw) : undefined } };
    }
    if (type === 'storage_session_set') {
      const key = String(inputs['key'] ?? config['key'] ?? '');
      sessionStorage.setItem(key, JSON.stringify(inputs['value']));
      return { nextPortId: 'exec', outputValues: {} };
    }

    // ── Delay Nodes ──────────────────────────────────────────────────────────
    if (type === 'delay_wait') {
      const ms = (inputs['duration'] as number ?? config['duration'] as number ?? 0);
      this.context.info(`  Waiting ${ms}ms...`);
      await new Promise<void>((r) => setTimeout(r, ms));
      return { nextPortId: 'exec', outputValues: {} };
    }

    // ── Navigation Nodes (runtime stubs — wired to router in Phase 5) ────────
    if (type.startsWith('nav_')) {
      const screenId = inputs['screenId'] ?? config['screenId'] ?? '';
      this.context.info(`  Navigation[${type}]: → "${screenId}"`);
      return { nextPortId: 'exec', outputValues: {} };
    }

    // ── API Request Nodes ────────────────────────────────────────────────────
    if (type.startsWith('api_')) {
      const url = String(inputs['url'] ?? config['url'] ?? '');
      const method = (config['method'] as string ?? 'GET').toUpperCase();
      const headers = (inputs['headers'] as Record<string, string> ?? {}) as Record<string, string>;
      const body = type !== 'api_get' && type !== 'api_delete' ? inputs['body'] : undefined;
      const timeout = config['timeout'] as number ?? 10000;

      this.context.info(`  HTTP ${method} → ${url}`);
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), timeout);

        const response = await fetch(url, {
          method,
          headers: { 'Content-Type': 'application/json', ...headers },
          body: body ? JSON.stringify(body) : undefined,
          signal: controller.signal,
        });
        clearTimeout(timeoutId);

        const status = response.status;
        let data: unknown;
        const fmt = config['responseFormat'] as string ?? 'json';
        if (fmt === 'json') {
          data = await response.json().catch(() => null);
        } else if (fmt === 'text') {
          data = await response.text();
        } else {
          data = await response.text();
        }

        this.context.info(`  HTTP ${method} ← ${status}`);
        const success = response.ok;
        return { nextPortId: success ? 'success' : 'error', outputValues: { data, status } };
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        this.context.error(`  HTTP ${method} failed: ${msg}`);
        return { nextPortId: 'error', outputValues: { data: null, status: 0 } };
      }
    }

    // ── Loop Nodes ───────────────────────────────────────────────────────────
    if (type === 'loop_for') {
      const start = (inputs['start'] as number ?? config['start'] as number ?? 0);
      const end = (inputs['end'] as number ?? config['end'] as number ?? 0);
      // Return first iteration — engine handles looping
      return { nextPortId: end > start ? 'loop_body' : 'completed', outputValues: { index: start } };
    }

    if (type === 'loop_foreach') {
      const arr = (inputs['array'] as unknown[]) ?? [];
      return { nextPortId: arr.length > 0 ? 'loop_body' : 'completed', outputValues: { item: arr[0], index: 0 } };
    }

    // ── Function Nodes ───────────────────────────────────────────────────────
    if (type === 'fn_define') {
      const name = config['functionName'] as string ?? 'anonymous';
      this.context.info(`  Function defined: ${name}`);
      return { nextPortId: null, outputValues: {} };
    }

    if (type === 'fn_call') {
      const name = config['functionName'] as string ?? '';
      this.context.info(`  Calling function: ${name}`);
      return { nextPortId: 'exec', outputValues: { return: null } };
    }

    if (type === 'fn_return') {
      this.context.info(`  Return: ${JSON.stringify(inputs['value'])}`);
      return { nextPortId: null, outputValues: {} };
    }

    // ── Custom Code Nodes ────────────────────────────────────────────────────
    if (type === 'custom_code') {
      const code = config['code'] as string ?? 'return null;';
      try {
        // eslint-disable-next-line no-new-func
        const fn = new Function('inputs', 'context', `"use strict"; ${code}`);
        const result = await Promise.resolve(fn(inputs, this.context));
        this.context.info(`  CustomCode result: ${JSON.stringify(result)}`);
        return { nextPortId: 'exec', outputValues: { result } };
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        this.context.error(`  CustomCode error: ${msg}`);
        return { nextPortId: 'error', outputValues: { result: null } };
      }
    }

    if (type === 'custom_transform') {
      const expression = config['expression'] as string ?? 'value';
      const value = inputs['value'];
      try {
        // eslint-disable-next-line no-new-func
        const fn = new Function('value', `"use strict"; return (${expression});`);
        const result = fn(value);
        return { nextPortId: null, outputValues: { result } };
      } catch (err) {
        return { nextPortId: null, outputValues: { result: null } };
      }
    }

    // ── Fallthrough ──────────────────────────────────────────────────────────
    this.context.warn(`  Unknown node type: ${type} — passing through`);
    return { nextPortId: 'exec', outputValues: {} };
  }

  // ── Private Helpers ─────────────────────────────────────────────────────────

  private mathResult(result: number): ExecutionResult {
    this.context.info(`  → ${result}`);
    return { nextPortId: null, outputValues: { result } };
  }

  private compare(a: unknown, b: unknown, op: string): boolean {
    switch (op) {
      case '==':  return a == b;   // eslint-disable-line eqeqeq
      case '===': return a === b;
      case '!=':  return a != b;   // eslint-disable-line eqeqeq
      case '!==': return a !== b;
      case '>':   return (a as number) > (b as number);
      case '<':   return (a as number) < (b as number);
      case '>=':  return (a as number) >= (b as number);
      case '<=':  return (a as number) <= (b as number);
      default:    return false;
    }
  }

  private tryParse(raw: string): unknown {
    try { return JSON.parse(raw); } catch { return raw; }
  }
}
