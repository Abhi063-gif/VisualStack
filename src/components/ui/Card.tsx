import React from 'react';
import { cn } from '../../utils/cn';

export const Card: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className, children, ...props }) => (
  <div className={cn('rounded-md border border-[#232733] bg-[#14161b] p-3 text-gray-200 shadow-sm', className)} {...props}>
    {children}
  </div>
);

export const Panel: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className, children, ...props }) => (
  <div className={cn('flex flex-col bg-[#14161b] border-r border-[#232733] h-full overflow-hidden', className)} {...props}>
    {children}
  </div>
);

export const Toolbar: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className, children, ...props }) => (
  <div className={cn('flex items-center gap-1.5 h-9 bg-[#0e0f12] border-b border-[#232733] px-3 select-none', className)} {...props}>
    {children}
  </div>
);

export const Sidebar: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className, children, ...props }) => (
  <div className={cn('w-full h-full bg-[#14161b] text-gray-300 text-xs flex flex-col', className)} {...props}>
    {children}
  </div>
);

export interface TabsProps {
  tabs: Array<{ id: string; label: string; icon?: React.ReactNode }>;
  activeTab: string;
  onTabChange: (id: string) => void;
  className?: string;
}

export const Tabs: React.FC<TabsProps> = ({ tabs, activeTab, onTabChange, className }) => (
  <div className={cn('flex border-b border-[#232733] bg-[#0e0f12]', className)}>
    {tabs.map((tab) => (
      <button
        key={tab.id}
        onClick={() => onTabChange(tab.id)}
        className={cn(
          'flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium border-b-2 transition-colors cursor-pointer',
          activeTab === tab.id
            ? 'border-indigo-500 text-gray-100 bg-[#14161b]'
            : 'border-transparent text-gray-400 hover:text-gray-200 hover:bg-[#14161b]/50'
        )}
      >
        {tab.icon}
        <span>{tab.label}</span>
      </button>
    ))}
  </div>
);
