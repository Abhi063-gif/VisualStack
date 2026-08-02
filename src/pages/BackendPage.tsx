import React, { useState, useRef, useCallback } from 'react';
import { ReactFlowProvider } from '@xyflow/react';
import { NodePalette } from '../features/logic/ui/palette/NodePalette';
import { LogicToolbar } from '../features/logic/ui/toolbar/LogicToolbar';
import { PropertyPanel } from '../features/logic/ui/inspector/PropertyPanel';
import { ExecutionConsole } from '../features/logic/ui/console/ExecutionConsole';
import { LogicCanvasContent } from '../features/logic/ui/canvas/LogicCanvas';
import { LivePreviewPanel } from '../components/layout/LivePreviewPanel';

export const BackendPage: React.FC = () => {
  const [leftWidth, setLeftWidth] = useState(260);
  const [rightWidth, setRightWidth] = useState(280);
  const [consoleHeight, setConsoleHeight] = useState(160);
  const [isPreviewCollapsed, setIsPreviewCollapsed] = useState(false);

  const isDraggingLeftRef = useRef(false);
  const isDraggingRightRef = useRef(false);
  const isDraggingConsoleRef = useRef(false);

  // Handle Left Panel Resize Drag
  const handleLeftMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    isDraggingLeftRef.current = true;

    const handleMouseMove = (moveEvent: MouseEvent) => {
      if (!isDraggingLeftRef.current) return;
      const newWidth = Math.max(160, Math.min(480, moveEvent.clientX - 48)); // 48px ActivityBar offset
      setLeftWidth(newWidth);
      window.dispatchEvent(new Event('resize'));
    };

    const handleMouseUp = () => {
      isDraggingLeftRef.current = false;
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  }, []);

  // Handle Right Panel Resize Drag
  const handleRightMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    isDraggingRightRef.current = true;

    const handleMouseMove = (moveEvent: MouseEvent) => {
      if (!isDraggingRightRef.current) return;
      const newWidth = Math.max(180, Math.min(520, window.innerWidth - moveEvent.clientX));
      setRightWidth(newWidth);
      window.dispatchEvent(new Event('resize'));
    };

    const handleMouseUp = () => {
      isDraggingRightRef.current = false;
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  }, []);

  // Handle Bottom Console Resize Drag
  const handleConsoleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    isDraggingConsoleRef.current = true;

    const handleMouseMove = (moveEvent: MouseEvent) => {
      if (!isDraggingConsoleRef.current) return;
      const newHeight = Math.max(80, Math.min(400, window.innerHeight - moveEvent.clientY - 24)); // 24px StatusBar offset
      setConsoleHeight(newHeight);
      window.dispatchEvent(new Event('resize'));
    };

    const handleMouseUp = () => {
      isDraggingConsoleRef.current = false;
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  }, []);

  return (
    <ReactFlowProvider>
      <div className="w-full h-full flex flex-col overflow-hidden bg-[#07080a] text-gray-100 select-none">
        {/* Top Logic Toolbar */}
        <LogicToolbar />

        {/* Main Workspace 3-Column Layout */}
        <div className="flex-1 flex min-w-0 overflow-hidden relative">
          {/* Left Node Library Palette */}
          <div style={{ width: `${leftWidth}px` }} className="h-full shrink-0 min-w-0 overflow-hidden">
            <NodePalette />
          </div>

          {/* Left Resize Handle */}
          <div
            onMouseDown={handleLeftMouseDown}
            className="w-[5px] h-full bg-[#232733] hover:bg-indigo-500 active:bg-indigo-500 cursor-col-resize shrink-0 transition-colors z-20"
            title="Drag to resize Node Library width"
          />

          {/* Center Column (Canvas + Floating Live Preview + Execution Console) */}
          <div className="flex-1 flex flex-col min-w-0 h-full relative overflow-hidden">
            {/* Logic Canvas */}
            <div className="flex-1 relative min-w-0 h-full overflow-hidden">
              <LogicCanvasContent />

              {/* Floating Live Frontend Preview Panel (Top Right overlay) */}
              <div className="absolute top-4 right-4 z-30 max-w-[380px] shadow-2xl">
                <LivePreviewPanel
                  isCollapsed={isPreviewCollapsed}
                  onToggleCollapse={() => setIsPreviewCollapsed(!isPreviewCollapsed)}
                />
              </div>
            </div>

            {/* Console Resize Handle */}
            <div
              onMouseDown={handleConsoleMouseDown}
              className="h-[5px] w-full bg-[#232733] hover:bg-indigo-500 active:bg-indigo-500 cursor-row-resize shrink-0 transition-colors z-20"
              title="Drag to resize Execution Console height"
            />

            {/* Bottom Real-Time Execution Console */}
            <div style={{ height: `${consoleHeight}px` }} className="w-full shrink-0 min-h-0 overflow-hidden">
              <ExecutionConsole />
            </div>
          </div>

          {/* Right Resize Handle */}
          <div
            onMouseDown={handleRightMouseDown}
            className="w-[5px] h-full bg-[#232733] hover:bg-indigo-500 active:bg-indigo-500 cursor-col-resize shrink-0 transition-colors z-20"
            title="Drag to resize Property Inspector width"
          />

          {/* Right Property Inspector Panel */}
          <div style={{ width: `${rightWidth}px` }} className="h-full shrink-0 min-w-0 overflow-hidden">
            <PropertyPanel />
          </div>
        </div>
      </div>
    </ReactFlowProvider>
  );
};

export default BackendPage;
