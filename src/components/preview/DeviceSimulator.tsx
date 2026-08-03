import React, { useState, useEffect } from 'react';
import * as Icons from 'lucide-react';
import { hotReloadEngine } from '../../runtime/server/HotReloadEngine';

export type DevicePreset = 'desktop' | 'laptop' | 'tablet' | 'phone';

interface DeviceSimulatorProps {
  initialUrl?: string;
}

export const DeviceSimulator: React.FC<DeviceSimulatorProps> = ({
  initialUrl = `${window.location.origin}/preview`,
}) => {
  const [url, setUrl] = useState(initialUrl);
  const [device, setDevice] = useState<DevicePreset>('desktop');
  const [isLandscape, setIsLandscape] = useState(false);
  const [zoom, setZoom] = useState(100);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [key, setKey] = useState(0);

  useEffect(() => {
    const cleanup = hotReloadEngine.onReload((newUrl) => {
      setUrl(newUrl);
      setKey((prev) => prev + 1);
    });
    return cleanup;
  }, []);

  const handleRefresh = () => {
    setKey((prev) => prev + 1);
  };

  const handleOpenExternal = () => {
    window.open(url, '_blank');
  };

  // Device Dimensions Mapping
  const getDimensions = () => {
    switch (device) {
      case 'phone':
        return isLandscape ? { width: '812px', height: '375px' } : { width: '375px', height: '812px' };
      case 'tablet':
        return isLandscape ? { width: '1024px', height: '768px' } : { width: '768px', height: '1024px' };
      case 'laptop':
        return { width: '1280px', height: '800px' };
      case 'desktop':
      default:
        return { width: '100%', height: '100%' };
    }
  };

  const dimensions = getDimensions();

  return (
    <div className="h-full w-full bg-[#0a0b0e] flex flex-col font-sans select-none overflow-hidden box-border">
      {/* Top Simulator Control Bar */}
      <div className="h-10 bg-[#14161d] border-b border-[#232733] px-3 flex items-center justify-between shrink-0 text-xs text-gray-300">
        {/* Device Switcher */}
        <div className="flex items-center gap-1.5 bg-[#181a20] border border-[#232733] rounded p-0.5">
          <button
            onClick={() => setDevice('desktop')}
            className={`px-2 py-1 rounded flex items-center gap-1.5 transition-colors cursor-pointer ${
              device === 'desktop' ? 'bg-indigo-600 text-white font-semibold' : 'text-gray-400 hover:text-white'
            }`}
          >
            <Icons.Monitor size={13} />
            <span>Desktop</span>
          </button>

          <button
            onClick={() => setDevice('laptop')}
            className={`px-2 py-1 rounded flex items-center gap-1.5 transition-colors cursor-pointer ${
              device === 'laptop' ? 'bg-indigo-600 text-white font-semibold' : 'text-gray-400 hover:text-white'
            }`}
          >
            <Icons.Laptop size={13} />
            <span>Laptop</span>
          </button>

          <button
            onClick={() => setDevice('tablet')}
            className={`px-2 py-1 rounded flex items-center gap-1.5 transition-colors cursor-pointer ${
              device === 'tablet' ? 'bg-indigo-600 text-white font-semibold' : 'text-gray-400 hover:text-white'
            }`}
          >
            <Icons.Tablet size={13} />
            <span>Tablet</span>
          </button>

          <button
            onClick={() => setDevice('phone')}
            className={`px-2 py-1 rounded flex items-center gap-1.5 transition-colors cursor-pointer ${
              device === 'phone' ? 'bg-indigo-600 text-white font-semibold' : 'text-gray-400 hover:text-white'
            }`}
          >
            <Icons.Smartphone size={13} />
            <span>Phone</span>
          </button>
        </div>

        {/* Orientation & Theme Controls */}
        <div className="flex items-center gap-2">
          {(device === 'phone' || device === 'tablet') && (
            <button
              onClick={() => setIsLandscape(!isLandscape)}
              className="px-2.5 py-1 rounded bg-[#181a20] hover:bg-[#232733] border border-[#232733] text-gray-300 flex items-center gap-1.5 text-mono transition-colors cursor-pointer"
            >
              <Icons.RotateCcw size={12} />
              <span>{isLandscape ? 'Landscape' : 'Portrait'}</span>
            </button>
          )}

          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="p-1.5 rounded bg-[#181a20] hover:bg-[#232733] border border-[#232733] text-gray-300 transition-colors cursor-pointer"
            title="Toggle Dark / Light Mode"
          >
            {isDarkMode ? <Icons.Moon size={13} className="text-indigo-400" /> : <Icons.Sun size={13} className="text-amber-400" />}
          </button>

          {/* Zoom Slider */}
          <div className="flex items-center gap-1.5 bg-[#181a20] border border-[#232733] px-2 py-1 rounded">
            <span className="text-[10px] text-gray-400 font-mono">Zoom:</span>
            <select
              value={zoom}
              onChange={(e) => setZoom(Number(e.target.value))}
              className="bg-transparent text-indigo-400 font-mono font-semibold outline-none cursor-pointer text-xs"
            >
              <option value={50}>50%</option>
              <option value={75}>75%</option>
              <option value={100}>100%</option>
              <option value={125}>125%</option>
            </select>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={handleRefresh}
            className="p-1.5 rounded bg-[#181a20] hover:bg-[#232733] border border-[#232733] text-gray-300 hover:text-white transition-colors cursor-pointer"
            title="Refresh Preview"
          >
            <Icons.RotateCw size={13} />
          </button>

          <button
            onClick={handleOpenExternal}
            className="px-2.5 py-1 rounded bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs flex items-center gap-1.5 shadow transition-colors cursor-pointer"
          >
            <Icons.ExternalLink size={12} />
            <span>Open in Browser</span>
          </button>
        </div>
      </div>

      {/* Frame Container */}
      <div className="flex-1 flex items-center justify-center p-6 overflow-auto bg-[#07080a]">
        <div
          className={`transition-all duration-300 flex flex-col shadow-2xl overflow-hidden ${
            device === 'phone' || device === 'tablet'
              ? 'border-[10px] border-[#1c1f2b] rounded-[36px] bg-[#14161d]'
              : 'border border-[#232733] rounded-xl bg-[#0e0f12]'
          }`}
          style={{
            width: dimensions.width,
            height: dimensions.height,
            transform: `scale(${zoom / 100})`,
            transformOrigin: 'center center',
          }}
        >
          {/* Simulated Browser URL Bar */}
          <div className="px-3 py-1.5 bg-[#14161d] border-b border-[#232733] flex items-center gap-2 shrink-0">
            <div className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
            </div>

            <div className="flex-1 bg-[#181a20] border border-[#232733] rounded px-2.5 py-0.5 flex items-center justify-between text-[11px] font-mono text-gray-300">
              <div className="flex items-center gap-1.5 text-emerald-400">
                <Icons.Lock size={10} />
                <span className="truncate">{url}</span>
              </div>
              <Icons.ShieldCheck size={12} className="text-emerald-400" />
            </div>
          </div>

          {/* Simulated App Viewport */}
          <div className={`flex-1 ${isDarkMode ? 'bg-gray-950 text-white' : 'bg-white text-gray-900'}`}>
            <iframe
              key={key}
              src={url}
              title="VisualStack Live Application Preview"
              className="w-full h-full border-none"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
