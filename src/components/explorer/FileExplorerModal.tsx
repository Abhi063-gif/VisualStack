import React, { useState } from 'react';
import * as Icons from 'lucide-react';
import { fileTreeService, type FileTreeNode } from '../../runtime/explorer/FileTreeService';

interface FileExplorerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FileExplorerModal: React.FC<FileExplorerModalProps> = ({ isOpen, onClose }) => {
  const [tree] = useState(fileTreeService.getTree());
  const [selectedFile, setSelectedFile] = useState<FileTreeNode | null>(tree[0]?.children?.[0] || tree[1]);
  const [search, setSearch] = useState('');

  if (!isOpen) return null;

  const renderTreeNodes = (nodes: FileTreeNode[]) => {
    return nodes.map((node) => {
      const isDir = node.type === 'directory';
      const isSelected = selectedFile?.path === node.path;

      if (search && !node.name.toLowerCase().includes(search.toLowerCase()) && !isDir) {
        return null;
      }

      return (
        <div key={node.id} className="select-none">
          <div
            onClick={() => {
              if (!isDir) setSelectedFile(node);
            }}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-mono transition-colors cursor-pointer ${
              isSelected ? 'bg-indigo-600/20 text-indigo-400 font-semibold border border-indigo-500/30' : 'text-gray-300 hover:bg-[#181a20]'
            }`}
          >
            {isDir ? (
              <Icons.Folder size={14} className="text-amber-400 shrink-0" />
            ) : node.extension === 'ts' || node.extension === 'tsx' ? (
              <Icons.Code2 size={14} className="text-cyan-400 shrink-0" />
            ) : node.extension === 'json' ? (
              <Icons.FileJson size={14} className="text-emerald-400 shrink-0" />
            ) : (
              <Icons.FileText size={14} className="text-purple-400 shrink-0" />
            )}
            <span className="truncate">{node.name}</span>
          </div>

          {isDir && node.children && (
            <div className="pl-4 border-l border-[#232733] ml-3 my-0.5 space-y-0.5">
              {renderTreeNodes(node.children)}
            </div>
          )}
        </div>
      );
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-6 select-none">
      <div className="bg-[#0e0f12] border border-[#232733] rounded-2xl w-full max-w-5xl h-[80vh] shadow-2xl overflow-hidden flex flex-col box-border text-gray-200">
        {/* Header */}
        <div className="p-4 border-b border-[#232733] bg-[#14161d] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <Icons.FolderTree size={18} />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white tracking-wide">Project Workspace File Explorer</h2>
              <p className="text-[11px] text-gray-400">Inspect and view generated project source files</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-white rounded hover:bg-[#181a20] transition-colors cursor-pointer"
          >
            <Icons.X size={18} />
          </button>
        </div>

        {/* 2-Column Explorer Area */}
        <div className="flex-1 flex min-h-0 overflow-hidden">
          {/* Left File Tree Sidebar */}
          <div className="w-64 border-r border-[#232733] bg-[#11131c] p-3 flex flex-col gap-3 shrink-0">
            <div className="relative">
              <input
                type="text"
                placeholder="Filter files..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-[#181a20] border border-[#232733] rounded-lg px-2.5 py-1.5 text-xs text-white placeholder-gray-500 outline-none focus:border-indigo-500"
              />
            </div>

            <div className="flex-1 overflow-y-auto space-y-1 custom-scrollbar">
              {renderTreeNodes(tree)}
            </div>
          </div>

          {/* Right File Code Content Viewer */}
          <div className="flex-1 bg-[#090a0f] flex flex-col overflow-hidden">
            {selectedFile ? (
              <>
                <div className="px-4 py-2 bg-[#14161d] border-b border-[#232733] flex items-center justify-between text-xs font-mono text-gray-300 shrink-0">
                  <span className="text-indigo-400 font-semibold">{selectedFile.path}</span>
                  <span className="text-[10px] text-gray-500">{selectedFile.content?.length || 0} characters</span>
                </div>
                <div className="flex-1 p-4 overflow-auto font-mono text-xs text-gray-200 leading-relaxed bg-[#0d0e12] custom-scrollbar">
                  <pre>{selectedFile.content}</pre>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-gray-500 text-xs">
                Select a file from the left sidebar to preview its source code.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
