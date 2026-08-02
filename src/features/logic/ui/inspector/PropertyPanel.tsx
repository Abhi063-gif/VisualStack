import React, { useState } from 'react';
import * as Icons from 'lucide-react';
import { useLogicStore } from '../../../../stores/LogicStore';
import { graphManager } from '../../graph/GraphManager';

const TabButton = ({ active, label, onClick }: { active?: boolean; label: string; onClick: () => void }) => (
  <button
    onClick={onClick}
    className={`flex-1 py-3 text-[11px] font-medium transition-colors border-b-2 ${
      active ? 'text-gray-100 border-indigo-500 font-semibold' : 'text-gray-500 border-transparent hover:text-gray-300'
    }`}
  >
    {label}
  </button>
);

const SectionHeader = ({ title, count }: { title: string; count?: number }) => (
  <div className="flex items-center justify-between pt-3 pb-1.5 border-t border-[#232733] mt-3">
    <h4 className="text-[11px] font-semibold text-white/90 uppercase tracking-wider">{title}</h4>
    {count !== undefined && (
      <span className="text-[10px] font-mono text-gray-400 bg-[#181a20] px-1.5 py-0.5 rounded border border-[#232733]">
        {count}
      </span>
    )}
  </div>
);

const InputBlock = ({
  label,
  value,
  onChange,
  type = 'text',
  placeholder,
}: {
  label?: string;
  value: string | number;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
}) => (
  <div className="space-y-1 w-full box-border min-w-0">
    {label && <span className="text-[10px] text-gray-400 font-medium block truncate">{label}</span>}
    <div className="flex items-center bg-[#181a20] border border-[#232733] rounded hover:border-[#383e52] focus-within:border-indigo-500 transition-colors px-2.5 py-1 min-h-7 box-border w-full min-w-0">
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="bg-transparent border-none outline-none text-white text-[11px] font-mono w-full min-w-0 placeholder-gray-600 box-border"
      />
    </div>
  </div>
);

const TextareaBlock = ({
  label,
  value,
  onChange,
  rows = 3,
}: {
  label?: string;
  value: string;
  onChange: (v: string) => void;
  rows?: number;
}) => (
  <div className="space-y-1 w-full box-border min-w-0">
    {label && <span className="text-[10px] text-gray-400 font-medium block truncate">{label}</span>}
    <div className="bg-[#181a20] border border-[#232733] rounded hover:border-[#383e52] focus-within:border-indigo-500 transition-colors p-2 box-border w-full min-w-0">
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={rows}
        className="bg-transparent border-none outline-none text-white text-[11px] font-mono w-full min-w-0 resize-y placeholder-gray-600 leading-relaxed box-border"
      />
    </div>
  </div>
);

/**
 * Real-Time Execution Flow Timeline Component (Matching Attached Inspector Design)
 */
