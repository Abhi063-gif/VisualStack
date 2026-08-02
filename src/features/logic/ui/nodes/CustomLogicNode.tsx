import React, { memo } from 'react';
import { Handle, Position, type NodeProps } from '@xyflow/react';
import * as Icons from 'lucide-react';
import type { LogicPort } from '../../connections/Port';
import { graphManager } from '../../graph/GraphManager';
import { useLogicStore } from '../../../../stores/LogicStore';

export interface LogicNodePropsData {
  label: string;
  nodeType: string;
  category: string;
  description: string;
  icon?: string;
  color?: string;
  inputs: LogicPort[];
  outputs: LogicPort[];
  config: Record<string, unknown>;
}

export const CustomLogicNode: React.FC<NodeProps> = memo(({ id, data, selected }) => {
  const nodeData = data as unknown as LogicNodePropsData;
  const { setSelectedNodeId, syncFromGraph } = useLogicStore();

  const IconComponent = (Icons as unknown as Record<string, React.FC<{ size?: number; className?: string }>>)[
    nodeData.icon || 'Code'
  ] || Icons.Code;

  const headerColor = nodeData.color || '#6366f1';

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    graphManager.deleteNode(id);
    syncFromGraph();
  };

  return (
    <div
      onClick={() => setSelectedNodeId(id)}
      className={`relative min-w-[220px] rounded-xl bg-slate-900/95 text-white shadow-2xl border transition-all duration-200 backdrop-blur-md ${
        selected ? 'border-indigo-500 ring-2 ring-indigo-500/40 shadow-indigo-500/20' : 'border-slate-800 hover:border-slate-700'
      }`}
    >
      {/* Node Header */}
      <div
        className="flex items-center justify-between px-3.5 py-2.5 rounded-t-xl text-xs font-semibold tracking-wide border-b border-slate-800/80"
        style={{ backgroundColor: `${headerColor}18`, color: headerColor }}
      >
        <div className="flex items-center gap-2 overflow-hidden">
          <div
            className="w-6 h-6 rounded-lg flex items-center justify-center shrink-0 shadow-inner"
            style={{ backgroundColor: `${headerColor}30` }}
          >
            <IconComponent size={14} />
          </div>
          <span className="truncate font-medium text-slate-100">{nodeData.label}</span>
        </div>

        <button
          onClick={handleDelete}
          className="text-slate-400 hover:text-red-400 p-1 rounded-md hover:bg-slate-800/60 transition-colors shrink-0 cursor-pointer"
          title="Delete Node"
        >
          <Icons.X size={12} />
        </button>
      </div>

      {/* Description / Subtitle */}
      {nodeData.description && (
        <div className="px-3.5 py-1.5 text-[11px] text-slate-400 bg-slate-950/40 border-b border-slate-800/50 truncate">
          {nodeData.description}
        </div>
      )}

      {/* Ports Area */}
      <div className="p-3 space-y-2 text-xs">
        {/* Input Ports */}
        <div className="space-y-2">
          {nodeData.inputs?.map((port) => (
            <div key={port.id} className="relative flex items-center justify-start group py-0.5">
              <Handle
                type="target"
                position={Position.Left}
                id={port.id}
                isConnectable={true}
                style={{
                  backgroundColor: port.color || '#94a3b8',
                  width: '16px',
                  height: '16px',
                  border: '2.5px solid #0f172a',
                  left: '-8px',
                  zIndex: 30,
                }}
                className="hover:scale-125 transition-transform cursor-crosshair shadow-md"
              />
              <span
                className="text-[11px] font-mono tracking-tight px-1.5 py-0.5 rounded bg-slate-800/60 text-slate-300 border border-slate-700/50 flex items-center gap-1.5"
              >
                <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: port.color || '#94a3b8' }} />
                {port.name}
              </span>
            </div>
          ))}
        </div>

        {/* Output Ports */}
        <div className="space-y-2 pt-1">
          {nodeData.outputs?.map((port) => (
            <div key={port.id} className="relative flex items-center justify-end group py-0.5">
              <span
                className="text-[11px] font-mono tracking-tight px-1.5 py-0.5 rounded bg-slate-800/60 text-slate-300 border border-slate-700/50 flex items-center gap-1.5"
              >
                {port.name}
                <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: port.color || '#ffffff' }} />
              </span>
              <Handle
                type="source"
                position={Position.Right}
                id={port.id}
                isConnectable={true}
                style={{
                  backgroundColor: port.color || '#ffffff',
                  width: '16px',
                  height: '16px',
                  border: '2.5px solid #0f172a',
                  right: '-8px',
                  zIndex: 30,
                }}
                className="hover:scale-125 transition-transform cursor-crosshair shadow-md"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
});

CustomLogicNode.displayName = 'CustomLogicNode';
