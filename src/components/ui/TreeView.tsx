import React, { useState } from 'react';
import { ChevronRight, ChevronDown } from 'lucide-react';
import { cn } from '../../utils/cn';

export interface TreeNode {
  id: string;
  label: string;
  icon?: React.ReactNode;
  children?: TreeNode[];
}

export interface TreeViewProps {
  data: TreeNode[];
  selectedId?: string;
  onSelect?: (node: TreeNode) => void;
}

export const TreeView: React.FC<TreeViewProps> = ({ data, selectedId, onSelect }) => {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  const toggleExpand = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const renderNodes = (nodes: TreeNode[], level = 0) => {
    return nodes.map((node) => {
      const hasChildren = node.children && node.children.length > 0;
      const isExpanded = expanded[node.id];
      const isSelected = selectedId === node.id;

      return (
        <div key={node.id} className="select-none">
          <div
            onClick={() => onSelect?.(node)}
            className={cn(
              'flex items-center gap-1.5 py-1 px-2 text-xs rounded hover:bg-[#222631] cursor-pointer text-gray-300',
              isSelected && 'bg-indigo-600/30 text-indigo-300 font-medium'
            )}
            style={{ paddingLeft: `${level * 12 + 8}px` }}
          >
            {hasChildren ? (
              <button
                onClick={(e) => toggleExpand(node.id, e)}
                className="text-gray-400 hover:text-gray-200"
              >
                {isExpanded ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
              </button>
            ) : (
              <span className="w-3" />
            )}
            {node.icon}
            <span className="truncate">{node.label}</span>
          </div>
          {hasChildren && isExpanded && renderNodes(node.children!, level + 1)}
        </div>
      );
    });
  };

  return <div className="w-full py-1">{renderNodes(data)}</div>;
};

export interface PropertyRowProps {
  label: string;
  children: React.ReactNode;
}

export const PropertyRow: React.FC<PropertyRowProps> = ({ label, children }) => (
  <div className="flex items-center justify-between py-1.5 border-b border-[#232733]/50 text-xs">
    <span className="text-gray-400 w-1/3 truncate">{label}</span>
    <div className="w-2/3 flex justify-end">{children}</div>
  </div>
);

export interface SearchBarProps {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({ value, onChange, placeholder = 'Search...' }) => (
  <div className="relative w-full">
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full h-7 rounded bg-[#0e0f12] border border-[#232733] pl-2 pr-6 text-xs text-gray-200 placeholder:text-gray-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
    />
    {value && (
      <button
        onClick={() => onChange('')}
        className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200 text-xs"
      >
        ✕
      </button>
    )}
  </div>
);
