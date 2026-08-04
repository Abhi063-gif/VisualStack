export interface RemoteCursor {
  sessionId: string;
  userName: string;
  color: string;
  x: number;
  y: number;
  lastUpdated: number;
}

export class CursorManager {
  private remoteCursors: Map<string, RemoteCursor> = new Map();

  public updateRemoteCursor(sessionId: string, userName: string, color: string, x: number, y: number): void {
    this.remoteCursors.set(sessionId, {
      sessionId,
      userName,
      color,
      x,
      y,
      lastUpdated: Date.now(),
    });
  }

  public removeCursor(sessionId: string): void {
    this.remoteCursors.delete(sessionId);
  }

  public getActiveCursors(): RemoteCursor[] {
    const now = Date.now();
    const active: RemoteCursor[] = [];
    this.remoteCursors.forEach((c) => {
      if (now - c.lastUpdated < 10000) {
        active.push(c);
      }
    });
    return active;
  }
}

export const cursorManager = new CursorManager();
