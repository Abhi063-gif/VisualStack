import React, { useState } from 'react';
import * as Icons from 'lucide-react';
import { dataMappingEngine, type DataBindingRule } from './DataMappingEngine';
import { componentDiscoveryEngine } from '../discovery/ComponentDiscovery';
import { screenManager } from '../screens/ScreenManager';

export const DataMappingPanel: React.FC = () => {
  const [bindings, setBindings] = useState<DataBindingRule[]>(dataMappingEngine.getBindings());
  const [sourceType, setSourceType] = useState<DataBindingRule['sourceType']>('component_input');
  const [sourcePath, setSourcePath] = useState('input_email.value');
  const [targetType, setTargetType] = useState<DataBindingRule['targetType']>('node_input');
  const [targetPath, setTargetPath] = useState('node_auth_login.email');
  const [transformExpr, setTransformExpr] = useState('{{ sourcePath.trim().toLowerCase() }}');
  const [evalTestVal, setEvalTestVal] = useState('  User@Example.Com  ');
  const [evalResult, setEvalResult] = useState<string | null>(null);

  const discoveredComponents = componentDiscoveryEngine.discoverComponents();
  const activeScreen = screenManager.getActiveScreen();

  const handleAddBinding = () => {
    const newRule: DataBindingRule = {
      id: `bind_${Date.now()}`,
      sourceType,
      sourcePath,
      targetType,
      targetPath,
      transformExpression: transformExpr,
    };
    dataMappingEngine.registerBinding(newRule);
    setBindings(dataMappingEngine.getBindings());
  };

  const handleTestEvaluate = () => {
    const result = dataMappingEngine.evaluateExpression(
      `{{ input_email.value }}`,
      { input_email: { value: evalTestVal.trim().toLowerCase() } }
    );
    setEvalResult(String(result));
  };

  return (
    <div className="flex flex-col h-full w-full bg-[#0e0f12] text-gray-200 p-3 space-y-4 font-sans text-xs box-border overflow-y-auto custom-scrollbar">
      {/* Header Banner */}
      <div className="p-3 bg-[#14161d] border border-[#232733] rounded-lg flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
            <Icons.GitMerge size={16} />
          </div>
          <div>
            <h3 className="text-xs font-semibold text-white">Visual Data Mapping & Bindings</h3>
            <p className="text-[10px] text-gray-400">Map UI inputs, screen variables, DB params, & node payloads.</p>
          </div>
        </div>

        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-800 font-semibold">
          {bindings.length} Active Rules
        </span>
      </div>

      {/* 1. Add Data Binding Builder Form */}
      <div className="p-3 bg-[#14161d] border border-[#232733] rounded-lg space-y-3 shrink-0">
        <div className="text-[11px] font-semibold uppercase text-indigo-400 tracking-wider">
          + Create New Data Binding Rule
        </div>

        <div className="grid grid-cols-2 gap-3">
          {/* Source Selector */}
          <div className="space-y-1">
            <label className="text-[10px] font-medium text-gray-400">Source Type</label>
            <select
              value={sourceType}
              onChange={(e) => setSourceType(e.target.value as DataBindingRule['sourceType'])}
              className="w-full bg-[#181a20] border border-[#232733] rounded px-2 py-1.5 text-white font-mono outline-none"
            >
              <option value="component_input">UI Component Input</option>
              <option value="variable">Screen Variable</option>
              <option value="node_output">Logic Node Output</option>
              <option value="env_secret">Environment Secret</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-medium text-gray-400">Source Property / Path</label>
            {sourceType === 'component_input' ? (
              <select
                value={sourcePath}
                onChange={(e) => setSourcePath(e.target.value)}
                className="w-full bg-[#181a20] border border-[#232733] rounded px-2 py-1.5 text-white font-mono outline-none"
              >
                {discoveredComponents.map((c) => (
                  <option key={c.id} value={`${c.name}.value`}>
                    {c.name} (.value)
                  </option>
                ))}
              </select>
            ) : sourceType === 'variable' ? (
              <select
                value={sourcePath}
                onChange={(e) => setSourcePath(e.target.value)}
                className="w-full bg-[#181a20] border border-[#232733] rounded px-2 py-1.5 text-white font-mono outline-none"
              >
                {(activeScreen?.variables || []).map((v) => (
                  <option key={v.id} value={`variables.${v.name}`}>
                    variables.{v.name}
                  </option>
                ))}
                {(!activeScreen?.variables || activeScreen.variables.length === 0) && (
                  <option value="variables.user_id">variables.user_id</option>
                )}
              </select>
            ) : (
              <input
                type="text"
                value={sourcePath}
                onChange={(e) => setSourcePath(e.target.value)}
                placeholder="e.g. node_1.output.id"
                className="w-full bg-[#181a20] border border-[#232733] rounded px-2.5 py-1.5 text-white font-mono outline-none"
              />
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {/* Target Selector */}
          <div className="space-y-1">
            <label className="text-[10px] font-medium text-gray-400">Target Location</label>
            <select
              value={targetType}
              onChange={(e) => setTargetType(e.target.value as DataBindingRule['targetType'])}
              className="w-full bg-[#181a20] border border-[#232733] rounded px-2 py-1.5 text-white font-mono outline-none"
            >
              <option value="node_input">Backend Node Input</option>
              <option value="api_payload">API Request Body</option>
              <option value="db_param">Database Query Parameter</option>
              <option value="component_state">UI Component State</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-medium text-gray-400">Target Field Path</label>
            <input
              type="text"
              value={targetPath}
              onChange={(e) => setTargetPath(e.target.value)}
              placeholder="e.g. node_auth_login.email"
              className="w-full bg-[#181a20] border border-[#232733] rounded px-2.5 py-1.5 text-white font-mono outline-none"
            />
          </div>
        </div>

        <div>
          <label className="text-[10px] font-medium text-gray-400 block mb-1">Handlebar Transform Expression</label>
          <input
            type="text"
            value={transformExpr}
            onChange={(e) => setTransformExpr(e.target.value)}
            placeholder="{{ source.trim().toLowerCase() }}"
            className="w-full bg-[#181a20] border border-[#232733] rounded px-2.5 py-1.5 text-indigo-300 font-mono outline-none text-[11px]"
          />
        </div>

        <button
          onClick={handleAddBinding}
          className="w-full py-1.5 rounded bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
        >
          <Icons.Plus size={13} />
          <span>Save Data Binding Rule</span>
        </button>
      </div>

      {/* 2. Expression Evaluator Tester */}
      <div className="p-3 bg-[#14161d] border border-[#232733] rounded-lg space-y-2.5 shrink-0">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-semibold uppercase text-emerald-400 tracking-wider">
            Expression Evaluator Tester
          </span>
          <button
            onClick={handleTestEvaluate}
            className="text-[10px] font-mono text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800 cursor-pointer hover:bg-emerald-900 transition-colors"
          >
            Evaluate
          </button>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="text"
            value={evalTestVal}
            onChange={(e) => setEvalTestVal(e.target.value)}
            placeholder="Test Value..."
            className="flex-1 bg-[#181a20] border border-[#232733] rounded px-2.5 py-1 text-white font-mono outline-none text-[11px]"
          />
          {evalResult && (
            <span className="text-[11px] font-mono text-emerald-400 bg-[#181a20] px-2 py-1 rounded border border-[#232733]">
              Result: "{evalResult}"
            </span>
          )}
        </div>
      </div>

      {/* 3. Existing Rules Table */}
      <div className="space-y-2 flex-1 min-h-[160px]">
        <div className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
          Active Screen Data Bindings
        </div>

        <div className="space-y-1.5">
          {bindings.length === 0 ? (
            <div className="text-gray-500 italic py-4 text-center">
              No data binding rules registered for this screen.
            </div>
          ) : (
            bindings.map((b) => (
              <div
                key={b.id}
                className="p-2 bg-[#14161d] border border-[#232733] rounded flex items-center justify-between text-[11px] font-mono"
              >
                <div className="flex items-center gap-2 truncate pr-2">
                  <span className="text-indigo-400 font-semibold">{b.sourcePath}</span>
                  <Icons.ArrowRight size={12} className="text-gray-500 shrink-0" />
                  <span className="text-purple-400 font-semibold">{b.targetPath}</span>
                </div>
                <span className="text-[9px] px-1.5 py-0.5 rounded bg-[#181a20] text-gray-400 border border-[#232733] shrink-0">
                  {b.sourceType}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
