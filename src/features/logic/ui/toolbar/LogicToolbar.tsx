import React, { useState } from 'react';
import * as Icons from 'lucide-react';
import { useReactFlow } from '@xyflow/react';
import { logicService } from '../../services/LogicService';
import { graphManager } from '../../graph/GraphManager';
import { useLogicStore } from '../../../../stores/LogicStore';

export const LogicToolbar: React.FC = () => {
  const { zoomIn, zoomOut, fitView } = useReactFlow();
  const { syncFromGraph, clearLogs } = useLogicStore();
  const [isRunning, setIsRunning] = useState(false);

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

  return (
    <div className="h-12 bg-[#0e0f12] border-b border-[#232733] px-4 flex items-center justify-between select-none shrink-0">
      {/* Title & Status */}
      <div className="flex items-center gap-3">
        <div className="w-7 h-7 rounded bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center">
          <Icons.Workflow size={15} />
        </div>
        <div>
          <h1 className="text-xs font-semibold text-white tracking-wide">Visual Logic Designer</h1>
          <p className="text-[10px] text-gray-400">Blueprint Automation & Engine</p>
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
