import type { ProjectIR } from './ir/ProjectIR';
import { CompilerDiagnostics } from './CompilerDiagnostics';
import { CompilerLogger } from './CompilerLogger';

export interface GeneratedFile {
  path: string;
  content: string;
  type: 'typescript' | 'json' | 'css' | 'html' | 'markdown' | 'dart' | 'python';
  hash?: string;
}

export interface CompilerOptions {
  targetFramework: 'react-express' | 'nextjs' | 'vue-express' | 'flutter' | 'react-native' | 'nestjs' | 'fastapi';
  language: 'typescript' | 'javascript' | 'dart' | 'python';
  cssFramework: 'tailwind' | 'css-modules' | 'vanilla';
  linting: boolean;
  formatting: boolean;
}

export class CompilerContext {
  public options: CompilerOptions;
  public diagnostics: CompilerDiagnostics;
  public logger: CompilerLogger;
  public ir: ProjectIR | null = null;
  public generatedFiles: GeneratedFile[] = [];

  constructor(options?: Partial<CompilerOptions>) {
    this.options = {
      targetFramework: options?.targetFramework || 'react-express',
      language: options?.language || 'typescript',
      cssFramework: options?.cssFramework || 'tailwind',
      linting: options?.linting ?? true,
      formatting: options?.formatting ?? true,
    };
    this.diagnostics = new CompilerDiagnostics();
    this.logger = new CompilerLogger();
  }

  public reset(): void {
    this.diagnostics.clear();
    this.logger.clear();
    this.ir = null;
    this.generatedFiles = [];
  }
}
