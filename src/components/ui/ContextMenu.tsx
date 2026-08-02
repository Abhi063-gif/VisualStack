import React, { useEffect, useRef } from 'react';

export interface ContextMenuItem {
  label: string;
  action: () => void;
  danger?: boolean;
  divider?: boolean;
}

export interface ContextMenuProps {
  x: number;
  y: number;
  items: ContextMenuItem[];
  onClose: () => void;
}

export const ContextMenu: React.FC<ContextMenuProps> = ({ x, y, items, onClose }) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onClose();
      }
    };
    window.addEventListener('mousedown', handleClick);
    return () => window.removeEventListener('mousedown', handleClick);
  }, [onClose]);

  // Clamp to viewport
  const menuW = 180;
  const menuH = items.length * 30 + 8;
  const clampedX = Math.min(x, window.innerWidth - menuW - 8);
  const clampedY = Math.min(y, window.innerHeight - menuH - 8);

  return (
    <div
      ref={ref}
      style={{ left: clampedX, top: clampedY, position: 'fixed', zIndex: 9999 }}
      className="bg-[#14161b] border border-[#2d3142] rounded-lg shadow-2xl shadow-black/60 py-1 min-w-[160px] text-xs"
    >
      {items.map((item, i) => (
        <React.Fragment key={i}>
          {item.divider && <div className="h-px bg-[#232733] my-1" />}
          <button
            className={`w-full text-left px-3 py-1.5 hover:bg-[#1f232d] transition-colors rounded-sm ${
              item.danger ? 'text-rose-400' : 'text-gray-200'
            }`}
            onClick={() => { item.action(); onClose(); }}
          >
            {item.label}
          </button>
        </React.Fragment>
      ))}
    </div>
  );
};
