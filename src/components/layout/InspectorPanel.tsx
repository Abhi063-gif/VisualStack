import React from 'react';
import { 
  AlignLeft, AlignCenter, AlignRight,
  ChevronDown, Plus, Minus, Target, CornerUpRight, LayoutGrid, Menu, MoreVertical, Lock
} from 'lucide-react';
import { useSelectionStore } from '../../stores/SelectionStore';
import { useSceneStore } from '../../stores/SceneStore';
import { commandManager } from '../../core/commands/CommandManager';
import { UpdateNodePropertyCommand, MultiUpdateNodePropertyCommand } from '../../features/designer/commands/NodeCommands';
import { GroupCommand } from '../../features/designer/commands/GroupCommand';
import { AlignNodesCommand, DistributeNodesCommand, TidyUpNodesCommand, type AlignType } from '../../features/designer/commands/LayoutCommands';
import type { DesignerNode } from '../../features/designer/models/DesignerNode';
import { sceneGraph } from '../../features/designer/scenegraph/SceneGraph';
import { layoutEngine } from '../../features/designer/layout/LayoutEngine';
import { DetachInstanceCommand } from '../../features/designer/commands/ComponentCommands';
import { useComponentStore } from '../../stores/ComponentStore';
import type { SceneNodeSnapshot } from '../../stores/SceneStore';

// --- Reusable UI Components ---

const TabButton = ({ active, label }: { active?: boolean, label: string }) => (
  <button className={`flex-1 py-3 text-[11px] font-medium transition-colors border-b-2 ${
    active ? 'text-gray-100 border-indigo-500' : 'text-gray-500 border-transparent hover:text-gray-300'
  }`}>
    {label}
  </button>
);

const IconButton = ({ icon: Icon, active, onClick, iconClassName }: { icon: any, active?: boolean, onClick?: () => void, iconClassName?: string }) => (
  <button onClick={onClick} className={`p-1.5 rounded transition-colors ${
    active ? 'bg-[#232733] text-gray-200' : 'text-gray-400 hover:text-gray-200 hover:bg-[#1f232d]'
  }`}>
    <Icon size={14} strokeWidth={2} className={iconClassName} />
  </button>
);

const ActionButton = ({ icon: Icon, label, onClick, iconClassName }: any) => (
  <button 
    onClick={onClick}
    className="flex items-center gap-2 px-3 py-1.5 bg-[#181a20] text-gray-300 border border-[#232733] rounded hover:border-[#383e52] hover:bg-[#1f232d] transition-colors w-full text-[11px]"
  >
    <Icon size={14} className={`text-gray-400 ${iconClassName || ''}`} />
    <span>{label}</span>
  </button>
);



const SectionHeader = ({ title, onAdd }: { title: string, onAdd?: () => void }) => (
  <div className="flex items-center justify-between py-3 border-t border-[#232733] mt-2">
    <h4 className="text-[11px] font-semibold text-white/90">{title}</h4>
    {onAdd && (
      <button className="text-gray-400 hover:text-white transition-colors" onClick={onAdd}>
        <Plus size={14} />
      </button>
    )}
  </div>
);

const InputBlock = ({ icon, prefix, value, onChange, suffix }: any) => (
  <div className="flex items-center bg-[#181a20] border border-[#232733] rounded hover:border-[#383e52] focus-within:border-indigo-500 transition-colors px-2 py-1 h-7">
    {icon && <span className="text-gray-500 mr-2 flex-shrink-0">{icon}</span>}
    {prefix && <span className="text-gray-500 mr-2 text-[10px] font-mono flex-shrink-0">{prefix}</span>}
    <input 
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="bg-transparent border-none outline-none text-white text-[11px] font-mono w-full min-w-0"
    />
    {suffix && <span className="text-gray-500 ml-1 text-[10px] flex-shrink-0">{suffix}</span>}
  </div>
);



