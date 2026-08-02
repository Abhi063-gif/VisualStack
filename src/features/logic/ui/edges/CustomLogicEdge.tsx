import React, { memo } from 'react';
import { BaseEdge, getBezierPath, EdgeLabelRenderer, type EdgeProps } from '@xyflow/react';
import { graphManager } from '../../graph/GraphManager';
import { useLogicStore } from '../../../../stores/LogicStore';
import * as Icons from 'lucide-react';

export const CustomLogicEdge: React.FC<EdgeProps> = memo((props) => {
  const {
    id,
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
    data,
    selected,
  } = props;
  const { syncFromGraph } = useLogicStore();

  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  const isExecution = (data?.portType as string) === 'execution';
  const strokeColor = isExecution ? '#ffffff' : '#60a5fa';

  const onEdgeClick = (evt: React.MouseEvent) => {
    evt.stopPropagation();
    graphManager.deleteEdge(id);
    syncFromGraph();
  };

  return (
    <>
      <BaseEdge
        id={id}
        path={edgePath}
        style={{
          stroke: selected ? '#818cf8' : strokeColor,
          strokeWidth: selected ? 3.5 : isExecution ? 2.5 : 2,
          strokeDasharray: isExecution ? '6 4' : 'none',
          animation: isExecution ? 'dashdraw 0.8s linear infinite' : 'none',
          opacity: selected ? 1 : 0.85,
        }}
      />
      <EdgeLabelRenderer>
        <div
          style={{
            position: 'absolute',
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
            pointerEvents: 'all',
          }}
          className="nodrag nopan group"
        >
          <button
            onClick={onEdgeClick}
            className="w-5 h-5 rounded-full bg-slate-900 border border-slate-700 text-slate-400 hover:text-red-400 hover:border-red-500 hover:bg-slate-950 flex items-center justify-center transition-all shadow-md hover:scale-125 cursor-pointer"
            title="Remove wire connection"
          >
            <Icons.X size={12} />
          </button>
        </div>
      </EdgeLabelRenderer>
    </>
  );
});

CustomLogicEdge.displayName = 'CustomLogicEdge';
