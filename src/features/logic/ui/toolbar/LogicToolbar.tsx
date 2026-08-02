import React, { useState } from 'react';
import * as Icons from 'lucide-react';
import { useReactFlow } from '@xyflow/react';
import { logicService } from '../../services/LogicService';
import { graphManager } from '../../graph/GraphManager';
import { useLogicStore } from '../../../../stores/LogicStore';
import { screenManager } from '../../../../application/screens/ScreenManager';
import { projectModelExporter } from '../../../../application/ir/ProjectModelExporter';

export const LogicToolbar: React.FC = () => {
  const { zoomIn, zoomOut, fitView } = useReactFlow();
  const { syncFromGraph, clearLogs } = useLogicStore();
  const [isRunning, setIsRunning] = useState(false);
  const [activeScreenId, setActiveScreenId] = useState<string>(screenManager.getActiveScreenId());
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

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

  const handleExportIR = () => {
    const irJson = projectModelExporter.exportJSONString();
    const blob = new Blob([irJson], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `visualstack_project_ir_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleClearCanvas = () => {
    if (window.confirm('Are you sure you want to clear the logic graph?')) {
      graphManager.reset();
      syncFromGraph();
      clearLogs();
    }
  };

  const handleSelectScreen = (screenId: string) => {
    const success = screenManager.switchScreen(screenId);
    if (success) {
      setActiveScreenId(screenId);
      setIsDropdownOpen(false);
    }
  };

  const handleCreateNewScreen = () => {
    const name = window.prompt('Enter Screen Name (e.g. User Profile, Checkout Page, Dashboard):');
    if (!name) return;
    const path = window.prompt('Enter Route Path (e.g. /profile, /checkout, /dashboard):', `/${name.toLowerCase().replace(/\s+/g, '-')}`);
    if (!path) return;

    const newScreen = screenManager.createScreen(name, path);
    setActiveScreenId(newScreen.id);
    setIsDropdownOpen(false);
  };

  return (
    <div className="h-12 bg-[#0e0f12] border-b border-[#232733] px-4 flex items-center justify-between select-none shrink-0 relative z-50">
      {/* Title & Screen Selector Dropdown */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center">
            <Icons.Workflow size={15} />
          </div>
          <div>
            <h1 className="text-xs font-semibold text-white tracking-wide">Visual Logic Designer</h1>
            <p className="text-[10px] text-gray-400">Blueprint Automation Engine</p>
          </div>
        </div>

        {/* Divider */}
        <div className="h-5 w-[1px] bg-[#232733]" />

        {/* Interactive Screen Selector */}
        <div className="relative">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="px-3 py-1.5 rounded bg-[#181a20] hover:bg-[#232733] border border-[#232733] text-xs font-medium text-gray-200 flex items-center gap-2 transition-colors cursor-pointer"
          >
            <span className="text-gray-400">Screen:</span>
            <span className="font-semibold text-indigo-400">{activeScreen?.name}</span>
            <span className="text-[10px] font-mono text-gray-400 bg-[#0e0f12] px-1.5 py-0.5 rounded">
              {activeScreen?.route.path}
            </span>
            <Icons.ChevronDown size={14} className="text-gray-400 ml-1" />
          </button>

          {isDropdownOpen && (
            <div className="absolute top-full left-0 mt-1 w-64 bg-[#14161d] border border-[#232733] rounded-lg shadow-xl py-1 z-50 box-border">
              <div className="px-3 py-1.5 text-[10px] font-semibold uppercase text-gray-400 border-b border-[#232733] flex items-center justify-between">
                <span>Designed Screens ({screens.length})</span>
                <button
                  onClick={handleCreateNewScreen}
                  className="text-indigo-400 hover:text-indigo-300 flex items-center gap-0.5 cursor-pointer capitalize font-sans"
                >
                  <Icons.Plus size={12} /> New Screen
                </button>
              </div>

              <div className="max-h-60 overflow-y-auto custom-scrollbar">
                {screens.map((scr) => (
                  <button
                    key={scr.id}
                    onClick={() => handleSelectScreen(scr.id)}
                    className={`w-full px-3 py-2 text-left text-xs flex items-center justify-between hover:bg-[#181a26] transition-colors cursor-pointer ${
                      scr.id === activeScreenId ? 'text-indigo-400 font-semibold bg-[#181a26]' : 'text-gray-300'
                    }`}
                  >
                    <span>{scr.name}</span>
                    <span className="text-[10px] font-mono text-gray-400">{scr.route.path}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Primary Actions (Run Logic, Export IR, Canvas Controls) */}
      <div className="flex items-center gap-2">
        <button
          onClick={handleRunGraph}
          disabled={isRunning}
          className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs flex items-center gap-2 shadow-sm transition-colors cursor-pointer disabled:opacity-50"
        >
          {isRunning ? (
            <Icons.RefreshCw className="animate-spin" size={14} />
          ) : (
            <Icons.Play size={14} className="fill-white" />
          )}
          <span>{isRunning ? 'Executing...' : 'Run Logic'}</span>
        </button>

        <button
          onClick={handleExportIR}
          className="px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
          title="Export Project IR JSON Model"
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
  );
};
