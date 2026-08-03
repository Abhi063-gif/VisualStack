import { CompilerContext, type CompilerOptions, type GeneratedFile } from './CompilerContext';
import { CompilerPipeline } from './CompilerPipeline';

export class Compiler {
  private pipeline: CompilerPipeline;

  constructor() {
    this.pipeline = new CompilerPipeline();
  }

  public async compile(options?: Partial<CompilerOptions>): Promise<{ files: GeneratedFile[]; context: CompilerContext }> {
    const context = new CompilerContext(options);
    const files = await this.pipeline.execute(context);
    return { files, context };
  }
}

export const compiler = new Compiler();
