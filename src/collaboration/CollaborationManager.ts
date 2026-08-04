import { sessionManager } from './SessionManager';
import { presenceManager } from './PresenceManager';
import { cursorManager } from './CursorManager';
import { realtimeSyncEngine } from './RealtimeSyncEngine';
import { conflictResolver } from './ConflictResolver';

export class SynchronizationService {
  private pendingQueue: any[] = [];

  public syncPendingChanges(): void {
    if (this.pendingQueue.length === 0) return;
    setTimeout(() => {
      this.pendingQueue = [];
    }, 300);
  }
}

export class CollaborationManager {
  public sessions = sessionManager;
  public presence = presenceManager;
  public cursors = cursorManager;
  public syncEngine = realtimeSyncEngine;
  public resolver = conflictResolver;
  public service = new SynchronizationService();

  public getSessionSummary() {
    return {
      current: this.sessions.getCurrentSession(),
      activeUsers: this.sessions.getActiveSessions(),
      activeCursors: this.cursors.getActiveCursors(),
      presences: this.presence.getPresences(),
    };
  }
}

export const collaborationManager = new CollaborationManager();
