import React, { useState } from 'react';
import * as Icons from 'lucide-react';
import { ALL_NODE_DEFINITIONS, NODE_CATEGORIES, searchNodes } from '../../nodes/NodeRegistry';
import type { NodeDefinition } from '../../nodes/NodeDefinition';
import type { NodeCategory } from '../../graph/LogicNode';
import { databaseManager } from '../../../../application/resources/DatabaseManager';
import { authManager } from '../../../../application/resources/AuthManager';
import { storageManager } from '../../../../application/resources/StorageManager';
import { apiManager } from '../../../../application/resources/APIManager';
import { environmentManager } from '../../../../application/resources/EnvironmentManager';

export const NodePalette: React.FC = () => {
  const [leftTab, setLeftTab] = useState<'library' | 'resources'>('library');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<NodeCategory | 'All'>('All');

  const filteredNodes = searchQuery.trim()
    ? searchNodes(searchQuery)
    : activeCategory === 'All'
    ? ALL_NODE_DEFINITIONS
    : ALL_NODE_DEFINITIONS.filter((n) => n.category === activeCategory);

  const dbConnections = databaseManager.getAllConnections();
  const authConfigs = authManager.getAll();
  const storageBuckets = storageManager.getAll();
  const apis = apiManager.getAll();
  const envVars = environmentManager.getAll();

  const handleDragStart = (e: React.DragEvent, nodeDef: NodeDefinition) => {
    e.dataTransfer.setData('application/reactflow', nodeDef.type);
    e.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div className="w-full h-full bg-[#0e0f12] border-r border-[#232733] flex flex-col select-none relative shrink-0 overflow-hidden box-border">
      {/* Top Left Panel Selector Tabs */}
      <div className="flex border-b border-[#232733] bg-[#11131c] px-2 shrink-0 justify-between items-center">
        <button
          onClick={() => setLeftTab('library')}
          className={`flex-1 py-2.5 text-[11px] font-medium transition-colors border-b-2 cursor-pointer ${
            leftTab === 'library' ? 'text-gray-100 border-indigo-500 font-semibold' : 'text-gray-500 border-transparent hover:text-gray-300'
          }`}
        >
          Node Library
        </button>
        <button
          onClick={() => setLeftTab('resources')}
          className={`flex-1 py-2.5 text-[11px] font-medium transition-colors border-b-2 cursor-pointer ${
            leftTab === 'resources' ? 'text-gray-100 border-indigo-500 font-semibold' : 'text-gray-500 border-transparent hover:text-gray-300'
          }`}
        >
          Project Resources
        </button>
      </div>

      {leftTab === 'resources' ? (
        <div className="flex-1 overflow-y-auto p-3 space-y-3 custom-scrollbar text-xs">
          {/* Databases */}
          <div className="p-2.5 bg-[#14161d] border border-[#232733] rounded-lg space-y-2">
            <div className="flex items-center justify-between font-semibold text-white">
              <div className="flex items-center gap-2">
                <Icons.Database size={14} className="text-cyan-400" />
                <span>Databases</span>
              </div>
              <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-cyan-950 text-cyan-400 border border-cyan-800">
                {dbConnections.length} Connected
              </span>
            </div>

            {dbConnections.map((db) => (
              <div key={db.id} className="p-2 bg-[#181a20] border border-[#232733] rounded space-y-1.5">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-semibold text-white truncate">{db.name}</span>
                  <span className="text-[9px] font-mono text-emerald-400 bg-emerald-950/60 px-1 py-0.2 rounded">
                    {db.type}
                  </span>
                </div>
                <div className="text-[10px] text-gray-400 font-mono">
                  Tables: {db.tables.map((t) => t.name).join(', ')}
                </div>
              </div>
            ))}
          </div>

          {/* Authentication */}
          <div className="p-2.5 bg-[#14161d] border border-[#232733] rounded-lg space-y-2">
            <div className="flex items-center justify-between font-semibold text-white">
              <div className="flex items-center gap-2">
                <Icons.ShieldCheck size={14} className="text-purple-400" />
                <span>Authentication</span>
              </div>
              <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-purple-950 text-purple-400 border border-purple-800">
                {authConfigs.length} Provider
              </span>
            </div>

            {authConfigs.map((auth) => (
              <div key={auth.id} className="p-2 bg-[#181a20] border border-[#232733] rounded flex items-center justify-between text-[11px]">
                <span className="font-semibold text-white">{auth.name}</span>
                <span className="text-[9px] font-mono text-purple-300 uppercase">{auth.provider}</span>
              </div>
            ))}
          </div>

          {/* Storage Providers */}
          <div className="p-2.5 bg-[#14161d] border border-[#232733] rounded-lg space-y-2">
            <div className="flex items-center justify-between font-semibold text-white">
              <div className="flex items-center gap-2">
                <Icons.HardDrive size={14} className="text-emerald-400" />
                <span>Storage Buckets</span>
              </div>
              <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-emerald-950 text-emerald-400 border border-emerald-800">
                {storageBuckets.length} Bucket
              </span>
            </div>

            {storageBuckets.map((st) => (
              <div key={st.id} className="p-2 bg-[#181a20] border border-[#232733] rounded flex items-center justify-between text-[11px]">
                <span className="font-semibold text-white truncate">{st.name}</span>
                <span className="text-[9px] font-mono text-emerald-400">{st.bucketName}</span>
              </div>
            ))}
          </div>

          {/* External APIs */}
          <div className="p-2.5 bg-[#14161d] border border-[#232733] rounded-lg space-y-2">
            <div className="flex items-center justify-between font-semibold text-white">
              <div className="flex items-center gap-2">
                <Icons.Globe size={14} className="text-orange-400" />
                <span>External APIs</span>
              </div>
              <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-orange-950 text-orange-400 border border-orange-800">
                {apis.length} Active
              </span>
            </div>

            {apis.map((api) => (
              <div key={api.id} className="p-2 bg-[#181a20] border border-[#232733] rounded space-y-1">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-semibold text-white truncate">{api.name}</span>
                  <span className="text-[9px] font-mono text-orange-400 font-bold">{api.method}</span>
                </div>
                <div className="text-[9px] font-mono text-gray-500 truncate">{api.url}</div>
              </div>
            ))}
          </div>

          {/* Environment Variables & Secrets */}
          <div className="p-2.5 bg-[#14161d] border border-[#232733] rounded-lg space-y-2">
            <div className="flex items-center justify-between font-semibold text-white">
              <div className="flex items-center gap-2">
                <Icons.Key size={14} className="text-amber-400" />
                <span>Environment Secrets</span>
              </div>
              <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-amber-950 text-amber-400 border border-amber-800">
                {envVars.length} Variables
              </span>
            </div>

            {envVars.map((env) => (
              <div key={env.key} className="p-1.5 bg-[#181a20] border border-[#232733] rounded flex items-center justify-between text-[10px] font-mono">
                <span className="text-indigo-400 font-semibold truncate">{env.key}</span>
                <span className="text-gray-400 font-sans">{env.isSecret ? '••••••••' : env.value}</span>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <>
          {/* Header & Search */}
          <div className="p-3 border-b border-[#232733] space-y-2.5 bg-[#14161d]">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-gray-300">Node Library</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-indigo-500/15 text-indigo-400 border border-indigo-500/30">
                {ALL_NODE_DEFINITIONS.length} Nodes
              </span>
            </div>

            <div className="flex items-center bg-[#181a20] border border-[#232733] rounded hover:border-[#383e52] focus-within:border-indigo-500 transition-colors px-2.5 py-1 h-7">
              <Icons.Search className="text-gray-500 mr-2 shrink-0" size={13} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search nodes..."
                className="bg-transparent border-none outline-none text-white text-[11px] font-mono w-full min-w-0 placeholder-gray-500"
              />
            </div>
          </div>

          {/* Category Pills */}
          <div className="p-2 border-b border-[#232733] overflow-x-auto flex gap-1 scrollbar-none bg-[#0e0f12]">
            <button
              onClick={() => setActiveCategory('All')}
              className={`px-2.5 py-1 rounded text-[11px] font-medium shrink-0 transition-colors cursor-pointer ${
                activeCategory === 'All'
                  ? 'bg-indigo-600 text-white font-semibold'
                  : 'bg-[#181a20] text-gray-400 hover:text-gray-200 border border-[#232733]'
              }`}
            >
              All
            </button>
            {NODE_CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-2.5 py-1 rounded text-[11px] font-medium shrink-0 transition-colors cursor-pointer ${
                  activeCategory === cat
                    ? 'bg-indigo-600 text-white font-semibold'
                    : 'bg-[#181a20] text-gray-400 hover:text-gray-200 border border-[#232733]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Nodes List */}
          <div className="flex-1 overflow-y-auto p-2.5 space-y-2 custom-scrollbar">
            {filteredNodes.map((def) => {
              const IconComp = (Icons as unknown as Record<string, React.FC<{ size?: number }>>)[def.icon] || Icons.Code;

              return (
                <div
                  key={def.type}
                  draggable
                  onDragStart={(e) => handleDragStart(e, def)}
                  className="p-2.5 rounded-lg bg-[#14161d] border border-[#232733] hover:border-indigo-500/50 hover:bg-[#181a26] transition-all cursor-grab active:cursor-grabbing group shadow-sm flex items-start gap-2.5"
                >
                  <div
                    className="w-7 h-7 rounded flex items-center justify-center text-white shrink-0 mt-0.5 shadow-sm"
                    style={{ backgroundColor: def.color || '#6366f1' }}
                  >
                    <IconComp size={14} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-white group-hover:text-indigo-300 transition-colors truncate">
                        {def.name}
                      </span>
                      <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-[#181a20] text-gray-400 border border-[#232733] shrink-0">
                        {def.category}
                      </span>
                    </div>
                    <p className="text-[10px] text-gray-400 leading-snug line-clamp-2 mt-0.5">{def.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};
