import { sessionManager } from './SessionManager';
import { cursorManager } from './CursorManager';
import { conflictResolver, type PropertyMutation } from './ConflictResolver';
import { eventBus } from '../core/events/EventBus';
import { SystemEventType } from '../core/events/EventTypes';

export interface CollaborationPacket {
  type: 'cursor' | 'mutation' | 'selection' | 'presence' | 'comment';
  senderSessionId: string;
  senderName: string;
  senderColor: string;
  payload: any;
  timestamp: number;
}

export class RealtimeSyncEngine {
  private isConnected = true;

  constructor() {
    this.initLocalListeners();
  }

  private initLocalListeners(): void {
    // Broadcast local cursor position changes
    window.addEventListener('mousemove', (e: MouseEvent) => {
      if (!this.isConnected) return;
      const session = sessionManager.getCurrentSession();
      cursorManager.updateRemoteCursor(session.sessionId, session.userName, session.color, e.clientX, e.clientY);
    });
  }

  public broadcastMutation(nodeId: string, property: string, value: any): void {
    const session = sessionManager.getCurrentSession();
    const mutation: PropertyMutation = {
      nodeId,
      property,
      value,
      timestamp: Date.now(),
      sessionId: session.sessionId,
    };

    if (conflictResolver.resolveMutation(mutation)) {
      eventBus.emit(SystemEventType.CANVAS_NODE_UPDATED, { nodeId, changes: { [property]: value } });
    }
  }

  public simulateRemoteUserAction(userName: string, color: string): void {
    const remoteSessionId = `remote_${Date.now()}`;
    cursorManager.updateRemoteCursor(remoteSessionId, userName, color, 450 + Math.random() * 200, 250 + Math.random() * 150);
  }
}

export const realtimeSyncEngine = new RealtimeSyncEngine();
