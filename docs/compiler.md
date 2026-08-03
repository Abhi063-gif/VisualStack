# VisualStack Compiler Specification & Diagnostics

## Overview
The VisualStack Compiler (`src/compiler/Compiler.ts`) processes visual application models into production-ready source code projects.

## Pipeline Execution
```ts
import { compiler } from './compiler/Compiler';

const { files, context } = await compiler.compile({
  targetFramework: 'react-express',
  language: 'typescript',
  cssFramework: 'tailwind',
});
```

## Diagnostic Codes Reference

### Errors
- `ERR_NO_SCREENS`: Project contains no designed screens.
- `ERR_DUPLICATE_SCREEN_ID`: Duplicate screen ID detected in IR.
- `ERR_INVALID_ROUTE`: Route path does not start with leading `/`.
- `ERR_DUPLICATE_ROUTE`: Duplicate route path assigned across multiple screens.
- `ERR_AUTH_MISSING`: Protected route configured without an active Auth Resource.
- `ERR_BROKEN_EDGE_SOURCE`: Logic graph edge connects to non-existent source node.
- `ERR_BROKEN_EDGE_TARGET`: Logic graph edge connects to non-existent target node.

### Warnings
- `WARN_BROKEN_NAV`: Navigation node targets a non-existent screen.
- `WARN_MISSING_API`: API request node references an unregistered endpoint.
- `WARN_CIRCULAR_WORKFLOW`: Cycle detected in logic workflow graph.
- `WARN_MISSING_VARIABLE`: Node accesses an undeclared variable.

### Optimization Info Logs
- `INFO_PRUNED_DEAD_NODES`: Tree-shaken orphan nodes disconnected from triggers.
- `INFO_PRUNED_UNUSED_VARS`: Pruned global variables that are never accessed.
- `INFO_NO_DATABASE`: Info log when default local storage is used.
