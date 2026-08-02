import React, { useState, useEffect } from 'react';
import { useViewportStore } from '../../stores/ViewportStore';
import { useSelectionStore } from '../../stores/SelectionStore';
import { eventBus } from '../../core/events/EventBus';
import { SystemEventType } from '../../core/events/EventTypes';
import { Grid } from 'lucide-react';

export const StatusBar: React.FC = () => {
  const { zoom } = useViewportStore();
  const { selectedComponentIds } = useSelectionStore();
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const unsubClick = eventBus.on(SystemEventType.CANVAS_CLICKED, (payload: { x: number; y: number; button: number }) => {
      setCursorPos({ x: Math.round(payload.x), y: Math.round(payload.y) });
    });

    const unsubStatus = eventBus.on(SystemEventType.STATUS_CHANGED, (payload: { zoom?: number; cursorX?: number; cursorY?: number }) => {
      if (payload.cursorX !== undefined && payload.cursorY !== undefined) {
        setCursorPos({ x: Math.round(payload.cursorX), y: Math.round(payload.cursorY) });
      }
    });

    return () => {
      unsubClick();
      unsubStatus();
    };
  }, []);

  return (
    <div className="h-6 bg-[#0e0f12] border-t border-[#232733] flex items-center justify-between px-3 text-[11px] font-mono text-gray-400 select-none z-30">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1.5">
          <Grid size={12} className="text-gray-500" />
          <span>Canvas</span>
        </div>
        <div>
          Pos: <span className="text-gray-200">{cursorPos.x}</span>, <span className="text-gray-200">{cursorPos.y}</span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div>
          Selected: <span className="text-gray-200">{selectedComponentIds.length}</span>
        </div>
        <div>
          Zoom: <span className="text-gray-200">{Math.round(zoom * 100)}%</span>
        </div>
      </div>
    </div>
  );
};
