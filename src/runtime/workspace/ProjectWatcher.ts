type FileChangeCallback = (filePath: string, changeType: 'add' | 'change' | 'delete') => void;

export class ProjectWatcher {
  private isWatching: boolean = false;
  private callbacks: FileChangeCallback[] = [];

  public startWatching(_projectPath: string): void {
    this.isWatching = true;
  }

  public stopWatching(): void {
    this.isWatching = false;
  }

  public onChange(callback: FileChangeCallback): () => void {
    this.callbacks.push(callback);
    return () => {
      this.callbacks = this.callbacks.filter((cb) => cb !== callback);
    };
  }

  public notifyChange(filePath: string, changeType: 'add' | 'change' | 'delete'): void {
    if (!this.isWatching) return;
    for (const cb of this.callbacks) {
      cb(filePath, changeType);
    }
  }

  public getStatus(): boolean {
    return this.isWatching;
  }
}

export const projectWatcher = new ProjectWatcher();
