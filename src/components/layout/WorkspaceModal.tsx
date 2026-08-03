import React, { useState } from 'react';
import * as Icons from 'lucide-react';
import { workspaceManager } from '../../runtime/workspace/WorkspaceManager';
import { processManager } from '../../runtime/process/ProcessManager';

interface WorkspaceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const WorkspaceModal: React.FC<WorkspaceModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'projects' | 'settings' | 'processes'>('projects');
  const activeWorkspace = workspaceManager.getActiveWorkspace();
  const recentWorkspaces = workspaceManager.getRecentWorkspaces();
  const [settings, setSettings] = useState(workspaceManager.getSettings());
  const [processes, setProcesses] = useState(processManager.listProcesses());
  const [newProjectName, setNewProjectName] = useState('');

  if (!isOpen) return null;

  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProjectName.trim()) return;
    workspaceManager.createWorkspace(newProjectName.trim());
    setNewProjectName('');
  };

  const handleKillProcess = (pid: number) => {
    processManager.killProcess(pid);
    setProcesses(processManager.listProcesses());
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-6 select-none">
      <div className="bg-[#0e0f12] border border-[#232733] rounded-2xl w-full max-w-4xl h-[75vh] shadow-2xl overflow-hidden flex flex-col box-border text-gray-200">
        {/* Header */}
        <div className="p-4 border-b border-[#232733] bg-[#14161d] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <Icons.FolderKanban size={18} />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white tracking-wide">Workspace & Process Manager</h2>
              <p className="text-[11px] text-gray-400">Active Workspace: <strong className="text-indigo-400">{activeWorkspace?.name}</strong></p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-white rounded hover:bg-[#181a20] transition-colors cursor-pointer"
          >
            <Icons.X size={18} />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="px-4 py-2 border-b border-[#232733] bg-[#11131c] flex items-center gap-2 shrink-0 text-xs font-medium">
          <button
            onClick={() => setActiveTab('projects')}
            className={`px-3 py-1.5 rounded flex items-center gap-2 transition-colors cursor-pointer ${
              activeTab === 'projects' ? 'bg-indigo-600 text-white font-semibold' : 'text-gray-400 hover:text-white'
            }`}
          >
            <Icons.Folder size={14} />
            <span>Projects & Workspaces</span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`px-3 py-1.5 rounded flex items-center gap-2 transition-colors cursor-pointer ${
              activeTab === 'settings' ? 'bg-indigo-600 text-white font-semibold' : 'text-gray-400 hover:text-white'
            }`}
          >
            <Icons.Sliders size={14} />
            <span>Workspace Settings</span>
          </button>

          <button
            onClick={() => setActiveTab('processes')}
            className={`px-3 py-1.5 rounded flex items-center gap-2 transition-colors cursor-pointer ${
              activeTab === 'processes' ? 'bg-indigo-600 text-white font-semibold' : 'text-gray-400 hover:text-white'
            }`}
          >
            <Icons.Cpu size={14} />
            <span>Process Manager</span>
            <span className="bg-gray-800 text-gray-300 px-1.5 py-0.2 rounded text-[10px]">{processes.length}</span>
          </button>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 p-6 overflow-y-auto custom-scrollbar">
          {/* 1. Projects & Workspaces */}
          {activeTab === 'projects' && (
            <div className="space-y-6">
              {/* Create New Project Form */}
              <form onSubmit={handleCreateProject} className="bg-[#14161d] border border-[#232733] p-4 rounded-xl flex items-center gap-3">
                <input
                  type="text"
                  placeholder="Create New Project Name..."
                  value={newProjectName}
                  onChange={(e) => setNewProjectName(e.target.value)}
                  className="flex-1 bg-[#181a20] border border-[#232733] rounded-lg px-3 py-2 text-xs text-white placeholder-gray-500 outline-none focus:border-indigo-500"
                />
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer"
                >
                  <Icons.Plus size={14} />
                  <span>Create Project</span>
                </button>
              </form>

              {/* Recent Projects List */}
              <div className="space-y-2">
                <h3 className="text-xs font-semibold uppercase text-gray-400 tracking-wider">Recent Project Workspaces</h3>
                <div className="grid grid-cols-2 gap-3">
                  {recentWorkspaces.map((ws) => {
                    const isActive = ws.id === activeWorkspace?.id;
                    return (
                      <div
                        key={ws.id}
                        onClick={() => workspaceManager.openWorkspace(ws.id)}
                        className={`p-4 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                          isActive
                            ? 'bg-indigo-600/10 border-indigo-500/50 shadow-lg'
                            : 'bg-[#14161d] border-[#232733] hover:border-gray-600'
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-2.5">
                            <Icons.FolderGit2 size={18} className={isActive ? 'text-indigo-400' : 'text-gray-400'} />
                            <div>
                              <h4 className="text-xs font-bold text-white">{ws.name}</h4>
                              <p className="text-[11px] text-gray-400 font-mono">{ws.path}</p>
                            </div>
                          </div>
                          {isActive && (
                            <span className="px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-bold text-[10px]">ACTIVE</span>
                          )}
                        </div>

                        <div className="mt-4 pt-3 border-t border-[#232733]/50 flex items-center justify-between text-[10px] text-gray-400">
                          <span>Target: <strong className="text-gray-300">{ws.targetFramework}</strong></span>
                          <span>Opened: {new Date(ws.lastOpenedAt).toLocaleTimeString()}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* 2. Workspace Settings */}
          {activeTab === 'settings' && (
            <div className="max-w-xl space-y-4 font-sans">
              <div className="flex items-center justify-between p-3 bg-[#14161d] border border-[#232733] rounded-xl">
                <div>
                  <h4 className="text-xs font-bold text-white">Auto Save Canvas & Files</h4>
                  <p className="text-[11px] text-gray-400">Automatically persist node edits to workspace storage.</p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.autoSave}
                  onChange={(e) => setSettings(workspaceManager.updateSettings({ autoSave: e.target.checked }))}
                  className="w-4 h-4 accent-indigo-500 cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between p-3 bg-[#14161d] border border-[#232733] rounded-xl">
                <div>
                  <h4 className="text-xs font-bold text-white">Hot Reload Engine</h4>
                  <p className="text-[11px] text-gray-400">Instantly update preview iframe on source file changes.</p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.hotReload}
                  onChange={(e) => setSettings(workspaceManager.updateSettings({ hotReload: e.target.checked }))}
                  className="w-4 h-4 accent-indigo-500 cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between p-3 bg-[#14161d] border border-[#232733] rounded-xl">
                <div>
                  <h4 className="text-xs font-bold text-white">Package Manager</h4>
                  <p className="text-[11px] text-gray-400">CLI package manager tool used for dependency installation.</p>
                </div>
                <select
                  value={settings.packageManager}
                  onChange={(e) => setSettings(workspaceManager.updateSettings({ packageManager: e.target.value as any }))}
                  className="bg-[#181a20] border border-[#232733] rounded px-3 py-1 text-xs text-indigo-400 font-mono font-semibold outline-none cursor-pointer"
                >
                  <option value="npm">npm</option>
                  <option value="pnpm">pnpm</option>
                  <option value="yarn">yarn</option>
                  <option value="bun">bun</option>
                </select>
              </div>
            </div>
          )}

          {/* 3. Process Manager */}
          {activeTab === 'processes' && (
            <div className="space-y-3 font-mono">
              <div className="text-[10px] font-semibold uppercase text-gray-400 tracking-wider">Active Background Processes</div>
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-[#232733] text-gray-400 text-[10px] uppercase font-sans">
                    <th className="pb-2">PID</th>
                    <th className="pb-2">Process Name</th>
                    <th className="pb-2">Command</th>
                    <th className="pb-2">CPU</th>
                    <th className="pb-2">Memory</th>
                    <th className="pb-2">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#232733]/50">
                  {processes.map((proc) => (
                    <tr key={proc.pid} className="hover:bg-[#14161d]">
                      <td className="py-2 text-indigo-400 font-bold">{proc.pid}</td>
                      <td className="py-2 text-white">{proc.name}</td>
                      <td className="py-2 text-gray-400">{proc.command}</td>
                      <td className="py-2 text-indigo-300">{proc.cpuPercent}%</td>
                      <td className="py-2 text-purple-300">{proc.memoryMb} MB</td>
                      <td className="py-2">
                        <button
                          onClick={() => handleKillProcess(proc.pid)}
                          className="px-2 py-0.5 rounded bg-red-950 text-red-400 hover:bg-red-900 border border-red-800 text-[10px] font-sans font-semibold transition-colors cursor-pointer"
                        >
                          Kill
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
