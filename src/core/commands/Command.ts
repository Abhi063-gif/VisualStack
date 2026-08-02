export interface ICommand {
  id: string;
  description: string;
  timestamp: number;
  execute(): void | Promise<void>;
  undo(): void | Promise<void>;
  redo?(): void | Promise<void>;
}

export abstract class BaseCommand implements ICommand {
  public readonly id: string;
  public readonly timestamp: number;
  public readonly description: string;

  constructor(description: string) {
    this.description = description;
    this.id = `cmd_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    this.timestamp = Date.now();
  }

  abstract execute(): void | Promise<void>;
  abstract undo(): void | Promise<void>;

  public redo(): void | Promise<void> {
    return this.execute();
  }
}
