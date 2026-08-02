# Runtime Execution Engine Specification

## Runtime Components
- **`RuntimeContext`**: Created per graph run. Caches port output values, tracks execution logs, enforces max iteration limits (10,000 safety cap), and manages abort state.
- **`ExecutionQueue`**: FIFO task queue draining node execution steps asynchronously with error boundary isolation.
- **`LogicExecutor`**: Evaluates individual nodes based on `type` and `config`, fetching upstream port values from `RuntimeContext`.
- **`ExecutionEngine`**: High-level orchestrator that finds entry points (`Events` category nodes), queues tasks, monitors execution, updates `LogicStore`, and emits `GRAPH_EXECUTED` to `EventBus`.
