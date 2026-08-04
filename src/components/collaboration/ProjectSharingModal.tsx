import React, { useState } from 'react';
import { Users, UserPlus, X, Copy, Check, Globe } from 'lucide-react';
import type { UserRole } from '../../collaboration/SessionManager';

export const ProjectSharingModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const [inviteEmail, setInviteEmail] = useState('');
  const [selectedRole, setSelectedRole] = useState<UserRole>('Editor');
  const [copiedLink, setCopiedLink] = useState(false);
  const [invitedMembers, setInvitedMembers] = useState([
    { id: 'm1', name: 'Alex Johnson (Owner)', email: 'alex@visualstack.io', role: 'Owner', color: '#6366f1' },
    { id: 'm2', name: 'Sarah Chen (Backend Lead)', email: 'sarah@visualstack.io', role: 'Developer', color: '#10b981' },
    { id: 'm3', name: 'Rohan Gupta (Designer)', email: 'rohan@visualstack.io', role: 'Editor', color: '#f59e0b' },
  ]);

  if (!isOpen) return null;

  const handleInvite = () => {
    if (!inviteEmail.trim()) return;
    setInvitedMembers((prev) => [
      ...prev,
      {
        id: `m_${Date.now()}`,
        name: inviteEmail.split('@')[0],
        email: inviteEmail,
        role: selectedRole,
        color: '#ec4899',
      },
    ]);
    setInviteEmail('');
  };

  const handleCopyLink = () => {
    const link = `${window.location.origin}/share/proj_${Date.now().toString(36)}?role=${selectedRole.toLowerCase()}`;
    navigator.clipboard.writeText(link);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4 font-sans text-gray-100">
      <div className="bg-[#14161b] border border-[#232733] rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl flex flex-col">
        {/* Header */}
        <div className="px-5 py-4 border-b border-[#232733] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-indigo-600/20 text-indigo-400 rounded-xl">
              <Users size={20} />
            </div>
            <div>
              <h2 className="text-sm font-bold text-gray-100">Share Project & Team Collaboration</h2>
              <p className="text-[11px] text-gray-400">Invite team members with role-based permissions</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-[#1f232d] text-gray-400 hover:text-white rounded">
            <X size={18} />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-5 space-y-4">
          {/* Invite Input */}
          <div className="flex items-center gap-2">
            <input
              type="email"
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
              placeholder="Enter team member email address..."
              className="flex-1 bg-[#0e0f12] border border-[#232733] rounded-lg px-3 py-2 text-xs text-gray-200 outline-none focus:border-indigo-500 font-sans"
            />
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value as UserRole)}
              className="bg-[#0e0f12] border border-[#232733] rounded-lg px-2 py-2 text-xs text-indigo-400 font-semibold outline-none"
            >
              <option value="Admin">Admin</option>
              <option value="Editor">Editor</option>
              <option value="Developer">Developer</option>
              <option value="Viewer">Viewer</option>
              <option value="Guest">Guest</option>
            </select>
            <button
              onClick={handleInvite}
              className="px-3 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-md"
            >
              <UserPlus size={14} /> Invite
            </button>
          </div>

          {/* Members List */}
          <div>
            <h4 className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">Team Members ({invitedMembers.length})</h4>
            <div className="space-y-2 max-h-48 overflow-y-auto custom-scrollbar">
              {invitedMembers.map((m) => (
                <div key={m.id} className="p-2.5 bg-[#0e0f12] border border-[#232733] rounded-xl flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div
                      style={{ backgroundColor: m.color }}
                      className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white uppercase shadow-sm"
                    >
                      {m.name.charAt(0)}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-gray-200">{m.name}</div>
                      <div className="text-[10px] text-gray-500">{m.email}</div>
                    </div>
                  </div>

                  <span className="px-2 py-0.5 bg-[#14161b] border border-[#232733] rounded text-[10px] font-mono text-indigo-400">
                    {m.role}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Link Generation */}
        <div className="p-4 bg-[#0e0f12] border-t border-[#232733] flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-gray-400 font-mono">
            <Globe size={14} className="text-emerald-400" />
            <span>Anyone with link can view</span>
          </div>

          <button
            onClick={handleCopyLink}
            className="px-3 py-1.5 bg-[#14161b] hover:bg-[#1a1d24] text-gray-200 border border-[#232733] rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            {copiedLink ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
            <span>{copiedLink ? 'Link Copied!' : 'Copy Share Link'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
