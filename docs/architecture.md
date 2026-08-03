# VisualStack Studio Architecture

## System Overview
VisualStack Studio is an end-to-end visual IDE that compiles full-stack applications from visual canvas models into production source code and runs them locally.

```
┌─────────────────────────────────────────────────────────┐
│                    VisualStack Studio                   │
├───────────────┬────────────────────────┬────────────────┤
│ Module 01-03  │       Module 04        │   Module 05    │
│  UI Canvas    │    Logic Workflows     │ Project Resources│
└───────┬───────┴───────────┬────────────┴────────┬───────┘
        │                   │                     │
        └───────────────────┼─────────────────────┘
                            ▼
              ┌───────────────────────────┐
              │ Unified Project IR Export │
              └─────────────┬─────────────┘
                            ▼
       ┌─────────────────────────────────────────┐
       │     Module 06 Compiler Engine           │
       ├─────────────────────────────────────────┤
       │ 1. Parse Project IR                     │
       │ 2. Validate (CompilerValidator)         │
       │ 3. Optimize (CompilerOptimizer)         │
       │ 4. Transform AST                        │
       │ 5. Generate (7 Framework Adapters)      │
       │ 6. Format & Incremental Hash Diff       │
       │ 7. Export Project Bundle & Assets       │
       └────────────────────┬────────────────────┘
                            ▼
       ┌─────────────────────────────────────────┐
       │ Module 07 Local Runtime & Preview Engine │
       ├─────────────────────────────────────────┤
       │ 1. Workspace Manager & File Watcher     │
       │ 2. Runtime Engine & Process Manager     │
       │ 3. Live Dev Server & Hot Reload Engine  │
       │ 4. Device Simulator & Live Preview      │
       │ 5. Embedded SQLite DB & Migrations      │
       │ 6. Integrated DevTools Terminal Shell   │
       └─────────────────────────────────────────┘
```

## Architectural Guarantee
The VisualStack Compiler (`src/compiler/`) and Runtime Engine (`src/runtime/`) are framework-independent and modular.
1. The compiler never reads Konva or React Flow directly.
2. All inputs pass through 16 Project IR models (`src/compiler/ir/`).
3. Multi-framework generation is plugin-based (`FrameworkAdapter`).
4. Live local execution runs inside the IDE without requiring VS Code or external terminal tools.
