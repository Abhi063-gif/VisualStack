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

  public registerBinding(rule: DataBindingRule): void {
    this.bindings.set(rule.id, rule);
  }

  public getBindings(): DataBindingRule[] {
    return Array.from(this.bindings.values());
  }
}

export const dataMappingEngine = new DataMappingEngine();
