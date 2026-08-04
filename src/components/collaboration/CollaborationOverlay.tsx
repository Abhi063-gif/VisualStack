import React, { useState, useEffect } from 'react';
import { cursorManager, type RemoteCursor } from '../../collaboration/CursorManager';
import { MousePointer } from 'lucide-react';

export const CollaborationOverlay: React.FC = () => {
  const [cursors, setCursors] = useState<RemoteCursor[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCursors(cursorManager.getActiveCursors());
    }, 100);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-40 overflow-hidden font-sans">
      {cursors.map((c) => (
        <div
          key={c.sessionId}
          style={{
            transform: `translate3d(${c.x}px, ${c.y}px, 0)`,
            transition: 'transform 0.08s ease-out',
          }}
          className="absolute top-0 left-0 flex items-center gap-1 shrink-0"
        >
          <MousePointer size={16} style={{ color: c.color, fill: c.color }} />
          <span
            style={{ backgroundColor: c.color }}
            className="px-1.5 py-0.5 rounded text-[10px] font-bold text-white shadow-md whitespace-nowrap"
          >
            {c.userName}
          </span>
        </div>
      ))}
    </div>
  );
};
