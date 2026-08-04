export type UserRole = 'Owner' | 'Admin' | 'Editor' | 'Developer' | 'Viewer' | 'Guest';

export interface UserSession {
  sessionId: string;
  userId: string;
  userName: string;
  userEmail: string;
  userRole: UserRole;
  avatarUrl?: string;
  color: string;
  joinedAt: string;
  activePageId?: string;
  activeScreenId?: string;
  cursorPosition?: { x: number; y: number };
  selectedNodeIds: string[];
}

export class SessionManager {
  private currentSession: UserSession;
  private activeSessions: Map<string, UserSession> = new Map();

  constructor() {
    const defaultUserId = `usr_${Math.random().toString(36).substring(2, 9)}`;
    this.currentSession = {
      sessionId: `sess_${Math.random().toString(36).substring(2, 9)}`,
      userId: defaultUserId,
      userName: 'Current Developer',
      userEmail: 'dev@visualstack.io',
      userRole: 'Owner',
      color: '#6366f1',
      joinedAt: new Date().toISOString(),
      selectedNodeIds: [],
    };
    this.activeSessions.set(this.currentSession.sessionId, this.currentSession);
  }

  public getCurrentSession(): UserSession {
    return { ...this.currentSession };
  }

  public updateCurrentSession(patch: Partial<UserSession>): UserSession {
    this.currentSession = { ...this.currentSession, ...patch };
    this.activeSessions.set(this.currentSession.sessionId, this.currentSession);
    return this.currentSession;
  }

  public registerRemoteSession(session: UserSession): void {
    if (session.sessionId !== this.currentSession.sessionId) {
      this.activeSessions.set(session.sessionId, session);
    }
  }

  public removeRemoteSession(sessionId: string): void {
    this.activeSessions.delete(sessionId);
  }

  public getActiveSessions(): UserSession[] {
    return Array.from(this.activeSessions.values());
  }

  public canEdit(): boolean {
    return ['Owner', 'Admin', 'Editor', 'Developer'].includes(this.currentSession.userRole);
  }

  public canManagePermissions(): boolean {
    return ['Owner', 'Admin'].includes(this.currentSession.userRole);
  }
}

export const sessionManager = new SessionManager();
