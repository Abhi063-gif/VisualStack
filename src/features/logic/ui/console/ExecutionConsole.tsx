import React, { useState } from 'react';
import * as Icons from 'lucide-react';
import { useLogicStore } from '../../../../stores/LogicStore';

export const ExecutionConsole: React.FC = () => {
  const { executionLogs, clearLogs } = useLogicStore();
  const [filterLevel, setFilterLevel] = useState<'all' | 'info' | 'warn' | 'error'>('all');
  const [collapsed, setCollapsed] = useState(false);

  const filteredLogs = filterLevel === 'all'
    ? executionLogs
    : executionLogs.filter((log) => log.level === filterLevel);

  return (
    <div className={`bg-slate-950 border-t border-slate-800 transition-all duration-200 flex flex-col ${collapsed ? 'h-9' : 'h-48'}`}>
      {/* Console Header bar */}
      <div className="h-9 px-3.5 bg-slate-900 border-b border-slate-800 flex items-center justify-between select-none">
        <div className="flex items-center gap-2">
          <Icons.Terminal size={14} className="text-indigo-400" />
          <span className="text-xs font-semibold text-slate-300">Execution Console</span>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-800 text-slate-400">
            {executionLogs.length} logs
          </span>
        </div>

        {/* Console Actions */}
        <div className="flex items-center gap-2">
          <div className="flex gap-1 text-[10px]">
            {(['all', 'info', 'warn', 'error'] as const).map((lvl) => (
              <button
                key={lvl}
                onClick={() => setFilterLevel(lvl)}
                className={`px-2 py-0.5 rounded capitalize transition-colors ${
                  filterLevel === lvl ? 'bg-indigo-600 text-white font-medium' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {lvl}
              </button>
            ))}
          </div>

          <button
            onClick={clearLogs}
            className="p-1 text-slate-400 hover:text-slate-200 rounded hover:bg-slate-800 transition-colors"
            title="Clear Logs"
          >
            <Icons.Trash size={12} />
          </button>

          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-1 text-slate-400 hover:text-slate-200 rounded hover:bg-slate-800 transition-colors"
          >
            {collapsed ? <Icons.ChevronUp size={14} /> : <Icons.ChevronDown size={14} />}
          </button>
        </div>
      </div>

      {/* Console Output Stream */}
      {!collapsed && (
        <div className="flex-1 overflow-y-auto p-3 font-mono text-[11px] space-y-1.5 scrollbar-thin scrollbar-thumb-slate-800">
          {filteredLogs.map((log) => {
            const isError = log.level === 'error';
            const isWarn = log.level === 'warn';

            return (
              <div
                key={log.id}
                className={`flex items-start gap-2.5 leading-relaxed border-l-2 pl-2 ${
                  isError
                    ? 'border-red-500 text-red-400 bg-red-950/20'
                    : isWarn
                    ? 'border-amber-500 text-amber-300 bg-amber-950/20'
                    : 'border-slate-700 text-slate-300'
                }`}
              >
                <span className="text-[10px] text-slate-500 shrink-0">
                  {new Date(log.timestamp).toLocaleTimeString()}
                </span>
                <span className="break-all">{log.message}</span>
              </div>
            );
          })}

          {filteredLogs.length === 0 && (
            <div className="text-slate-600 italic py-4 text-center">Console is empty. Run logic graph to view execution logs.</div>
          )}
        </div>
      )}
    </div>
  );
};
