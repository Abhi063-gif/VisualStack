import React from 'react';
import { useCanvasStore } from '../../stores/CanvasStore';

export const Viewport: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { viewport } = useCanvasStore();

  return (
    <div
      className="w-full h-full relative overflow-hidden bg-[#0e0f12]"
      style={{
        transform: `scale(${viewport.zoom}) translate(${viewport.x}px, ${viewport.y}px)`,
        transformOrigin: '0 0',
      }}
    >
      {children}
    </div>
  );
};
