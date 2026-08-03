import React, { useState } from 'react';
import { GitBranch, GitCommit, Upload, Download, FileCode, Archive } from 'lucide-react';
import { gitManager } from '../../deployment/git/GitManager';

export const VisualGitPanel: React.FC = () => {
  const [branch] = useState(gitManager.getCurrentBranch());
  const [commitMessage, setCommitMessage] = useState('');
  const [files, setFiles] = useState(gitManager.getUncommittedFiles());
  const [history, setHistory] = useState(gitManager.getCommitHistory());
  const [statusText, setStatusText] = useState<string | null>(null);

  const handleCommit = () => {
    if (!commitMessage.trim()) return;
    gitManager.commit(commitMessage);
    setHistory(gitManager.getCommitHistory());
    setFiles([]);
    setCommitMessage('');
    setStatusText('Committed successfully!');
    setTimeout(() => setStatusText(null), 3000);
  };

  const handlePush = () => {
    gitManager.push();
    setStatusText('Pushed to remote successfully!');
    setTimeout(() => setStatusText(null), 3000);
  };

  return (
    <div className="w-full h-full bg-[#14161b] text-gray-200 p-4 flex flex-col gap-4 overflow-y-auto">
      {/* Header Bar */}
      <div className="flex items-center justify-between border-b border-[#232733] pb-3">
        <div className="flex items-center gap-2">
          <GitBranch className="text-indigo-400" size={18} />
          <span className="font-semibold text-sm">Git Workspace</span>
          <span className="px-2 py-0.5 bg-indigo-500/20 text-indigo-400 text-xs rounded-full font-mono">{branch}</span>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={handlePush} className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded text-xs transition-colors">
            <Upload size={14} /> Push
          </button>
          <button className="flex items-center gap-1.5 px-3 py-1.5 bg-[#1f232d] hover:bg-[#282d3a] text-gray-300 rounded text-xs transition-colors">
            <Download size={14} /> Pull
          </button>
        </div>
      </div>

      {statusText && (
        <div className="p-2 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs rounded">
          {statusText}
        </div>
      )}

      {/* Main Grid: Staged Changes & Commit Form */}
      <div className="grid grid-cols-2 gap-4">
        {/* Uncommitted Changes */}
        <div className="bg-[#0e0f12] border border-[#232733] rounded-lg p-3 flex flex-col gap-2">
          <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider flex items-center justify-between">
            <span>Staged / Unstaged Files ({files.length})</span>
            <button onClick={() => gitManager.stash()} className="text-indigo-400 hover:underline text-[11px] flex items-center gap-1">
              <Archive size={12} /> Stash
            </button>
          </div>
          {files.length === 0 ? (
            <div className="text-xs text-gray-500 py-6 text-center">Working tree clean. No uncommitted changes.</div>
          ) : (
            <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
              {files.map((f) => (
                <div key={f.path} className="flex items-center justify-between bg-[#14161b] p-2 rounded text-xs border border-[#232733]">
                  <span className="flex items-center gap-2 text-gray-300 font-mono">
                    <FileCode size={14} className="text-indigo-400" /> {f.path}
                  </span>
                  <span className="text-[10px] px-1.5 py-0.5 bg-amber-500/20 text-amber-400 rounded uppercase">{f.status}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Commit Form */}
        <div className="bg-[#0e0f12] border border-[#232733] rounded-lg p-3 flex flex-col gap-2">
          <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Commit Message</div>
          <textarea
            value={commitMessage}
            onChange={(e) => setCommitMessage(e.target.value)}
            placeholder="e.g. feat(auth): Add OAuth2 login pipeline..."
            className="w-full h-24 bg-[#14161b] border border-[#232733] rounded p-2 text-xs text-gray-200 outline-none focus:border-indigo-500 resize-none font-mono"
          />
          <button
            onClick={handleCommit}
            disabled={!commitMessage.trim() || files.length === 0}
            className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded text-xs font-medium transition-colors flex items-center justify-center gap-1.5"
          >
            <GitCommit size={14} /> Commit Changes
          </button>
        </div>
      </div>

      {/* Commit History Timeline */}
      <div className="bg-[#0e0f12] border border-[#232733] rounded-lg p-3 flex flex-col gap-2">
        <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Commit Log Graph</div>
        <div className="space-y-2">
          {history.map((c) => (
            <div key={c.hash} className="flex items-center justify-between bg-[#14161b] p-2.5 rounded border border-[#232733] text-xs">
              <div className="flex items-center gap-2">
                <GitCommit size={16} className="text-indigo-400" />
                <span className="font-mono text-indigo-400 font-semibold">{c.shortHash}</span>
                <span className="text-gray-200">{c.message}</span>
              </div>
              <div className="text-[11px] text-gray-500 font-mono">{c.author} • {new Date(c.date).toLocaleTimeString()}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
