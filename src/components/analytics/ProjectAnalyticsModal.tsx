import React from 'react';
import { Activity, Code, Database, Cpu, X, Zap, Award } from 'lucide-react';
import { projectAnalyticsEngine } from '../../analytics/ProjectAnalyticsEngine';
import { userAnalyticsEngine } from '../../analytics/UserAnalyticsEngine';

export const ProjectAnalyticsModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const projMetrics = projectAnalyticsEngine.calculateMetrics();
  const userMetrics = userAnalyticsEngine.getMetrics();

  return (
    <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4 font-sans text-gray-100">
      <div className="bg-[#14161b] border border-[#232733] rounded-3xl w-full max-w-3xl max-h-[85vh] overflow-hidden shadow-2xl flex flex-col">
        {/* Header */}
        <div className="px-6 py-5 border-b border-[#232733] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-gradient-to-tr from-indigo-600 to-purple-600 text-white rounded-2xl border border-indigo-400/30">
              <Activity size={22} />
            </div>
            <div>
              <h2 className="text-sm font-bold text-gray-100">Project & Team Productivity Analytics</h2>
              <p className="text-[11px] text-gray-400">Real-time LOC generation, API endpoints, database schemas & velocity</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 hover:bg-[#1f232d] text-gray-400 hover:text-white rounded-xl">
            <X size={18} />
          </button>
        </div>

        {/* Body Metrics Grid */}
        <div className="p-6 overflow-y-auto space-y-6 custom-scrollbar">
          {/* Top Score Banner */}
          <div className="p-6 bg-gradient-to-r from-indigo-900/30 via-purple-900/30 to-emerald-900/30 border border-indigo-500/30 rounded-3xl flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-emerald-500/20 text-emerald-400 rounded-2xl border border-emerald-500/30">
                <Award size={28} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-gray-100">Developer Productivity Score: 98/100</h3>
                <p className="text-xs text-gray-400">High efficiency rating powered by VisualStack AI & automated compilers</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-black text-emerald-400 font-mono">OPTIONAL</div>
              <div className="text-[10px] text-gray-500 uppercase font-mono">Production Ready</div>
            </div>
          </div>

          {/* Core Project Metrics Grid */}
          <div className="grid grid-cols-4 gap-4 text-xs font-mono">
            <div className="p-4 bg-[#0e0f12] border border-[#232733] rounded-2xl">
              <div className="flex items-center gap-2 text-indigo-400 mb-2">
                <Code size={16} />
                <span className="font-bold text-gray-300">Lines of Code</span>
              </div>
              <div className="text-2xl font-extrabold text-white">{projMetrics.linesOfCode.toLocaleString()}</div>
              <div className="text-[10px] text-gray-500 mt-1">Generated JS/TS</div>
            </div>

            <div className="p-4 bg-[#0e0f12] border border-[#232733] rounded-2xl">
              <div className="flex items-center gap-2 text-emerald-400 mb-2">
                <Zap size={16} />
                <span className="font-bold text-gray-300">UI Widgets</span>
              </div>
              <div className="text-2xl font-extrabold text-white">{projMetrics.uiComponentsCount}</div>
              <div className="text-[10px] text-gray-500 mt-1">Canvas Elements</div>
            </div>

            <div className="p-4 bg-[#0e0f12] border border-[#232733] rounded-2xl">
              <div className="flex items-center gap-2 text-purple-400 mb-2">
                <Cpu size={16} />
                <span className="font-bold text-gray-300">Node Logic</span>
              </div>
              <div className="text-2xl font-extrabold text-white">{projMetrics.backendNodesCount}</div>
              <div className="text-[10px] text-gray-500 mt-1">Workflow Nodes</div>
            </div>

            <div className="p-4 bg-[#0e0f12] border border-[#232733] rounded-2xl">
              <div className="flex items-center gap-2 text-amber-400 mb-2">
                <Database size={16} />
                <span className="font-bold text-gray-300">DB Tables</span>
              </div>
              <div className="text-2xl font-extrabold text-white">{projMetrics.dbTablesCount}</div>
              <div className="text-[10px] text-gray-500 mt-1">Postgres Schemas</div>
            </div>
          </div>

          {/* User Session Analytics */}
          <div className="p-5 bg-[#0e0f12] border border-[#232733] rounded-2xl space-y-3 text-xs">
            <h4 className="font-bold text-gray-200 uppercase tracking-wider text-[11px]">Active Session Breakdown</h4>
            <div className="grid grid-cols-3 gap-4 text-gray-300">
              <div>Session Time: <span className="font-mono text-indigo-400 font-bold">{userMetrics.sessionDurationMinutes} mins</span></div>
              <div>Canvas Mutations: <span className="font-mono text-emerald-400 font-bold">{userMetrics.canvasMutationsCount}</span></div>
              <div>AI Prompts: <span className="font-mono text-amber-400 font-bold">{userMetrics.aiPromptsExecuted}</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
