# VisualStack Studio - Module 09 Documentation
## AI Assistant, AI Agent, Autonomous Development Engine & Visual Intelligence

Module 09 introduces the complete Artificial Intelligence layer for VisualStack Studio, transforming it into an autonomous software engineering platform.

### Key Architecture Components

1. **Provider Abstraction (`IAIProvider`)**:
   - Supports 10 AI providers (OpenAI, Anthropic, Google Gemini, OpenRouter, DeepSeek, Groq, Ollama, LM Studio, Azure OpenAI, Custom OpenAI Compatible).

2. **Context Engine (`ContextEngine.ts`)**:
   - Automatically builds context snapshots harvesting state from Designer scene graphs, React Flow workflows, Compiler errors, Runtime logs, Git status, DB schemas, and Deployment state.

3. **Executive Tool Calling Engine (`ToolCallingEngine.ts`)**:
   - Enables AI models to trigger internal APIs: `git_commit`, `git_push`, `deploy_app`, `build_docker_container`, `set_secret`, `add_custom_domain`.

4. **Autonomous Agent & Task Planner (`AutonomousAgent.ts` & `TaskPlanner.ts`)**:
   - Breaks high-level user goals into structured subtasks for end-to-end visual, logic, DB, auth, and deployment execution.

5. **AI Chat & Command Palette (`AIChatPanel.tsx` & `AICommandPalette.tsx`)**:
   - Interactive slide-over chat assistant with real-time response streaming and spotlight search command palette (`Ctrl+K`).
