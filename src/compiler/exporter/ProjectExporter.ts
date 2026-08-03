import type { GeneratedFile } from '../CompilerContext';

export interface ExportOptions {
  exportFormat: 'json' | 'zip' | 'folder';
  targetFramework: string;
}

export class ProjectExporter {
  public exportProjectBundle(files: GeneratedFile[], options: ExportOptions): void {
    const timestamp = Date.now();
    const fileName = `visualstack_${options.targetFramework}_${timestamp}.json`;

    const bundle = {
      version: '1.0.0',
      exportedAt: new Date().toISOString(),
      targetFramework: options.targetFramework,
      totalFiles: files.length,
      files,
    };

    const blob = new Blob([JSON.stringify(bundle, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    a.click();
    URL.revokeObjectURL(url);
  }
}

export const projectExporter = new ProjectExporter();
