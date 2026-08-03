# Module 06 — Compiler & Multi-Framework Code Generation Engine

## Overview
Module 06 implements the production-grade **VisualStack Compiler and Multi-Framework Code Generation Engine**. It operates completely framework-independently by compiling from a unified Intermediate Representation (IR) rather than reading UI canvas nodes directly.

```
Visual Project (Designer + Logic + Resources)
       │
       ▼
Intermediate Representation (Project IR)
       │
       ▼
1. Parse Project ──► 2. Validate ──► 3. Optimize ──► 4. Transform ──► 5. Generate ──► 6. Format ──► 7. Export
                                                                           │
                                                                           ▼
                                                             Production Project Bundle
```

---

## 7-Stage Compiler Pipeline Architecture

| Stage | Class / Module | Purpose |
| :--- | :--- | :--- |
| **1. Parse Project** | `CompilerPipeline.ts` | Exports unified state from all 5 preceding modules into 16 clean IR models. |
| **2. Validate** | `CompilerValidator.ts` | Static analysis checking broken links, invalid routes, missing variables, missing auth, and circular workflows. |
| **3. Optimize** | `CompilerOptimizer.ts` | Tree shaking of disconnected orphan logic nodes, route normalization, and unused variable pruning. |
| **4. Transform** | `CompilerPipeline.ts` | Prepares target framework AST structures. |
| **5. Generate** | `CodeGenerator.ts` | Plugin-based code generation delegating to framework adapters. |
| **6. Format** | `IncrementalGenerator.ts` | Code formatting, trailing line cleanup, and incremental file hash diffing. |
| **7. Export** | `ProjectExporter.ts` & `AssetPipeline.ts` | Generates final downloadable production project bundle & asset manifests. |

---

## 16 Intermediate Representation (IR) Models

Located under `src/compiler/ir/`:
1. `ProjectIR.ts`: Root project metadata, theme, and resource collections.
2. `ScreenIR.ts`: Application screen definitions and component trees.
3. `ComponentIR.ts`: UI element hierarchy, props, and styles.
4. `WorkflowIR.ts`: Backend logic graph nodes, edges, and triggers.
5. `RouteIR.ts`: Application URL routing and route guards.
6. `ApiIR.ts`: External REST & GraphQL API configurations.
7. `DatabaseIR.ts`: Database connection parameters, tables, and columns.
8. `VariableIR.ts`: Screen-scoped and global variables.
9. `StyleIR.ts`: Component CSS properties and media query rules.
10. `ThemeIR.ts`: Design system color tokens, typography, and dark mode configs.
11. `AnimationIR.ts`: Micro-animations and keyframes.
12. `ValidationIR.ts`: Input field validation rules.
13. `StorageIR.ts`: S3, Cloudinary, and Supabase storage bucket definitions.
14. `AuthenticationIR.ts`: JWT, OAuth2, and Firebase Auth settings.
15. `NavigationIR.ts`: Screen navigation guards and transitions.
16. `EnvironmentIR.ts`: Environment variables and secrets.

---

## Supported Framework Adapters

Located under `src/compiler/generators/adapters/`:
- `ReactExpressGenerator.ts` (`react-express`): React 19 + Express Node.js Server + Prisma
- `NextJSGenerator.ts` (`nextjs`): Next.js 15 App Router (`app/layout.tsx`, `app/page.tsx`)
- `VueExpressGenerator.ts` (`vue-express`): Vue 3 SFC + Vite + Express
- `FlutterGenerator.ts` (`flutter`): Flutter Mobile (Dart) (`pubspec.yaml`, `lib/main.dart`)
- `ReactNativeGenerator.ts` (`react-native`): React Native Expo Router (`app/_layout.tsx`)
- `NestJSGenerator.ts` (`nestjs`): NestJS Enterprise Server (`src/main.ts`, `app.module.ts`)
- `FastAPIGenerator.ts` (`fastapi`): Python FastAPI Server (`main.py`, `requirements.txt`)
