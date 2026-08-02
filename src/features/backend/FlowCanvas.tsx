import React from 'react';
import { ReactFlow, Background, Controls, BackgroundVariant } from '@xyflow/react';
import '@xyflow/react/dist/style.css';

export const FlowCanvas: React.FC = () => {
  return (
    <div className="w-full h-full bg-[#0e0f12] relative overflow-hidden">
      <ReactFlow
        nodes={[]}
        edges={[]}
        fitView
        proOptions={{ hideAttribution: true }}
      >
        <Background variant={BackgroundVariant.Dots} gap={16} size={1} color="#232733" />
        <Controls className="bg-[#14161b] border border-[#232733] fill-gray-300 rounded shadow-md" />
      </ReactFlow>
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
        <div className="bg-[#14161b]/80 border border-[#232733] px-4 py-2 rounded-md text-xs text-gray-500 font-medium shadow-sm">
          Empty React Flow Canvas (Integrated)
        </div>
      </div>
    </div>
  );
};
