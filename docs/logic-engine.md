# Logic Engine Technical Specification

## Core Data Model
- **`LogicNode`**: Represents a visual logic node with typed inputs, outputs, position, icon, color, and dynamic config object.
- **`LogicEdge`**: Connects a source node output port to a target node input port. Typed as `execution` or `data`.
- **`LogicGraph`**: In-memory graph structure supporting topological sorting, node/edge lookup, serialization, and edge queries (`getOutgoingExecutionEdges`, `getIncomingDataEdges`).
- **`GraphManager`**: Singleton lifecycle manager emitting EventBus notifications on graph mutations.

## Connection Validation (`Validation.ts`)
- Execution ports connect ONLY to execution ports.
- Data ports evaluate `isDataTypeCompatible(sourceDataType, targetDataType)`:
  - `any` accepts any data type.
  - Same data types (e.g. `number` → `number`) pass validation.
  - Incompatible assignments (e.g. `string` → `boolean`) are rejected with explicit failure reasons.
