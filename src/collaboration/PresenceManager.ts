import { sessionManager } from './SessionManager';

export interface PresenceBadge {
  userId: string;
  userName: string;
  color: string;
  status: 'online' | 'idle' | 'editing';
  currentLocation: string;
}

export class PresenceManager {
  private presences: Map<string, PresenceBadge> = new Map();

  constructor() {
    this.updateLocalPresence('online', 'Main Designer');
  }

  public updateLocalPresence(status: 'online' | 'idle' | 'editing', currentLocation: string): void {
    const session = sessionManager.getCurrentSession();
    const badge: PresenceBadge = {
      userId: session.userId,
      userName: session.userName,
      color: session.color,
      status,
      currentLocation,
    };
    this.presences.set(session.userId, badge);
  }

  public setRemotePresence(badge: PresenceBadge): void {
    this.presences.set(badge.userId, badge);
  }

  public removePresence(userId: string): void {
    this.presences.delete(userId);
  }

  public getPresences(): PresenceBadge[] {
    return Array.from(this.presences.values());
  }
}

export const presenceManager = new PresenceManager();
