import type { GeneratorContext } from './GeneratorContext';
import type { GeneratedFile } from '../CompilerContext';

export interface FrameworkAdapter {
  id: string;
  name: string;
  targetFramework: string;
  supportsLanguage: (lang: string) => boolean;
  generateProject: (context: GeneratorContext) => GeneratedFile[];
}
