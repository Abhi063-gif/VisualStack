import type { ProjectIR } from '../ir/ProjectIR';
import { CompilerDiagnostics } from '../CompilerDiagnostics';

export class CompilerValidator {
  public validate(ir: ProjectIR, diagnostics: CompilerDiagnostics): void {
    this.checkScreensAndRoutes(ir, diagnostics);
    this.checkWorkflows(ir, diagnostics);
    this.checkVariables(ir, diagnostics);
    this.checkResources(ir, diagnostics);
  }

  private checkScreensAndRoutes(ir: ProjectIR, diagnostics: CompilerDiagnostics): void {
    if (ir.screens.length === 0) {
      diagnostics.error('ERR_NO_SCREENS', 'Project contains no screens or pages.', 'CompilerValidator');
      return;
    }

    const routeSet = new Set<string>();
    const screenIdSet = new Set<string>();

    for (const scr of ir.screens) {
      if (screenIdSet.has(scr.id)) {
        diagnostics.error('ERR_DUPLICATE_SCREEN_ID', `Duplicate Screen ID found: "${scr.id}".`, 'CompilerValidator', scr.id);
      }
      screenIdSet.add(scr.id);

      if (!scr.route.path || !scr.route.path.startsWith('/')) {
        diagnostics.error('ERR_INVALID_ROUTE', `Invalid route path "${scr.route.path}" on screen "${scr.name}". Must start with "/".`, 'CompilerValidator', scr.id);
      }

      if (routeSet.has(scr.route.path)) {
        diagnostics.error('ERR_DUPLICATE_ROUTE', `Duplicate route path detected: "${scr.route.path}" on screen "${scr.name}".`, 'CompilerValidator', scr.id);
      }
      routeSet.add(scr.route.path);

      // Check Protected Routes without Auth
      if (scr.route.isProtected) {
        const hasAuth = ir.authServices.some((a) => a.enabled);
        if (!hasAuth) {
          diagnostics.error(
            'ERR_AUTH_MISSING',
            `Screen "${scr.name}" is marked as Protected, but no active Authentication Service is configured in Project Resources.`,
            'CompilerValidator',
            scr.id
          );
        }
      }
    }
  }

  private checkWorkflows(ir: ProjectIR, diagnostics: CompilerDiagnostics): void {
    const screenNames = new Set(ir.screens.map((s) => s.name.replace(/\s+/g, '')));

    for (const scr of ir.screens) {
      const nodeIds = new Set(scr.workflow.nodes.map((n) => n.id));

      // 1. Broken Edges
      for (const edge of scr.workflow.edges) {
        if (!nodeIds.has(edge.sourceNodeId)) {
          diagnostics.error(
            'ERR_BROKEN_EDGE_SOURCE',
            `Workflow on "${scr.name}" contains an edge connected to non-existent source node "${edge.sourceNodeId}".`,
            'CompilerValidator',
            scr.id
          );
        }
        if (!nodeIds.has(edge.targetNodeId)) {
          diagnostics.error(
            'ERR_BROKEN_EDGE_TARGET',
            `Workflow on "${scr.name}" contains an edge connected to non-existent target node "${edge.targetNodeId}".`,
            'CompilerValidator',
            scr.id
          );
        }
      }

      // 2. Navigation Node Validation & Broken Screen Links
      for (const node of scr.workflow.nodes) {
        if (node.type === 'NavigateNode' || node.category === 'Navigation') {
          const targetScreen = String(node.config.targetScreen || node.config.screenName || '');
          if (targetScreen && !screenNames.has(targetScreen.replace(/\s+/g, ''))) {
            diagnostics.warning(
              'WARN_BROKEN_NAV',
              `Navigation node "${node.label}" targets screen "${targetScreen}" which does not exist in the project.`,
              'CompilerValidator',
              node.id
            );
          }
        }

        // 3. API Node Validation
        if (node.type === 'APIRequestNode' || node.category === 'API') {
          const apiName = String(node.config.apiName || '');
          if (apiName) {
            const apiExists = ir.externalApis.some((a) => a.name === apiName);
            if (!apiExists) {
              diagnostics.warning(
                'WARN_MISSING_API',
                `API node "${node.label}" references external API "${apiName}" which is not registered in Project Resources.`,
                'CompilerValidator',
                node.id
              );
            }
          }
        }
      }

      // 4. Circular Workflow Detection (Cycle Check)
      if (this.detectCycle(scr.workflow.nodes, scr.workflow.edges)) {
        diagnostics.warning(
          'WARN_CIRCULAR_WORKFLOW',
          `Circular workflow loop detected on screen "${scr.name}". Ensure logic nodes do not form infinite execution recursion.`,
          'CompilerValidator',
          scr.id
        );
      }
    }
  }

  private detectCycle(nodes: { id: string }[], edges: { sourceNodeId: string; targetNodeId: string }[]): boolean {
    const adj = new Map<string, string[]>();
    for (const node of nodes) adj.set(node.id, []);
    for (const edge of edges) {
      if (adj.has(edge.sourceNodeId)) {
        adj.get(edge.sourceNodeId)!.push(edge.targetNodeId);
      }
    }

    const visited = new Set<string>();
    const recStack = new Set<string>();

    const dfs = (nodeId: string): boolean => {
      visited.add(nodeId);
      recStack.add(nodeId);

      const neighbors = adj.get(nodeId) || [];
      for (const neighbor of neighbors) {
        if (!visited.has(neighbor)) {
          if (dfs(neighbor)) return true;
        } else if (recStack.has(neighbor)) {
          return true;
        }
      }

      recStack.delete(nodeId);
      return false;
    };

    for (const node of nodes) {
      if (!visited.has(node.id)) {
        if (dfs(node.id)) return true;
      }
    }

    return false;
  }

  private checkVariables(ir: ProjectIR, diagnostics: CompilerDiagnostics): void {
    const declaredVars = new Set<string>();
    for (const gv of ir.globalVariables) declaredVars.add(gv.name);
    for (const scr of ir.screens) {
      for (const sv of scr.variables) declaredVars.add(sv.name);
    }

    const referencedVars = new Set<string>();

    for (const scr of ir.screens) {
      for (const node of scr.workflow.nodes) {
        if (node.type === 'VariableNode' || node.category === 'Variables') {
          const varName = String(node.config.varName || node.config.variableName || '');
          if (varName) {
            referencedVars.add(varName);
            if (!declaredVars.has(varName)) {
              diagnostics.warning(
                'WARN_MISSING_VARIABLE',
                `Logic node "${node.label}" accesses variable "${varName}" which is not declared in screen or global variables.`,
                'CompilerValidator',
                node.id
              );
            }
          }
        }
      }
    }

    // Check Unused Variables
    for (const vName of declaredVars) {
      if (!referencedVars.has(vName)) {
        diagnostics.info(
          'INFO_UNUSED_VARIABLE',
          `Variable "${vName}" is declared but never accessed in any logic workflow.`,
          'CompilerValidator'
        );
      }
    }
  }

  private checkResources(ir: ProjectIR, diagnostics: CompilerDiagnostics): void {
    if (ir.databases.length === 0) {
      diagnostics.info(
        'INFO_NO_DATABASE',
        'No database resources configured. Local embedded storage will be used by default.',
        'CompilerValidator'
      );
    }
  }
}

export const compilerValidator = new CompilerValidator();
