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

export const PropertyPanel: React.FC = () => {
  const { selectedNodeId, nodes, syncFromGraph } = useLogicStore();
  const [activeTab, setActiveTab] = useState<'config' | 'ports' | 'json'>('config');

  const selectedNode = selectedNodeId ? graphManager.getNode(selectedNodeId) : null;
  const storeNode = nodes.find((n) => n.id === selectedNodeId);

  if (!selectedNode || !storeNode) {
    return (
      <div className="w-full h-full bg-[#0e0f12] text-gray-300 flex flex-col border-l border-[#232733] shrink-0 select-none box-border overflow-hidden">
        {/* Top Header Tabs */}
        <div className="flex border-b border-[#232733] px-2 shrink-0 justify-between items-center bg-[#0e0f12]">
          <div className="flex flex-1">
            <TabButton active label="Config" onClick={() => {}} />
            <TabButton label="Ports" onClick={() => {}} />
            <TabButton label="JSON" onClick={() => {}} />
          </div>
        </div>

        {/* Empty State matching InspectorPanel */}
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center text-gray-600">
          <div className="w-10 h-10 rounded-lg bg-[#181a20] border border-[#232733] flex items-center justify-center mb-3 text-gray-500">
            <Icons.Sliders size={18} />
          </div>
          <span className="text-xs font-semibold text-gray-300">Select a Node Element</span>
          <span className="text-[11px] text-gray-500 mt-1 max-w-[200px] leading-relaxed">
            Click any node on the graph canvas to configure properties & ports.
          </span>
        </div>
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

      {/* Main Form Fields Container */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden p-3 space-y-3 custom-scrollbar box-border w-full min-w-0">
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
                      value={String(value)}
                      onChange={(v) => handleConfigChange(key, v)}
                      rows={5}
                    />
                  );
                }

                return (
                  <InputBlock
                    key={key}
                    label={key}
                    value={String(value ?? '')}
                    onChange={(v) => handleConfigChange(key, v)}
                    type={valType === 'number' ? 'number' : 'text'}
                  />
                );
              })
            )}
          </>
        )}

        {activeTab === 'ports' && (
          <>
            {/* Input Ports */}
            <SectionHeader title="Input Ports" count={selectedNode.inputs.length} />
            <div className="space-y-2 box-border w-full min-w-0">
              {selectedNode.inputs.map((port) => (
                <div key={port.id} className="p-2.5 rounded bg-[#181a20] border border-[#232733] space-y-1.5 box-border w-full min-w-0">
                  <div className="flex items-center justify-between min-w-0">
                    <div className="flex items-center gap-1.5 min-w-0 shrink">
                      <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: port.color || '#94a3b8' }} />
                      <span className="font-mono text-[11px] text-gray-200 truncate">{port.name}</span>
                    </div>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#0e0f12] text-gray-400 border border-[#232733] shrink-0 ml-1">
                      {port.dataType}
                    </span>
                  </div>

                  {port.type === 'data' && (
                    <div className="mt-1 w-full box-border min-w-0">
                      <InputBlock
                        value={String(port.defaultValue ?? '')}
                        onChange={(v) => handlePortDefaultChange(port.id, v)}
                        placeholder={`Default (${port.dataType})`}
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Output Ports */}
            <SectionHeader title="Output Ports" count={selectedNode.outputs.length} />
            <div className="space-y-1.5 box-border w-full min-w-0">
              {selectedNode.outputs.map((port) => (
                <div key={port.id} className="flex items-center justify-between p-2 rounded bg-[#181a20] border border-[#232733] box-border w-full min-w-0">
                  <div className="flex items-center gap-1.5 min-w-0 shrink">
                    <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: port.color || '#ffffff' }} />
                    <span className="font-mono text-[11px] text-gray-200 truncate">{port.name}</span>
                  </div>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#0e0f12] text-gray-400 border border-[#232733] shrink-0 ml-1">
                    {port.dataType}
                  </span>
                </div>
              ))}
            </div>
          </>
        )}

        {activeTab === 'json' && (
          <>
            <SectionHeader title="Raw Node Definition" />
            <div className="bg-[#181a20] border border-[#232733] rounded p-2.5 overflow-x-auto box-border w-full min-w-0">
              <pre className="text-[10px] font-mono text-indigo-300 leading-relaxed">
                {JSON.stringify(
                  {
                    id: selectedNode.id,
                    type: selectedNode.type,
                    category: selectedNode.category,
                    name: selectedNode.name,
                    config: selectedNode.config,
                    inputsCount: selectedNode.inputs.length,
                    outputsCount: selectedNode.outputs.length,
                  },
                  null,
                  2
                )}
              </pre>
            </div>
          </>
        )}
      </div>

      {/* Custom Scrollbar */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #232733; border-radius: 3px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #383e52; }
      `}</style>
    </div>
  );
};
