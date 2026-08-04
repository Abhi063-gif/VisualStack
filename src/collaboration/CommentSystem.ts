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

  constructor() {
    // Seed initial demo comment
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

  public addComment(input: Omit<CommentItem, 'id' | 'isResolved' | 'replies'>): CommentItem {
    const comment: CommentItem = {
      ...input,
      id: `comment_${Date.now().toString(36)}`,
      isResolved: false,
      replies: [],
    };
    this.comments.set(comment.id, comment);
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
    return true;
  }

  public toggleResolve(commentId: string): boolean {
    const target = this.comments.get(commentId);
    if (!target) return false;
    target.isResolved = !target.isResolved;
    return true;
  }

  public getComments(targetType?: CommentItem['targetType']): CommentItem[] {
    const all = Array.from(this.comments.values());
    if (!targetType) return all;
    return all.filter((c) => c.targetType === targetType);
  }
}

export const commentSystem = new CommentSystem();
