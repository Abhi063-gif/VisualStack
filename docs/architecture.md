# VisualStack Studio — System Architecture Document

## 1. High-Level System Architecture
VisualStack Studio is a production-grade desktop IDE for visual full-stack application development. It compiles visual frontends and backend execution flows into a clean, decoupled internal representation (`.vstack`) before producing native React and Node.js source code.

```mermaid
graph TD
    User Interface[Visual IDE Shell] --> Store[Internal Model (.vstack Store)]
    Store --> EventBus[System Event Bus]
    EventBus --> CommandManager[Command Pattern History Engine]
    Store --> Compiler[Compiler Pipeline]
    Compiler --> ReactOutput[React Frontend Bundle]
    Compiler --> NodeOutput[Node/Express Backend Services]
```

## 2. Core Architectural Layers
1. **Presentation Layer (`src/components/`, `src/features/`)**: React 19 UI shell, Monaco code editor, Konva 2D design viewport, React Flow graph engine.
2. **Core IDE Engine Layer (`src/core/`)**:
   - `events/`: Strongly typed EventBus decoupling state mutations from secondary side effects.
   - `commands/`: Transactional Undo/Redo command manager (`Command`, `UndoCommand`, `RedoCommand`).
   - `container/`: Centralized `ServiceContainer` for Dependency Injection.
   - `models/`: Canonical data schemas for frontend components and backend nodes.
3. **State Management Layer (`src/stores/`)**: 11 modular Zustand stores for Session & Document state.
4. **Token & Design System (`src/tokens/`, `src/theme/`)**: Flat-color, dark-only desktop IDE design tokens inspired by Cursor, VS Code, Linear, and Figma.
5. **Packages Ready Architecture**: Isolated domain modules designed to easily transition into standalone monorepo packages (`packages/core`, `packages/compiler`, `packages/ui`).

## 3. Technology Stack Specification
- **Framework**: React 19 + TypeScript (Strict Mode)
- **Bundler**: Vite + `@tailwindcss/vite`
- **Canvas Viewports**: React Konva (Frontend), React Flow (Backend), Monaco Editor (Code)
- **Panels**: `react-resizable-panels`
- **State**: Zustand
- **Animations**: Framer Motion + GSAP
- **Icons**: Lucide React
