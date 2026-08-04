export interface VersionCheckpoint {
  id: string;
  name: string;
  authorName: string;
  timestamp: string;
  type: 'auto' | 'named';
  changesSummary: string;
  snapshotData: any;
}

export class VersionHistoryEngine {
  private checkpoints: VersionCheckpoint[] = [];
  private listeners: Set<() => void> = new Set();

  constructor() {
    this.loadFromStorage();
  }

  private loadFromStorage() {
    try {
      const saved = localStorage.getItem('visualstack_version_snapshots');
      if (saved) {
        this.checkpoints = JSON.parse(saved);
      } else {
        this.createCheckpoint('Initial Project Baseline', 'System Admin', 'auto');
      }
    } catch (e) {
      console.warn('Failed to load visualstack_version_snapshots', e);
    }
  }

  private saveToStorage() {
    try {
      localStorage.setItem('visualstack_version_snapshots', JSON.stringify(this.checkpoints));
      this.notifyListeners();
    } catch (e) {
      console.warn('Failed to save visualstack_version_snapshots', e);
    }
  }

  public subscribe(fn: () => void): () => void {
    this.listeners.add(fn);
    return () => this.listeners.delete(fn);
  }

  private notifyListeners() {
    this.listeners.forEach((fn) => fn());
  }

  public createCheckpoint(name: string, authorName = 'Alex Johnson', type: 'auto' | 'named' = 'named', snapshotData?: any): VersionCheckpoint {
    const checkpoint: VersionCheckpoint = {
      id: `ckpt_${Date.now().toString(36)}`,
      name,
      authorName,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      type,
      changesSummary: `Snapshot created at ${new Date().toLocaleTimeString()}`,
      snapshotData: snapshotData || { timestamp: Date.now() },
    };
    this.checkpoints.unshift(checkpoint);
    this.saveToStorage();
    return checkpoint;
  }

  public getCheckpoints(): VersionCheckpoint[] {
    return [...this.checkpoints];
  }

  public restoreCheckpoint(checkpointId: string): boolean {
    const target = this.checkpoints.find((c) => c.id === checkpointId);
    if (!target) return false;
    // Broadcast restore action or notify listeners
    this.notifyListeners();
    return true;
  }
}

export const versionHistoryEngine = new VersionHistoryEngine();
