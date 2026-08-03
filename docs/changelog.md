# VisualStack Studio Changelog

## [1.3.0] - 2026-08-03 (Module 07 Release)

### Added
- **Module 07 Phase 1**: Built Workspace Manager (`WorkspaceManager.ts`, `ProjectWorkspace.ts`, `WorkspaceSettings.ts`, `ProjectWatcher.ts`), Local Runtime Core (`RuntimeManager.ts`, `RuntimeEngine.ts`, `RuntimeStatus.ts`, `RuntimeSession.ts`), Process Manager (`ProcessManager.ts`, `ProcessRunner.ts`, `ProcessRegistry.ts`), and IDE bottom Runtime Status Bar (`RuntimeStatusBar.tsx`).
- **Module 07 Phase 2**: Built Live Dev Server (`LiveDevServer.ts`), Hot Reload Engine (`HotReloadEngine.ts`), Device Simulator (`DeviceSimulator.tsx` supporting Desktop, Laptop, Tablet, Phone, Portrait/Landscape, Zoom), and Live Preview Panel (`LivePreviewPanel.tsx` rendering `/preview`).
- **Module 07 Phase 3**: Built Project File Explorer (`FileTreeService.ts`, `FileExplorerModal.tsx`), Visual Package Manager (`PackageManagerService.ts`, `PackageManagerModal.tsx`), and Environment Variable Editor (`EnvironmentService.ts`, `EnvironmentModal.tsx`).
- **Module 07 Phase 4**: Built Embedded Local Database Manager (`LocalDatabaseManager.ts` for SQLite, migrations, seeding), System Log Streaming Engine (`LogStreamer.ts`), and DevTools Terminal Shell (`TerminalService.ts`, `TerminalEmulatorModal.tsx`).
- **Module 07 Phase 5**: Added Runtime Diagnostics (`RuntimeDiagnostics.ts`), Health Monitor (`HealthMonitor.ts`), and full documentation suite (`docs/module-07.md`, `docs/architecture.md`, `docs/changelog.md`). Verified 0 TypeScript errors and clean production build.

## [1.2.0] - 2026-08-03 (Module 06 Release)

### Added
- **Module 06 Phase 1**: Built 7-Stage Compiler Pipeline Architecture (`Compiler.ts`, `CompilerContext.ts`, `CompilerPipeline.ts`, `CompilerDiagnostics.ts`, `CompilerLogger.ts`) and 16 Intermediate Representation (IR) models (`src/compiler/ir/`).
- **Module 06 Phase 2**: Implemented static architecture validation engine (`CompilerValidator.ts`) and compiler optimization engine (`CompilerOptimizer.ts`).
- **Module 06 Phase 3**: Built plugin-based code generator engine with 7 framework adapters (React+Express, Next.js 15, Vue 3, Flutter, React Native Expo, NestJS, FastAPI).
- **Module 06 Phase 4**: Built Asset Pipeline, Incremental Hash Diff Generator, and Production Project Exporter.
- **Module 06 Phase 5**: Comprehensive documentation suite.

## [1.0.0] - 2026-08-02 (Module 04 Release)
- **Visual Logic Designer & Workflow Engine**.
