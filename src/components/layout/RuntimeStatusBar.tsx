import React, { useState, useEffect } from 'react';
import * as Icons from 'lucide-react';
import { runtimeManager } from '../../runtime/core/RuntimeManager';

export const RuntimeStatusBar: React.FC = () => {
  const [session, setSession] = useState(runtimeManager.getActiveSession());
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setSession(runtimeManager.getActiveSession());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleToggleRuntime = async () => {
    setIsProcessing(true);
    if (session?.status.state === 'running') {
      await runtimeManager.stopSession();
    } else {
      await runtimeManager.startSession(session?.status.targetFramework || 'React 19 + Express', session?.status.port || 3000);
    }
    setSession(runtimeManager.getActiveSession());
    setIsProcessing(false);
  };

  const handleRestart = async () => {
    setIsProcessing(true);
    await runtimeManager.restartSession();
    setSession(runtimeManager.getActiveSession());
    setIsProcessing(false);
  };

  const isRunning = session?.status.state === 'running';

  return (
    <div className="h-6 bg-[#0a0b0e] border-t border-[#1e222d] px-3 flex items-center justify-between text-[11px] font-mono text-gray-400 select-none z-40 shrink-0">
      {/* Left Items */}
      <div className="flex items-center gap-3">
        <button
          onClick={handleToggleRuntime}
          disabled={isProcessing}
          className={`flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-semibold transition-colors cursor-pointer ${
            isRunning
              ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-800/60 hover:bg-emerald-900/80'
              : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
          }`}
        >
          <span className={`w-1.5 h-1.5 rounded-full ${isRunning ? 'bg-emerald-400 animate-pulse' : 'bg-gray-500'}`} />
          <span>{isProcessing ? 'Processing...' : isRunning ? 'RUNNING' : 'STOPPED'}</span>
        </button>

        {isRunning && (
          <button
            onClick={handleRestart}
            disabled={isProcessing}
            className="p-1 hover:text-white text-gray-400 rounded hover:bg-[#181a20] transition-colors cursor-pointer"
            title="Restart Runtime Engine"
          >
            <Icons.RotateCw size={11} />
          </button>
        )}

        <div className="flex items-center gap-1.5 text-gray-300">
          <Icons.Cpu size={12} className="text-indigo-400" />
          <span>{session?.status.targetFramework || 'React 19 + Express'}</span>
        </div>

        <div className="flex items-center gap-1.5 text-gray-400">
          <Icons.Globe size={11} className="text-cyan-400" />
          <span>Port: <strong className="text-gray-200">{session?.status.port || 3000}</strong></span>
        </div>
      </div>

      {/* Right Metrics */}
      <div className="flex items-center gap-4 text-[10px]">
        <div className="flex items-center gap-1 text-gray-400">
          <Icons.Activity size={11} className="text-indigo-400" />
          <span>CPU: <strong className="text-indigo-300">{session?.status.cpuPercent || 1.8}%</strong></span>
        </div>

        <div className="flex items-center gap-1 text-gray-400">
          <Icons.HardDrive size={11} className="text-purple-400" />
          <span>RAM: <strong className="text-purple-300">{session?.status.memoryMb || 76.2} MB</strong></span>
        </div>

        <div className="flex items-center gap-1 text-gray-400">
          <Icons.GitBranch size={11} className="text-emerald-400" />
          <span className="text-emerald-300">main</span>
        </div>

        <div className="flex items-center gap-1 text-gray-400">
          <Icons.Database size={11} className="text-amber-400" />
          <span className="text-gray-300">Prisma SQLite</span>
        </div>
      </div>
    </div>
  );
};
