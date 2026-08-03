import React, { useState } from 'react';
import { GitBranch, GitCommit, Upload, Download, Archive, Plus, Minus, Eye, X } from 'lucide-react';
import { gitManager, type GitDiffResult } from '../../deployment/git/GitManager';

export const VisualGitPanel: React.FC = () => {
  const [branch, setBranch] = useState(gitManager.getCurrentBranch());
  const [branches, setBranches] = useState(gitManager.getBranches());
  const [commitMessage, setCommitMessage] = useState('');
  const [isAmend, setIsAmend] = useState(false);
  const [files, setFiles] = useState(gitManager.getUncommittedFiles());
  const [history, setHistory] = useState(gitManager.getCommitHistory());
  const [stashes, setStashes] = useState(gitManager.getStashes());
  const [statusText, setStatusText] = useState<string | null>(null);
  
  const [newBranchModal, setNewBranchModal] = useState(false);
  const [newBranchName, setNewBranchName] = useState('');

  const [activeDiff, setActiveDiff] = useState<GitDiffResult | null>(null);

  const refreshState = () => {
    setFiles(gitManager.getUncommittedFiles());
    setHistory(gitManager.getCommitHistory());
    setStashes(gitManager.getStashes());
    setBranches(gitManager.getBranches());
    setBranch(gitManager.getCurrentBranch());
  };

  const handleStage = (path: string) => {
    gitManager.stageFile(path);
    refreshState();
  };

  const handleUnstage = (path: string) => {
    gitManager.unstageFile(path);
    refreshState();
  };

  const handleStageAll = () => {
    gitManager.stageAll();
    refreshState();
  };

  const handleUnstageAll = () => {
    gitManager.unstageAll();
    refreshState();
  };

  const handleCommit = () => {
    if (!commitMessage.trim()) return;
    gitManager.commit(commitMessage, isAmend);
    setCommitMessage('');
    setIsAmend(false);
    refreshState();
    setStatusText(isAmend ? 'Amended commit successfully!' : 'Committed successfully!');
    setTimeout(() => setStatusText(null), 3000);
  };

  const handlePush = () => {
    gitManager.push();
    setStatusText('Pushed to origin main!');
    setTimeout(() => setStatusText(null), 3000);
  };

  const handlePull = () => {
    gitManager.pull();
    setStatusText('Pulled latest changes from origin main!');
    setTimeout(() => setStatusText(null), 3000);
  };

  const handleCreateBranch = () => {
    if (!newBranchName.trim()) return;
    gitManager.createBranch(newBranchName);
    setNewBranchName('');
    setNewBranchModal(false);
    refreshState();
  };

  const handleCheckoutBranch = (targetBranch: string) => {
    gitManager.checkoutBranch(targetBranch);
    refreshState();
  };

  const handleStash = () => {
    gitManager.stash();
    refreshState();
  };

  const handlePopStash = () => {
    gitManager.popStash();
    refreshState();
  };

  const handleViewDiff = (path: string) => {
    const diff = gitManager.getDiff(path);
    setActiveDiff(diff);
  };

  const stagedFiles = files.filter((f) => f.staged);
  const unstagedFiles = files.filter((f) => !f.staged);

  return (
    <div className="w-full h-full bg-[#14161b] text-gray-200 p-4 flex flex-col gap-4 overflow-y-auto font-sans">
      {/* Top Toolbar */}
      <div className="flex items-center justify-between border-b border-[#232733] pb-3">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 font-bold text-sm text-indigo-400">
            <GitBranch size={18} />
            <span>Git Engine</span>
          </div>

          {/* Branch Selector Dropdown */}
          <div className="flex items-center gap-1.5 bg-[#0e0f12] border border-[#232733] rounded px-2 py-1 text-xs">
            <span className="text-gray-500 font-mono text-[11px]">Branch:</span>
            <select
              value={branch}
              onChange={(e) => handleCheckoutBranch(e.target.value)}
              className="bg-transparent text-indigo-400 font-mono outline-none cursor-pointer"
            >
              {branches.map((b) => (
                <option key={b} value={b} className="bg-[#14161b] text-gray-200">{b}</option>
              ))}
            </select>
          </div>

          <button
            onClick={() => setNewBranchModal(true)}
            className="px-2 py-1 bg-[#1f232d] hover:bg-indigo-600/30 text-indigo-400 rounded text-xs transition-colors flex items-center gap-1"
          >
            <Plus size={12} /> New Branch
          </button>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button onClick={handlePush} className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded text-xs font-semibold transition-colors">
            <Upload size={14} /> Push
          </button>
          <button onClick={handlePull} className="flex items-center gap-1.5 px-3 py-1.5 bg-[#1f232d] hover:bg-[#282d3a] text-gray-300 rounded text-xs font-medium transition-colors">
            <Download size={14} /> Pull
          </button>
        </div>
      </div>

      {statusText && (
        <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs rounded font-medium">
          {statusText}
        </div>
      )}

      {/* Main Grid: Staging Trees & Commit Form */}
      <div className="grid grid-cols-2 gap-4">
        {/* Left Column: Staged and Unstaged Files */}
        <div className="space-y-3">
          {/* Staged Changes */}
          <div className="bg-[#0e0f12] border border-[#232733] rounded-lg p-3 space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold text-emerald-400 uppercase tracking-wider">
              <span>Staged Changes ({stagedFiles.length})</span>
              {stagedFiles.length > 0 && (
                <button onClick={handleUnstageAll} className="text-gray-400 hover:text-gray-200 text-[11px] font-normal lowercase">
                  Unstage All
                </button>
              )}
            </div>
            {stagedFiles.length === 0 ? (
              <div className="text-xs text-gray-600 py-3 text-center">No staged changes.</div>
            ) : (
              <div className="space-y-1 max-h-32 overflow-y-auto">
                {stagedFiles.map((f) => (
                  <div key={f.path} className="flex items-center justify-between bg-[#14161b] px-2.5 py-1.5 rounded text-xs border border-[#232733]">
                    <span className="font-mono text-gray-300 truncate max-w-[200px]">{f.path}</span>
                    <div className="flex items-center gap-1.5">
                      <button onClick={() => handleViewDiff(f.path)} title="View Diff" className="p-1 hover:bg-[#1f232d] text-gray-400 hover:text-indigo-400 rounded">
                        <Eye size={12} />
                      </button>
                      <button onClick={() => handleUnstage(f.path)} title="Unstage File" className="p-1 hover:bg-rose-500/20 text-gray-400 hover:text-rose-400 rounded">
                        <Minus size={12} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Unstaged Changes */}
          <div className="bg-[#0e0f12] border border-[#232733] rounded-lg p-3 space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold text-amber-400 uppercase tracking-wider">
              <span>Unstaged Changes ({unstagedFiles.length})</span>
              <div className="flex items-center gap-3">
                {unstagedFiles.length > 0 && (
                  <button onClick={handleStageAll} className="text-gray-400 hover:text-gray-200 text-[11px] font-normal lowercase">
                    Stage All
                  </button>
                )}
                <button onClick={handleStash} className="text-indigo-400 hover:underline text-[11px] lowercase flex items-center gap-1">
                  <Archive size={11} /> Stash
                </button>
              </div>
            </div>
            {unstagedFiles.length === 0 ? (
              <div className="text-xs text-gray-600 py-3 text-center">Working tree clean.</div>
            ) : (
              <div className="space-y-1 max-h-32 overflow-y-auto">
                {unstagedFiles.map((f) => (
                  <div key={f.path} className="flex items-center justify-between bg-[#14161b] px-2.5 py-1.5 rounded text-xs border border-[#232733]">
                    <span className="font-mono text-gray-300 truncate max-w-[200px]">{f.path}</span>
                    <div className="flex items-center gap-1.5">
                      <button onClick={() => handleViewDiff(f.path)} title="View Diff" className="p-1 hover:bg-[#1f232d] text-gray-400 hover:text-indigo-400 rounded">
                        <Eye size={12} />
                      </button>
                      <button onClick={() => handleStage(f.path)} title="Stage File" className="p-1 hover:bg-emerald-500/20 text-gray-400 hover:text-emerald-400 rounded">
                        <Plus size={12} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Commit Form & Stash Manager */}
        <div className="space-y-3">
          {/* Commit Form */}
          <div className="bg-[#0e0f12] border border-[#232733] rounded-lg p-3 flex flex-col gap-2.5">
            <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Commit Message</div>
            <textarea
              value={commitMessage}
              onChange={(e) => setCommitMessage(e.target.value)}
              placeholder="e.g. feat(module-08): Add Visual Git Manager and diff viewer..."
              className="w-full h-24 bg-[#14161b] border border-[#232733] rounded p-2.5 text-xs text-gray-200 outline-none focus:border-indigo-500 resize-none font-mono"
            />
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-xs text-gray-400 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isAmend}
                  onChange={(e) => setIsAmend(e.target.checked)}
                  className="rounded border-[#232733] text-indigo-600 focus:ring-0"
                />
                <span>Amend previous commit</span>
              </label>

              <button
                onClick={handleCommit}
                disabled={!commitMessage.trim() || stagedFiles.length === 0}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded text-xs font-bold transition-colors flex items-center gap-1.5"
              >
                <GitCommit size={14} /> Commit Changes
              </button>
            </div>
          </div>

          {/* Stash Manager */}
          {stashes.length > 0 && (
            <div className="bg-[#0e0f12] border border-[#232733] rounded-lg p-3 space-y-2">
              <div className="flex items-center justify-between text-xs font-semibold text-indigo-400 uppercase tracking-wider">
                <span>Stash Queue ({stashes.length})</span>
                <button onClick={handlePopStash} className="text-xs text-indigo-400 hover:underline">
                  Pop Stash
                </button>
              </div>
              <div className="space-y-1">
                {stashes.map((s) => (
                  <div key={s.id} className="flex items-center justify-between bg-[#14161b] px-2.5 py-1.5 rounded text-xs border border-[#232733] font-mono text-gray-400">
                    <span>{s.id}: {s.message}</span>
                    <span className="text-[10px] text-gray-500">{new Date(s.date).toLocaleTimeString()}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Commit History Timeline Graph */}
      <div className="bg-[#0e0f12] border border-[#232733] rounded-lg p-3 space-y-2.5">
        <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Commit Log Timeline</div>
        <div className="space-y-1.5">
          {history.map((c) => (
            <div key={c.hash} className="flex items-center justify-between bg-[#14161b] p-2.5 rounded border border-[#232733] text-xs">
              <div className="flex items-center gap-2.5">
                <GitCommit size={16} className="text-indigo-400" />
                <span className="font-mono text-indigo-400 font-bold">{c.shortHash}</span>
                <span className="text-gray-200 font-medium">{c.message}</span>
              </div>
              <div className="text-[11px] text-gray-500 font-mono">{c.author} • {new Date(c.date).toLocaleTimeString()}</div>
            </div>
          ))}
        </div>
      </div>

      {/* New Branch Modal */}
      {newBranchModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-[#14161b] border border-[#232733] rounded-xl p-5 w-96 space-y-4">
            <div className="flex items-center justify-between border-b border-[#232733] pb-2">
              <h3 className="text-sm font-bold text-gray-200">Create New Branch</h3>
              <button onClick={() => setNewBranchModal(false)} className="text-gray-400 hover:text-gray-200"><X size={16} /></button>
            </div>
            <input
              type="text"
              value={newBranchName}
              onChange={(e) => setNewBranchName(e.target.value)}
              placeholder="e.g. feature/my-new-feature"
              className="w-full bg-[#0e0f12] border border-[#232733] rounded p-2 text-xs text-gray-200 outline-none focus:border-indigo-500 font-mono"
            />
            <div className="flex justify-end gap-2">
              <button onClick={() => setNewBranchModal(false)} className="px-3 py-1.5 text-xs text-gray-400 hover:text-gray-200">Cancel</button>
              <button onClick={handleCreateBranch} className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded">Create & Checkout</button>
            </div>
          </div>
        </div>
      )}

      {/* Diff Inspector Modal */}
      {activeDiff && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-[#14161b] border border-[#232733] rounded-xl p-5 w-[650px] max-h-[500px] flex flex-col gap-3">
            <div className="flex items-center justify-between border-b border-[#232733] pb-2">
              <h3 className="text-xs font-mono font-bold text-indigo-400">Diff: {activeDiff.filePath}</h3>
              <button onClick={() => setActiveDiff(null)} className="text-gray-400 hover:text-gray-200"><X size={16} /></button>
            </div>
            <div className="bg-[#0e0f12] p-3 rounded font-mono text-xs overflow-y-auto space-y-1 flex-1">
              {activeDiff.lines.map((l, i) => (
                <div
                  key={i}
                  className={`px-2 py-0.5 rounded ${
                    l.type === 'add' ? 'bg-emerald-500/10 text-emerald-400' : l.type === 'delete' ? 'bg-rose-500/10 text-rose-400' : 'text-gray-400'
                  }`}
                >
                  {l.content}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
