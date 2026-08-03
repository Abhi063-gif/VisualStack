export type DiagnosticSeverity = 'error' | 'warning' | 'info';

export interface DiagnosticItem {
  id: string;
  code: string;
  severity: DiagnosticSeverity;
  message: string;
  sourceModule: string;
  targetId?: string;
  location?: { line?: number; column?: number; file?: string };
}

export class CompilerDiagnostics {
  private diagnostics: DiagnosticItem[] = [];

  public add(severity: DiagnosticSeverity, code: string, message: string, sourceModule: string, targetId?: string): DiagnosticItem {
    const item: DiagnosticItem = {
      id: `diag_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      code,
      severity,
      message,
      sourceModule,
      targetId,
    };
    this.diagnostics.push(item);
    return item;
  }

  public error(code: string, message: string, sourceModule: string, targetId?: string): DiagnosticItem {
    return this.add('error', code, message, sourceModule, targetId);
  }

  public warning(code: string, message: string, sourceModule: string, targetId?: string): DiagnosticItem {
    return this.add('warning', code, message, sourceModule, targetId);
  }

  public info(code: string, message: string, sourceModule: string, targetId?: string): DiagnosticItem {
    return this.add('info', code, message, sourceModule, targetId);
  }

  public getErrors(): DiagnosticItem[] {
    return this.diagnostics.filter((d) => d.severity === 'error');
  }

  public getWarnings(): DiagnosticItem[] {
    return this.diagnostics.filter((d) => d.severity === 'warning');
  }

  public getAll(): DiagnosticItem[] {
    return [...this.diagnostics];
  }

  public clear(): void {
    this.diagnostics = [];
  }

  public hasErrors(): boolean {
    return this.diagnostics.some((d) => d.severity === 'error');
  }
}
