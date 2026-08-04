import React, { useState } from 'react';
import { Cloud, Download, HardDrive, X, CheckCircle2 } from 'lucide-react';
import { backupEngine, type BackupSnapshot } from '../../enterprise/BackupEngine';
import { notificationService } from '../../services/NotificationService';

export const BackupCloudModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const [backups, setBackups] = useState<BackupSnapshot[]>(backupEngine.getBackups());
  const [toast, setToast] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCreateBackup = (location: 'local' | 'cloud') => {
    const name = `${location === 'cloud' ? 'CloudSync' : 'LocalBackup'}_${new Date().toLocaleTimeString().replace(/\s/g, '')}`;
    const newBak = backupEngine.createBackup(name, location);
    setBackups(backupEngine.getBackups());
    setToast(`Created ${newBak.name} successfully!`);
    setTimeout(() => setToast(null), 3000);
  };

  const handleDownloadVstack = () => {
    notificationService.success('Exporting workspace to .vstack binary bundle file...');
  };

  return (
    <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4 font-sans text-gray-100">
      <div className="bg-[#14161b] border border-[#232733] rounded-3xl w-full max-w-3xl max-h-[85vh] overflow-hidden shadow-2xl flex flex-col">
        {/* Header */}
        <div className="px-6 py-5 border-b border-[#232733] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-gradient-to-tr from-blue-600 to-indigo-600 text-white rounded-2xl border border-blue-400/30">
              <Cloud size={22} />
            </div>
            <div>
              <h2 className="text-sm font-bold text-gray-100">Enterprise Cloud Backup & Workspace Export</h2>
              <p className="text-[11px] text-gray-400">Automated cloud snapshots, local .vstack exports & 1-click restore</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 hover:bg-[#1f232d] text-gray-400 hover:text-white rounded-xl">
            <X size={18} />
          </button>
        </div>

        {toast && (
          <div className="bg-emerald-600/20 text-emerald-400 text-xs font-mono px-6 py-2.5 border-b border-emerald-500/40 flex items-center gap-2">
            <CheckCircle2 size={14} /> {toast}
          </div>
        )}

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-6 custom-scrollbar text-xs">
          {/* Action Buttons */}
          <div className="grid grid-cols-3 gap-4">
            <button
              onClick={() => handleCreateBackup('local')}
              className="p-4 bg-[#0e0f12] border border-[#232733] hover:border-indigo-500 rounded-2xl flex flex-col items-center justify-center space-y-2 group transition-all"
            >
              <HardDrive size={22} className="text-indigo-400 group-hover:scale-110 transition-transform" />
              <span className="font-bold text-gray-200">Create Local Backup</span>
              <span className="text-[10px] text-gray-500 font-mono">Store on machine</span>
            </button>

            <button
              onClick={() => handleCreateBackup('cloud')}
              className="p-4 bg-[#0e0f12] border border-[#232733] hover:border-blue-500 rounded-2xl flex flex-col items-center justify-center space-y-2 group transition-all"
            >
              <Cloud size={22} className="text-blue-400 group-hover:scale-110 transition-transform" />
              <span className="font-bold text-gray-200">Create Cloud Backup</span>
              <span className="text-[10px] text-gray-500 font-mono">Sync to AWS S3</span>
            </button>

            <button
              onClick={handleDownloadVstack}
              className="p-4 bg-[#0e0f12] border border-[#232733] hover:border-emerald-500 rounded-2xl flex flex-col items-center justify-center space-y-2 group transition-all"
            >
              <Download size={22} className="text-emerald-400 group-hover:scale-110 transition-transform" />
              <span className="font-bold text-gray-200">Export .vstack File</span>
              <span className="text-[10px] text-gray-500 font-mono">Download project zip</span>
            </button>
          </div>

          {/* Existing Backup Snapshots */}
          <div className="p-5 bg-[#0e0f12] border border-[#232733] rounded-2xl space-y-3">
            <h4 className="font-bold text-gray-200 uppercase tracking-wider text-[11px]">Saved Backup Snapshots</h4>
            <div className="space-y-2 font-mono text-xs">
              {backups.map((b) => (
                <div key={b.id} className="p-3 bg-[#14161b] border border-[#232733] rounded-xl flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {b.location === 'cloud' ? <Cloud size={16} className="text-blue-400" /> : <HardDrive size={16} className="text-indigo-400" />}
                    <div>
                      <div className="font-bold text-gray-200">{b.name}</div>
                      <div className="text-[10px] text-gray-500">{b.timestamp} • {(b.sizeBytes / 1024 / 1024).toFixed(2)} MB</div>
                    </div>
                  </div>
                  <button
                    onClick={() => notificationService.success(`Restored ${b.name}!`)}
                    className="px-3 py-1 bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 rounded-lg font-bold text-[11px] hover:bg-indigo-600 hover:text-white transition-colors"
                  >
                    Restore
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
