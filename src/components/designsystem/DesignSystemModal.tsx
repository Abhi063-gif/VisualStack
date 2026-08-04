import React, { useState } from 'react';
import { Palette, X, Check } from 'lucide-react';
import { designSystemManager, type DesignTokens } from '../../designsystem/DesignSystemManager';

export const DesignSystemModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const [tokens, setTokens] = useState<DesignTokens>(designSystemManager.getTokens());
  const [savedToast, setSavedToast] = useState(false);

  if (!isOpen) return null;

  const handleColorChange = (key: string, colorHex: string) => {
    designSystemManager.updateColorToken(key, colorHex);
    setTokens(designSystemManager.getTokens());
  };

  const handleSave = () => {
    setSavedToast(true);
    setTimeout(() => {
      setSavedToast(false);
      onClose();
    }, 1000);
  };

  return (
    <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4 font-sans text-gray-100">
      <div className="bg-[#14161b] border border-[#232733] rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl flex flex-col">
        {/* Header */}
        <div className="px-5 py-4 border-b border-[#232733] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-indigo-600/20 text-indigo-400 rounded-xl">
              <Palette size={20} />
            </div>
            <div>
              <h2 className="text-sm font-bold text-gray-100">Design System Tokens & Theme Variables</h2>
              <p className="text-[11px] text-gray-400">Global brand colors, typography, border radii & spacing tokens</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-[#1f232d] text-gray-400 hover:text-white rounded">
            <X size={18} />
          </button>
        </div>

        {/* Color Tokens Grid */}
        <div className="p-5 space-y-4 max-h-80 overflow-y-auto custom-scrollbar">
          <h4 className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Brand & Palette Tokens</h4>

          <div className="grid grid-cols-2 gap-3">
            {Object.entries(tokens.colors).map(([key, val]) => (
              <div key={key} className="p-2.5 bg-[#0e0f12] border border-[#232733] rounded-xl flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-gray-200 capitalize">{key}</div>
                  <div className="text-[10px] font-mono text-gray-500">{val}</div>
                </div>
                <input
                  type="color"
                  value={val}
                  onChange={(e) => handleColorChange(key, e.target.value)}
                  className="w-7 h-7 rounded border-none bg-transparent cursor-pointer"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-[#0e0f12] border-t border-[#232733] flex items-center justify-between">
          <span className="text-[11px] text-gray-500 font-mono">Font: {tokens.typography.fontFamily.split(',')[0]}</span>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-md"
          >
            {savedToast ? <Check size={14} className="text-emerald-400" /> : <Palette size={14} />}
            <span>{savedToast ? 'Tokens Applied!' : 'Apply Tokens'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
