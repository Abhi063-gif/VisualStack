import React, { useState, useEffect } from 'react';
import * as Icons from 'lucide-react';
import { useLogicStore } from '../../../../stores/LogicStore';
import { screenManager } from '../../../../application/screens/ScreenManager';
import { architectureValidator } from '../../../../application/engines/ArchitectureValidator';
import { runtimeSimulatorEngine } from '../../../../application/simulator/RuntimeSimulatorEngine';
import { projectModelExporter } from '../../../../application/ir/ProjectModelExporter';
import { compiler } from '../../../../compiler/Compiler';
import type { StageLog } from '../../../../compiler/CompilerLogger';
import type { DiagnosticItem } from '../../../../compiler/CompilerDiagnostics';
import { localDatabaseManager } from '../../../../runtime/db/LocalDatabaseManager';

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

  const [compilerStageLogs, setCompilerStageLogs] = useState<StageLog[]>([]);
  const [compilerDiagnostics, setCompilerDiagnostics] = useState<DiagnosticItem[]>([]);
  const [compilerIRJson, setCompilerIRJson] = useState<string>('');
  const [isCompiling, setIsCompiling] = useState(false);

  const activeScreen = screenManager.getActiveScreen();
  const validationIssues = architectureValidator.validateFullProject();
  const rawIRJson = projectModelExporter.exportJSONString();

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

  const handleRunCompilerPipeline = async () => {
    setIsCompiling(true);
    const { context } = await compiler.compile({ targetFramework: 'react-express' });
    setCompilerStageLogs(context.logger.getLogs());
    setCompilerDiagnostics(context.diagnostics.getAll());
    if (context.ir) {
      setCompilerIRJson(JSON.stringify(context.ir, null, 2));
    }
    setIsCompiling(false);
  };

  const filteredLogs =
    filterLevel === 'all' ? executionLogs : executionLogs.filter((log) => log.level === filterLevel);

  const compilerErrors = compilerDiagnostics.filter((d) => d.severity === 'error');
  const compilerWarnings = compilerDiagnostics.filter((d) => d.severity === 'warning' || d.severity === 'info');

  const errors = [
    ...validationIssues.filter((i: any) => i.severity === 'error' || i.type === 'error'),
    ...compilerErrors,
  ];
  const warnings = [
    ...validationIssues.filter((i: any) => i.severity === 'warning' || i.type === 'warning'),
    ...compilerWarnings,
  ];

  return (
    <div className="h-full bg-[#0c0d12] border-t border-[#232733] flex flex-col font-sans select-none text-xs text-gray-300 overflow-hidden box-border">
      {/* Header Bar */}
      <div className="bg-[#14161d] border-b border-[#232733] px-3 py-1.5 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-1.5 overflow-x-auto custom-scrollbar">
          <button
            onClick={() => setActiveTab('logs')}
            className={`px-2.5 py-1 rounded font-medium flex items-center gap-1.5 transition-colors cursor-pointer ${
              activeTab === 'logs'
                ? 'bg-indigo-600/20 text-indigo-400 border border-indigo-500/30'
                : 'text-gray-400 hover:text-gray-200 hover:bg-[#181a20]'
            }`}
          >
            <Icons.Terminal size={13} />
            <span>Execution Logs</span>
            <span className="bg-gray-800 text-gray-300 px-1.5 py-0.2 rounded text-[10px]">
              {executionLogs.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('simulator')}
            className={`px-2.5 py-1 rounded font-medium flex items-center gap-1.5 transition-colors cursor-pointer ${
              activeTab === 'simulator'
                ? 'bg-indigo-600/20 text-indigo-400 border border-indigo-500/30'
                : 'text-gray-400 hover:text-gray-200 hover:bg-[#181a20]'
            }`}
          >
            <Icons.PlayCircle size={13} />
            <span>Step Simulator</span>
            <span className="bg-indigo-950 text-indigo-300 border border-indigo-800 px-1.5 py-0.2 rounded text-[10px]">
              {executionSteps.length} Steps
            </span>
          </button>

          <button
            onClick={() => setActiveTab('variables')}
            className={`px-2.5 py-1 rounded font-medium flex items-center gap-1.5 transition-colors cursor-pointer ${
              activeTab === 'variables'
                ? 'bg-indigo-600/20 text-indigo-400 border border-indigo-500/30'
                : 'text-gray-400 hover:text-gray-200 hover:bg-[#181a20]'
            }`}
          >
            <Icons.Variable size={13} />
            <span>Live Variables</span>
            <span className="bg-gray-800 text-gray-300 px-1.5 py-0.2 rounded text-[10px]">
              {(activeScreen?.variables.length || 0) + variables.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('apis')}
            className={`px-2.5 py-1 rounded font-medium flex items-center gap-1.5 transition-colors cursor-pointer ${
              activeTab === 'apis'
                ? 'bg-indigo-600/20 text-indigo-400 border border-indigo-500/30'
                : 'text-gray-400 hover:text-gray-200 hover:bg-[#181a20]'
            }`}
          >
            <Icons.Globe size={13} />
            <span>Generated APIs</span>
          </button>

          <button
            onClick={() => setActiveTab('db_queries')}
            className={`px-2.5 py-1 rounded font-medium flex items-center gap-1.5 transition-colors cursor-pointer ${
              activeTab === 'db_queries'
                ? 'bg-indigo-600/20 text-indigo-400 border border-indigo-500/30'
                : 'text-gray-400 hover:text-gray-200 hover:bg-[#181a20]'
            }`}
          >
            <Icons.Database size={13} />
            <span>DB Queries</span>
          </button>

          <button
            onClick={() => setActiveTab('compiler')}
            className={`px-2.5 py-1 rounded font-medium flex items-center gap-1.5 transition-colors cursor-pointer ${
              activeTab === 'compiler'
                ? 'bg-indigo-600/20 text-indigo-400 border border-indigo-500/30'
                : 'text-gray-400 hover:text-gray-200 hover:bg-[#181a20]'
            }`}
          >
            <Icons.Code2 size={13} />
            <span>Compiler IR</span>
          </button>

          <button
            onClick={() => setActiveTab('problems')}
            className={`px-2.5 py-1 rounded font-medium flex items-center gap-1.5 transition-colors cursor-pointer ${
              activeTab === 'problems'
                ? 'bg-red-950/40 text-red-400 border border-red-800/40'
                : 'text-gray-400 hover:text-gray-200 hover:bg-[#181a20]'
            }`}
          >
            <Icons.AlertCircle size={13} className={errors.length > 0 ? 'text-red-400' : ''} />
            <span>Problems</span>
            {errors.length > 0 && (
              <span className="bg-red-600 text-white font-bold px-1.5 py-0.2 rounded text-[10px]">
                {errors.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('warnings')}
            className={`px-2.5 py-1 rounded font-medium flex items-center gap-1.5 transition-colors cursor-pointer ${
              activeTab === 'warnings'
                ? 'bg-amber-950/40 text-amber-400 border border-amber-800/40'
                : 'text-gray-400 hover:text-gray-200 hover:bg-[#181a20]'
            }`}
          >
            <Icons.AlertTriangle size={13} className={warnings.length > 0 ? 'text-amber-400' : ''} />
            <span>Warnings</span>
            {warnings.length > 0 && (
              <span className="bg-amber-600 text-white font-bold px-1.5 py-0.2 rounded text-[10px]">
                {warnings.length}
              </span>
            )}
          </button>
        </div>

        {/* Console Controls */}
        <div className="flex items-center gap-2">
          {activeTab === 'logs' && (
            <>
              <select
                value={filterLevel}
                onChange={(e) => setFilterLevel(e.target.value as any)}
                className="bg-[#181a20] border border-[#232733] rounded px-2 py-0.5 text-[11px] text-gray-300 outline-none"
              >
                <option value="all">All Logs</option>
                <option value="info">Info</option>
                <option value="warn">Warn</option>
                <option value="error">Error</option>
              </select>

              <button
                onClick={clearLogs}
                className="p-1 text-gray-400 hover:text-white rounded hover:bg-[#181a20] transition-colors cursor-pointer"
                title="Clear Logs"
              >
                <Icons.Trash2 size={13} />
              </button>
            </>
          )}
        </div>
      </div>

      {/* Main Console Viewport */}
      <div className="flex-1 p-3 overflow-auto custom-scrollbar font-mono text-[11px]">
        {/* 1. Execution Logs */}
        {activeTab === 'logs' && (
          <div className="space-y-1">
            {filteredLogs.length === 0 ? (
              <div className="text-gray-400 italic py-4 text-center">
                No logs recorded. Run a logic workflow to view real-time node outputs.
              </div>
            ) : (
              filteredLogs.map((log: any) => (
                <div
                  key={log.id}
                  className="flex items-start gap-2.5 py-0.5 hover:bg-[#14161d] px-1 rounded transition-colors"
                >
                  <span className="text-gray-400 text-[10px] shrink-0 pt-0.5 font-sans">{log.timestamp}</span>
                  <span
                    className={`font-semibold shrink-0 uppercase text-[10px] px-1.5 py-0.2 rounded font-sans ${
                      log.level === 'error'
                        ? 'bg-red-950 text-red-400 border border-red-800/50'
                        : log.level === 'warn'
                        ? 'bg-amber-950 text-amber-400 border border-amber-800/50'
                        : 'bg-indigo-950 text-indigo-400 border border-indigo-800/50'
                    }`}
                  >
                    {log.level}
                  </span>
                  {log.nodeLabel && <span className="text-indigo-300 font-semibold shrink-0">[{log.nodeLabel}]</span>}
                  <span className="text-gray-200 break-all">{log.message}</span>
                </div>
              ))
            )}
          </div>
        )}

        {/* 2. Step Simulator */}
        {activeTab === 'simulator' && (
          <div className="space-y-3">
            <div className="bg-[#14161d] border border-[#232733] rounded-lg p-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button
                  onClick={handleStartSimulation}
                  className={`px-3 py-1.5 rounded font-semibold text-xs flex items-center gap-2 transition-colors cursor-pointer ${
                    isSimulating
                      ? 'bg-red-600 hover:bg-red-500 text-white'
                      : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                  }`}
                >
                  {isSimulating ? <Icons.Pause size={14} /> : <Icons.Play size={14} />}
                  <span>{isSimulating ? 'Pause Simulation' : 'Start Simulation'}</span>
                </button>

                <div className="flex items-center gap-1.5">
                  <span className="text-xs text-gray-400">Speed:</span>
                  {(['1x', '2x', '5x'] as const).map((spd) => (
                    <button
                      key={spd}
                      onClick={() => setSimSpeed(spd)}
                      className={`px-2 py-0.5 rounded text-[11px] font-mono transition-colors cursor-pointer ${
                        simSpeed === spd
                          ? 'bg-indigo-600 text-white font-bold'
                          : 'bg-[#181a20] text-gray-400 hover:text-white'
                      }`}
                    >
                      {spd}
                    </button>
                  ))}
                </div>
              </div>

              <div className="w-48 bg-gray-900 border border-[#232733] h-2.5 rounded-full overflow-hidden">
                <div
                  className="bg-indigo-500 h-full transition-all duration-300"
                  style={{ width: `${simProgress}%` }}
                />
              </div>
            </div>

            <div className="space-y-1">
              {executionSteps.length === 0 ? (
                <div className="text-gray-400 italic py-4 text-center">
                  No simulation steps executed yet. Click "Start Simulation" above.
                </div>
              ) : (
                executionSteps.map((step: any, idx: number) => (
                  <div
                    key={step.id || idx}
                    className="p-2 bg-[#14161d] border border-[#232733] rounded flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-indigo-600/30 text-indigo-400 font-bold text-[10px] flex items-center justify-center">
                        {idx + 1}
                      </span>
                      <span className="text-gray-200 font-semibold">{step.nodeType || step.name || 'Step'}</span>
                    </div>
                    <span className="text-gray-400 text-[10px]">{step.durationMs || 10}ms</span>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* 3. Live Variables */}
        {activeTab === 'variables' && (
          <div className="space-y-2">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#232733] text-gray-400 font-sans text-[10px] uppercase">
                  <th className="pb-1 font-semibold">Variable Name</th>
                  <th className="pb-1 font-semibold">Scope</th>
                  <th className="pb-1 font-semibold">Data Type</th>
                  <th className="pb-1 font-semibold">Current Value</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#232733]/50">
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
            <div className="p-2.5 bg-[#14161d] border border-[#232733] rounded space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="px-1.5 py-0.5 bg-emerald-950 text-emerald-400 border border-emerald-800 rounded font-bold text-[10px]">
                  POST
                </span>
                <code className="text-gray-200">
                  /api/v1{activeScreen?.route.path === '/' ? '/main' : activeScreen?.route.path}
                </code>
              </div>
            </div>
          </div>
        )}

        {/* 5. DB Queries & Local Database Runtime */}
        {activeTab === 'db_queries' && (
          <div className="space-y-3 font-sans">
            <div className="p-3 bg-[#14161d] border border-[#232733] rounded-xl flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Icons.Database size={18} className="text-amber-400" />
                <div>
                  <h4 className="text-xs font-bold text-white font-mono">SQLite Local Database Engine (prisma/dev.db)</h4>
                  <p className="text-[11px] text-gray-400">Status: <strong className="text-emerald-400 uppercase">CONNECTED</strong> | Tables: <strong>4</strong></p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={async () => {
                    const msg = await localDatabaseManager.runMigration();
                    alert(msg);
                  }}
                  className="px-3 py-1 rounded bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-colors cursor-pointer"
                >
                  Run Migration
                </button>
                <button
                  onClick={async () => {
                    const msg = await localDatabaseManager.seedDatabase();
                    alert(msg);
                  }}
                  className="px-3 py-1 rounded bg-[#181a20] hover:bg-[#232733] border border-[#232733] text-gray-300 text-xs font-semibold transition-colors cursor-pointer"
                >
                  Seed Database
                </button>
              </div>
            </div>

            <div className="space-y-1 font-mono">
              <div className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider font-sans">
                Generated SQL Statements
              </div>
              <div className="p-2.5 bg-[#14161d] border border-[#232733] rounded text-emerald-400 leading-relaxed">
                SELECT id, email, role, created_at FROM users WHERE email = $1 LIMIT 1;
              </div>
            </div>
          </div>
        )}

        {/* 6. Compiler IR */}
        {activeTab === 'compiler' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between bg-[#14161d] border border-[#232733] rounded-lg p-2.5">
              <div className="flex items-center gap-2">
                <Icons.Cpu size={16} className="text-indigo-400" />
                <span className="font-semibold text-white">VisualStack 7-Stage Compiler Pipeline</span>
              </div>

              <button
                onClick={handleRunCompilerPipeline}
                disabled={isCompiling}
                className="px-3 py-1.5 rounded bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-semibold text-xs flex items-center gap-2 transition-colors cursor-pointer shadow"
              >
                <Icons.Play size={13} />
                <span>{isCompiling ? 'Compiling Pipeline...' : 'Run 7-Stage Compiler Pipeline'}</span>
              </button>
            </div>

            {compilerStageLogs.length > 0 && (
              <div className="bg-[#14161d] border border-[#232733] rounded-lg p-3 space-y-1.5">
                <div className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1">
                  Pipeline Execution Stage Timings
                </div>
                {compilerStageLogs.map((log) => (
                  <div key={log.stage} className="flex items-center justify-between text-[11px] font-mono py-0.5">
                    <span className="text-indigo-400 font-semibold">{log.stage}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-gray-300">{log.message}</span>
                      <span className="bg-indigo-950 text-indigo-300 border border-indigo-800 px-1.5 py-0.2 rounded text-[10px]">
                        {log.durationMs}ms
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="bg-[#14161d] border border-[#232733] rounded-lg p-3 overflow-auto max-h-[250px] custom-scrollbar">
              <pre className="font-mono text-[11px] text-indigo-300 leading-relaxed whitespace-pre-wrap">
                {compilerIRJson || rawIRJson}
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
              errors.map((e: any, idx: number) => (
                <div key={e.id || idx} className="p-2 bg-red-950/30 border border-red-900/50 rounded text-red-300 flex items-center gap-2">
                  <Icons.AlertCircle size={13} className="text-red-400 shrink-0" />
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                      {e.code && <span className="font-bold text-red-400 font-mono text-[10px]">[{e.code}]</span>}
                      <span>{e.message}</span>
                    </div>
                    {e.sourceModule && <span className="text-[9px] text-gray-400">Source: {e.sourceModule}</span>}
                  </div>
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
              warnings.map((w: any, idx: number) => (
                <div key={w.id || idx} className="p-2 bg-amber-950/30 border border-amber-900/50 rounded text-amber-300 flex items-center gap-2">
                  <Icons.AlertTriangle size={13} className="text-amber-400 shrink-0" />
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                      {w.code && <span className="font-bold text-amber-400 font-mono text-[10px]">[{w.code}]</span>}
                      <span>{w.message}</span>
                    </div>
                    {w.sourceModule && <span className="text-[9px] text-gray-400">Source: {w.sourceModule}</span>}
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};
