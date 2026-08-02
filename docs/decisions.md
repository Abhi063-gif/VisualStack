# Architectural Decisions (ADR) — Module 04

## ADR-01: React Flow Integration via Zustand Bridge
- **Decision**: Keep `LogicGraph` as the pure domain data model source of truth, and mirror it reactively into `@xyflow/react` via `LogicStore` (`useLogicStore`).
- **Rationale**: Isolates domain graph logic and runtime execution from UI framework bindings. Allows background graph execution without requiring React UI components to be mounted.

## ADR-[02]: Strict Typed Port Connections
- **Decision**: Validate port connection requests using `Validation.ts` rules prior to establishing edges in `LogicGraph`.
- **Rationale**: Prevents runtime execution errors caused by passing incompatible data types (e.g. passing a raw string to a boolean conditional handle).

## ADR-03: Variable Scoping Hierarchy
- **Decision**: Implement explicit variable scoping (`local`, `global`, `app`, `session`, `component`, `page`).
- **Rationale**: Matches state hierarchy of production visual builder platforms (FlutterFlow, Framer, WeWeb).
