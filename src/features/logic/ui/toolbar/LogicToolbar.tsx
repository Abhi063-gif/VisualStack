import React, { useState, useEffect } from 'react';
import * as Icons from 'lucide-react';
import { useReactFlow } from '@xyflow/react';
import { logicService } from '../../services/LogicService';
import { graphManager } from '../../graph/GraphManager';
import { useLogicStore } from '../../../../stores/LogicStore';
import { screenManager } from '../../../../application/screens/ScreenManager';
import { screenRegistry } from '../../../../application/screens/ScreenRegistry';

export const LogicToolbar: React.FC = () => {
  const { zoomIn, zoomOut, fitView } = useReactFlow();
  const { syncFromGraph, clearLogs } = useLogicStore();
  const [isRunning, setIsRunning] = useState(false);
  const [activeScreen, setActiveScreen] = useState(screenManager.getActiveScreen());

  useEffect(() => {
    return screenManager.subscribe((screen) => {
      setActiveScreen(screen);
    });
  }, []);

  const handleScreenChange = (screenId: string) => {
    const screen = screenManager.setActiveScreen(screenId);
    setActiveScreen(screen);
  };

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

  const screens = screenRegistry.getAll();

  return (
    <div className="h-12 bg-[#0e0f12] border-b border-[#232733] px-4 flex items-center justify-between select-none shrink-0 box-border w-full">
      {/* Title & Screen Context Selector */}
      <div className="flex items-center gap-3">
        <div className="w-7 h-7 rounded bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center shrink-0">
          <Icons.Workflow size={15} />
        </div>

        {/* Screen Selector Dropdown */}
        <div className="flex items-center gap-2 bg-[#14161d] border border-[#232733] rounded px-2.5 py-1 hover:border-[#383e52] transition-colors">
          <Icons.Monitor size={13} className="text-indigo-400 shrink-0" />
          <select
            value={activeScreen.id}
            onChange={(e) => handleScreenChange(e.target.value)}
            className="bg-transparent text-xs font-semibold text-white outline-none cursor-pointer pr-1"
          >
            {screens.map((s) => (
              <option key={s.id} value={s.id} className="bg-[#14161d] text-white">
                {s.name} ({s.route})
              </option>
            ))}
          </select>
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
          onClick={() => alert(`Generating production React + Node.js code for ${activeScreen.name}...`)}
          className="px-3.5 py-1.5 rounded bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium flex items-center gap-1.5 shadow transition-all active:scale-95 cursor-pointer"
        >
          <Icons.Zap size={13} />
          <span>Export Code</span>
        </button>

        <button
          onClick={handleClearCanvas}
          className="p-1.5 rounded bg-[#181a20] hover:bg-[#232733] text-gray-400 hover:text-red-400 text-xs border border-[#232733] transition-colors cursor-pointer ml-1"
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
