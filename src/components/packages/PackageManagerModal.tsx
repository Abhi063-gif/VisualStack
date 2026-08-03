import React, { useState } from 'react';
import * as Icons from 'lucide-react';
import { packageManagerService, type PackageInfo } from '../../runtime/packages/PackageManagerService';

interface PackageManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PackageManagerModal: React.FC<PackageManagerModalProps> = ({ isOpen, onClose }) => {
  const [packages, setPackages] = useState<PackageInfo[]>(packageManagerService.getInstalledPackages());
  const [newPkgName, setNewPkgName] = useState('');
  const [isInstalling, setIsInstalling] = useState(false);

  if (!isOpen) return null;

  const handleInstall = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPkgName.trim()) return;
    setIsInstalling(true);

    setTimeout(() => {
      packageManagerService.installPackage(newPkgName.trim());
      setPackages(packageManagerService.getInstalledPackages());
      setNewPkgName('');
      setIsInstalling(false);
    }, 400);
  };

  const handleUninstall = (name: string) => {
    packageManagerService.uninstallPackage(name);
    setPackages(packageManagerService.getInstalledPackages());
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-6 select-none">
      <div className="bg-[#0e0f12] border border-[#232733] rounded-2xl w-full max-w-3xl h-[70vh] shadow-2xl overflow-hidden flex flex-col box-border text-gray-200">
        {/* Header */}
        <div className="p-4 border-b border-[#232733] bg-[#14161d] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <Icons.PackagePlus size={18} />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white tracking-wide">Dependency & Package Manager</h2>
              <p className="text-[11px] text-gray-400">Install and manage npm packages locally in VisualStack Studio</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-white rounded hover:bg-[#181a20] transition-colors cursor-pointer"
          >
            <Icons.X size={18} />
          </button>
        </div>

        {/* Install Input Form */}
        <div className="p-4 border-b border-[#232733] bg-[#11131c] shrink-0">
          <form onSubmit={handleInstall} className="flex items-center gap-3">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Enter npm package name (e.g. axios, dotenv, lodash)..."
                value={newPkgName}
                onChange={(e) => setNewPkgName(e.target.value)}
                className="w-full bg-[#181a20] border border-[#232733] rounded-lg px-3 py-2 text-xs text-white placeholder-gray-500 outline-none focus:border-indigo-500 font-mono"
              />
            </div>

            <button
              type="submit"
              disabled={isInstalling}
              className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs flex items-center gap-2 transition-colors cursor-pointer disabled:opacity-50"
            >
              <Icons.Download size={14} />
              <span>{isInstalling ? 'Installing...' : 'Install Package'}</span>
            </button>
          </form>
        </div>

        {/* Installed Packages List */}
        <div className="flex-1 p-4 overflow-y-auto space-y-2 custom-scrollbar">
          <h3 className="text-xs font-semibold uppercase text-gray-400 tracking-wider">Installed Dependencies ({packages.length})</h3>
          <div className="space-y-2">
            {packages.map((pkg) => (
              <div key={pkg.name} className="p-3 bg-[#14161d] border border-[#232733] rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Icons.Package size={16} className="text-indigo-400" />
                  <div>
                    <h4 className="text-xs font-bold text-white font-mono">{pkg.name} <span className="text-indigo-400 font-normal">{pkg.version}</span></h4>
                    <p className="text-[11px] text-gray-400">{pkg.description}</p>
                  </div>
                </div>

                <button
                  onClick={() => handleUninstall(pkg.name)}
                  className="px-2.5 py-1 rounded bg-red-950/80 text-red-400 hover:bg-red-900 border border-red-800/60 text-[11px] font-semibold transition-colors cursor-pointer"
                >
                  Uninstall
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
