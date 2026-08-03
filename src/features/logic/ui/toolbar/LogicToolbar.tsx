import React, { useState } from 'react';
import * as Icons from 'lucide-react';
import { useReactFlow } from '@xyflow/react';
import { logicService } from '../../services/LogicService';
import { graphManager } from '../../graph/GraphManager';
import { useLogicStore } from '../../../../stores/LogicStore';
import { screenManager } from '../../../../application/screens/ScreenManager';
import { projectModelExporter } from '../../../../application/ir/ProjectModelExporter';
import { WorkspaceModal } from '../../../../components/layout/WorkspaceModal';
import { LivePreviewPanel } from '../../../../components/preview/LivePreviewPanel';
import { FileExplorerModal } from '../../../../components/explorer/FileExplorerModal';
import { PackageManagerModal } from '../../../../components/packages/PackageManagerModal';
import { EnvironmentModal } from '../../../../components/config/EnvironmentModal';
import { TerminalEmulatorModal } from '../../../../components/terminal/TerminalEmulatorModal';
import { AIChatPanel } from '../../../../components/ai/AIChatPanel';
import { AICommandPalette } from '../../../../components/ai/AICommandPalette';

export const LogicToolbar: React.FC = () => {
  const { zoomIn, zoomOut, fitView } = useReactFlow();
  const { syncFromGraph, clearLogs } = useLogicStore();
  const [isRunning, setIsRunning] = useState(false);
  const [activeScreenId, setActiveScreenId] = useState<string>(screenManager.getActiveScreenId());
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Modals
  const [isWorkspaceModalOpen, setIsWorkspaceModalOpen] = useState(false);
  const [isPreviewPanelOpen, setIsPreviewPanelOpen] = useState(false);
  const [isFileExplorerOpen, setIsFileExplorerOpen] = useState(false);
  const [isPackageManagerOpen, setIsPackageManagerOpen] = useState(false);
  const [isEnvironmentOpen, setIsEnvironmentOpen] = useState(false);
  const [isTerminalOpen, setIsTerminalOpen] = useState(false);
  const [isAiChatOpen, setIsAiChatOpen] = useState(false);
  const [isAiCommandPaletteOpen, setIsAiCommandPaletteOpen] = useState(false);

  const screens = screenManager.getAllScreens();
  const activeScreen = screens.find((s) => s.id === activeScreenId) || screens[0];

  const handleRunGraph = async () => {
    setIsRunning(true);
    try {
      await logicService.runGraph();
    } catch (err) {
      console.error('Execution error:', err);
    } finally {
      setIsRunning(false);
    }
  };

  const handleClearCanvas = () => {
    graphManager.getGraph().clear();
    syncFromGraph();
    clearLogs();
  };

  const handleScreenChange = (screenId: string) => {
    screenManager.switchScreen(screenId);
    setActiveScreenId(screenId);
    syncFromGraph();
    setIsDropdownOpen(false);
  };

  const handleExportIRJson = () => {
    const jsonStr = projectModelExporter.exportJSONString();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `project_ir_${activeScreenId}.json`;
    a.click();
  };

  return (
    <>
      <WorkspaceModal isOpen={isWorkspaceModalOpen} onClose={() => setIsWorkspaceModalOpen(false)} />
      <LivePreviewPanel isOpen={isPreviewPanelOpen} onClose={() => setIsPreviewPanelOpen(false)} />
      <FileExplorerModal isOpen={isFileExplorerOpen} onClose={() => setIsFileExplorerOpen(false)} />
      <PackageManagerModal isOpen={isPackageManagerOpen} onClose={() => setIsPackageManagerOpen(false)} />
      <EnvironmentModal isOpen={isEnvironmentOpen} onClose={() => setIsEnvironmentOpen(false)} />
      <TerminalEmulatorModal isOpen={isTerminalOpen} onClose={() => setIsTerminalOpen(false)} />
      <AIChatPanel isOpen={isAiChatOpen} onClose={() => setIsAiChatOpen(false)} />
      <AICommandPalette isOpen={isAiCommandPaletteOpen} onClose={() => setIsAiCommandPaletteOpen(false)} />

      <div className="h-10 bg-[#0e0f12] border-b border-[#232733] flex items-center justify-between px-3 z-30 select-none">
        {/* Left Section: Screen Selector & Workflow Info */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-2 px-2.5 py-1 bg-[#14161b] hover:bg-[#1a1d24] text-xs font-semibold text-gray-200 border border-[#232733] rounded transition-colors"
            >
              <Icons.LayoutGrid size={13} className="text-indigo-400" />
              <span>{activeScreen?.name || 'Main Screen'}</span>
              <Icons.ChevronDown size={12} className="text-gray-400" />
            </button>

            {isDropdownOpen && (
              <div className="absolute left-0 top-full mt-1 w-48 bg-[#14161b] border border-[#232733] rounded shadow-xl py-1 z-50">
                {screens.map((screen) => (
                  <button
                    key={screen.id}
                    onClick={() => handleScreenChange(screen.id)}
                    className={`w-full text-left px-3 py-1.5 text-xs flex items-center justify-between hover:bg-[#1f232d] ${
                      screen.id === activeScreenId ? 'text-indigo-400 font-semibold' : 'text-gray-300'
                    }`}
                  >
                    <span>{screen.name}</span>
                    {screen.id === activeScreenId && <Icons.Check size={12} />}
                  </button>
                ))}
              </div>
            )}
          </div>

          <span className="text-gray-600 text-xs">|</span>
          <span className="text-xs text-gray-400 font-mono">Backend Logic Engine</span>
        </div>

        {/* Center Section: Canvas Controls */}
        <div className="flex items-center gap-1 bg-[#14161b] px-1.5 py-0.5 rounded border border-[#232733]">
          <button onClick={() => zoomIn()} title="Zoom In" className="p-1 hover:bg-[#1f232d] text-gray-400 hover:text-white rounded">
            <Icons.ZoomIn size={13} />
          </button>
          <button onClick={() => zoomOut()} title="Zoom Out" className="p-1 hover:bg-[#1f232d] text-gray-400 hover:text-white rounded">
            <Icons.ZoomOut size={13} />
          </button>
          <button onClick={() => fitView()} title="Fit View" className="p-1 hover:bg-[#1f232d] text-gray-400 hover:text-white rounded">
            <Icons.Maximize2 size={13} />
          </button>
          <span className="text-gray-600">|</span>
          <button onClick={handleClearCanvas} title="Clear Canvas" className="p-1 hover:bg-rose-500/20 text-gray-400 hover:text-rose-400 rounded">
            <Icons.Trash2 size={13} />
          </button>
        </div>

        {/* Right Section: Tools, Run Button & AI Copilot */}
        <div className="flex items-center gap-2">
          {/* AI Tools */}
          <button
            onClick={() => setIsAiCommandPaletteOpen(true)}
            className="flex items-center gap-1 px-2 py-1 bg-[#14161b] hover:bg-amber-600/20 text-amber-400 border border-[#232733] rounded text-xs font-medium transition-colors"
            title="Open AI Palette (Ctrl+K)"
          >
            <Icons.Command size={12} />
            <span>AI Palette</span>
          </button>

          <button
            onClick={() => setIsAiChatOpen(!isAiChatOpen)}
            className="flex items-center gap-1 px-2.5 py-1 bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/40 rounded text-xs font-bold transition-colors"
            title="Open AI Copilot Chat"
          >
            <Icons.Sparkles size={12} className="text-indigo-400" />
            <span>AI Copilot</span>
          </button>

          <span className="text-gray-600">|</span>

          <button
            onClick={() => setIsFileExplorerOpen(true)}
            className="p-1.5 hover:bg-[#14161b] text-gray-400 hover:text-gray-200 rounded text-xs"
            title="File Explorer"
          >
            <Icons.FolderTree size={14} />
          </button>
          <button
            onClick={() => setIsPackageManagerOpen(true)}
            className="p-1.5 hover:bg-[#14161b] text-gray-400 hover:text-gray-200 rounded text-xs"
            title="Package Manager"
          >
            <Icons.Package size={14} />
          </button>
          <button
            onClick={() => setIsEnvironmentOpen(true)}
            className="p-1.5 hover:bg-[#14161b] text-gray-400 hover:text-gray-200 rounded text-xs"
            title="Environment Variables"
          >
            <Icons.Key size={14} />
          </button>
          <button
            onClick={() => setIsTerminalOpen(true)}
            className="p-1.5 hover:bg-[#14161b] text-gray-400 hover:text-gray-200 rounded text-xs"
            title="Terminal"
          >
            <Icons.Terminal size={14} />
          </button>
          <button
            onClick={handleExportIRJson}
            className="p-1.5 hover:bg-[#14161b] text-gray-400 hover:text-indigo-400 rounded text-xs"
            title="Export IR JSON"
          >
            <Icons.Code size={14} />
          </button>

          <button
            onClick={handleRunGraph}
            disabled={isRunning}
            className="flex items-center gap-1.5 px-3 py-1 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white rounded text-xs font-bold transition-all shadow-md"
          >
            {isRunning ? <Icons.RefreshCw className="animate-spin" size={13} /> : <Icons.Play size={13} className="fill-white" />}
            <span>{isRunning ? 'Running...' : 'Run Logic'}</span>
          </button>
        </div>
      </div>
    </>
  );
};
