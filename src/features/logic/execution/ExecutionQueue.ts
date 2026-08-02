import type { RuntimeContext } from './RuntimeContext';

export type ExecutionTask = {
  nodeId: string;
  portId?: string;
  fn: () => Promise<void>;
};

export class ExecutionQueue {
  private queue: ExecutionTask[] = [];
  private running = false;
  private context: RuntimeContext;

  constructor(context: RuntimeContext) {
    this.context = context;
  }

  public enqueue(task: ExecutionTask): void {
    this.queue.push(task);
  }

  public prepend(task: ExecutionTask): void {
    this.queue.unshift(task);
  }

  public async drain(): Promise<void> {
    if (this.running) return;
    this.running = true;

    while (this.queue.length > 0 && !this.context.aborted) {
      if (!this.context.checkIterationLimit()) break;

      const task = this.queue.shift()!;
      try {
        await task.fn();
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        this.context.error(`Node [${task.nodeId}] threw: ${msg}`);
        // Stop on unhandled error
        this.context.abort(`Unhandled error in node ${task.nodeId}`);
      }
    }

    this.running = false;
  }

  public clear(): void {
    this.queue = [];
  }

  public get length(): number {
    return this.queue.length;
  }

  public get isRunning(): boolean {
    return this.running;
  }
}
