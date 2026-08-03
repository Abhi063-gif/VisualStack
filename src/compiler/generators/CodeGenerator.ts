import type { GeneratorContext } from './GeneratorContext';
import type { GeneratorOutput } from './GeneratorOutput';
import { generatorRegistry } from './GeneratorRegistry';
import { ReactExpressGenerator } from './adapters/ReactExpressGenerator';
import { NextJSGenerator } from './adapters/NextJSGenerator';
import { VueExpressGenerator } from './adapters/VueExpressGenerator';
import { FlutterGenerator } from './adapters/FlutterGenerator';
import { ReactNativeGenerator } from './adapters/ReactNativeGenerator';
import { NestJSGenerator } from './adapters/NestJSGenerator';
import { FastAPIGenerator } from './adapters/FastAPIGenerator';

export class CodeGenerator {
  constructor() {
    this.registerDefaultAdapters();
  }

  private registerDefaultAdapters(): void {
    generatorRegistry.register(new ReactExpressGenerator());
    generatorRegistry.register(new NextJSGenerator());
    generatorRegistry.register(new VueExpressGenerator());
    generatorRegistry.register(new FlutterGenerator());
    generatorRegistry.register(new ReactNativeGenerator());
    generatorRegistry.register(new NestJSGenerator());
    generatorRegistry.register(new FastAPIGenerator());
  }

  public generate(context: GeneratorContext): GeneratorOutput {
    const adapter = generatorRegistry.get(context.targetFramework);
    const fallbackAdapter = generatorRegistry.get('react-express')!;
    const activeAdapter = adapter || fallbackAdapter;

    const files = activeAdapter.generateProject(context);

    return {
      targetFramework: activeAdapter.targetFramework,
      files,
      summary: {
        totalFiles: files.length,
        frontendPages: context.ir.screens.length,
        backendControllers: context.ir.screens.length,
        databaseModels: context.ir.databases.length,
      },
    };
  }
}

export const codeGenerator = new CodeGenerator();
