export interface RuntimeDiagnosticIssue {
  id: string;
  type: 'syntax' | 'missing_dependency' | 'port_conflict' | 'db_connection';
  message: string;
  suggestedFix: string;
  file?: string;
  line?: number;
}

export class RuntimeDiagnostics {
  private issues: RuntimeDiagnosticIssue[] = [];

  public getDiagnostics(): RuntimeDiagnosticIssue[] {
    return [...this.issues];
  }

  public reportIssue(issue: Omit<RuntimeDiagnosticIssue, 'id'>): void {
    this.issues.push({
      ...issue,
      id: `diag_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
    });
  }

  public clearDiagnostics(): void {
    this.issues = [];
  }
}

export const runtimeDiagnostics = new RuntimeDiagnostics();