const DropdownBlock = ({ value, options, onChange }: { value: string, options: string[], onChange: (v: string) => void }) => (
  <div className="relative flex items-center justify-between bg-[#181a20] border border-[#232733] rounded hover:border-[#383e52] transition-colors px-2 py-1 h-7 cursor-pointer">
    <select 
      value={value} 
      onChange={(e) => onChange(e.target.value)}
      className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
    >
      {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
    </select>
    <span className="text-white text-[11px] truncate pointer-events-none" style={{ fontFamily: value }}>{value}</span>
    <ChevronDown size={14} className="text-gray-500 pointer-events-none shrink-0" />
  </div>
);

export const InspectorPanel: React.FC = () => {
  const { selectedComponentIds } = useSelectionStore();
  const nodes = useSceneStore((s) => s.nodes);

  const selectedId = selectedComponentIds[0] ?? null;
  const node = selectedId ? nodes.find((n) => n.id === selectedId) ?? null : null;

  const patch = (key: keyof SceneNodeSnapshot, value: unknown) => {
    if (selectedComponentIds.length === 0) return;

    if (selectedComponentIds.length === 1) {
      if (!selectedId || !node) return;
      const prev = { [key]: node[key] };
      const next = { [key]: value };
      void commandManager.executeCommand(new UpdateNodePropertyCommand(selectedId, prev, next));
    } else {
      const updates = selectedComponentIds.map((id) => {
        const n = nodes.find((item) => item.id === id);
        return {
          nodeId: id,
          prevPatch: { [key]: n ? (n as any)[key] : undefined },
          newPatch: { [key]: value },
        };
      });
      void commandManager.executeCommand(new MultiUpdateNodePropertyCommand(updates));
    }

    if (key === 'layoutConfig') {
      setTimeout(() => {
        selectedComponentIds.forEach((id) => layoutEngine.updateLayout(id));
      }, 10);
    }
  };

  const patchNum = (key: keyof SceneNodeSnapshot, valStr: string | number, innerKey?: string) => {
    if (!node) return;
    const num = typeof valStr === 'number' ? valStr : parseFloat(valStr) || 0;
    if (innerKey) {
      const obj = node[key] as any;
      patch(key, { ...obj, [innerKey]: num });
    } else {
      patch(key, num);
    }
  };

  const handleAlign = (type: AlignType) => {
    const selectedNodes = selectedComponentIds
      .map(id => sceneGraph.getNode(id)?.node)
      .filter(Boolean) as DesignerNode[];

    if (selectedNodes.length === 0) return;

    if (selectedNodes.length === 1) {
      const singleNode = selectedNodes[0];
      const sceneNode = sceneGraph.getNode(singleNode.id);
      const parentNode = sceneNode?.parent?.node;

      if (parentNode) {
        const parentW = parentNode.size.width;
        const parentH = parentNode.size.height;
        let newX = singleNode.position.x;
        let newY = singleNode.position.y;

        switch (type) {
          case 'left': newX = 0; break;
          case 'center': newX = (parentW - singleNode.size.width) / 2; break;
          case 'right': newX = parentW - singleNode.size.width; break;
          case 'top': newY = 0; break;
          case 'middle': newY = (parentH - singleNode.size.height) / 2; break;
          case 'bottom': newY = parentH - singleNode.size.height; break;
        }

        commandManager.executeCommand(
          new UpdateNodePropertyCommand(
            singleNode.id,
            { position: singleNode.position },
            { position: { x: Math.round(newX), y: Math.round(newY) } }
          )
        );
      }
    } else {
      // Align all selected elements relative to the selection bounding box
      commandManager.executeCommand(new AlignNodesCommand(selectedNodes, type));
    }
  };

  // ── ComponentInstance Inspector (short-circuit) ─────────────────────
  if (node && node.type === 'ComponentInstance') {
    const liveNode = sceneGraph.getNode(selectedId!)?.node as any;
    const overrides = liveNode?.overrides || {};
    const componentDef = useComponentStore.getState().getComponent(liveNode?.componentId);

    const setOverride = (key: string, value: unknown) => {
      if (!liveNode) return;
      liveNode.overrides = { ...overrides, [key]: value };
      useSceneStore.getState().upsertNode(liveNode);
      // Trigger re-render
      import('../../core/events/EventBus').then(({ eventBus }) => {
        import('../../core/events/EventTypes').then(({ SystemEventType }) => {
          eventBus.emit(SystemEventType.CANVAS_NODE_UPDATED, { nodeId: selectedId!, changes: {} });
        });
      });
    };

    return (
      <div className="h-full bg-[#0e0f12] text-gray-300 flex flex-col border-l border-[#232733] overflow-y-auto custom-scrollbar w-64">
        <div className="flex border-b border-[#232733] px-2">
          <TabButton active label="Design" />
          <TabButton label="Inspect" />
        </div>
        <div className="p-4 space-y-4">
          {/* Component Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-green-400 text-base">◇</span>
              <div>
                <div className="text-[11px] font-semibold text-white">{node.name}</div>
                {componentDef && (
                  <div className="text-[10px] text-gray-500">→ {componentDef.name}</div>
                )}
              </div>
            </div>
            <button
              onClick={() => commandManager.executeCommand(new DetachInstanceCommand(selectedId!))}
              className="text-[10px] text-amber-400 hover:text-amber-300 border border-amber-900 hover:border-amber-700 px-2 py-0.5 rounded transition-colors"
            >
              Detach
            </button>
          </div>

          <div className="text-[10px] text-gray-500 uppercase tracking-wider font-medium pt-1 border-t border-[#232733]">Overridable Properties</div>

          {/* Fill override */}
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-gray-400">Fill</span>
              {'fill' in overrides && (
                <button onClick={() => { delete liveNode.overrides.fill; useSceneStore.getState().upsertNode(liveNode); }} className="text-[9px] text-blue-400 hover:text-blue-300">reset</button>
              )}
            </div>
            <div className={`flex items-center gap-2 bg-[#181a20] border rounded px-2 py-1 h-7 ${'fill' in overrides ? 'border-blue-500/50' : 'border-[#232733]'}`}>
              <input
                type="color"
                value={(overrides.fill as string) || node.fill || '#6366f1'}
                onChange={(e) => setOverride('fill', e.target.value)}
                className="w-5 h-5 rounded cursor-pointer border-0 bg-transparent"
              />
              <span className="text-[11px] font-mono text-white flex-1">{(overrides.fill as string) || node.fill || '#6366f1'}</span>
            </div>
          </div>

          {/* Text content override */}
          {(node.textContent || componentDef) && (
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-gray-400">Text</span>
                {'textContent' in overrides && (
                  <button onClick={() => { delete liveNode.overrides.textContent; useSceneStore.getState().upsertNode(liveNode); }} className="text-[9px] text-blue-400 hover:text-blue-300">reset</button>
                )}
              </div>
              <input
                type="text"
                value={(overrides.textContent as string) ?? node.textContent ?? ''}
                onChange={(e) => setOverride('textContent', e.target.value)}
                className={`w-full bg-[#181a20] border rounded px-2 py-1 text-[11px] text-white outline-none ${'textContent' in overrides ? 'border-blue-500/50' : 'border-[#232733]'}`}
              />
            </div>
          )}

          {/* Opacity override */}
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-gray-400">Opacity</span>
              {'opacity' in overrides && (
                <button onClick={() => { delete liveNode.overrides.opacity; useSceneStore.getState().upsertNode(liveNode); }} className="text-[9px] text-blue-400 hover:text-blue-300">reset</button>
              )}
            </div>
            <div className={`flex items-center bg-[#181a20] border rounded px-2 py-1 h-7 ${'opacity' in overrides ? 'border-blue-500/50' : 'border-[#232733]'}`}>
              <input
                type="range" min="0" max="1" step="0.01"
                value={(overrides.opacity as number) ?? node.opacity ?? 1}
                onChange={(e) => setOverride('opacity', parseFloat(e.target.value))}
                className="flex-1 mr-2"
              />
              <span className="text-[11px] font-mono text-white w-8 text-right">{Math.round(((overrides.opacity as number) ?? node.opacity ?? 1) * 100)}%</span>
            </div>
          </div>

          {/* Position (read-only for instances) */}
          <div className="text-[10px] text-gray-500 uppercase tracking-wider font-medium pt-1 border-t border-[#232733]">Position</div>
          <div className="grid grid-cols-2 gap-2">
            <div className="flex flex-col gap-1">
              <span className="text-[10px] text-gray-500">X</span>
              <div className="bg-[#181a20] border border-[#232733] rounded px-2 py-1 text-[11px] font-mono text-white">{Math.round(node.position.x)}</div>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-[10px] text-gray-500">Y</span>
              <div className="bg-[#181a20] border border-[#232733] rounded px-2 py-1 text-[11px] font-mono text-white">{Math.round(node.position.y)}</div>
            </div>
          </div>
        </div>
      </div>
    );
  }



  if (!node) {
    return (
      <div className="h-full bg-[#0e0f12] text-gray-300 flex flex-col border-l border-[#232733]">
        <div className="flex border-b border-[#232733] px-2">
          <TabButton active label="Design" />
          <TabButton label="Inspect" />
          <TabButton label="Interactions" />
        </div>
        <div className="flex-1 flex items-center justify-center text-gray-600 text-xs">
          Select an element
        </div>
      </div>
    );
  }

  return (
    <div className="h-full bg-[#0e0f12] text-gray-300 flex flex-col border-l border-[#232733] overflow-y-auto select-none custom-scrollbar" style={{ minWidth: '260px' }}>
      {/* Tabs */}
      <div className="flex border-b border-[#232733] px-2 shrink-0">
        <TabButton label="Design" />
        <TabButton active label="Inspect" />
        <TabButton label="Interactions" />
      </div>

      <div className="p-3 shrink-0">
        {/* Multi-selection Header Banner */}
        {selectedComponentIds.length > 1 && (
          <div className="mb-3 p-2 bg-[#181a20] border border-[#232733] rounded-lg space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-indigo-400">
                Multiple Selected ({selectedComponentIds.length})
              </span>
              <button
                onClick={() => {
                  const multiNodes = selectedComponentIds.map(id => sceneGraph.getNode(id)?.node).filter(Boolean) as any[];
                  commandManager.executeCommand(new GroupCommand(multiNodes));
                }}
                className="text-[10px] bg-indigo-600 hover:bg-indigo-500 text-white px-2 py-0.5 rounded transition-colors font-medium"
              >
                Group Selection
              </button>
            </div>
            <div className="flex items-center justify-between bg-[#0e0f12] p-1 rounded border border-[#232733]">
              <IconButton icon={AlignLeft} onClick={() => commandManager.executeCommand(new AlignNodesCommand(selectedComponentIds.map(id => sceneGraph.getNode(id)?.node).filter(Boolean) as any[], 'left'))} />
              <IconButton icon={AlignCenter} onClick={() => commandManager.executeCommand(new AlignNodesCommand(selectedComponentIds.map(id => sceneGraph.getNode(id)?.node).filter(Boolean) as any[], 'center'))} />
              <IconButton icon={AlignRight} onClick={() => commandManager.executeCommand(new AlignNodesCommand(selectedComponentIds.map(id => sceneGraph.getNode(id)?.node).filter(Boolean) as any[], 'right'))} />
              <div className="w-px h-3 bg-[#232733]" />
              <IconButton icon={AlignLeft} iconClassName="-rotate-90" onClick={() => commandManager.executeCommand(new AlignNodesCommand(selectedComponentIds.map(id => sceneGraph.getNode(id)?.node).filter(Boolean) as any[], 'top'))} />
              <IconButton icon={AlignCenter} iconClassName="-rotate-90" onClick={() => commandManager.executeCommand(new AlignNodesCommand(selectedComponentIds.map(id => sceneGraph.getNode(id)?.node).filter(Boolean) as any[], 'middle'))} />
              <IconButton icon={AlignRight} iconClassName="-rotate-90" onClick={() => commandManager.executeCommand(new AlignNodesCommand(selectedComponentIds.map(id => sceneGraph.getNode(id)?.node).filter(Boolean) as any[], 'bottom'))} />
            </div>
          </div>
        )}
        {/* Align elements */}
        <SectionHeader title="Align elements" />
        <div className="grid grid-cols-2 gap-2 mb-4">
          <ActionButton icon={AlignLeft} iconClassName="-rotate-90" label="Top" onClick={() => handleAlign('top')} />
          <ActionButton icon={AlignLeft} label="Left" onClick={() => handleAlign('left')} />
          <ActionButton icon={AlignCenter} iconClassName="-rotate-90" label="Middle" onClick={() => handleAlign('middle')} />
          <ActionButton icon={AlignCenter} label="Center" onClick={() => handleAlign('center')} />
          <ActionButton icon={AlignRight} iconClassName="-rotate-90" label="Bottom" onClick={() => handleAlign('bottom')} />
          <ActionButton icon={AlignRight} label="Right" onClick={() => handleAlign('right')} />
        </div>

        {/* Space evenly */}
        <SectionHeader title="Space evenly" />
        <div className="grid grid-cols-2 gap-2 mb-4">
          <ActionButton 
            icon={Menu} 
            label="Vertically" 
            onClick={() => {
              const selectedNodes = selectedComponentIds
                .map(id => sceneGraph.getNode(id)?.node)
                .filter(Boolean) as DesignerNode[];
              if (selectedNodes.length >= 2) {
                commandManager.executeCommand(new DistributeNodesCommand(selectedNodes, 'vertical'));
              }
            }} 
          />
          <ActionButton 
            icon={MoreVertical} 
            label="Horizontally" 
            onClick={() => {
              const selectedNodes = selectedComponentIds
                .map(id => sceneGraph.getNode(id)?.node)
                .filter(Boolean) as DesignerNode[];
              if (selectedNodes.length >= 2) {
                commandManager.executeCommand(new DistributeNodesCommand(selectedNodes, 'horizontal'));
              }
            }} 
          />
          <ActionButton 
            icon={LayoutGrid} 
            label="Tidy up" 
            onClick={() => {
              const selectedNodes = selectedComponentIds
                .map(id => sceneGraph.getNode(id)?.node)
                .filter(Boolean) as DesignerNode[];
              if (selectedNodes.length >= 2) {
                commandManager.executeCommand(new TidyUpNodesCommand(selectedNodes));
              }
            }} 
          />
        </div>

        {/* Advanced */}
        <SectionHeader title="Advanced" />
        <div className="grid grid-cols-3 gap-2 mb-2">
          <div className="flex flex-col gap-1">
            <span className="text-[10px] text-gray-500 font-medium">Width</span>
            <InputBlock value={Math.round(node.size.width)} onChange={(v: string) => patchNum('size', v, 'width')} />
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-[10px] text-gray-500 font-medium">Height</span>
            <InputBlock value={Math.round(node.size.height)} onChange={(v: string) => patchNum('size', v, 'height')} />
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-[10px] text-gray-500 font-medium">Ratio</span>
            <button className="h-7 bg-[#181a20] border border-[#232733] rounded hover:border-[#383e52] flex items-center justify-center text-gray-400 hover:text-white transition-colors">
              <Lock size={12} />
            </button>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-2 mb-4">
          <div className="flex flex-col gap-1">
            <span className="text-[10px] text-gray-500 font-medium">X</span>
            <InputBlock value={Math.round(node.position.x)} onChange={(v: string) => patchNum('position', v, 'x')} />
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-[10px] text-gray-500 font-medium">Y</span>
            <InputBlock value={Math.round(node.position.y)} onChange={(v: string) => patchNum('position', v, 'y')} />
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-[10px] text-gray-500 font-medium">Rotate</span>
            <InputBlock value={node.rotation || 0} suffix="°" onChange={(v: string) => patchNum('rotation', v)} />
          </div>
        </div>

        {/* Auto Layout */}
        <SectionHeader 
          title="Auto Layout" 
          onAdd={() => {
            const currentConfig = (node as any).layoutConfig || {};
            const nextConfig = {
              ...currentConfig,
              enabled: !currentConfig.enabled,
              direction: currentConfig.direction || 'row',
              gap: currentConfig.gap ?? 10,
              padding: currentConfig.padding || { top: 10, right: 10, bottom: 10, left: 10 },
              justify: currentConfig.justify || 'start',
              align: currentConfig.align || 'start',
              widthMode: currentConfig.widthMode || 'fixed',
              heightMode: currentConfig.heightMode || 'fixed',
            };
            patch('layoutConfig' as any, nextConfig);
            setTimeout(() => layoutEngine.updateLayout(node.id), 10);
          }} 
        />

        {((node as any).layoutConfig?.enabled) && (
          <div className="bg-[#14161d] p-2.5 rounded border border-[#232733] mb-4 space-y-3">
            {/* Direction */}
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-gray-400 font-medium">Direction</span>
              <div className="flex bg-[#181a20] p-0.5 rounded border border-[#232733]">
                <button 
                  onClick={() => {
                    const cfg = { ...((node as any).layoutConfig || {}), direction: 'row' };
                    patch('layoutConfig' as any, cfg);
                    setTimeout(() => layoutEngine.updateLayout(node.id), 10);
                  }}
                  className={`px-2 py-0.5 text-[10px] rounded font-medium transition-colors ${
                    ((node as any).layoutConfig?.direction !== 'column') ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  Horizontal
                </button>
                <button 
                  onClick={() => {
                    const cfg = { ...((node as any).layoutConfig || {}), direction: 'column' };
                    patch('layoutConfig' as any, cfg);
                    setTimeout(() => layoutEngine.updateLayout(node.id), 10);
                  }}
                  className={`px-2 py-0.5 text-[10px] rounded font-medium transition-colors ${
                    ((node as any).layoutConfig?.direction === 'column') ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  Vertical
                </button>
              </div>
            </div>

            {/* Gap & Padding */}
            <div className="grid grid-cols-2 gap-2">
              <div className="flex flex-col gap-1">
                <span className="text-[10px] text-gray-500">Gap</span>
                <InputBlock 
                  value={((node as any).layoutConfig?.gap ?? 10)} 
                  onChange={(v: string) => {
                    const cfg = { ...((node as any).layoutConfig || {}), gap: parseInt(v) || 0 };
                    patch('layoutConfig' as any, cfg);
                    setTimeout(() => layoutEngine.updateLayout(node.id), 10);
                  }} 
                />
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-[10px] text-gray-500">Padding</span>
                <InputBlock 
                  value={((node as any).layoutConfig?.padding?.top ?? 10)} 
                  onChange={(v: string) => {
                    const p = parseInt(v) || 0;
                    const cfg = { 
                      ...((node as any).layoutConfig || {}), 
                      padding: { top: p, right: p, bottom: p, left: p } 
                    };
                    patch('layoutConfig' as any, cfg);
                    setTimeout(() => layoutEngine.updateLayout(node.id), 10);
                  }} 
                />
              </div>
            </div>

            {/* Alignment Controls */}
            <div className="flex items-center justify-between pt-1">
              <span className="text-[11px] text-gray-400 font-medium">Alignment</span>
              <div className="w-32">
                <DropdownBlock 
                  value={((node as any).layoutConfig?.justify || 'start')}
                  options={['start', 'center', 'end', 'space-between']}
                  onChange={(v: string) => {
                    const cfg = { ...((node as any).layoutConfig || {}), justify: v };
                    patch('layoutConfig' as any, cfg);
                    setTimeout(() => layoutEngine.updateLayout(node.id), 10);
                  }}
                />
              </div>
            </div>

            {/* Cross Align */}
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-gray-400 font-medium">Cross Align</span>
              <div className="w-32">
                <DropdownBlock 
                  value={((node as any).layoutConfig?.align || 'start')}
                  options={['start', 'center', 'end', 'stretch']}
                  onChange={(v: string) => {
                    const cfg = { ...((node as any).layoutConfig || {}), align: v };
                    patch('layoutConfig' as any, cfg);
                    setTimeout(() => layoutEngine.updateLayout(node.id), 10);
                  }}
                />
              </div>
            </div>

            {/* Sizing Modes */}
            <div className="flex items-center justify-between pt-1">
              <span className="text-[11px] text-gray-400 font-medium">Width Sizing</span>
              <div className="w-32">
                <DropdownBlock 
                  value={((node as any).layoutConfig?.widthMode || 'fixed')}
                  options={['fixed', 'hug', 'fill']}
                  onChange={(v: string) => {
                    const cfg = { ...((node as any).layoutConfig || {}), widthMode: v };
                    patch('layoutConfig' as any, cfg);
                    setTimeout(() => layoutEngine.updateLayout(node.id), 10);
                  }}
                />
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-gray-400 font-medium">Height Sizing</span>
              <div className="w-32">
                <DropdownBlock 
                  value={((node as any).layoutConfig?.heightMode || 'fixed')}
                  options={['fixed', 'hug', 'fill']}
                  onChange={(v: string) => {
                    const cfg = { ...((node as any).layoutConfig || {}), heightMode: v };
                    patch('layoutConfig' as any, cfg);
                    setTimeout(() => layoutEngine.updateLayout(node.id), 10);
                  }}
                />
              </div>
            </div>
          </div>
        )}

        {/* Typography */}
        {(['Text', 'text', 'Heading', 'heading', 'Paragraph', 'paragraph', 'Button', 'button', 'Input', 'input', 'Textarea', 'textarea'].includes(node.type) || node.textContent !== undefined) && (
          <>
            <SectionHeader title="Typography" />
            <div className="flex flex-col gap-2 mb-4">
              <div className="flex flex-col gap-1 mb-1">
                <span className="text-[11px] text-gray-400">Content</span>
                <input
                  type="text"
                  value={node.textContent ?? ''}
                  onChange={(e) => patch('textContent', e.target.value)}
                  className="w-full bg-[#181a20] border border-[#232733] rounded px-2 py-1 text-[11px] text-white outline-none focus:border-indigo-500"
                  placeholder="Enter text content..."
                />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-gray-400">Font</span>
                <div className="w-32">
                  <DropdownBlock 
                    value={node.fontFamily || 'Inter'} 
                    options={['Inter', 'Roboto', 'Arial', 'Helvetica', 'Times New Roman', 'Courier New', 'Georgia', 'Verdana', 'Comic Sans MS', 'Impact', 'Trebuchet MS']}
                    onChange={(v: string) => patch('fontFamily', v)} 
                  />
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-gray-400">Weight</span>
                <div className="w-32"><InputBlock value={node.fontWeight || 400} onChange={(v: string) => patch('fontWeight', v)} /></div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-gray-400">Size</span>
                <div className="w-32"><InputBlock value={node.fontSize || 14} onChange={(v: string) => patchNum('fontSize', v)} /></div>
              </div>
              <div className="flex items-center justify-between mt-1">
                <span className="text-[11px] text-gray-400">Align</span>
                <div className="w-32 flex gap-1">
                  <button onClick={() => patch('textAlign', 'left')} className={`p-1 rounded transition-colors ${(node.textAlign || 'left')==='left'?'bg-[#232733] text-white':'text-gray-500 hover:text-white'}`}><AlignLeft size={14} /></button>
                  <button onClick={() => patch('textAlign', 'center')} className={`p-1 rounded transition-colors ${node.textAlign==='center'?'bg-[#232733] text-white':'text-gray-500 hover:text-white'}`}><AlignCenter size={14} /></button>
                  <button onClick={() => patch('textAlign', 'right')} className={`p-1 rounded transition-colors ${node.textAlign==='right'?'bg-[#232733] text-white':'text-gray-500 hover:text-white'}`}><AlignRight size={14} /></button>
                </div>
              </div>
            </div>
          </>
        )}



        {/* Appearance */}
        <SectionHeader title="Appearance" onAdd={() => {}} />
        <div className="grid grid-cols-2 gap-2 mb-4">
          <div>
            <div className="text-[10px] text-gray-500 mb-1">Opacity</div>
            <InputBlock icon={<Target size={12}/>} value={Math.round(node.opacity * 100)} suffix="%" onChange={(v: string) => patchNum('opacity', (parseFloat(v)||0)/100)} />
          </div>
          <div>
            <div className="text-[10px] text-gray-500 mb-1">Corner Radius</div>
            <InputBlock icon={<CornerUpRight size={12}/>} value={node.cornerRadius || 0} onChange={(v: string) => patchNum('cornerRadius', v)} />
          </div>
        </div>

        {/* Fill */}
        <SectionHeader title="Fill" onAdd={() => {}} />
        <div className="flex items-center gap-2 mb-4">
          <div className="w-5 h-5 rounded overflow-hidden shrink-0 border border-black relative cursor-pointer">
            <div className="absolute inset-0" style={{ backgroundColor: /^#[0-9a-fA-F]{3,6}$/.test(node.fill) ? node.fill : '#0f1115' }} />
            <input type="color" className="opacity-0 absolute inset-0 cursor-pointer" value={/^#[0-9a-fA-F]{3,6}$/.test(node.fill) ? node.fill : '#0f1115'} onChange={(e) => patch('fill', e.target.value)} />
          </div>
          <div className="flex-1"><InputBlock value={node.fill || '#0F1115'} onChange={(v: string) => patch('fill', v)} /></div>
          <div className="w-16"><InputBlock value="100%" onChange={() => {}} /></div>
          <button className="text-gray-500 hover:text-white shrink-0"><Minus size={14} /></button>
        </div>

        {/* Stroke */}
        <SectionHeader title="Stroke" onAdd={() => {}} />
        <div className="flex items-center gap-2 mb-4">
          <div className="w-5 h-5 rounded overflow-hidden shrink-0 border border-black relative cursor-pointer">
            <div className="absolute inset-0" style={{ backgroundColor: /^#[0-9a-fA-F]{3,6}$/.test(node.stroke) ? node.stroke : '#2a2f3a' }} />
            <input type="color" className="opacity-0 absolute inset-0 cursor-pointer" value={/^#[0-9a-fA-F]{3,6}$/.test(node.stroke) ? node.stroke : '#2a2f3a'} onChange={(e) => patch('stroke', e.target.value)} />
          </div>
          <div className="flex-1"><InputBlock value={node.stroke || '#2A2F3A'} onChange={(v: string) => patch('stroke', v)} /></div>
          <div className="w-16"><InputBlock value={node.strokeWidth || 1} onChange={(v: string) => patchNum('strokeWidth', v)} /></div>
          <button className="text-gray-500 hover:text-white shrink-0"><Minus size={14} /></button>
        </div>

        {/* Effects */}
        <SectionHeader title="Effects" onAdd={() => {}} />
        
      </div>
      
      {/* Global styling for nice scrollbar */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #232733; border-radius: 3px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #383e52; }
      `}</style>
    </div>
  );
};
