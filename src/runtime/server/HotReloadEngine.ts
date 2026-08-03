type ReloadListener = (url: string) => void;

export class HotReloadEngine {
  private listeners: ReloadListener[] = [];

  public onReload(listener: ReloadListener): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  public triggerReload(url: string = 'http://localhost:3000'): void {
    for (const listener of this.listeners) {
      listener(url);
    }
  }
}

export const hotReloadEngine = new HotReloadEngine();
