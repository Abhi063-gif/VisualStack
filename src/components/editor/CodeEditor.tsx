import React, { useState, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import { Copy, Download, Check, Code2, Layers, FileCode } from 'lucide-react';
import { CodeGenerator, type CodeExportMode } from '../../features/designer/services/CodeGenerator';
import { ExportService } from '../../features/designer/services/exportService';
import { useSceneStore } from '../../stores/SceneStore';

export interface CodeEditorProps {
  code?: string;
  language?: string;
}

export const CodeEditor: React.FC<CodeEditorProps> = ({
  code: externalCode,
  language: initialLanguage = 'javascript',
}) => {
  const nodes = useSceneStore((s) => s.nodes);
  const [exportMode, setExportMode] = useState<CodeExportMode>('react-tailwind');
  const [code, setCode] = useState(externalCode || '');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (externalCode !== undefined) {
      setCode(externalCode);
    } else {
      const generated = CodeGenerator.generateCode(exportMode);
      setCode(generated);
    }
  }, [nodes, externalCode, exportMode]);

  const handleCopy = async () => {
    const ok = await ExportService.copyJSXToClipboard(exportMode);
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownload = () => {
    const filename = exportMode === 'html-css' ? 'index.html' : 'GeneratedCanvas.jsx';
    ExportService.downloadJSXFile(filename, exportMode);
  };

  const getMonacoLanguage = (): string => {
    if (externalCode !== undefined) return initialLanguage;
    return exportMode === 'html-css' ? 'html' : 'javascript';
  };

  return (
    <div className="h-full flex flex-col bg-[#1e1e2e]">
      {/* Editor Header & Export Format Switcher Bar */}
      <div className="flex items-center justify-between px-3 py-1.5 bg-[#14161b] border-b border-[#232733] shrink-0">
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setExportMode('react-tailwind')}
            className={`flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-medium rounded transition-colors ${
              exportMode === 'react-tailwind'
                ? 'bg-indigo-600/30 text-indigo-400 border border-indigo-500/40'
                : 'text-gray-400 hover:text-gray-200 hover:bg-[#1f232d]'
            }`}
          >
            <Code2 size={12} />
            <span>React (Tailwind)</span>
          </button>
          <button
            onClick={() => setExportMode('react-inline')}
            className={`flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-medium rounded transition-colors ${
              exportMode === 'react-inline'
                ? 'bg-indigo-600/30 text-indigo-400 border border-indigo-500/40'
                : 'text-gray-400 hover:text-gray-200 hover:bg-[#1f232d]'
            }`}
          >
            <Layers size={12} />
            <span>React (Inline Styles)</span>
          </button>
          <button
            onClick={() => setExportMode('html-css')}
            className={`flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-medium rounded transition-colors ${
              exportMode === 'html-css'
                ? 'bg-indigo-600/30 text-indigo-400 border border-indigo-500/40'
                : 'text-gray-400 hover:text-gray-200 hover:bg-[#1f232d]'
            }`}
          >
            <FileCode size={12} />
            <span>HTML + CSS</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            className="flex items-center gap-1 px-2.5 py-1 bg-[#1f232d] hover:bg-[#2a3045] text-gray-300 hover:text-white text-[11px] rounded transition-colors border border-[#232733]"
            title="Copy Code to Clipboard"
          >
            {copied ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
            <span>{copied ? 'Copied!' : 'Copy Code'}</span>
          </button>
          <button
            onClick={handleDownload}
            className="flex items-center gap-1 px-2.5 py-1 bg-indigo-600 hover:bg-indigo-500 text-white text-[11px] font-medium rounded transition-colors shadow-sm"
            title="Download Code File"
          >
            <Download size={12} />
            <span>Download {exportMode === 'html-css' ? '.html' : '.jsx'}</span>
          </button>
        </div>
      </div>

      {/* Monaco Editor */}
      <div className="flex-1 overflow-hidden">
        <Editor
          height="100%"
          language={getMonacoLanguage()}
          theme="vs-dark"
          value={code}
          options={{
            readOnly: true,
            minimap: { enabled: false },
            fontSize: 12,
            fontFamily: 'JetBrains Mono, Monaco, monospace',
            scrollBeyondLastLine: false,
            lineNumbers: 'on',
            automaticLayout: true,
          }}
        />
      </div>
    </div>
  );
};
