import React from 'react';
import { LayoutGrid, Workflow, Box, Settings, FolderTree } from 'lucide-react';
import { useLayoutStore } from '../../stores/LayoutStore';
import type { ActivityBarItem } from '../../types/editor';
import { cn } from '../../utils/cn';
import { useNavigate, useLocation } from 'react-router-dom';

export const ActivityBar: React.FC = () => {
  const { activeActivityItem, setActiveActivityItem } = useLayoutStore();
  const navigate = useNavigate();
  const location = useLocation();

  const items: Array<{ id: ActivityBarItem; label: string; icon: React.ReactNode; path: string }> = [
    { id: 'explorer', label: 'Explorer', icon: <FolderTree size={18} />, path: '/designer' },
    { id: 'designer', label: 'Visual UI Designer', icon: <LayoutGrid size={18} />, path: '/designer' },
    { id: 'backend', label: 'Backend Flow', icon: <Workflow size={18} />, path: '/backend' },
    { id: 'plugins', label: 'Plugins', icon: <Box size={18} />, path: '/plugins' },
    { id: 'settings', label: 'Settings', icon: <Settings size={18} />, path: '/settings' },
  ];

  const handleSelect = (id: ActivityBarItem, path: string) => {
    setActiveActivityItem(id);
    navigate(path);
  };

  return (
    <div className="w-12 bg-[#0e0f12] border-r border-[#232733] flex flex-col items-center py-2 gap-1 select-none z-10">
      {items.map((item) => {
        const isActive = location.pathname === item.path && activeActivityItem === item.id;
        return (
          <button
            key={item.id}
            onClick={() => handleSelect(item.id, item.path)}
            title={item.label}
            className={cn(
              'w-9 h-9 flex items-center justify-center rounded-md transition-colors cursor-pointer',
              isActive
                ? 'bg-indigo-600/20 text-indigo-400 border border-indigo-500/30'
                : 'text-gray-400 hover:text-gray-200 hover:bg-[#1a1d24]'
            )}
          >
            {item.icon}
          </button>
        );
      })}
    </div>
  );
};
