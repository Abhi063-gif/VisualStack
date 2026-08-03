import type { FrameworkAdapter } from './FrameworkAdapter';

export class GeneratorRegistry {
  private adapters: Map<string, FrameworkAdapter> = new Map();

  public register(adapter: FrameworkAdapter): void {
    this.adapters.set(adapter.targetFramework, adapter);
  }

  public get(targetFramework: string): FrameworkAdapter | undefined {
    return this.adapters.get(targetFramework);
  }

  public getAll(): FrameworkAdapter[] {
    return Array.from(this.adapters.values());
  }
}

export const generatorRegistry = new GeneratorRegistry();
