export interface ICompiler {
  compile(project: unknown): Promise<unknown>;
}
