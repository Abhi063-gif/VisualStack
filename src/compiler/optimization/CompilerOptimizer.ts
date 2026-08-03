import type { ProjectIR } from '../ir/ProjectIR';
import { CompilerDiagnostics } from '../CompilerDiagnostics';

export class CompilerOptimizer {
  public optimize(ir: ProjectIR, diagnostics: CompilerDiagnostics): ProjectIR {
    this.optimizeRoutes(ir);
    this.pruneDeadNodes(ir, diagnostics);
    this.pruneUnusedVariables(ir, diagnostics);
    return ir;
  }

  private optimizeRoutes(ir: ProjectIR): void {
    for (const scr of ir.screens) {
      let path = scr.route.path.trim();

      // Normalize multiple slashes and trailing slashes
      path = path.replace(/\/+/g, '/');
      if (path.length > 1 && path.endsWith('/')) {
        path = path.slice(0, -1);
      }

      scr.route.path = path;
    }
  }

  private pruneDeadNodes(ir: ProjectIR, diagnostics: CompilerDiagnostics): void {
    for (const scr of ir.screens) {
      const connectedNodeIds = new Set<string>();

      // Entry trigger nodes are automatically connected
      for (const node of scr.workflow.nodes) {
        if (node.category === 'Events' || node.type.includes('Event')) {
          connectedNodeIds.add(node.id);
        }
      }

      // BFS to find all reachable nodes from triggers
      let queue = Array.from(connectedNodeIds);
      while (queue.length > 0) {
        const currentId = queue.shift()!;
        const outgoingEdges = scr.workflow.edges.filter((e) => e.sourceNodeId === currentId);
        for (const edge of outgoingEdges) {
          if (!connectedNodeIds.has(edge.targetNodeId)) {
            connectedNodeIds.add(edge.targetNodeId);
            queue.push(edge.targetNodeId);
          }
        }
      }

      // Identify dead orphan nodes
      const initialCount = scr.workflow.nodes.length;
      scr.workflow.nodes = scr.workflow.nodes.filter((n) => connectedNodeIds.has(n.id));
      const prunedCount = initialCount - scr.workflow.nodes.length;

      if (prunedCount > 0) {
        diagnostics.info(
          'INFO_PRUNED_DEAD_NODES',
          `Tree shaking: Pruned ${prunedCount} disconnected orphan node(s) on screen "${scr.name}".`,
          'CompilerOptimizer',
          scr.id
        );
      }
    }
  }

  private pruneUnusedVariables(ir: ProjectIR, diagnostics: CompilerDiagnostics): void {
    const referencedVars = new Set<string>();

    for (const scr of ir.screens) {
      for (const node of scr.workflow.nodes) {
        const varName = String(node.config.varName || node.config.variableName || '');
        if (varName) referencedVars.add(varName);
      }
    }

    const initialGlobalVarsCount = ir.globalVariables.length;
    ir.globalVariables = ir.globalVariables.filter((v) => referencedVars.has(v.name));
    const prunedGlobalVars = initialGlobalVarsCount - ir.globalVariables.length;

    if (prunedGlobalVars > 0) {
      diagnostics.info(
        'INFO_PRUNED_UNUSED_VARS',
        `Optimization: Pruned ${prunedGlobalVars} unused global variable(s).`,
        'CompilerOptimizer'
      );
    }
  }
}

export const compilerOptimizer = new CompilerOptimizer();
