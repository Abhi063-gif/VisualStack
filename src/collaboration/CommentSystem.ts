export interface CommentItem {
  id: string;
  targetType: 'canvas_node' | 'backend_node' | 'file' | 'code_line';
  targetId: string;
  authorName: string;
  authorColor: string;
  content: string;
  timestamp: string;
  isResolved: boolean;
  replies: Array<{ id: string; authorName: string; content: string; timestamp: string }>;
  position?: { x: number; y: number };
}

export class CommentSystem {
  private comments: Map<string, CommentItem> = new Map();
  private listeners: Set<() => void> = new Set();

  constructor() {
    this.loadFromStorage();
  }

  private loadFromStorage() {
    try {
      const saved = localStorage.getItem('visualstack_comments');
      if (saved) {
        const parsed: CommentItem[] = JSON.parse(saved);
        parsed.forEach((c) => this.comments.set(c.id, c));
      } else {
        // Seed initial demo comment if empty
        this.addComment({
          targetType: 'canvas_node',
          targetId: 'node_hero',
          authorName: 'Sarah Chen (Lead)',
          authorColor: '#10b981',
          content: '@Alex Please update hero heading to bold white font.',
          timestamp: new Date().toLocaleTimeString(),
          position: { x: 140, y: 210 },
        });
      }
    } catch (e) {
      console.warn('Failed to load visualstack_comments', e);
    }
  }

  private saveToStorage() {
    try {
      const list = Array.from(this.comments.values());
      localStorage.setItem('visualstack_comments', JSON.stringify(list));
      this.notifyListeners();
    } catch (e) {
      console.warn('Failed to save visualstack_comments', e);
    }
  }

  public subscribe(fn: () => void): () => void {
    this.listeners.add(fn);
    return () => this.listeners.delete(fn);
  }

  private notifyListeners() {
    this.listeners.forEach((fn) => fn());
  }

  public addComment(input: Omit<CommentItem, 'id' | 'isResolved' | 'replies'>): CommentItem {
    const comment: CommentItem = {
      ...input,
      id: `comment_${Date.now().toString(36)}`,
      isResolved: false,
      replies: [],
    };
    this.comments.set(comment.id, comment);
    this.saveToStorage();
    return comment;
  }

  public addReply(commentId: string, authorName: string, content: string): boolean {
    const target = this.comments.get(commentId);
    if (!target) return false;
    target.replies.push({
      id: `reply_${Date.now().toString(36)}`,
      authorName,
      content,
      timestamp: new Date().toLocaleTimeString(),
    });
    this.saveToStorage();
    return true;
  }

  public toggleResolve(commentId: string): boolean {
    const target = this.comments.get(commentId);
    if (!target) return false;
    target.isResolved = !target.isResolved;
    this.saveToStorage();
    return true;
  }

  public deleteComment(commentId: string): boolean {
    const res = this.comments.delete(commentId);
    if (res) this.saveToStorage();
    return res;
  }

  public getComments(targetType?: CommentItem['targetType']): CommentItem[] {
    const all = Array.from(this.comments.values());
    if (!targetType) return all;
    return all.filter((c) => c.targetType === targetType);
  }
}

export const commentSystem = new CommentSystem();
