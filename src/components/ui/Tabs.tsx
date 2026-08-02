import React from 'react';
import { cn } from '../../utils/cn';

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
