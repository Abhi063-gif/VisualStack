import React, { useState } from 'react';
import { Play, CheckCircle2, Clock, AlertCircle, RefreshCw, Download, Terminal, Code, Check } from 'lucide-react';
import { docGenerator } from '../../deployment/documentation/DocGenerator';

export interface PipelineNode {
  id: string;
  name: string;
  category: 'source' | 'test' | 'build' | 'deploy' | 'verify';
  status: 'idle' | 'running' | 'success' | 'failed';
  durationMs?: number;
  command: string;
}

export const VisualPipeline: React.FC = () => {
  const [nodes, setNodes] = useState<PipelineNode[]>([
    { id: 'p1', name: 'Checkout Code', category: 'source', status: 'idle', command: 'git checkout main' },
    { id: 'p2', name: 'Lint & Security Scan', category: 'test', status: 'idle', command: 'npm run lint && npx audit' },
    { id: 'p3', name: 'Run Unit & E2E Tests', category: 'test', status: 'idle', command: 'npm run test -- --coverage' },
    { id: 'p4', name: 'Build Container & Assets', category: 'build', status: 'idle', command: 'docker build -t app:latest .' },
    { id: 'p5', name: 'Deploy to Cloud', category: 'deploy', status: 'idle', command: 'npx vercel --prod' },
    { id: 'p6', name: 'Health Check & Verify', category: 'verify', status: 'idle', command: 'curl -f https://app.visualstack.io/health' },
  ]);

  const [isRunning, setIsRunning] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  const [yamlModal, setYamlModal] = useState<'github' | 'gitlab' | null>(null);
  const [copiedYaml, setCopiedYaml] = useState(false);

  const handleRunPipeline = async () => {
    setIsRunning(true);
    setLogs(['[Pipeline] Triggering CI/CD Automated Execution Pipeline...']);

    // Reset nodes
    setNodes((prev) => prev.map((n) => ({ ...n, status: 'idle', durationMs: undefined })));

    for (let i = 0; i < nodes.length; i++) {
      const node = nodes[i];
      const startTime = Date.now();

      // Mark running
      setNodes((prev) =>
        prev.map((n) => (n.id === node.id ? { ...n, status: 'running' } : n))
      );
      setLogs((prev) => [...prev, `[${new Date().toLocaleTimeString()}] ▶ Executing step: ${node.name} (${node.command})...`]);

      await new Promise((resolve) => setTimeout(resolve, 800));

      const durationMs = Date.now() - startTime;
      // Mark success
      setNodes((prev) =>
        prev.map((n) => (n.id === node.id ? { ...n, status: 'success', durationMs } : n))
      );
      setLogs((prev) => [...prev, `[${new Date().toLocaleTimeString()}] ✔ Completed: ${node.name} in ${durationMs}ms.`]);
    }

    setLogs((prev) => [...prev, `[Pipeline] 🎉 All CI/CD pipeline steps completed successfully!`]);
    setIsRunning(false);
  };

  const copyYaml = (content: string) => {
    navigator.clipboard.writeText(content);
    setCopiedYaml(true);
    setTimeout(() => setCopiedYaml(false), 2000);
  };

  return (
    <div className="w-full h-full bg-[#0e1017] text-gray-100 p-6 flex flex-col gap-6 font-sans overflow-y-auto custom-scrollbar">
      {/* Header Bar */}
      <div className="bg-[#14161b] border border-[#232733] rounded-xl p-5 flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-gray-100 flex items-center gap-2">
            Visual CI/CD Pipeline Graph & Orchestrator
          </h2>
          <p className="text-xs text-gray-400 mt-0.5">Automate continuous integration, container builds, automated testing, and zero-downtime deployment.</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setYamlModal('github')}
            className="px-3 py-1.5 bg-[#1f232d] hover:bg-indigo-600/20 text-indigo-400 border border-[#232733] rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <Code size={14} /> Export GitHub Actions
          </button>
          <button
            onClick={() => setYamlModal('gitlab')}
            className="px-3 py-1.5 bg-[#1f232d] hover:bg-amber-600/20 text-amber-400 border border-[#232733] rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <Code size={14} /> Export GitLab CI
          </button>
          <button
            onClick={handleRunPipeline}
            disabled={isRunning}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-lg text-xs font-bold shadow-lg transition-all flex items-center gap-2"
          >
            {isRunning ? <RefreshCw className="animate-spin" size={15} /> : <Play size={15} />}
            {isRunning ? 'Running Pipeline...' : 'Run CI/CD Pipeline'}
          </button>
        </div>
      </div>

      {/* Visual Pipeline Nodes Flow */}
      <div className="bg-[#14161b] border border-[#232733] rounded-xl p-6 flex flex-col gap-4">
        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Pipeline Node Graph Execution Steps</h3>
        <div className="grid grid-cols-6 gap-3 relative">
          {nodes.map((node, index) => (
            <div
              key={node.id}
              className={`p-4 rounded-xl border transition-all flex flex-col justify-between h-36 ${
                node.status === 'running'
                  ? 'bg-indigo-600/10 border-indigo-500 shadow-lg shadow-indigo-500/10'
                  : node.status === 'success'
                  ? 'bg-emerald-500/10 border-emerald-500/40'
                  : node.status === 'failed'
                  ? 'bg-rose-500/10 border-rose-500/40'
                  : 'bg-[#0e0f12] border-[#232733]'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-bold text-gray-500">Step 0{index + 1}</span>
                {node.status === 'running' && <RefreshCw className="animate-spin text-indigo-400" size={16} />}
                {node.status === 'success' && <CheckCircle2 className="text-emerald-400" size={16} />}
                {node.status === 'failed' && <AlertCircle className="text-rose-400" size={16} />}
                {node.status === 'idle' && <Clock className="text-gray-600" size={16} />}
              </div>

              <div>
                <div className="text-xs font-bold text-gray-200 mt-2">{node.name}</div>
                <div className="text-[10px] font-mono text-gray-500 mt-1 truncate">{node.command}</div>
              </div>

              <div className="flex items-center justify-between text-[10px] pt-2 border-t border-[#232733]">
                <span className="text-gray-400 font-mono capitalize">{node.category}</span>
                <span className="font-mono text-indigo-400">{node.durationMs ? `${node.durationMs}ms` : '--'}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Real-time Terminal Console Output */}
      <div className="bg-[#14161b] border border-[#232733] rounded-xl p-5 flex flex-col gap-3 flex-1">
        <div className="flex items-center justify-between border-b border-[#232733] pb-2">
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
            <Terminal size={14} className="text-indigo-400" /> Pipeline Console Stream
          </h3>
          <span className="text-[11px] font-mono text-gray-500">{logs.length} lines logged</span>
        </div>

        <pre className="bg-[#08090d] border border-[#232733] rounded-lg p-4 font-mono text-xs text-indigo-300 h-52 overflow-y-auto custom-scrollbar space-y-1">
          {logs.length === 0 ? (
            <span className="text-gray-600 italic">No pipeline runs logged yet. Click "Run CI/CD Pipeline" above to execute steps.</span>
          ) : (
            logs.map((log, i) => (
              <div key={i} className={log.includes('✔') ? 'text-emerald-400' : log.includes('▶') ? 'text-indigo-300' : 'text-gray-400'}>
                {log}
              </div>
            ))
          )}
        </pre>
      </div>

      {/* Export YAML Modal */}
      {yamlModal && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-6">
          <div className="bg-[#14161b] border border-[#232733] rounded-xl w-full max-w-2xl flex flex-col overflow-hidden shadow-2xl">
            <div className="p-4 border-b border-[#232733] flex items-center justify-between">
              <span className="text-xs font-bold font-mono text-indigo-400">
                {yamlModal === 'github' ? '.github/workflows/deploy.yml' : '.gitlab-ci.yml'}
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() =>
                    copyYaml(yamlModal === 'github' ? docGenerator.generateGitHubWorkflowYaml() : docGenerator.generateGitLabCiYaml())
                  }
                  className="px-3 py-1 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded flex items-center gap-1"
                >
                  {copiedYaml ? <Check size={12} /> : <Download size={12} />}
                  {copiedYaml ? 'Copied YAML' : 'Copy Content'}
                </button>
                <button onClick={() => setYamlModal(null)} className="text-gray-400 hover:text-white px-2">✕</button>
              </div>
            </div>
            <pre className="p-4 bg-[#08090d] font-mono text-xs text-emerald-400 overflow-x-auto h-96 custom-scrollbar">
              {yamlModal === 'github' ? docGenerator.generateGitHubWorkflowYaml() : docGenerator.generateGitLabCiYaml()}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
};
