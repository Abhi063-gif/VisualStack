import React from 'react';
import { cn } from '../../utils/cn';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs">
      <div className="w-full max-w-md rounded-lg border border-[#363c4e] bg-[#14161b] p-4 text-gray-200 shadow-xl">
        <div className="flex items-center justify-between border-b border-[#232733] pb-2 mb-3">
          <h3 className="text-sm font-semibold">{title || 'Dialog'}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-100 text-xs">✕</button>
        </div>
        <div>{children}</div>
      </div>
    </div>
  );
};

export const Dialog = Modal;

export interface TooltipProps {
  content: string;
  children: React.ReactNode;
}

export const Tooltip: React.FC<TooltipProps> = ({ content, children }) => (
  <div className="group relative inline-block">
    {children}
    <div className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 hidden group-hover:block rounded bg-[#222631] border border-[#363c4e] px-2 py-0.5 text-[10px] text-gray-200 shadow-md whitespace-nowrap z-50">
      {content}
    </div>
  </div>
);

export interface ContextMenuItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  shortcut?: string;
  danger?: boolean;
  action: () => void;
}

export interface ContextMenuProps {
  x: number;
  y: number;
  isOpen: boolean;
  onClose: () => void;
  items: ContextMenuItem[];
}

export const ContextMenu: React.FC<ContextMenuProps> = ({ x, y, isOpen, onClose, items }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed z-50 min-w-[140px] rounded-md border border-[#363c4e] bg-[#14161b] p-1 text-xs shadow-xl"
      style={{ left: x, top: y }}
      onClick={onClose}
    >
      {items.map((item) => (
        <button
          key={item.id}
          onClick={item.action}
          className={cn(
            'flex w-full items-center justify-between rounded px-2 py-1 text-left hover:bg-[#222631]',
            item.danger ? 'text-rose-400 hover:text-rose-300' : 'text-gray-200'
          )}
        >
          <span className="flex items-center gap-1.5">
            {item.icon}
            {item.label}
          </span>
          {item.shortcut && <span className="text-[10px] text-gray-500">{item.shortcut}</span>}
        </button>
      ))}
    </div>
  );
};
