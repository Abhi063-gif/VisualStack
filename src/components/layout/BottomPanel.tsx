import React from 'react';
import { Tabs } from '../ui/Tabs';
import { useLayoutStore } from '../../stores/LayoutStore';
import type { BottomPanelTab } from '../../types/editor';
import { Terminal as TerminalIcon, AlertCircle, Code, Bot, Cpu } from 'lucide-react';
import { CodeEditor } from '../editor/CodeEditor';

export const BottomPanel: React.FC = () => {
  const { activeBottomTab, setActiveBottomTab } = useLayoutStore();

  const tabs: Array<{ id: BottomPanelTab; label: string; icon: React.ReactNode }> = [
    { id: 'terminal', label: 'Terminal', icon: <TerminalIcon size={14} /> },
    { id: 'console', label: 'Console', icon: <Cpu size={14} /> },
    { id: 'problems', label: 'Problems', icon: <AlertCircle size={14} /> },
    { id: 'code', label: 'Generated Code', icon: <Code size={14} /> },
    { id: 'ai', label: 'AI Chat', icon: <Bot size={14} /> },
  ];

  return (
    <div className="h-full bg-[#0e0f12] border-t border-[#232733] flex flex-col overflow-hidden select-none">
      <Tabs
        tabs={tabs}
        activeTab={activeBottomTab}
        onTabChange={(id: string) => setActiveBottomTab(id as BottomPanelTab)}
      />
      <div className="flex-1 overflow-hidden p-2 text-xs font-mono text-gray-300">
        {activeBottomTab === 'terminal' && (
          <div className="h-full bg-[#14161b] p-3 rounded border border-[#232733] font-mono text-emerald-400">
            <div>$ visualstack-studio init --module 01</div>
            <div className="text-gray-400">Environment initialized. Ready for commands...</div>
          </div>
        )}

        {activeBottomTab === 'console' && (
          <div className="h-full bg-[#14161b] p-3 rounded border border-[#232733] text-gray-400">
            [System] EventBus active. CommandManager history stack initialized.
          </div>
        )}

        {activeBottomTab === 'problems' && (
          <div className="h-full bg-[#14161b] p-3 rounded border border-[#232733] text-gray-500 italic">
            0 Problems detected in project.
          </div>
        )}

        {activeBottomTab === 'code' && (
          <div className="h-full rounded overflow-hidden border border-[#232733]">
            <CodeEditor />
          </div>
        )}

        {activeBottomTab === 'ai' && (
          <div className="h-full bg-[#14161b] p-3 rounded border border-[#232733] text-gray-400 flex flex-col justify-between">
            <div>[AI Engine] Ready to assist with .vstack schema edits.</div>
            <input
              type="text"
              placeholder="Ask AI assistant..."
              className="w-full bg-[#0e0f12] border border-[#232733] px-2 py-1 text-xs text-gray-200 rounded focus:outline-none focus:border-indigo-500"
              readOnly
            />
          </div>
        )}
      </div>
    </div>
  );
};
