import React, { useState } from 'react';
import { History, RotateCcw, Plus, Clock, X, Check } from 'lucide-react';
import { versionHistoryEngine, type VersionCheckpoint } from '../../collaboration/VersionHistoryEngine';

export const VersionHistoryModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const [checkpoints, setCheckpoints] = useState<VersionCheckpoint[]>(versionHistoryEngine.getCheckpoints());
  const [newCheckpointName, setNewCheckpointName] = useState('');
  const [restoredId, setRestoredId] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCreateCheckpoint = () => {
    if (!newCheckpointName.trim()) return;
    versionHistoryEngine.createCheckpoint(newCheckpointName, 'Current User', 'named');
    setNewCheckpointName('');
    setCheckpoints(versionHistoryEngine.getCheckpoints());
  };

  const handleRestore = (id: string) => {
    versionHistoryEngine.restoreCheckpoint(id);
    setRestoredId(id);
    setTimeout(() => setRestoredId(null), 2000);
  };

  return (
    <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4 font-sans text-gray-100">
      <div className="bg-[#14161b] border border-[#232733] rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl flex flex-col">
        {/* Header */}
        <div className="px-5 py-4 border-b border-[#232733] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-indigo-600/20 text-indigo-400 rounded-xl">
              <History size={20} />
            </div>
            <div>
              <h2 className="text-sm font-bold text-gray-100">Version History & Checkpoint Timeline</h2>
              <p className="text-[11px] text-gray-400">Save named checkpoints, compare snapshots & restore project state</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-[#1f232d] text-gray-400 hover:text-white rounded">
            <X size={18} />
          </button>
        </div>

        {/* Input */}
        <div className="p-5 border-b border-[#232733] flex items-center gap-2">
          <input
            type="text"
            value={newCheckpointName}
            onChange={(e) => setNewCheckpointName(e.target.value)}
            placeholder="Create named checkpoint (e.g., Release v1.0.4)..."
            className="flex-1 bg-[#0e0f12] border border-[#232733] rounded-lg px-3 py-2 text-xs text-gray-200 outline-none focus:border-indigo-500 font-sans"
          />
          <button onClick={handleCreateCheckpoint} className="px-3 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold flex items-center gap-1">
            <Plus size={14} /> Save Checkpoint
          </button>
        </div>

        {/* Timeline List */}
        <div className="p-5 max-h-80 overflow-y-auto space-y-3 custom-scrollbar">
          {checkpoints.map((c) => (
            <div key={c.id} className="p-3 bg-[#0e0f12] border border-[#232733] rounded-xl flex items-center justify-between">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-[#14161b] text-indigo-400 rounded-lg mt-0.5">
                  <Clock size={16} />
                </div>
                <div>
                  <div className="text-xs font-bold text-gray-200 flex items-center gap-2">
                    <span>{c.name}</span>
                    <span className="px-1.5 py-0.2 bg-indigo-600/20 text-indigo-300 rounded text-[9px] font-mono">{c.type}</span>
                  </div>
                  <div className="text-[11px] text-gray-500">{c.authorName} • {c.timestamp}</div>
                </div>
              </div>

              <button
                onClick={() => handleRestore(c.id)}
                className="px-2.5 py-1 bg-[#14161b] hover:bg-[#1f232d] text-gray-300 hover:text-indigo-400 border border-[#232733] rounded text-xs flex items-center gap-1 transition-colors"
              >
                {restoredId === c.id ? <Check size={12} className="text-emerald-400" /> : <RotateCcw size={12} />}
                <span>{restoredId === c.id ? 'Restored' : 'Restore'}</span>
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
