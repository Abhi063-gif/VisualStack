# VisualStack Studio — Engineering Specification

## 1. Ground Truth Principles
1. **Never Generate Code Directly from Designer**: Every UI element and backend node is converted into an internal `.vstack` JSON model. Code generators read `.vstack` to emit code.
2. **Zero Temporary Code**: All Module 01 artifacts are permanent, production-grade contracts, abstract services, and typed extension points. No temporary placeholder mocks or disposable `TODO` lines.
3. **Decoupled Messaging**: Visual components emit events via `EventBus` rather than tightly coupling store subscriptions.
4. **Command Mutation Standard**: Every Canvas or Flow mutation is executed via `CommandManager.executeCommand()` to support robust undo/redo.

## 2. Technical Contracts
- **Canvas Element Metadata Schema**:
```ts
export interface ComponentNodeMeta {
  id: string;
  name: string;
  parent: string | null;
  children: string[];
  position: { x: number; y: number };
  size: { width: number; height: number };
  rotation: number;
  opacity: number;
  constraints: { horizontal: 'left' | 'right' | 'center' | 'stretch'; vertical: 'top' | 'bottom' | 'center' | 'stretch' };
  style: Record<string, unknown>;
  events: Array<{ name: string; targetFlowId?: string }>;
  visibility: boolean;
}
```

- **Backend Flow Graph Schema**:
```ts
export interface BackendNodeMeta {
  id: string;
  type: string;
  category: 'Auth' | 'Data' | 'Integration' | 'ControlFlow' | 'Logic' | 'Output';
  label: string;
  position: { x: number; y: number };
  inputs: Array<{ id: string; name: string; type: string }>;
  outputs: Array<{ id: string; name: string; type: string }>;
  config: Record<string, unknown>;
}
```
