export interface ITool {
  id: string;
  name: string;
  cursor: string;
  onActivate?(): void;
  onDeactivate?(): void;
}

export abstract class BaseTool implements ITool {
  public readonly id: string;
  public readonly name: string;
  public readonly cursor: string;

  constructor(id: string, name: string, cursor = 'default') {
    this.id = id;
    this.name = name;
    this.cursor = cursor;
  }

  public onActivate(): void {}
  public onDeactivate(): void {}
}
