import React, { useState, useEffect } from 'react';
import * as Icons from 'lucide-react';
import { useLogicStore } from '../../stores/LogicStore';
import { screenManager } from '../../application/screens/ScreenManager';
import { screenRegistry } from '../../application/screens/ScreenRegistry';

export const LivePreviewPanel: React.FC<{ isCollapsed?: boolean; onToggleCollapse?: () => void }> = ({
  isCollapsed = false,
  onToggleCollapse,
}) => {
  const { nodes, selectedNodeId } = useLogicStore();
  const [activeScreen, setActiveScreen] = useState(screenManager.getActiveScreen());
  const [screensList, setScreensList] = useState(screenRegistry.getAll());
  const [zoom, setZoom] = useState<number>(0.85);

  useEffect(() => {
    const unsubManager = screenManager.subscribe((screen) => {
      setActiveScreen(screen);
    });
    const unsubRegistry = screenRegistry.subscribe(() => {
      setScreensList(screenRegistry.getAll());
    });
    return () => {
      unsubManager();
      unsubRegistry();
    };
  }, []);

  const handleScreenSelect = (screenId: string) => {
    const selected = screenManager.setActiveScreen(screenId);
    setActiveScreen(selected);
  };

  const handleCreateNewScreen = () => {
    const name = window.prompt('Enter new page/screen name:', 'Custom Page');
    if (!name) return;

    const defaultRoute = `/${name.toLowerCase().replace(/\s+/g, '-')}`;
    const route = window.prompt('Enter route path:', defaultRoute);
    if (!route) return;

    const newScreen = screenRegistry.createScreen(name, route);
    screenManager.setActiveScreen(newScreen.id);
  };

  if (isCollapsed) {
    return (
      <button
        onClick={onToggleCollapse}
        className="flex items-center gap-2 px-3 py-1.5 bg-[#14161d] border border-[#232733] rounded-lg text-xs font-semibold text-indigo-400 hover:text-white hover:bg-[#1f2330] transition-colors shadow"
      >
        <Icons.Eye size={14} />
        <span>Live Frontend Preview</span>
        <Icons.ChevronDown size={14} />
      </button>
    );
  }

  return (
    <div className="w-full h-[280px] bg-[#0c0d12] border border-[#232733] rounded-lg flex flex-col shadow-2xl overflow-hidden box-border">
      {/* Top Preview Control Bar */}
      <div className="h-9 px-3 bg-[#14161d] border-b border-[#232733] flex items-center justify-between shrink-0 select-none">
        <div className="flex items-center gap-2 min-w-0 flex-1 pr-2">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
          
          {/* Interactive Screen Selector Dropdown */}
          <div className="flex items-center gap-1.5 bg-[#181a20] border border-[#232733] rounded px-2 py-0.5 hover:border-indigo-500 transition-colors shrink min-w-0 max-w-[200px]">
            <Icons.Monitor size={12} className="text-indigo-400 shrink-0" />
            <select
              value={activeScreen.id}
              onChange={(e) => handleScreenSelect(e.target.value)}
              className="bg-transparent text-xs font-semibold text-white outline-none cursor-pointer w-full min-w-0 truncate"
            >
              {screensList.map((screen) => (
                <option key={screen.id} value={screen.id} className="bg-[#14161d] text-white">
                  {screen.name} ({screen.route})
                </option>
              ))}
            </select>
          </div>

          {/* Create New Screen Button */}
          <button
            onClick={handleCreateNewScreen}
            className="p-1 text-indigo-400 hover:text-white bg-[#181a20] hover:bg-[#232733] border border-[#232733] rounded transition-colors shrink-0"
            title="Create New Page"
          >
            <Icons.Plus size={13} />
          </button>

          <span className="text-[10px] font-mono text-gray-500 bg-[#181a20] px-1.5 py-0.5 rounded border border-[#232733] shrink-0 truncate max-w-[80px]">
            {activeScreen.route}
          </span>
        </div>

        <div className="flex items-center gap-1.5 shrink-0 ml-1">
          <button
            onClick={() => setZoom((z) => Math.max(0.4, z - 0.1))}
            className="p-1 text-gray-400 hover:text-white rounded hover:bg-[#181a20] transition-colors"
            title="Zoom Out"
          >
            <Icons.ZoomOut size={13} />
          </button>
          <span className="text-[10px] font-mono text-gray-400 w-9 text-center">{Math.round(zoom * 100)}%</span>
          <button
            onClick={() => setZoom((z) => Math.min(1.5, z + 0.1))}
            className="p-1 text-gray-400 hover:text-white rounded hover:bg-[#181a20] transition-colors"
            title="Zoom In"
          >
            <Icons.ZoomIn size={13} />
          </button>
          <div className="w-[1px] h-3 bg-[#232733] mx-1" />
          {onToggleCollapse && (
            <button
              onClick={onToggleCollapse}
              className="p-1 text-gray-400 hover:text-white rounded hover:bg-[#181a20] transition-colors"
              title="Minimize Preview"
            >
              <Icons.Minimize2 size={13} />
            </button>
          )}
        </div>
      </div>

      {/* Live Canvas Rendering Container */}
      <div className="flex-1 bg-[#090a0e] relative overflow-auto p-4 flex items-center justify-center custom-scrollbar">
        {/* Render Live Canvas Screen Window */}
        <div
          className="bg-[#181a20] border border-[#2e3446] rounded-md shadow-2xl relative overflow-hidden transition-all duration-75 origin-center"
          style={{
            width: '320px',
            height: '200px',
            transform: `scale(${zoom})`,
          }}
        >
          {/* Virtual Device Header */}
          <div className="h-5 bg-[#12141a] border-b border-[#232733] px-2 flex items-center justify-between text-[9px] text-gray-500 font-mono">
            <span>{activeScreen.route}</span>
            <div className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span>60 FPS</span>
            </div>
          </div>

          {/* Dynamic Rendered Scene Nodes */}
          <div className="p-3 relative w-full h-[calc(100%-20px)] overflow-hidden">
            {nodes.length === 0 ? (
              <div className="w-full h-full flex flex-col items-center justify-center text-center p-2">
                <span className="text-[11px] font-medium text-gray-400">Empty Screen Layout</span>
                <span className="text-[9px] text-gray-600 mt-1">Design UI components on `/designer` canvas to see live updates.</span>
              </div>
            ) : (
              nodes.map((node: { id: string; position?: { x: number; y: number }; data?: Record<string, unknown> }) => {
                const isSelected = node.id === selectedNodeId;
                const nodeData = node.data || {};

                return (
                  <div
                    key={node.id}
                    className={`absolute p-2 rounded transition-all pointer-events-none ${
                      isSelected ? 'ring-2 ring-indigo-500 bg-indigo-950/30' : 'bg-[#232733]/60 hover:bg-[#232733]'
                    }`}
                    style={{
                      left: Math.max(8, ((node.position?.x || 10) % 240)),
                      top: Math.max(8, ((node.position?.y || 10) % 130)),
                      width: '130px',
                    }}
                  >
                    <span className="text-[10px] font-semibold text-white truncate block">
                      {String(nodeData.label || node.id)}
                    </span>
                    <span className="text-[8px] font-mono text-indigo-400 block">{String(nodeData.nodeType || 'Component')}</span>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
