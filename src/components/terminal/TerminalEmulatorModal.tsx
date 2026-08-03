import React, { useState } from 'react';
import * as Icons from 'lucide-react';
import { terminalService } from '../../runtime/terminal/TerminalService';

interface TerminalEmulatorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TerminalEmulatorModal: React.FC<TerminalEmulatorModalProps> = ({ isOpen, onClose }) => {
  const [history, setHistory] = useState<string[]>([
    'VisualStack Studio Local Terminal Emulator [Version 1.0.0]',
    'Type "help" for available commands.',
    '',
  ]);
  const [input, setInput] = useState('');

  if (!isOpen) return null;

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const currentInput = input;
      if (currentInput.trim().toLowerCase() === 'clear') {
        setHistory([]);
        setInput('');
        return;
      }

      const output = terminalService.executeCommand(currentInput);
      setHistory((prev) => [...prev, `$ ${currentInput}`, ...output]);
      setInput('');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-6 select-none">
      <div className="bg-[#0b0c10] border border-[#232733] rounded-2xl w-full max-w-4xl h-[70vh] shadow-2xl overflow-hidden flex flex-col box-border font-mono text-gray-200">
        {/* Header */}
        <div className="p-3 border-b border-[#232733] bg-[#14161d] flex items-center justify-between shrink-0 font-sans">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-emerald-600/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Icons.Terminal size={16} />
            </div>
            <div>
              <h2 className="text-xs font-bold text-white tracking-wide">DevTools Local Terminal Emulator</h2>
              <p className="text-[10px] text-gray-400 font-mono">Integrated Shell Environment</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-white rounded hover:bg-[#181a20] transition-colors cursor-pointer"
          >
            <Icons.X size={18} />
          </button>
        </div>

        {/* Terminal Screen */}
        <div className="flex-1 p-4 overflow-y-auto space-y-1 text-xs leading-relaxed text-emerald-400 custom-scrollbar bg-[#07080a]">
          {history.map((line, idx) => (
            <div key={idx} className={line.startsWith('$') ? 'text-indigo-400 font-bold' : 'text-gray-300'}>
              {line}
            </div>
          ))}

          {/* Input Prompt */}
          <div className="flex items-center gap-2 pt-2">
            <span className="text-emerald-400 font-bold">visualstack@local:~$</span>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1 bg-transparent outline-none text-white font-mono text-xs caret-emerald-400"
              autoFocus
            />
          </div>
        </div>
      </div>
    </div>
  );
};
