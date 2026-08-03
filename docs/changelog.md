# VisualStack Studio Changelog

## [1.2.0] - 2026-08-03 (Module 06 Release)

### Added
- **Module 06 Phase 1**: Built 7-Stage Compiler Pipeline Architecture (`Compiler.ts`, `CompilerContext.ts`, `CompilerPipeline.ts`, `CompilerDiagnostics.ts`, `CompilerLogger.ts`) and 16 Intermediate Representation (IR) models (`src/compiler/ir/`).
- **Module 06 Phase 2**: Implemented static architecture validation engine (`CompilerValidator.ts`) and compiler optimization engine (`CompilerOptimizer.ts` for tree-shaking dead orphan nodes, route normalization, and unused variable pruning).
- **Module 06 Phase 3**: Built plugin-based code generator engine (`CodeGenerator.ts`, `GeneratorRegistry.ts`) with 7 framework adapters:
  - React 19 + Express Node.js (`ReactExpressGenerator.ts`)
  - Next.js 15 App Router (`NextJSGenerator.ts`)
  - Vue 3 + Vite (`VueExpressGenerator.ts`)
  - Flutter Mobile Dart (`FlutterGenerator.ts`)
  - React Native Expo (`ReactNativeGenerator.ts`)
  - NestJS Enterprise Server (`NestJSGenerator.ts`)
  - Python FastAPI Server (`FastAPIGenerator.ts`)
- **Module 06 Phase 4**: Built Asset Pipeline (`AssetPipeline.ts`), Incremental File Hash Diff Generator (`IncrementalGenerator.ts`), and Production Project Exporter (`ProjectExporter.ts`). Integrated live 7-Stage Compiler Pipeline runner into IDE Execution Console.
- **Module 06 Phase 5**: Comprehensive documentation suite (`docs/module-06.md`, `docs/compiler.md`, `docs/architecture.md`, `docs/changelog.md`). Verified clean `npx tsc --noEmit` and `npm run build`.

## [1.0.0] - 2026-08-02 (Module 04 Release)

### Added
- **Phase 1**: Data Layer Foundation (`LogicNode`, `LogicEdge`, `LogicGraph`, `GraphManager`, `Port`, `Validation`, `ConnectionManager`, `EventRegistry`, `EventDispatcher`, `LogicService`, `LogicCommands`, `LogicStore`).
- **Phase 2**: Complete Node Library (84 node definitions across 15 categories, `NodeRegistry`).
- **Phase 3**: Variable System & State Management (`VariableManager`, `GlobalVariables`, `LocalVariables`, `AppState`).
- **Phase 4**: Runtime Execution Engine (`RuntimeContext`, `ExecutionQueue`, `LogicExecutor`, `ExecutionEngine`).
- **Phase 5**: Blueprint IDE UI Workspace (`CustomLogicNode`, `CustomLogicEdge`, `NodePalette`, `LogicToolbar`, `PropertyPanel`, `ExecutionConsole`, `LogicCanvas`, `BackendPage`).
- **Phase 6**: Complete Module 04 Documentation Suite (`docs/module-04.md`, `docs/logic-engine.md`, `docs/runtime.md`, `docs/node-library.md`, `docs/decisions.md`, `docs/changelog.md`).
