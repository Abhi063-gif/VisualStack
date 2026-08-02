export interface DataBindingRule {
  id: string;
  sourceType: 'variable' | 'component_input' | 'node_output' | 'env_secret';
  sourcePath: string;
  targetType: 'node_input' | 'component_state' | 'api_payload' | 'db_param';
  targetPath: string;
  transformExpression?: string;
}

export class DataMappingEngine {
  private bindings: Map<string, DataBindingRule> = new Map();

  /**
   * Evaluates dynamic handlebar expressions like {{ variables.user_id }} or {{ input_email.value }}
   */
  public evaluateExpression(expression: string, context: Record<string, unknown>): unknown {
    if (!expression.includes('{{')) return expression;

    return expression.replace(/\{\{\s*([\w.]+)\s*\}\}/g, (_, path) => {
      const keys = path.split('.');
      let current: unknown = context;
      for (const k of keys) {
        if (current && typeof current === 'object' && k in (current as Record<string, unknown>)) {
          current = (current as Record<string, unknown>)[k];
        } else {
          return '';
        }
      }
      return String(current ?? '');
    });
  }

  /**
   * Automatically adapts and infers bindings when canvas wires or UI components are connected.
   */
  public autoDetectBindings(sourceId: string, targetId: string, sourcePortName: string, targetPortName: string): DataBindingRule {
    const bindingId = `auto_bind_${sourceId}_${targetId}_${Date.now()}`;
    const autoRule: DataBindingRule = {
      id: bindingId,
      sourceType: sourceId.startsWith('btn') || sourceId.startsWith('input') ? 'component_input' : 'node_output',
      sourcePath: `${sourceId}.${sourcePortName}`,
      targetType: 'node_input',
      targetPath: `${targetId}.${targetPortName}`,
      transformExpression: `{{ ${sourceId}.${sourcePortName} }}`,
    };

    this.registerBinding(autoRule);
    return autoRule;
  }

  public registerBinding(rule: DataBindingRule): void {
    this.bindings.set(rule.id, rule);
  }

  public getBindings(): DataBindingRule[] {
    return Array.from(this.bindings.values());
  }

  public removeBinding(id: string): boolean {
    return this.bindings.delete(id);
  }
}

export const dataMappingEngine = new DataMappingEngine();
