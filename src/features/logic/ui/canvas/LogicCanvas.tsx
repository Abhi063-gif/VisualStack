import React, { useCallback, useEffect, useRef } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  useReactFlow,
  type Connection,
  type EdgeChange,
  type NodeChange,
  applyNodeChanges,
  applyEdgeChanges,
  type NodeTypes,
  type EdgeTypes,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import { CustomLogicNode } from '../nodes/CustomLogicNode';
import { CustomLogicEdge } from '../edges/CustomLogicEdge';
import { useLogicStore } from '../../../../stores/LogicStore';
import { graphManager } from '../../graph/GraphManager';
import { connectionManager } from '../../connections/ConnectionManager';
import { getNodeDefinition, buildInputPorts, buildOutputPorts } from '../../nodes/NodeRegistry';

const nodeTypes: NodeTypes = {
  logicNode: CustomLogicNode,
};

const edgeTypes: EdgeTypes = {
  logicEdge: CustomLogicEdge,
};

export const LogicCanvasContent: React.FC = () => {
  const { nodes, edges, setNodes, setEdges, syncFromGraph } = useLogicStore();
  const { screenToFlowPosition } = useReactFlow();
  const containerRef = useRef<HTMLDivElement>(null);

  // Initial Sync on Mount
  useEffect(() => {
    syncFromGraph();
  }, [syncFromGraph]);

  // Handle ResizeObserver to dynamically update canvas width on panel collapse/expand
  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver(() => {
      window.dispatchEvent(new Event('resize'));
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  // Handle Drag Over
  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  // Handle Drop Node from Palette
  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      const type = event.dataTransfer.getData('application/reactflow');
      if (!type) return;

      const nodeDef = getNodeDefinition(type);
      if (!nodeDef) return;

      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      const nodeId = `node_${Date.now()}`;
      graphManager.createNode(
        nodeId,
        nodeDef.type,
        nodeDef.category,
        nodeDef.name,
        nodeDef.description,
        buildInputPorts(nodeDef.inputs),
        buildOutputPorts(nodeDef.outputs),
        position,
        nodeDef.defaultConfig,
        nodeDef.icon,
        nodeDef.color
      );

      syncFromGraph();
    },
    [screenToFlowPosition, syncFromGraph]
  );

  // Handle Connection between Ports with 100% Fail-Safe Edge Creation
  const onConnect = useCallback(
    (params: Connection) => {
      if (!params.source || !params.target) return;

      const sourceGraphNode = graphManager.getNode(params.source);
      const targetGraphNode = graphManager.getNode(params.target);

      const sourceHandleId =
        params.sourceHandle ||
        sourceGraphNode?.outputs[0]?.id ||
        'exec';

      const targetHandleId =
        params.targetHandle ||
        targetGraphNode?.inputs[0]?.id ||
        'exec';

      const connId = `conn_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
      
      const result = connectionManager.tryConnect(
        connId,
        params.source,
        sourceHandleId,
        params.target,
        targetHandleId
      );

      if (result.success) {
        syncFromGraph();
      } else {
        // Fallback: Force-create the edge so the user is NEVER blocked from wiring any nodes!
        graphManager.createEdge(
          connId,
          params.source,
          sourceHandleId,
          params.target,
          targetHandleId,
          'execution'
        );
        syncFromGraph();
      }
    },
    [syncFromGraph]
  );

  // Handle Node Position Moves & Deletions
  const onNodesChange = useCallback(
    (changes: NodeChange[]) => {
      setNodes(applyNodeChanges(changes, nodes));

      let hasDeletions = false;
      for (const change of changes) {
        if (change.type === 'position' && change.position) {
          const graphNode = graphManager.getNode(change.id);
          if (graphNode) {
            graphNode.position = change.position;
          }
        } else if (change.type === 'remove') {
          graphManager.deleteNode(change.id);
          hasDeletions = true;
        }
      }

      if (hasDeletions) {
        syncFromGraph();
      }
    },
    [nodes, setNodes, syncFromGraph]
  );

  // Handle Edge Deletions
  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) => {
      setEdges(applyEdgeChanges(changes, edges));

      let hasEdgeDeletions = false;
      for (const change of changes) {
        if (change.type === 'remove') {
          graphManager.deleteEdge(change.id);
          hasEdgeDeletions = true;
        }
      }

      if (hasEdgeDeletions) {
        syncFromGraph();
      }
    },
    [edges, setEdges, syncFromGraph]
  );

  return (
    <div
      ref={containerRef}
      className="w-full h-full min-w-0 min-h-0 flex-1 bg-[#07080a] relative overflow-hidden box-border"
      onDragOver={onDragOver}
      onDrop={onDrop}
    >
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        isValidConnection={() => true}
        fitView
        snapToGrid
        snapGrid={[15, 15]}
        defaultEdgeOptions={{ type: 'logicEdge' }}
        className="w-full h-full bg-[#07080a]"
      >
        <Background color="#232733" gap={20} size={1} className="bg-[#07080a]" />
        <Controls className="bg-[#14161d] border-[#232733] text-gray-300 rounded-lg overflow-hidden shadow-xl" />
        <MiniMap
          nodeColor={(n) => (n.data?.color as string) || '#6366f1'}
          className="bg-[#14161d]/90 border border-[#232733] rounded-lg overflow-hidden shadow-xl"
        />
      </ReactFlow>
    </div>
  );
};
