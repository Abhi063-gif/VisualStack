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
    const unsubClick = eventBus.on(SystemEventType.CANVAS_CLICKED, (payload) => {
      setCursorPos({ x: Math.round(payload.x), y: Math.round(payload.y) });
    });

    const unsubStatus = eventBus.on(SystemEventType.STATUS_CHANGED, (payload) => {
      setCursorPos({ x: Math.round(payload.cursorX), y: Math.round(payload.cursorY) });
    });

    return () => {
      unsubClick();
      unsubStatus();
    };
  }, []);

  return (
    <div className="h-6 bg-[#0e0f12] border-t border-[#232733] flex items-center justify-between px-3 text-[11px] font-mono text-gray-400 select-none z-30">
      <div className="flex items-center gap-4">
        <span className="flex items-center gap-1 text-emerald-400">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse inline-block" />
          <span>Ready</span>
        </span>
        <span className="text-gray-600">|</span>
        <span>Canvas: 1920 × 1080</span>
        <span className="text-gray-600">|</span>
        <span>Cursor: X:{cursorPos.x} Y:{cursorPos.y}</span>
        {selectedComponentIds.length > 0 && (
          <>
            <span className="text-gray-600">|</span>
            <span className="text-indigo-400">Selection: 320 × 48</span>
          </>
        )}
      </div>

      <div className="flex items-center gap-4">
        <span className="flex items-center gap-1 text-gray-400">
          <Grid size={12} className="text-indigo-400" />
          <span>Snap: 16px (On)</span>
        </span>
        <span className="text-gray-600">|</span>
        <span className="text-indigo-400 font-semibold">{Math.round(zoom * 100)}%</span>
      </div>
    </div>
  );
};
