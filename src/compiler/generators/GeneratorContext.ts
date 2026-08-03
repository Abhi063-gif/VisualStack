import type { ProjectIR } from '../ir/ProjectIR';
import { CompilerDiagnostics } from '../CompilerDiagnostics';
import { CompilerLogger } from '../CompilerLogger';

export interface GeneratorContext {
  ir: ProjectIR;
  targetFramework: string;
  language: 'typescript' | 'javascript' | 'dart' | 'python';
  cssFramework: 'tailwind' | 'css-modules' | 'vanilla';
  diagnostics: CompilerDiagnostics;
  logger: CompilerLogger;
}
