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
    a.download = `visualstack_project_ir_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <div className="h-10 bg-[#14161d] border-b border-[#232733] px-3 flex items-center justify-between select-none shrink-0 text-xs text-gray-200">
        {/* Left Controls: Screen Switcher + Workflow Name */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="px-2.5 py-1 rounded bg-[#181a20] hover:bg-[#232733] border border-[#232733] flex items-center gap-2 text-indigo-400 font-semibold transition-colors cursor-pointer"
            >
              <Icons.Smartphone size={14} />
              <span>{activeScreen?.name || 'Screen'}</span>
              <Icons.ChevronDown size={13} className="text-gray-400" />
            </button>

            {isDropdownOpen && (
              <div className="absolute top-full left-0 mt-1 w-56 bg-[#14161d] border border-[#232733] rounded-lg shadow-xl py-1 z-50">
                <div className="text-[10px] font-semibold text-gray-400 px-3 py-1 uppercase tracking-wider">
                  Switch Active Screen
                </div>
                {screens.map((scr) => (
                  <button
                    key={scr.id}
                    onClick={() => handleScreenChange(scr.id)}
                    className={`w-full px-3 py-1.5 text-left text-xs font-mono flex items-center justify-between transition-colors cursor-pointer ${
                      scr.id === activeScreenId
                        ? 'bg-indigo-600/20 text-indigo-400 font-semibold'
                        : 'text-gray-300 hover:bg-[#181a20]'
                    }`}
                  >
                    <span>{scr.name}</span>
                    <span className="text-[10px] text-gray-400">{scr.route.path}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="h-4 w-[1px] bg-[#232733]" />

          <div className="flex items-center gap-2 font-mono text-[11px] text-gray-400">
            <Icons.GitBranch size={13} className="text-emerald-400" />
            <span>Workflow: <strong className="text-gray-200">{activeScreen?.name} Execution Graph</strong></span>
          </div>
        </div>

        {/* Right Controls: Files, Packages, Env, Live Preview, Run Graph, Export IR JSON */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsFileExplorerOpen(true)}
            className="px-2 py-1.5 rounded bg-[#181a20] hover:bg-[#232733] border border-[#232733] text-gray-300 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Files Explorer"
          >
            <Icons.FolderTree size={14} className="text-amber-400" />
            <span>Files</span>
          </button>

          <button
            onClick={() => setIsPackageManagerOpen(true)}
            className="px-2 py-1.5 rounded bg-[#181a20] hover:bg-[#232733] border border-[#232733] text-gray-300 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Package Manager"
          >
            <Icons.PackagePlus size={14} className="text-indigo-400" />
            <span>Packages</span>
          </button>

          <button
            onClick={() => setIsEnvironmentOpen(true)}
            className="px-2 py-1.5 rounded bg-[#181a20] hover:bg-[#232733] border border-[#232733] text-gray-300 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Environment Variables (.env)"
          >
            <Icons.KeyRound size={14} className="text-cyan-400" />
            <span>.env</span>
          </button>

          <div className="h-4 w-[1px] bg-[#232733]" />

          <button
            onClick={() => setIsPreviewPanelOpen(true)}
            className="px-3 py-1.5 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs flex items-center gap-1.5 transition-colors cursor-pointer shadow"
          >
            <Icons.Eye size={14} />
            <span>Live Preview</span>
          </button>

          <button
            onClick={() => setIsWorkspaceModalOpen(true)}
            className="px-2.5 py-1.5 rounded bg-[#181a20] hover:bg-[#232733] border border-[#232733] text-gray-300 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Icons.FolderKanban size={14} className="text-indigo-400" />
            <span>Workspace</span>
          </button>

          <button
            onClick={handleRunGraph}
            disabled={isRunning}
            className="px-3 py-1.5 rounded bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-semibold text-xs flex items-center gap-1.5 transition-colors cursor-pointer shadow"
          >
            <Icons.Play size={14} />
            <span>{isRunning ? 'Executing...' : 'Run Logic'}</span>
          </button>

          <button
            onClick={handleExportIRJson}
            className="px-2.5 py-1.5 rounded bg-[#181a20] hover:bg-[#232733] border border-[#232733] text-gray-300 hover:text-white text-xs font-mono flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Icons.Download size={14} />
            <span>Export IR JSON</span>
          </button>

          <button
            onClick={handleClearCanvas}
            className="p-1.5 rounded hover:bg-[#181a20] text-gray-400 hover:text-white transition-colors cursor-pointer"
            title="Clear Canvas"
          >
            <Icons.Trash2 size={15} />
          </button>

          {/* Viewport Zoom Controls */}
          <div className="flex items-center gap-0.5 bg-[#181a20] border border-[#232733] rounded p-0.5 ml-2">
            <button
              onClick={() => zoomIn()}
              className="p-1 text-gray-400 hover:text-white rounded hover:bg-[#232733] transition-colors cursor-pointer"
              title="Zoom In"
            >
              <Icons.ZoomIn size={14} />
            </button>
            <button
              onClick={() => zoomOut()}
              className="p-1 text-gray-400 hover:text-white rounded hover:bg-[#232733] transition-colors cursor-pointer"
              title="Zoom Out"
            >
              <Icons.ZoomOut size={14} />
            </button>
            <button
              onClick={() => fitView()}
              className="p-1 text-gray-400 hover:text-white rounded hover:bg-[#232733] transition-colors cursor-pointer"
              title="Fit View"
            >
              <Icons.Maximize2 size={14} />
            </button>
          </div>
        </div>
      </div>

      <WorkspaceModal isOpen={isWorkspaceModalOpen} onClose={() => setIsWorkspaceModalOpen(false)} />
      <LivePreviewPanel isOpen={isPreviewPanelOpen} onClose={() => setIsPreviewPanelOpen(false)} />
      <FileExplorerModal isOpen={isFileExplorerOpen} onClose={() => setIsFileExplorerOpen(false)} />
      <PackageManagerModal isOpen={isPackageManagerOpen} onClose={() => setIsPackageManagerOpen(false)} />
      <EnvironmentModal isOpen={isEnvironmentOpen} onClose={() => setIsEnvironmentOpen(false)} />
    </>
  );
};
