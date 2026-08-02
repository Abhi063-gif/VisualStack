import type { ICommand } from './Command';
import { eventBus } from '../events/EventBus';
import { SystemEventType } from '../events/EventTypes';

export class CommandManager {
  private static instance: CommandManager;
  private undoStack: ICommand[] = [];
  private redoStack: ICommand[] = [];
  private maxHistory: number = 100;

  private constructor() {}

  public static getInstance(): CommandManager {
    if (!CommandManager.instance) {
      CommandManager.instance = new CommandManager();
    }
    return CommandManager.instance;
  }

  public async executeCommand(command: ICommand): Promise<void> {
    await command.execute();
    this.undoStack.push(command);
    this.redoStack = [];

    if (this.undoStack.length > this.maxHistory) {
      this.undoStack.shift();
    }

    eventBus.emit(SystemEventType.COMMAND_EXECUTED, {
      commandId: command.id,
      description: command.description,
    });
  }

  public async undo(): Promise<boolean> {
    const command = this.undoStack.pop();
    if (!command) return false;

    await command.undo();
    this.redoStack.push(command);

    eventBus.emit(SystemEventType.COMMAND_UNDONE, { commandId: command.id });
    return true;
  }

  public async redo(): Promise<boolean> {
    const command = this.redoStack.pop();
    if (!command) return false;

    if (command.redo) {
      await command.redo();
    } else {
      await command.execute();
    }
    this.undoStack.push(command);

    eventBus.emit(SystemEventType.COMMAND_REDONE, { commandId: command.id });
    return true;
  }

  public canUndo(): boolean {
    return this.undoStack.length > 0;
  }

  public canRedo(): boolean {
    return this.redoStack.length > 0;
  }

  public getUndoStack(): ReadonlyArray<ICommand> {
    return this.undoStack;
  }

  public getRedoStack(): ReadonlyArray<ICommand> {
    return this.redoStack;
  }

  public clear(): void {
    this.undoStack = [];
    this.redoStack = [];
  }
}

export const commandManager = CommandManager.getInstance();