const ExecutionFlowPanel: React.FC = () => {
  const { executionSteps, clearExecutionSteps } = useLogicStore();

  return (
    <div className="flex flex-col h-full w-full bg-[#0c0e14] p-3 rounded-lg border border-[#1e2230] box-border text-gray-200 overflow-hidden">
      {/* Header Banner */}
      <div className="flex items-center justify-between pb-3 border-b border-[#1e2230]">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-full bg-purple-950/80 border border-purple-500/40 flex items-center justify-center">
            <Icons.Play size={10} className="text-purple-400 fill-purple-400 ml-0.5" />
          </div>
          <h3 className="text-xs font-semibold uppercase tracking-wider text-purple-300">Execution Flow</h3>
        </div>
        {executionSteps.length > 0 && (
          <button
            onClick={clearExecutionSteps}
            className="text-[10px] text-gray-400 hover:text-white px-2 py-0.5 bg-[#181a20] hover:bg-[#232733] border border-[#232733] rounded transition-colors"
          >
            Clear Flow
          </button>
        )}
      </div>

      {/* Steps List Timeline */}
      <div className="flex-1 overflow-y-auto pt-4 pb-2 px-1 space-y-0 custom-scrollbar">
        {executionSteps.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 text-center text-gray-500">
            <Icons.Activity size={24} className="text-gray-600 mb-2 stroke-1" />
            <span className="text-xs font-medium text-gray-400">No Execution Flow Logged Yet</span>
            <span className="text-[10px] text-gray-600 mt-1 max-w-[200px]">
              Click "Run Logic" in the toolbar to execute graph nodes and visualize real-time logic execution.
            </span>
          </div>
        ) : (
          executionSteps.map((step, idx) => {
            const isLast = idx === executionSteps.length - 1;
            const isSuccess = step.status === 'Success';
            const isFailed = step.status === 'Failed';

            return (
              <div key={step.id} className="relative flex items-start group">
                {/* Step Connector Line & Arrow */}
                {!isLast && (
                  <div className="absolute left-[13px] top-[26px] bottom-[-6px] w-[1px] bg-gradient-to-b from-[#3b82f6]/50 to-[#3b82f6]/20 flex flex-col items-center justify-center z-0">
                    <Icons.ChevronDown size={10} className="text-indigo-400/60 -mt-1" />
                  </div>
                )}

                {/* Badge Number Icon */}
                <div className="relative z-10 w-7 h-7 rounded-full bg-[#181a26] border border-[#3b82f6]/40 text-[#a5b4fc] text-[11px] font-mono font-bold flex items-center justify-center shrink-0 shadow-sm group-hover:border-indigo-400 transition-colors">
                  {step.stepIndex}
                </div>

                {/* Step Name & Information */}
                <div className="ml-3 flex-1 min-w-0 pb-5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 truncate pr-2">
                      <span className="text-xs font-mono text-purple-300 font-semibold">{step.stepIndex}</span>
                      <span className="text-xs font-medium text-white truncate">{step.nodeName}</span>
                    </div>

                    {/* Status Pill */}
                    <span
                      className={`text-xs font-medium font-sans px-1.5 py-0.5 rounded shrink-0 ${
                        isSuccess
                          ? 'text-[#10b981] font-semibold'
                          : isFailed
                          ? 'text-[#ef4444] font-semibold'
                          : 'text-[#f59e0b] font-semibold'
                      }`}
                    >
                      {step.status}
                    </span>
                  </div>
                  <div className="text-[10px] font-mono text-gray-500 mt-0.5 flex items-center gap-2">
                    <span>{step.category}</span>
                    <span>•</span>
                    <span>{step.timestamp}</span>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export const PropertyPanel: React.FC = () => {
  const { selectedNodeId, nodes, syncFromGraph, executionSteps } = useLogicStore();
  const [activeTab, setActiveTab] = useState<'config' | 'ports' | 'flow' | 'json'>('config');

  const selectedNode = selectedNodeId ? graphManager.getNode(selectedNodeId) : null;
  const storeNode = nodes.find((n) => n.id === selectedNodeId);

  if (!selectedNode || !storeNode) {
    return (
      <div className="w-full h-full bg-[#0e0f12] text-gray-300 flex flex-col border-l border-[#232733] shrink-0 select-none box-border overflow-hidden">
        {/* Top Header Tabs */}
        <div className="flex border-b border-[#232733] px-2 shrink-0 justify-between items-center bg-[#0e0f12]">
          <div className="flex flex-1">
            <TabButton active={activeTab === 'config'} label="Config" onClick={() => setActiveTab('config')} />
            <TabButton active={activeTab === 'ports'} label="Ports" onClick={() => setActiveTab('ports')} />
            <TabButton
              active={activeTab === 'flow'}
              label={`Flow (${executionSteps.length})`}
              onClick={() => setActiveTab('flow')}
            />
            <TabButton active={activeTab === 'json'} label="JSON" onClick={() => setActiveTab('json')} />
          </div>
        </div>

        {/* If Flow tab active, show ExecutionFlowPanel directly even when no node selected */}
        {activeTab === 'flow' ? (
          <div className="p-3 h-full overflow-hidden">
            <ExecutionFlowPanel />
          </div>
        ) : (
          <div className="flex-1 flex flex-col p-3 overflow-y-auto space-y-4">
            <div className="flex flex-col items-center justify-center p-6 text-center text-gray-600 bg-[#14161d] rounded-lg border border-[#232733]">
              <div className="w-10 h-10 rounded-lg bg-[#181a20] border border-[#232733] flex items-center justify-center mb-3 text-gray-400">
                <Icons.Sliders size={18} />
              </div>
              <span className="text-xs font-semibold text-gray-300">Select a Node Element</span>
              <span className="text-[11px] text-gray-500 mt-1 max-w-[200px] leading-relaxed">
                Click any node on the canvas to configure properties & ports.
              </span>
            </div>

            {/* Always display Execution Flow Timeline in default empty state */}
            <div className="flex-1 min-h-[260px]">
              <ExecutionFlowPanel />
            </div>
          </div>
        )}
      </div>
    );
  }

  const handleNameChange = (newName: string) => {
    selectedNode.name = newName;
    syncFromGraph();
  };

  const handleDescriptionChange = (newDesc: string) => {
    selectedNode.description = newDesc;
    syncFromGraph();
  };

  const handleConfigChange = (key: string, value: unknown) => {
    selectedNode.config[key] = value;
    syncFromGraph();
  };

  const handlePortDefaultChange = (portId: string, value: unknown) => {
    const inputPort = selectedNode.inputs.find((p) => p.id === portId);
    if (inputPort) {
      inputPort.defaultValue = value;
      syncFromGraph();
    }
  };

  const IconComp = (Icons as unknown as Record<string, React.FC<{ size?: number }>>)[selectedNode.icon] || Icons.Code;

  return (
    <div className="w-full h-full bg-[#0e0f12] text-gray-300 flex flex-col border-l border-[#232733] shrink-0 select-none relative custom-scrollbar overflow-hidden box-border">
      {/* Top Header Tabs */}
      <div className="flex border-b border-[#232733] px-2 shrink-0 justify-between items-center bg-[#0e0f12]">
        <div className="flex flex-1">
          <TabButton active={activeTab === 'config'} label="Config" onClick={() => setActiveTab('config')} />
          <TabButton active={activeTab === 'ports'} label="Ports" onClick={() => setActiveTab('ports')} />
          <TabButton
            active={activeTab === 'flow'}
            label={`Flow (${executionSteps.length})`}
            onClick={() => setActiveTab('flow')}
          />
          <TabButton active={activeTab === 'json'} label="JSON" onClick={() => setActiveTab('json')} />
        </div>
      </div>

      {/* Selected Node Header Banner */}
      <div className="p-3 border-b border-[#232733] bg-[#14161d] shrink-0 flex items-center justify-between box-border min-w-0">
        <div className="flex items-center gap-2.5 min-w-0 shrink">
          <div
            className="w-7 h-7 rounded flex items-center justify-center text-white shrink-0 shadow"
            style={{ backgroundColor: selectedNode.color || '#6366f1' }}
          >
            <IconComp size={15} />
          </div>
          <div className="min-w-0 shrink">
            <div className="text-xs font-semibold text-white truncate">{selectedNode.name}</div>
            <div className="text-[10px] font-mono text-gray-400 truncate">{selectedNode.type}</div>
          </div>
        </div>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded border border-[#232733] text-gray-400 bg-[#181a20] shrink-0 ml-1 truncate max-w-[90px]">
          {selectedNode.category}
        </span>
      </div>

      {/* Main Form Fields / Execution Flow Container */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden p-3 space-y-3 custom-scrollbar box-border w-full min-w-0">
        {activeTab === 'flow' && <ExecutionFlowPanel />}

        {activeTab === 'config' && (
          <>
            {/* Identity */}
            <SectionHeader title="Node Identity" />
            <InputBlock label="Title" value={selectedNode.name} onChange={handleNameChange} />
            <TextareaBlock label="Description" value={selectedNode.description} onChange={handleDescriptionChange} rows={2} />

            {/* Configuration */}
            <SectionHeader title="Node Configuration" count={Object.keys(selectedNode.config).length} />
            {Object.keys(selectedNode.config).length === 0 ? (
              <span className="text-[11px] text-gray-500 italic block py-1">No configurable parameters.</span>
            ) : (
              Object.entries(selectedNode.config).map(([key, value]) => {
                const valType = typeof value;

                if (valType === 'boolean') {
                  return (
                    <div key={key} className="flex items-center justify-between py-1.5 px-2.5 bg-[#181a20] border border-[#232733] rounded box-border w-full min-w-0">
                      <span className="text-[11px] font-mono text-gray-300 truncate pr-2">{key}</span>
                      <input
                        type="checkbox"
                        checked={Boolean(value)}
                        onChange={(e) => handleConfigChange(key, e.target.checked)}
                        className="rounded bg-[#0e0f12] border-[#232733] text-indigo-600 focus:ring-0 cursor-pointer shrink-0"
                      />
                    </div>
                  );
                }

                if (key === 'code' || key === 'sql' || key === 'script') {
                  return (
                    <TextareaBlock
                      key={key}
                      label={key}
                      value={String(value || '')}
                      onChange={(val) => handleConfigChange(key, val)}
                      rows={4}
                    />
                  );
                }

                return (
                  <InputBlock
                    key={key}
                    label={key}
                    value={String(value ?? '')}
                    onChange={(val) => handleConfigChange(key, valType === 'number' ? Number(val) : val)}
                    type={valType === 'number' ? 'number' : 'text'}
                  />
                );
              })
            )}

            {/* Inline Execution Flow Section inside Config */}
            <div className="pt-3">
              <ExecutionFlowPanel />
            </div>
          </>
        )}

        {activeTab === 'ports' && (
          <>
            <SectionHeader title="Input Ports" count={selectedNode.inputs.length} />
            {selectedNode.inputs.length === 0 ? (
              <span className="text-[11px] text-gray-500 italic block py-1">No input ports.</span>
            ) : (
              selectedNode.inputs.map((port) => (
                <div key={port.id} className="p-2 bg-[#181a20] border border-[#232733] rounded space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-medium text-white">{port.name}</span>
                    <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-[#232733] text-indigo-400">
                      {port.dataType}
                    </span>
                  </div>
                  {port.type === 'data' && (
                    <InputBlock
                      value={String(port.defaultValue ?? '')}
                      onChange={(val) => handlePortDefaultChange(port.id, val)}
                      placeholder="Default Value"
                    />
                  )}
                </div>
              ))
            )}

            <SectionHeader title="Output Ports" count={selectedNode.outputs.length} />
            {selectedNode.outputs.length === 0 ? (
              <span className="text-[11px] text-gray-500 italic block py-1">No output ports.</span>
            ) : (
              selectedNode.outputs.map((port) => (
                <div key={port.id} className="p-2 bg-[#181a20] border border-[#232733] rounded flex items-center justify-between">
                  <span className="text-[11px] font-medium text-white">{port.name}</span>
                  <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-[#232733] text-indigo-400">
                    {port.dataType}
                  </span>
                </div>
              ))
            )}
          </>
        )}

        {activeTab === 'json' && (
          <div className="bg-[#181a20] border border-[#232733] rounded p-2.5">
            <pre className="text-[10px] font-mono text-emerald-400 whitespace-pre-wrap break-all leading-relaxed">
              {JSON.stringify(selectedNode, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};
