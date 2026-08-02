import { variableManager } from '../variables/VariableManager';
import type { VariableScope } from '../nodes/VariableNode';

export type PortValueMap = Map<string, unknown>; // portId -> value

export class RuntimeContext {
  public executionId: string;
  public startedAt: number;
  public portValues: Map<string, PortValueMap>; // nodeId -> portId -> value
  public logs: { level: 'info' | 'warn' | 'error'; message: string; timestamp: string }[];
  public aborted: boolean;
  public iterationCount: number;
  public maxIterations: number;

  constructor(executionId?: string) {
    this.executionId = executionId ?? `exec_${Date.now()}`;
    this.startedAt = Date.now();
    this.portValues = new Map();
    this.logs = [];
    this.aborted = false;
    this.iterationCount = 0;
    this.maxIterations = 10_000;
  }

  // ── Port Value Access ───────────────────────────────────────────────────────

  public setPortValue(nodeId: string, portId: string, value: unknown): void {
    if (!this.portValues.has(nodeId)) {
      this.portValues.set(nodeId, new Map());
    }
    this.portValues.get(nodeId)!.set(portId, value);
  }

  public getPortValue(nodeId: string, portId: string): unknown {
    return this.portValues.get(nodeId)?.get(portId);
  }

  public getNodePorts(nodeId: string): PortValueMap {
    return this.portValues.get(nodeId) ?? new Map();
  }

  // ── Variable Access ─────────────────────────────────────────────────────────

  public getVariable(name: string, scope: VariableScope = 'local'): unknown {
    return variableManager.getValue(name, scope);
  }

  public setVariable(name: string, value: unknown, scope: VariableScope = 'local'): boolean {
    return variableManager.setByName(name, scope, value);
  }

  // ── Logging ─────────────────────────────────────────────────────────────────

  public log(level: 'info' | 'warn' | 'error', message: string): void {
    const entry = { level, message, timestamp: new Date().toISOString() };
    this.logs.push(entry);
    console[level](`[Runtime:${this.executionId}] ${message}`);
  }

  public info(message: string): void { this.log('info', message); }
  public warn(message: string): void { this.log('warn', message); }
  public error(message: string): void { this.log('error', message); }

  // ── Lifecycle ───────────────────────────────────────────────────────────────

  public abort(reason = 'Aborted'): void {
    this.aborted = true;
    this.log('warn', `Execution aborted: ${reason}`);
  }

  public checkIterationLimit(): boolean {
    this.iterationCount++;
    if (this.iterationCount > this.maxIterations) {
      this.abort('Maximum iteration limit reached');
      return false;
    }
    return true;
  }

  public elapsed(): number {
    return Date.now() - this.startedAt;
  }

  public summary(): string {
    return `Execution [${this.executionId}] finished in ${this.elapsed()}ms — ${this.logs.length} log entries`;
  }
}
