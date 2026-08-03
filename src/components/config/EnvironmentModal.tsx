import React, { useState } from 'react';
import * as Icons from 'lucide-react';
import { environmentService, type EnvVariable } from '../../runtime/config/EnvironmentService';

interface EnvironmentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EnvironmentModal: React.FC<EnvironmentModalProps> = ({ isOpen, onClose }) => {
  const [variables, setVariables] = useState<EnvVariable[]>(environmentService.getVariables());
  const [newKey, setNewKey] = useState('');
  const [newValue, setNewValue] = useState('');
  const [isSecret, setIsSecret] = useState(false);
  const [visibleSecrets, setVisibleSecrets] = useState<Record<string, boolean>>({});

  if (!isOpen) return null;

  const handleAddVariable = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKey.trim() || !newValue.trim()) return;

    environmentService.setVariable(newKey.trim().toUpperCase(), newValue.trim(), isSecret);
    setVariables(environmentService.getVariables());
    setNewKey('');
    setNewValue('');
    setIsSecret(false);
  };

  const handleDelete = (key: string) => {
    environmentService.deleteVariable(key);
    setVariables(environmentService.getVariables());
  };

  const toggleSecretVisibility = (key: string) => {
    setVisibleSecrets((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-6 select-none">
      <div className="bg-[#0e0f12] border border-[#232733] rounded-2xl w-full max-w-3xl h-[70vh] shadow-2xl overflow-hidden flex flex-col box-border text-gray-200">
        {/* Header */}
        <div className="p-4 border-b border-[#232733] bg-[#14161d] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <Icons.KeyRound size={18} />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white tracking-wide">Environment Variable Editor (.env)</h2>
              <p className="text-[11px] text-gray-400">Manage runtime secrets, database strings, and API tokens</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-white rounded hover:bg-[#181a20] transition-colors cursor-pointer"
          >
            <Icons.X size={18} />
          </button>
        </div>

        {/* Add New Env Variable Form */}
        <div className="p-4 border-b border-[#232733] bg-[#11131c] shrink-0">
          <form onSubmit={handleAddVariable} className="flex items-center gap-3">
            <input
              type="text"
              placeholder="VARIABLE_KEY"
              value={newKey}
              onChange={(e) => setNewKey(e.target.value)}
              className="w-1/3 bg-[#181a20] border border-[#232733] rounded-lg px-3 py-2 text-xs text-indigo-400 font-mono font-semibold placeholder-gray-500 outline-none focus:border-indigo-500 uppercase"
            />

            <input
              type="text"
              placeholder="value_or_connection_string"
              value={newValue}
              onChange={(e) => setNewValue(e.target.value)}
              className="flex-1 bg-[#181a20] border border-[#232733] rounded-lg px-3 py-2 text-xs text-white font-mono placeholder-gray-500 outline-none focus:border-indigo-500"
            />

            <label className="flex items-center gap-1.5 text-xs text-gray-400 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={isSecret}
                onChange={(e) => setIsSecret(e.target.checked)}
                className="accent-indigo-500 cursor-pointer"
              />
              <span>Secret</span>
            </label>

            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs flex items-center gap-2 transition-colors cursor-pointer"
            >
              <Icons.Plus size={14} />
              <span>Add</span>
            </button>
          </form>
        </div>

        {/* Variables List */}
        <div className="flex-1 p-4 overflow-y-auto space-y-2 custom-scrollbar font-mono">
          <h3 className="text-xs font-semibold uppercase text-gray-400 tracking-wider font-sans">Configured (.env) Variables ({variables.length})</h3>
          <div className="space-y-2">
            {variables.map((v) => {
              const isVisible = visibleSecrets[v.key];
              const displayVal = v.isSecret && !isVisible ? '••••••••••••••••••••' : v.value;

              return (
                <div key={v.key} className="p-3 bg-[#14161d] border border-[#232733] rounded-xl flex items-center justify-between">
                  <div className="flex items-center gap-3 flex-1 min-w-0 pr-4">
                    <span className="text-indigo-400 font-bold text-xs truncate w-40 shrink-0">{v.key}</span>
                    <span className="text-gray-300 text-xs truncate font-normal bg-[#181a20] px-2.5 py-1 rounded border border-[#232733] flex-1">
                      {displayVal}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {v.isSecret && (
                      <button
                        onClick={() => toggleSecretVisibility(v.key)}
                        className="p-1.5 rounded hover:bg-[#181a20] text-gray-400 hover:text-white transition-colors cursor-pointer"
                        title={isVisible ? 'Hide Secret' : 'Show Secret'}
                      >
                        {isVisible ? <Icons.EyeOff size={14} /> : <Icons.Eye size={14} />}
                      </button>
                    )}

                    <button
                      onClick={() => handleDelete(v.key)}
                      className="p-1.5 rounded hover:bg-red-950 text-red-400 transition-colors cursor-pointer"
                      title="Delete Variable"
                    >
                      <Icons.Trash2 size={14} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
