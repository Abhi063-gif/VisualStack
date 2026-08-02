import React, { useState } from 'react';
import * as Icons from 'lucide-react';
import { useReactFlow } from '@xyflow/react';
import { logicService } from '../../services/LogicService';
import { graphManager } from '../../graph/GraphManager';
import { useLogicStore } from '../../../../stores/LogicStore';
import { screenManager } from '../../../../application/screens/ScreenManager';

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

        {/* Current Screen Selector Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-2 px-3 py-1.5 rounded bg-[#181a20] hover:bg-[#232733] border border-[#232733] hover:border-indigo-500/50 text-white text-xs font-medium transition-all cursor-pointer shadow-sm"
          >
            <Icons.Monitor size={13} className="text-indigo-400" />
            <span className="text-gray-400 text-[10px] uppercase font-semibold tracking-wider">Screen:</span>
            <span className="text-white font-semibold">{activeScreen ? activeScreen.name : 'Select Screen'}</span>
            {activeScreen?.route && (
              <span className="text-[10px] font-mono text-gray-400 bg-[#0e0f12] px-1.5 py-0.5 rounded border border-[#232733]">
                {activeScreen.route.path}
              </span>
            )}
            <Icons.ChevronDown size={13} className={`text-gray-400 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
          </button>

          {/* Screen Options Menu */}
          {isDropdownOpen && (
            <div className="absolute left-0 mt-1.5 w-64 bg-[#14161d] border border-[#232733] rounded-lg shadow-xl py-1.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="px-3 py-1 text-[10px] font-semibold text-gray-400 uppercase tracking-wider border-b border-[#232733] mb-1">
                Designed Frontend Screens ({screens.length})
              </div>

              <div className="max-h-60 overflow-y-auto custom-scrollbar">
                {screens.map((scr) => {
                  const isSelected = scr.id === activeScreenId;
                  return (
                    <button
                      key={scr.id}
                      onClick={() => handleSelectScreen(scr.id)}
                      className={`w-full px-3 py-2 text-left flex items-center justify-between text-xs transition-colors cursor-pointer ${
                        isSelected ? 'bg-indigo-600/20 text-white font-semibold' : 'text-gray-300 hover:bg-[#181a20] hover:text-white'
                      }`}
                    >
                      <div className="flex items-center gap-2 truncate pr-2">
                        <Icons.Layout size={13} className={isSelected ? 'text-indigo-400' : 'text-gray-500'} />
                        <span className="truncate">{scr.name}</span>
                      </div>
                      <span className="text-[10px] font-mono text-gray-500 shrink-0">{scr.route.path}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Execution Actions */}
      <div className="flex items-center gap-2">
        <button
          onClick={handleRunGraph}
          disabled={isRunning}
          className="px-3.5 py-1.5 rounded bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-xs font-medium flex items-center gap-1.5 shadow transition-all active:scale-95 cursor-pointer"
        >
          {isRunning ? (
            <>
              <Icons.Loader size={13} className="animate-spin" />
              <span>Running...</span>
            </>
          ) : (
            <>
              <Icons.Play size={13} className="fill-current" />
              <span>Run Logic</span>
            </>
          )}
        </button>

        <button
          onClick={handleClearCanvas}
          className="p-1.5 rounded bg-[#181a20] hover:bg-[#232733] text-gray-400 hover:text-red-400 text-xs border border-[#232733] transition-colors cursor-pointer"
          title="Clear Graph"
        >
          <Icons.Trash2 size={13} />
        </button>
      </div>

      {/* Viewport Zoom Controls */}
      <div className="flex items-center gap-1 bg-[#181a20] p-1 rounded border border-[#232733]">
        <button
          onClick={() => zoomIn()}
          className="p-1 text-gray-400 hover:text-white rounded hover:bg-[#232733] transition-colors cursor-pointer"
          title="Zoom In"
        >
          <Icons.ZoomIn size={13} />
        </button>
        <button
          onClick={() => zoomOut()}
          className="p-1 text-gray-400 hover:text-white rounded hover:bg-[#232733] transition-colors cursor-pointer"
          title="Zoom Out"
        >
          <Icons.ZoomOut size={13} />
        </button>
        <button
          onClick={() => fitView({ padding: 0.2, duration: 400 })}
          className="p-1 text-gray-400 hover:text-white rounded hover:bg-[#232733] transition-colors cursor-pointer"
          title="Fit View"
        >
          <Icons.Maximize2 size={13} />
        </button>
      </div>
    </div>
  );
};
