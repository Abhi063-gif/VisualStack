# Module 07 – Local Runtime, Live Preview & Development Environment

## Overview
Module 07 completes the full local development cycle inside VisualStack Studio. Users can generate code, install packages, run development servers, preview their application, debug workflows, inspect logs, and manage SQLite databases—all without leaving the IDE or requiring VS Code/external terminal shells.

## Core Features & Components

### 1. Project Workspace Manager (`src/runtime/workspace/`)
- `WorkspaceManager.ts`: Workspace lifecycle manager tracking recent projects, settings, and active directories.
- `WorkspaceSettings.ts`: Preferences for Auto-Save, Auto-Compile, Hot Reload, Default Port, and Package Manager.
- `ProjectWatcher.ts`: Real-time file system watcher monitoring project changes.

### 2. Local Runtime Engine (`src/runtime/core/`)
- `RuntimeManager.ts`: Process manager controlling local node server execution (`start`, `stop`, `restart`).
- `RuntimeStatus.ts`: State machine (`stopped`, `starting`, `running`, `paused`) tracking live PID, port, uptime, CPU%, and memory usage.

### 3. Process Manager (`src/runtime/process/`)
- `ProcessManager.ts`: Spawns, monitors, and terminates background CLI tools (`npm`, `node`, `flutter`, `docker`).

### 4. Live Dev Server & Hot Reload Engine (`src/runtime/server/`)
- `LiveDevServer.ts`: Auto-detects free ports and launches live dev servers.
- `HotReloadEngine.ts`: Event listener triggering real-time iframe updates on file change.

### 5. Device Simulator & Live Preview Panel (`src/components/preview/`)
- `DeviceSimulator.tsx`: Multi-device simulator supporting Desktop, Laptop, Tablet, and Phone frames.
- `LivePreviewPanel.tsx`: Full-screen standalone viewport modal rendering `/preview`.

### 6. File Explorer, Package Manager & Environment Editor
- `FileExplorerModal.tsx` & `FileTreeService.ts`: Virtual tree viewer with live syntax code preview.
- `PackageManagerModal.tsx` & `PackageManagerService.ts`: 1-click npm package installer & uninstaller.
- `EnvironmentModal.tsx` & `EnvironmentService.ts`: Key-value `.env` editor with secret masking.

### 7. Local Database Runtime & DevTools Terminal
- `LocalDatabaseManager.ts`: SQLite embedded database engine with migration and seed runners.
- `TerminalEmulatorModal.tsx` & `TerminalService.ts`: Integrated shell emulator for interactive dev commands.

---
*VisualStack Studio Module 07 Architecture Completed & Verified.*
