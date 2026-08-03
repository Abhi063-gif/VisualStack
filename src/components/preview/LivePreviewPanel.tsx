import React from 'react';
import * as Icons from 'lucide-react';
import { DeviceSimulator } from './DeviceSimulator';

interface LivePreviewPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LivePreviewPanel: React.FC<LivePreviewPanelProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const previewUrl = `${window.location.origin}/preview`;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 select-none">
      <div className="bg-[#0e0f12] border border-[#232733] rounded-2xl w-full max-w-6xl h-[88vh] shadow-2xl overflow-hidden flex flex-col box-border">
        {/* Top Panel Header */}
        <div className="p-3 border-b border-[#232733] bg-[#14161d] flex items-center justify-between shrink-0 text-white">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-emerald-600/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Icons.PlayCircle size={16} />
            </div>
            <div>
              <h3 className="text-xs font-bold tracking-wide">Live Application Preview Workspace</h3>
              <p className="text-[10px] text-gray-400 font-mono">{previewUrl} (Rendered Application Viewport)</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-white rounded hover:bg-[#181a20] transition-colors cursor-pointer"
          >
            <Icons.X size={18} />
          </button>
        </div>

        {/* Device Simulator Area */}
        <div className="flex-1 overflow-hidden">
          <DeviceSimulator initialUrl={previewUrl} />
        </div>
      </div>
    </div>
  );
};
