import React, { useState } from 'react';
import { MessageSquare, Send, CheckCircle, X, CornerDownRight } from 'lucide-react';
import { commentSystem, type CommentItem } from '../../collaboration/CommentSystem';
import { sessionManager } from '../../collaboration/SessionManager';

export const CommentsPanel: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const [comments, setComments] = useState<CommentItem[]>(commentSystem.getComments());
  const [newContent, setNewContent] = useState('');
  const [replyInputs, setReplyInputs] = useState<Record<string, string>>({});

  if (!isOpen) return null;

  const handleAddComment = () => {
    if (!newContent.trim()) return;
    const session = sessionManager.getCurrentSession();
    commentSystem.addComment({
      targetType: 'canvas_node',
      targetId: 'canvas_main',
      authorName: session.userName,
      authorColor: session.color,
      content: newContent,
      timestamp: new Date().toLocaleTimeString(),
    });
    setNewContent('');
    setComments(commentSystem.getComments());
  };

  const handleAddReply = (commentId: string) => {
    const text = replyInputs[commentId];
    if (!text || !text.trim()) return;
    const session = sessionManager.getCurrentSession();
    commentSystem.addReply(commentId, session.userName, text);
    setReplyInputs((prev) => ({ ...prev, [commentId]: '' }));
    setComments(commentSystem.getComments());
  };

  const handleResolve = (id: string) => {
    commentSystem.toggleResolve(id);
    setComments(commentSystem.getComments());
  };

  return (
    <div className="fixed inset-y-0 right-0 w-[380px] bg-[#0c0d12] border-l border-[#232733] shadow-2xl z-50 flex flex-col font-sans text-gray-100">
      {/* Header */}
      <div className="bg-[#14161b] border-b border-[#232733] px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MessageSquare size={16} className="text-indigo-400" />
          <h2 className="text-xs font-bold text-gray-200">Threaded Comments & Review ({comments.length})</h2>
        </div>
        <button onClick={onClose} className="p-1 hover:bg-[#1f232d] text-gray-400 hover:text-white rounded">
          <X size={16} />
        </button>
      </div>

      {/* Comment List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
        {comments.map((c) => (
          <div key={c.id} className={`p-3 rounded-xl border text-xs space-y-2 ${c.isResolved ? 'bg-[#0f1116] border-[#1e2330] opacity-60' : 'bg-[#14161b] border-[#232733]'}`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div style={{ backgroundColor: c.authorColor }} className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold text-white uppercase">
                  {c.authorName.charAt(0)}
                </div>
                <span className="font-bold text-gray-200">{c.authorName}</span>
                <span className="text-[10px] text-gray-500">• {c.timestamp}</span>
              </div>
              <button onClick={() => handleResolve(c.id)} className="text-gray-400 hover:text-emerald-400" title="Resolve Thread">
                <CheckCircle size={14} className={c.isResolved ? 'text-emerald-400' : ''} />
              </button>
            </div>

            <p className="text-gray-300 leading-relaxed font-sans">{c.content}</p>

            {/* Replies */}
            {c.replies.length > 0 && (
              <div className="pl-3 border-l-2 border-[#232733] space-y-2 pt-1">
                {c.replies.map((r) => (
                  <div key={r.id} className="text-[11px]">
                    <div className="flex items-center gap-1.5 font-bold text-indigo-300">
                      <CornerDownRight size={10} />
                      <span>{r.authorName}</span>
                      <span className="text-[9px] text-gray-500 font-normal">• {r.timestamp}</span>
                    </div>
                    <p className="text-gray-400 pl-3">{r.content}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Reply Input */}
            <div className="flex items-center gap-1 pt-1">
              <input
                type="text"
                value={replyInputs[c.id] || ''}
                onChange={(e) => setReplyInputs({ ...replyInputs, [c.id]: e.target.value })}
                onKeyDown={(e) => e.key === 'Enter' && handleAddReply(c.id)}
                placeholder="Reply to thread..."
                className="flex-1 bg-[#0e0f12] border border-[#232733] rounded px-2 py-1 text-[11px] text-gray-300 outline-none"
              />
              <button onClick={() => handleAddReply(c.id)} className="p-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded">
                <Send size={11} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* New Comment Input Footer */}
      <div className="p-3 bg-[#14161b] border-t border-[#232733] flex items-center gap-2">
        <input
          type="text"
          value={newContent}
          onChange={(e) => setNewContent(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleAddComment()}
          placeholder="Add comment or @mention team..."
          className="flex-1 bg-[#0e0f12] border border-[#232733] rounded-lg px-3 py-2 text-xs text-gray-200 outline-none focus:border-indigo-500 font-sans"
        />
        <button onClick={handleAddComment} className="p-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs shadow-md">
          <Send size={14} />
        </button>
      </div>
    </div>
  );
};
