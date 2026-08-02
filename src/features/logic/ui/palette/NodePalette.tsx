import React, { useState } from 'react';
import * as Icons from 'lucide-react';
import { ALL_NODE_DEFINITIONS, NODE_CATEGORIES, searchNodes } from '../../nodes/NodeRegistry';
import type { NodeDefinition } from '../../nodes/NodeDefinition';
import type { NodeCategory } from '../../graph/LogicNode';

export const NodePalette: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<NodeCategory | 'All'>('All');

  const filteredNodes = searchQuery.trim()
    ? searchNodes(searchQuery)
    : activeCategory === 'All'
    ? ALL_NODE_DEFINITIONS
    : ALL_NODE_DEFINITIONS.filter((n) => n.category === activeCategory);

  const handleDragStart = (e: React.DragEvent, nodeDef: NodeDefinition) => {
    e.dataTransfer.setData('application/reactflow', nodeDef.type);
    e.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div className="w-full h-full bg-[#0e0f12] border-r border-[#232733] flex flex-col select-none relative shrink-0 overflow-hidden box-border">
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
          className={`px-2.5 py-1 rounded text-[11px] font-medium shrink-0 transition-colors ${
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
            className={`px-2.5 py-1 rounded text-[11px] font-medium shrink-0 transition-colors ${
              activeCategory === cat
                ? 'bg-indigo-600 text-white font-semibold'
                : 'bg-[#181a20] text-gray-400 hover:text-gray-200 border border-[#232733]'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Node Items List */}
      <div className="flex-1 overflow-y-auto p-2.5 pb-20 space-y-2 custom-scrollbar">
        {filteredNodes.map((nodeDef) => {
          const IconComp = (Icons as unknown as Record<string, React.FC<{ size?: number }>>)[nodeDef.icon] || Icons.Code;

          return (
            <div
              key={nodeDef.type}
              draggable
              onDragStart={(e) => handleDragStart(e, nodeDef)}
              className="p-2.5 rounded bg-[#14161d] border border-[#232733] hover:border-indigo-500/50 hover:bg-[#181a20] cursor-grab active:cursor-grabbing transition-all group shadow-sm"
            >
              <div className="flex items-center gap-2 mb-1">
                <div
                  className="w-5 h-5 rounded flex items-center justify-center text-white shrink-0 shadow-inner"
                  style={{ backgroundColor: nodeDef.color || '#6366f1' }}
                >
                  <IconComp size={12} />
                </div>
                <span className="text-xs font-semibold text-gray-200 group-hover:text-white truncate">
                  {nodeDef.name}
                </span>
                <span className="ml-auto text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#0e0f12] text-gray-400 border border-[#232733] shrink-0">
                  {nodeDef.category}
                </span>
              </div>
              <p className="text-[11px] text-gray-400 line-clamp-2 leading-relaxed pl-7">
                {nodeDef.description}
              </p>
            </div>
          );
        })}

        {filteredNodes.length === 0 && (
          <div className="p-8 text-center text-gray-500 text-xs">No matching nodes found</div>
        )}
      </div>

      {/* Global Scrollbar Style */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #232733; border-radius: 3px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #383e52; }
      `}</style>
    </div>
  );
};
