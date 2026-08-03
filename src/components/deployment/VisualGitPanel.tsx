import React, { useState } from 'react';
import { GitBranch, GitCommit, Upload, Download, Archive, Plus, Minus, Eye, X, Globe, Key, Check, Link } from 'lucide-react';
import { gitManager, type GitDiffResult } from '../../deployment/git/GitManager';

export const VisualGitPanel: React.FC = () => {
  const [branch, setBranch] = useState(gitManager.getCurrentBranch());
  const [branches, setBranches] = useState(gitManager.getBranches());
  const [remoteUrl, setRemoteUrl] = useState(gitManager.getRemoteUrl());
  const [isEditingRemote, setIsEditingRemote] = useState(false);
  const [patToken, setPatToken] = useState(gitManager.getAccessToken());
  const [showTokenModal, setShowTokenModal] = useState(false);

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
    setRemoteUrl(gitManager.getRemoteUrl());
    setPatToken(gitManager.getAccessToken());
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

  const handleSaveRemote = () => {
    gitManager.setRemoteUrl(remoteUrl);
    setIsEditingRemote(false);
    setStatusText(`Remote URL set to ${remoteUrl}`);
    setTimeout(() => setStatusText(null), 3000);
  };

  const handleSaveToken = () => {
    gitManager.setAccessToken(patToken);
    setShowTokenModal(false);
    setStatusText('GitHub Personal Access Token configured successfully!');
    setTimeout(() => setStatusText(null), 3000);
  };

  const handlePush = () => {
    gitManager.push();
    setStatusText(`Pushed commits to ${remoteUrl} (${branch})`);
    setTimeout(() => setStatusText(null), 3500);
  };

  const handlePull = () => {
    gitManager.pull();
    setStatusText(`Pulled latest changes from ${remoteUrl} (${branch})`);
    setTimeout(() => setStatusText(null), 3500);
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
    <div className="w-full h-full bg-[#0e1017] text-gray-100 p-6 flex flex-col gap-5 font-sans overflow-y-auto custom-scrollbar">
      {/* Top Remote Repository & Action Header */}
      <div className="bg-[#14161b] border border-[#232733] rounded-xl p-4 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-600/20 text-indigo-400 rounded-lg">
              <GitBranch size={20} />
            </div>
            <div>
              <h2 className="text-sm font-bold text-gray-200">Git Repository & Branch Control</h2>
              <p className="text-[11px] text-gray-400">Manage local commits, staging, branches, stashes, and remote sync.</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 bg-[#0e0f12] px-3 py-1.5 rounded-lg border border-[#232733]">
              <span className="text-xs text-gray-400 font-medium">Branch:</span>
              <select
                value={branch}
                onChange={(e) => handleCheckoutBranch(e.target.value)}
                className="bg-transparent text-xs text-indigo-400 font-bold outline-none cursor-pointer"
              >
                {branches.map((b) => (
                  <option key={b} value={b} className="bg-[#14161b] text-gray-200">{b}</option>
                ))}
              </select>
            </div>

            <button
              onClick={() => setNewBranchModal(true)}
              className="px-3 py-1.5 bg-[#1f232d] hover:bg-indigo-600/20 hover:text-indigo-400 text-gray-300 text-xs font-semibold rounded-lg border border-[#232733] transition-colors flex items-center gap-1.5"
            >
              <Plus size={14} /> New Branch
            </button>

            <button
              onClick={handlePush}
              className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 shadow-md"
            >
              <Upload size={14} /> Push
            </button>

            <button
              onClick={handlePull}
              className="px-3.5 py-1.5 bg-[#1f232d] hover:bg-[#282d3a] text-gray-200 text-xs font-bold rounded-lg border border-[#232733] transition-colors flex items-center gap-1.5"
            >
              <Download size={14} /> Pull
            </button>
          </div>
        </div>

        {/* Remote Repository URL Bar */}
        <div className="flex items-center justify-between bg-[#0e0f12] p-2.5 rounded-lg border border-[#232733] text-xs">
          <div className="flex items-center gap-2 flex-1">
            <Globe size={15} className="text-indigo-400" />
            <span className="text-gray-400 font-medium">Remote Origin URL:</span>
            {isEditingRemote ? (
              <input
                type="text"
                value={remoteUrl}
                onChange={(e) => setRemoteUrl(e.target.value)}
                placeholder="https://github.com/username/repository.git"
                className="bg-[#14161b] border border-[#232733] rounded px-3 py-1 text-xs text-gray-200 outline-none flex-1 font-mono"
              />
            ) : (
              <a href={remoteUrl} target="_blank" rel="noreferrer" className="font-mono text-indigo-400 hover:underline font-semibold flex items-center gap-1">
                {remoteUrl} <Link size={12} />
              </a>
            )}
          </div>

          <div className="flex items-center gap-2">
            {isEditingRemote ? (
              <button onClick={handleSaveRemote} className="px-3 py-1 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded flex items-center gap-1">
                <Check size={12} /> Save Remote
              </button>
            ) : (
              <button onClick={() => setIsEditingRemote(true)} className="px-2.5 py-1 bg-[#14161b] hover:bg-[#1f232d] text-gray-300 rounded text-xs">
                Edit Remote URL
              </button>
            )}

            <button
              onClick={() => setShowTokenModal(true)}
              className="px-2.5 py-1 bg-[#14161b] hover:bg-indigo-600/20 text-indigo-400 rounded text-xs flex items-center gap-1 border border-[#232733]"
            >
              <Key size={12} /> {patToken ? 'PAT Configured' : 'Configure PAT Token'}
            </button>
          </div>
        </div>
      </div>

      {/* Toast Notification */}
      {statusText && (
        <div className="bg-indigo-600/20 border border-indigo-500/40 text-indigo-300 px-4 py-2 rounded-lg text-xs font-medium animate-fade-in flex items-center justify-between">
          <span>{statusText}</span>
          <button onClick={() => setStatusText(null)} className="text-gray-400 hover:text-white"><X size={14} /></button>
        </div>
      )}

      {/* Main Git Workspace Grid */}
      <div className="grid grid-cols-12 gap-5 flex-1">
        {/* Left Side: Staging & Changes (7 cols) */}
        <div className="col-span-7 flex flex-col gap-5">
          {/* Staged Changes Card */}
          <div className="bg-[#14161b] border border-[#232733] rounded-xl p-4 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400" /> Staged Changes ({stagedFiles.length})
              </h3>
              {stagedFiles.length > 0 && (
                <button onClick={handleUnstageAll} className="text-[11px] text-gray-400 hover:text-rose-400 font-medium">
                  Unstage All
                </button>
              )}
            </div>

            {stagedFiles.length === 0 ? (
              <div className="text-xs text-gray-500 py-6 text-center italic bg-[#0e0f12] rounded-lg border border-[#232733]/50">
                No staged changes. Click (+) on unstaged files to stage changes for commit.
              </div>
            ) : (
              <div className="space-y-1.5">
                {stagedFiles.map((file) => (
                  <div key={file.path} className="flex items-center justify-between bg-[#0e0f12] px-3 py-2 rounded-lg border border-[#232733] text-xs">
                    <div className="flex items-center gap-2 truncate">
                      <span className="text-emerald-400 font-mono font-bold uppercase text-[10px]">{file.status.slice(0, 1)}</span>
                      <span className="font-mono text-gray-200 truncate">{file.path}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button onClick={() => handleViewDiff(file.path)} className="p-1 text-gray-400 hover:text-indigo-400" title="View Diff">
                        <Eye size={14} />
                      </button>
                      <button onClick={() => handleUnstage(file.path)} className="p-1 text-gray-400 hover:text-rose-400" title="Unstage File">
                        <Minus size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Unstaged Changes Card */}
          <div className="bg-[#14161b] border border-[#232733] rounded-xl p-4 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-400" /> Unstaged Changes ({unstagedFiles.length})
              </h3>
              <div className="flex items-center gap-3">
                {unstagedFiles.length > 0 && (
                  <button onClick={handleStash} className="text-[11px] text-gray-400 hover:text-indigo-400 font-medium flex items-center gap-1">
                    <Archive size={12} /> Stash
                  </button>
                )}
                {unstagedFiles.length > 0 && (
                  <button onClick={handleStageAll} className="text-[11px] text-indigo-400 hover:text-indigo-300 font-medium">
                    Stage All
                  </button>
                )}
              </div>
            </div>

            {unstagedFiles.length === 0 ? (
              <div className="text-xs text-gray-500 py-6 text-center italic bg-[#0e0f12] rounded-lg border border-[#232733]/50">
                Working tree clean. No uncommitted modifications detected.
              </div>
            ) : (
              <div className="space-y-1.5">
                {unstagedFiles.map((file) => (
                  <div key={file.path} className="flex items-center justify-between bg-[#0e0f12] px-3 py-2 rounded-lg border border-[#232733] text-xs">
                    <div className="flex items-center gap-2 truncate">
                      <span className="text-amber-400 font-mono font-bold uppercase text-[10px]">{file.status.slice(0, 1)}</span>
                      <span className="font-mono text-gray-200 truncate">{file.path}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button onClick={() => handleViewDiff(file.path)} className="p-1 text-gray-400 hover:text-indigo-400" title="View Diff">
                        <Eye size={14} />
                      </button>
                      <button onClick={() => handleStage(file.path)} className="p-1 text-gray-400 hover:text-emerald-400" title="Stage File">
                        <Plus size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Commit Form & Stash Manager (5 cols) */}
        <div className="col-span-5 flex flex-col gap-5">
          {/* Commit Message Box */}
          <div className="bg-[#14161b] border border-[#232733] rounded-xl p-4 flex flex-col gap-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-300 flex items-center gap-2">
              <GitCommit size={15} className="text-indigo-400" /> Commit Changes
            </h3>

            <textarea
              value={commitMessage}
              onChange={(e) => setCommitMessage(e.target.value)}
              placeholder="e.g. feat(module-08): Add Visual Git Engine and remote sync..."
              className="w-full bg-[#0e0f12] border border-[#232733] rounded-lg p-3 text-xs text-gray-200 placeholder-gray-600 outline-none focus:border-indigo-500 h-28 resize-none font-mono"
            />

            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 text-xs text-gray-400 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={isAmend}
                  onChange={(e) => setIsAmend(e.target.checked)}
                  className="rounded border-[#232733] bg-[#0e0f12] text-indigo-600 focus:ring-0"
                />
                Amend previous commit
              </label>

              <button
                onClick={handleCommit}
                disabled={stagedFiles.length === 0 && !isAmend}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5"
              >
                <GitCommit size={14} /> {isAmend ? 'Amend Commit' : 'Commit Changes'}
              </button>
            </div>
          </div>

          {/* Stash Queue Manager */}
          {stashes.length > 0 && (
            <div className="bg-[#14161b] border border-[#232733] rounded-xl p-4 flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                  <Archive size={14} /> Stash Queue ({stashes.length})
                </h3>
                <button onClick={handlePopStash} className="px-2.5 py-1 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 rounded text-xs font-semibold">
                  Pop Stash
                </button>
              </div>
              {stashes.map((st) => (
                <div key={st.id} className="bg-[#0e0f12] p-2 rounded border border-[#232733] text-xs font-mono flex items-center justify-between">
                  <span className="text-indigo-400 font-bold">{st.id}</span>
                  <span className="text-gray-300 truncate flex-1 mx-2">{st.message}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Commit History Timeline Graph */}
      <div className="bg-[#14161b] border border-[#232733] rounded-xl p-4 flex flex-col gap-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-gray-300 flex items-center gap-2">
          <GitCommit size={15} className="text-indigo-400" /> Commit Log Timeline ({history.length})
        </h3>

        {history.length === 0 ? (
          <div className="text-xs text-gray-500 py-6 text-center italic bg-[#0e0f12] rounded-lg border border-[#232733]/50">
            No commits recorded in this repository branch yet. Create your first commit above.
          </div>
        ) : (
          <div className="space-y-2">
            {history.map((commit) => (
              <div key={commit.hash} className="flex items-center justify-between bg-[#0e0f12] p-3 rounded-lg border border-[#232733] text-xs">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-indigo-400 font-bold">{commit.shortHash}</span>
                  <span className="text-gray-200 font-medium">{commit.message}</span>
                </div>
                <div className="flex items-center gap-3 font-mono text-[11px] text-gray-500">
                  <span>{commit.author}</span>
                  <span>{new Date(commit.date).toLocaleTimeString()}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Line-by-Line Diff Modal */}
      {activeDiff && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-6">
          <div className="bg-[#14161b] border border-[#232733] rounded-xl w-full max-w-3xl max-h-[80vh] flex flex-col overflow-hidden shadow-2xl">
            <div className="p-4 border-b border-[#232733] flex items-center justify-between">
              <span className="text-xs font-bold font-mono text-indigo-400">Diff: {activeDiff.filePath}</span>
              <button onClick={() => setActiveDiff(null)} className="text-gray-400 hover:text-white"><X size={16} /></button>
            </div>
            <div className="p-4 font-mono text-xs overflow-y-auto space-y-1 bg-[#090a0f] flex-1">
              {activeDiff.lines.map((line, idx) => (
                <div
                  key={idx}
                  className={`px-2 py-0.5 rounded ${
                    line.type === 'add' ? 'bg-emerald-500/10 text-emerald-400' : line.type === 'delete' ? 'bg-rose-500/10 text-rose-400' : 'text-gray-400'
                  }`}
                >
                  {line.content}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* GitHub Personal Access Token Modal */}
      {showTokenModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-6">
          <div className="bg-[#14161b] border border-[#232733] rounded-xl w-full max-w-md p-5 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#232733] pb-3">
              <h3 className="text-sm font-bold text-gray-200 flex items-center gap-2">
                <Key size={16} className="text-indigo-400" /> GitHub Credentials & Token
              </h3>
              <button onClick={() => setShowTokenModal(false)} className="text-gray-400 hover:text-white"><X size={16} /></button>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-gray-400 block">Personal Access Token (PAT)</label>
              <input
                type="password"
                value={patToken}
                onChange={(e) => setPatToken(e.target.value)}
                placeholder="ghp_16CharacterGitHubToken"
                className="w-full bg-[#0e0f12] border border-[#232733] rounded px-3 py-2 text-xs text-gray-200 font-mono outline-none focus:border-indigo-500"
              />
              <p className="text-[11px] text-gray-500">Required for authenticating push/pull operations to private GitHub repositories.</p>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-[#232733]">
              <button onClick={() => setShowTokenModal(false)} className="px-3 py-1.5 bg-[#0e0f12] text-gray-400 text-xs rounded hover:text-gray-200">
                Cancel
              </button>
              <button onClick={handleSaveToken} className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded">
                Save Credentials
              </button>
            </div>
          </div>
        </div>
      )}

      {/* New Branch Modal */}
      {newBranchModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-6">
          <div className="bg-[#14161b] border border-[#232733] rounded-xl w-full max-w-md p-5 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#232733] pb-3">
              <h3 className="text-sm font-bold text-gray-200">Create & Checkout Branch</h3>
              <button onClick={() => setNewBranchModal(false)} className="text-gray-400 hover:text-white"><X size={16} /></button>
            </div>

            <input
              type="text"
              value={newBranchName}
              onChange={(e) => setNewBranchName(e.target.value)}
              placeholder="e.g. feature/auth-flow"
              className="w-full bg-[#0e0f12] border border-[#232733] rounded px-3 py-2 text-xs text-gray-200 font-mono outline-none focus:border-indigo-500"
            />

            <div className="flex justify-end gap-2">
              <button onClick={() => setNewBranchModal(false)} className="px-3 py-1.5 bg-[#0e0f12] text-gray-400 text-xs rounded">Cancel</button>
              <button onClick={handleCreateBranch} className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded">Create & Checkout</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
