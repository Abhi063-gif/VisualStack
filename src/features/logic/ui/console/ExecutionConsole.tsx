import React, { useState, useEffect } from 'react';
import * as Icons from 'lucide-react';
import { useLogicStore } from '../../../../stores/LogicStore';
import { screenManager } from '../../../../application/screens/ScreenManager';
import { architectureValidator } from '../../../../application/engines/ArchitectureValidator';
import { runtimeSimulatorEngine } from '../../../../application/simulator/RuntimeSimulatorEngine';
import { projectModelExporter } from '../../../../application/ir/ProjectModelExporter';

type BottomTab =
  | 'logs'
  | 'simulator'
  | 'variables'
  | 'apis'
  | 'db_queries'
  | 'compiler'
  | 'problems'
  | 'warnings';

export const ExecutionConsole: React.FC = () => {
  const { executionLogs, clearLogs, variables, executionSteps, nodes, edges } = useLogicStore();
  const [activeTab, setActiveTab] = useState<BottomTab>('logs');
  const [filterLevel, setFilterLevel] = useState<'all' | 'info' | 'warn' | 'error'>('all');
  const [simSpeed, setSimSpeed] = useState<'1x' | '2x' | '5x'>('1x');
  const [isSimulating, setIsSimulating] = useState(false);
  const [simProgress, setSimProgress] = useState(0);

  const activeScreen = screenManager.getActiveScreen();
  const validationIssues = architectureValidator.validateFullProject();
  const compiledIRJson = projectModelExporter.exportJSONString();

  // Automatic Step Simulator Timer when isSimulating is active
  useEffect(() => {
    let timer: ReturnType<typeof setInterval>;
    if (isSimulating) {
      const intervalMs = simSpeed === '5x' ? 200 : simSpeed === '2x' ? 500 : 1000;
      timer = setInterval(async () => {
        if (nodes.length === 0) {
          setIsSimulating(false);
          return;
        }
        await runtimeSimulatorEngine.runSimulation(nodes, edges);
        setSimProgress((prev) => (prev >= 100 ? 100 : prev + 25));
      }, intervalMs);
    }
    return () => clearInterval(timer);
  }, [isSimulating, simSpeed, nodes, edges]);

  const handleStartSimulation = async () => {
    if (!isSimulating) {
      setSimProgress(10);
      setIsSimulating(true);
      await runtimeSimulatorEngine.runSimulation(nodes, edges);
      setSimProgress(100);
    } else {
      setIsSimulating(false);
    }
  };

  const filteredLogs =
    filterLevel === 'all' ? executionLogs : executionLogs.filter((log) => log.level === filterLevel);

  const errors = [
    ...executionLogs.filter((l) => l.level === 'error').map((l) => ({ id: l.id, message: l.message })),
    ...validationIssues.filter((i) => i.type === 'error').map((i) => ({ id: i.id, message: i.message })),
  ];

  const warnings = [
    ...executionLogs.filter((l) => l.level === 'warn').map((l) => ({ id: l.id, message: l.message })),
    ...validationIssues.filter((i) => i.type === 'warning').map((i) => ({ id: i.message, message: i.message })),
  ];

  return (
    <div className="w-full h-full bg-[#0c0d12] border-t border-[#232733] flex flex-col select-none overflow-hidden box-border">
      {/* 8-Tab Header Bar */}
      <div className="h-9 px-3 bg-[#11131c] border-b border-[#232733] flex items-center justify-between shrink-0 box-border overflow-x-auto custom-scrollbar">
        {/* Tab Buttons */}
        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={() => setActiveTab('logs')}
            className={`px-2.5 py-1 rounded text-[11px] font-medium flex items-center gap-1.5 transition-colors cursor-pointer ${
              activeTab === 'logs' ? 'bg-[#181a26] text-white font-semibold border border-[#232733]' : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            <Icons.Terminal size={12} className="text-indigo-400" />
            <span>Execution Logs</span>
            <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-[#0e0f12] text-gray-400 border border-[#232733]">
              {executionLogs.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('simulator')}
            className={`px-2.5 py-1 rounded text-[11px] font-medium flex items-center gap-1.5 transition-colors cursor-pointer ${
              activeTab === 'simulator' ? 'bg-[#181a26] text-white font-semibold border border-[#232733]' : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            <Icons.PlayCircle size={12} className="text-purple-400" />
            <span>Runtime Simulator</span>
          </button>

          <button
            onClick={() => setActiveTab('variables')}
            className={`px-2.5 py-1 rounded text-[11px] font-medium flex items-center gap-1.5 transition-colors cursor-pointer ${
              activeTab === 'variables' ? 'bg-[#181a26] text-white font-semibold border border-[#232733]' : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            <Icons.Box size={12} className="text-emerald-400" />
            <span>Variables</span>
            <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-[#0e0f12] text-gray-400 border border-[#232733]">
              {variables.length + (activeScreen?.variables.length || 0)}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('apis')}
            className={`px-2.5 py-1 rounded text-[11px] font-medium flex items-center gap-1.5 transition-colors cursor-pointer ${
              activeTab === 'apis' ? 'bg-[#181a26] text-white font-semibold border border-[#232733]' : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            <Icons.Globe size={12} className="text-orange-400" />
            <span>Generated APIs</span>
          </button>

          <button
            onClick={() => setActiveTab('db_queries')}
            className={`px-2.5 py-1 rounded text-[11px] font-medium flex items-center gap-1.5 transition-colors cursor-pointer ${
              activeTab === 'db_queries' ? 'bg-[#181a26] text-white font-semibold border border-[#232733]' : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            <Icons.Database size={12} className="text-cyan-400" />
            <span>DB Queries</span>
          </button>

          <button
            onClick={() => setActiveTab('compiler')}
            className={`px-2.5 py-1 rounded text-[11px] font-medium flex items-center gap-1.5 transition-colors cursor-pointer ${
              activeTab === 'compiler' ? 'bg-[#181a26] text-white font-semibold border border-[#232733]' : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            <Icons.Cpu size={12} className="text-blue-400" />
            <span>Compiler IR</span>
          </button>

          <button
            onClick={() => setActiveTab('problems')}
            className={`px-2.5 py-1 rounded text-[11px] font-medium flex items-center gap-1.5 transition-colors cursor-pointer ${
              activeTab === 'problems' ? 'bg-[#181a26] text-white font-semibold border border-[#232733]' : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            <Icons.AlertCircle size={12} className="text-red-400" />
            <span>Problems</span>
            <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-red-950/60 text-red-300 border border-red-800/40">
              {errors.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('warnings')}
            className={`px-2.5 py-1 rounded text-[11px] font-medium flex items-center gap-1.5 transition-colors cursor-pointer ${
              activeTab === 'warnings' ? 'bg-[#181a26] text-white font-semibold border border-[#232733]' : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            <Icons.AlertTriangle size={12} className="text-amber-400" />
            <span>Warnings</span>
            <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-amber-950/60 text-amber-300 border border-amber-800/40">
              {warnings.length}
            </span>
          </button>
        </div>

        {/* Console Level Filters & Actions */}
        {activeTab === 'logs' && (
          <div className="flex items-center gap-2 shrink-0">
            <div className="flex items-center gap-1 text-[10px]">
              {(['all', 'info', 'warn', 'error'] as const).map((lvl) => (
                <button
                  key={lvl}
                  onClick={() => setFilterLevel(lvl)}
                  className={`px-2 py-0.5 rounded capitalize transition-colors cursor-pointer ${
                    filterLevel === lvl ? 'bg-indigo-600 text-white font-medium' : 'text-gray-400 hover:text-gray-200'
                  }`}
                >
                  {lvl}
                </button>
              ))}
            </div>

            <button
              onClick={clearLogs}
              className="p-1 text-gray-400 hover:text-white rounded hover:bg-[#181a20] transition-colors cursor-pointer"
              title="Clear Logs"
            >
              <Icons.Trash2 size={13} />
            </button>
          </div>
        )}
      </div>

      {/* Tab Content Panes */}
      <div className="flex-1 overflow-y-auto p-3 font-mono text-[11px] custom-scrollbar box-border">
        {/* 1. Execution Logs */}
        {activeTab === 'logs' && (
          <div className="space-y-1.5">
            {filteredLogs.map((log) => {
              const isError = log.level === 'error';
              const isWarn = log.level === 'warn';

              return (
                <div
                  key={log.id}
                  className={`flex items-start gap-2.5 leading-relaxed border-l-2 pl-2.5 py-0.5 rounded-r ${
                    isError
                      ? 'border-red-500 text-red-300 bg-red-950/20'
                      : isWarn
                      ? 'border-amber-500 text-amber-300 bg-amber-950/20'
                      : 'border-[#232733] text-gray-300'
                  }`}
                >
                  <span className="text-[10px] text-gray-500 shrink-0 font-mono">
                    {new Date(log.timestamp).toLocaleTimeString()}
                  </span>
                  <span className="break-all">{log.message}</span>
                </div>
              );
            })}

            {filteredLogs.length === 0 && (
              <div className="text-gray-500 italic py-6 text-center">
                Console stream is empty. Click "Run Logic" in toolbar to trigger execution.
              </div>
            )}
          </div>
        )}

        {/* 2. Runtime Simulator (Phase 6 Interactive Engine) */}
        {activeTab === 'simulator' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between p-2.5 bg-[#14161d] border border-[#232733] rounded-lg">
              <div className="flex items-center gap-3">
                <button
                  onClick={handleStartSimulation}
                  className={`px-3 py-1.5 rounded text-xs font-semibold flex items-center gap-2 cursor-pointer transition-colors ${
                    isSimulating ? 'bg-amber-600 hover:bg-amber-500 text-white' : 'bg-purple-600 hover:bg-purple-500 text-white'
                  }`}
                >
                  {isSimulating ? <Icons.Pause size={14} /> : <Icons.Play size={14} />}
                  <span>{isSimulating ? 'Pause Step Simulation' : 'Start Runtime Simulation'}</span>
                </button>

                <div className="flex items-center gap-1 text-[10px] font-sans text-gray-400">
                  <span>Speed:</span>
                  {(['1x', '2x', '5x'] as const).map((spd) => (
                    <button
                      key={spd}
                      onClick={() => setSimSpeed(spd)}
                      className={`px-2 py-0.5 rounded font-mono cursor-pointer ${
                        simSpeed === spd ? 'bg-indigo-600 text-white font-bold' : 'bg-[#181a20] text-gray-400 hover:text-white'
                      }`}
                    >
                      {spd}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="text-right text-[10px] text-gray-400 font-mono">
                  <span>Simulation Progress: </span>
                  <strong className="text-purple-300 font-semibold">{simProgress}%</strong>
                </div>

                <div className="w-24 bg-[#181a20] h-2 rounded-full overflow-hidden border border-[#232733]">
                  <div className="bg-purple-500 h-full transition-all duration-300" style={{ width: `${simProgress}%` }} />
                </div>
              </div>
            </div>

            {/* Active Execution Steps List */}
            <div className="space-y-1">
              <div className="text-[10px] font-semibold uppercase text-purple-400 pb-1 tracking-wider">
                Simulated Execution Stack Timeline ({executionSteps.length} Steps)
              </div>

              {executionSteps.length === 0 ? (
                <div className="text-gray-500 italic py-6 text-center bg-[#14161d] rounded border border-[#232733]">
                  No step simulation active. Click "Start Runtime Simulation" above to execute graph step-by-step.
                </div>
              ) : (
                executionSteps.map((step) => (
                  <div key={step.id} className="flex items-center justify-between p-2 bg-[#14161d] border border-[#232733] rounded">
                    <div className="flex items-center gap-2 truncate pr-2">
                      <span className="text-purple-400 font-mono font-bold">#{step.stepIndex}</span>
                      <span className="text-white font-medium truncate">{step.nodeName}</span>
                      <span className="text-[9px] font-mono text-gray-500">({step.category})</span>
                    </div>
                    <span className="text-emerald-400 font-semibold text-[10px] shrink-0">{step.status}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* 3. Variables */}
        {activeTab === 'variables' && (
          <div className="space-y-2">
            <div className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider pb-1">
              Screen & Global Scope Variables
            </div>
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#232733] text-gray-500 text-[10px]">
                  <th className="py-1">Name</th>
                  <th className="py-1">Scope</th>
                  <th className="py-1">Type</th>
                  <th className="py-1">Value</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#181a20] text-[11px]">
                {activeScreen?.variables.map((v) => (
                  <tr key={v.id} className="hover:bg-[#14161d]">
                    <td className="py-1.5 font-mono text-indigo-400 font-semibold">{v.name}</td>
                    <td className="py-1.5 font-mono text-purple-400">{v.scope}</td>
                    <td className="py-1.5 font-mono text-emerald-400">{v.type}</td>
                    <td className="py-1.5 font-mono text-white">{JSON.stringify(v.value)}</td>
                  </tr>
                ))}
                {variables.map((v) => (
                  <tr key={v.id} className="hover:bg-[#14161d]">
                    <td className="py-1.5 font-mono text-indigo-400 font-semibold">{v.name}</td>
                    <td className="py-1.5 font-mono text-blue-400">global</td>
                    <td className="py-1.5 font-mono text-emerald-400">{v.type}</td>
                    <td className="py-1.5 font-mono text-white">{JSON.stringify(v.value)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* 4. Generated APIs */}
        {activeTab === 'apis' && (
          <div className="space-y-2">
            <div className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider pb-1">
              Screen REST & Webhook API Endpoints
            </div>
            <div className="space-y-1.5">
              <div className="p-2 bg-[#14161d] border border-[#232733] rounded flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-400 font-bold text-[9px]">POST</span>
                  <span className="font-mono text-white">/api/v1/auth/login</span>
                </div>
                <span className="text-[10px] text-gray-400">Auth: Public</span>
              </div>
              <div className="p-2 bg-[#14161d] border border-[#232733] rounded flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="px-1.5 py-0.5 rounded bg-blue-950 text-blue-400 font-bold text-[9px]">GET</span>
                  <span className="font-mono text-white">/api/v1/users/me</span>
                </div>
                <span className="text-[10px] text-gray-400">Auth: Bearer JWT</span>
              </div>
            </div>
          </div>
        )}

        {/* 5. DB Queries */}
        {activeTab === 'db_queries' && (
          <div className="space-y-2">
            <div className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider pb-1">
              Generated SQL & NoSQL Statements
            </div>
            <div className="p-2.5 bg-[#14161d] border border-[#232733] rounded font-mono text-emerald-400 leading-relaxed">
              SELECT id, email, role, created_at FROM users WHERE email = $1 LIMIT 1;
            </div>
          </div>
        )}

        {/* 6. Compiler IR (Phase 6 Live JSON Model Viewer) */}
        {activeTab === 'compiler' && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-[10px] font-semibold text-gray-400 uppercase tracking-wider pb-1">
              <span>Intermediate Representation (IR) Compiler Output</span>
              <span className="text-indigo-400 font-mono">Full Application Model JSON</span>
            </div>

            <div className="bg-[#14161d] border border-[#232733] rounded-lg p-3 overflow-auto max-h-[300px] custom-scrollbar">
              <pre className="font-mono text-[11px] text-indigo-300 leading-relaxed whitespace-pre-wrap">
                {compiledIRJson}
              </pre>
            </div>
          </div>
        )}

        {/* 7. Problems */}
        {activeTab === 'problems' && (
          <div className="space-y-1.5">
            {errors.length === 0 ? (
              <div className="text-emerald-400 font-medium py-3 text-center">
                ✓ No critical architecture problems detected.
              </div>
            ) : (
              errors.map((e) => (
                <div key={e.id} className="p-2 bg-red-950/30 border border-red-900/50 rounded text-red-300 flex items-center gap-2">
                  <Icons.AlertCircle size={13} className="text-red-400 shrink-0" />
                  <span>{e.message}</span>
                </div>
              ))
            )}
          </div>
        )}

        {/* 8. Warnings */}
        {activeTab === 'warnings' && (
          <div className="space-y-1.5">
            {warnings.length === 0 ? (
              <div className="text-gray-400 italic py-3 text-center">No non-critical warnings reported.</div>
            ) : (
              warnings.map((w) => (
                <div key={w.id} className="p-2 bg-amber-950/30 border border-amber-900/50 rounded text-amber-300 flex items-center gap-2">
                  <Icons.AlertTriangle size={13} className="text-amber-400 shrink-0" />
                  <span>{w.message}</span>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};
