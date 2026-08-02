import React, { useState } from 'react';
import * as Icons from 'lucide-react';
import { projectModelExporter } from '../../application/ir/ProjectModelExporter';
import { codeCompiler, type GeneratedFile } from '../../compiler/CodeCompiler';

interface CodeInspectorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CodeInspectorModal: React.FC<CodeInspectorModalProps> = ({ isOpen, onClose }) => {
  const [selectedFileIdx, setSelectedFileIdx] = useState(0);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const ir = projectModelExporter.exportUnifiedIR();
  const compiledFiles: GeneratedFile[] = codeCompiler.compileProject(ir);
  const activeFile = compiledFiles[selectedFileIdx] || compiledFiles[0];

  const handleCopyCode = () => {
    navigator.clipboard.writeText(activeFile.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadZip = () => {
    // Generate JSON package download containing all files
    const fullProjectBundle = {
      project: ir.metadata,
      files: compiledFiles,
    };
    const blob = new Blob([JSON.stringify(fullProjectBundle, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `visualstack_full_project_source_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-6 select-none">
      <div className="bg-[#0e0f12] border border-[#232733] rounded-2xl w-full max-w-5xl h-[85vh] shadow-2xl overflow-hidden flex flex-col box-border text-gray-200">
        {/* Header */}
        <div className="p-4 border-b border-[#232733] bg-[#14161d] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <Icons.Code2 size={18} />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white tracking-wide">Generated Application Source Code</h2>
              <p className="text-[11px] text-gray-400">
                React 19 + TypeScript + Vite + Express Node.js Server ({compiledFiles.length} Source Files)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadZip}
              className="px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs flex items-center gap-2 shadow transition-colors cursor-pointer"
            >
              <Icons.Download size={14} />
              <span>Export Full Source Bundle</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 text-gray-400 hover:text-white rounded hover:bg-[#181a20] transition-colors cursor-pointer"
            >
              <Icons.X size={18} />
            </button>
          </div>
        </div>

        {/* Main 2-Panel View: File Tree + Code Editor */}
        <div className="flex-1 flex overflow-hidden">
          {/* Left Panel: File Tree Explorer */}
          <div className="w-64 bg-[#11131c] border-r border-[#232733] flex flex-col shrink-0 overflow-y-auto custom-scrollbar p-2">
            <div className="text-[10px] font-semibold uppercase text-gray-400 px-2 py-1.5 mb-1 tracking-wider border-b border-[#232733]/50">
              Source Code Directory
            </div>

            <div className="space-y-0.5 pt-1">
              {compiledFiles.map((file, idx) => {
                const isActive = idx === selectedFileIdx;
                const isServer = file.path.startsWith('server');
                const isPage = file.path.startsWith('src/pages');

                return (
                  <button
                    key={file.path}
                    onClick={() => setSelectedFileIdx(idx)}
                    className={`w-full px-2.5 py-1.5 rounded text-left text-xs font-mono flex items-center justify-between transition-colors cursor-pointer ${
                      isActive
                        ? 'bg-indigo-600/20 text-indigo-300 font-semibold border border-indigo-500/30'
                        : 'text-gray-400 hover:text-gray-200 hover:bg-[#181a20]'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate pr-1">
                      {isServer ? (
                        <Icons.Server size={13} className="text-purple-400 shrink-0" />
                      ) : isPage ? (
                        <Icons.FileCode size={13} className="text-cyan-400 shrink-0" />
                      ) : (
                        <Icons.FileText size={13} className="text-gray-400 shrink-0" />
                      )}
                      <span className="truncate">{file.path}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Panel: Syntax Highlighted Code Viewer */}
          <div className="flex-1 bg-[#0c0d12] flex flex-col overflow-hidden">
            {/* Active File Banner */}
            <div className="px-4 py-2 bg-[#14161d] border-b border-[#232733] flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2 font-mono text-xs text-indigo-400 font-semibold">
                <Icons.FileCode size={14} />
                <span>{activeFile.path}</span>
              </div>

              <button
                onClick={handleCopyCode}
                className="px-2.5 py-1 rounded bg-[#181a20] hover:bg-[#232733] text-gray-300 hover:text-white border border-[#232733] text-[11px] font-mono flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                {copied ? <Icons.Check size={12} className="text-emerald-400" /> : <Icons.Copy size={12} />}
                <span>{copied ? 'Copied!' : 'Copy Code'}</span>
              </button>
            </div>

            {/* Code Viewport */}
            <div className="flex-1 overflow-auto p-4 custom-scrollbar">
              <pre className="font-mono text-xs text-gray-200 leading-relaxed whitespace-pre-wrap selection:bg-indigo-500/30">
                {activeFile.content}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
