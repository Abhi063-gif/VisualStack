import React, { useState, useEffect } from 'react';
import { Search, Sparkles, Command, ArrowRight, X } from 'lucide-react';
import { toolCallingEngine } from '../../ai/tools/ToolCallingEngine';
import { aiPromptEngine } from '../../ai/services/AIPromptEngine';

export interface AICommandItem {
  id: string;
  title: string;
  category: 'ui' | 'backend' | 'git' | 'devops' | 'database';
  action: string;
  description: string;
}

export const AICommandPalette: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [executedToast, setExecutedToast] = useState<string | null>(null);

  const commands: AICommandItem[] = [
    { id: 'cmd_1', title: 'Generate E-Commerce Storefront (Light Theme)', category: 'ui', action: 'create_ecommerce_light', description: 'Creates E-Commerce Page, Navbar, Search, Sale Banner, Product Cards & Stripe Checkout Graph' },
    { id: 'cmd_2', title: 'Build Fullstack Auth Screen & Workflow', category: 'backend', action: 'create_auth', description: 'Creates Auth Page, login card, email/password inputs, and JWT Auth Graph' },
    { id: 'cmd_3', title: 'Generate CRM Dashboard Layout', category: 'ui', action: 'create_crm', description: 'Creates Dashboard Page, sidebar navigation, navbar, and analytics metric cards' },
    { id: 'cmd_4', title: 'Commit & Push Changes to Remote Git', category: 'git', action: 'git_sync', description: 'Stages all uncommitted files and pushes to origin main' },
    { id: 'cmd_5', title: 'Deploy Project to Vercel Production', category: 'devops', action: 'deploy_vercel', description: 'Runs 1-click cloud deployment pipeline to Vercel' },
    { id: 'cmd_6', title: 'Build & Run Docker Container', category: 'devops', action: 'docker_run', description: 'Generates multi-stage Dockerfile and starts container' },
  ];

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filtered = commands.filter((c) => c.title.toLowerCase().includes(query.toLowerCase()) || c.description.toLowerCase().includes(query.toLowerCase()));

  const handleExecuteCommand = async (cmd: AICommandItem) => {
    let result = '';
    if (cmd.action === 'create_ecommerce_light') {
      result = aiPromptEngine.executePrompt('make it an attractive e-commerce website landing page with light colors and theme');
    } else if (cmd.action === 'create_auth') {
      result = aiPromptEngine.executePrompt('create login auth page');
    } else if (cmd.action === 'create_crm') {
      result = aiPromptEngine.executePrompt('create CRM dashboard');
    } else if (cmd.action === 'git_sync') {
      result = await toolCallingEngine.executeToolCall('git_commit', { message: 'feat: AI Spotlight Command execute', isAmend: false });
    } else if (cmd.action === 'deploy_vercel') {
      result = await toolCallingEngine.executeToolCall('deploy_app', { provider: 'vercel', environment: 'production' });
    } else if (cmd.action === 'docker_run') {
      result = await toolCallingEngine.executeToolCall('build_docker_container', { name: 'visualstack-spotlight', ports: '8080:8080' });
    } else {
      result = aiPromptEngine.executePrompt(cmd.title);
    }

    setExecutedToast(result);
    setTimeout(() => {
      setExecutedToast(null);
      onClose();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-start justify-center pt-24 p-6 font-sans">
      <div className="bg-[#14161b] border border-[#232733] rounded-2xl w-full max-w-xl flex flex-col overflow-hidden shadow-2xl animate-fade-in">
        {/* Search Bar Input Header */}
        <div className="p-4 border-b border-[#232733] flex items-center gap-3">
          <Search size={18} className="text-indigo-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type an AI command (e.g. E-Commerce Light Theme, Login, Deploy, Push Git)..."
            className="w-full bg-transparent text-sm text-gray-200 placeholder-gray-500 outline-none font-sans"
            autoFocus
          />
          <span className="px-2 py-0.5 bg-[#0e0f12] text-gray-400 rounded text-[10px] font-mono border border-[#232733] flex items-center gap-1">
            <Command size={10} /> K
          </span>
          <button onClick={onClose} className="text-gray-400 hover:text-white"><X size={16} /></button>
        </div>

        {/* Executed Result Toast */}
        {executedToast && (
          <div className="p-3 bg-emerald-500/20 text-emerald-400 text-xs font-mono border-b border-emerald-500/30 flex items-center gap-2">
            <Sparkles size={14} /> {executedToast}
          </div>
        )}

        {/* Command List */}
        <div className="p-2 max-h-80 overflow-y-auto space-y-1 custom-scrollbar">
          {filtered.length === 0 ? (
            <div className="p-6 text-xs text-gray-500 text-center">No AI commands matching "{query}".</div>
          ) : (
            filtered.map((cmd) => (
              <button
                key={cmd.id}
                onClick={() => handleExecuteCommand(cmd)}
                className="w-full text-left p-3 rounded-xl hover:bg-indigo-600/10 border border-transparent hover:border-indigo-500/30 flex items-center justify-between transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-[#0e0f12] text-indigo-400 rounded-lg group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                    <Sparkles size={16} />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-gray-200 group-hover:text-white">{cmd.title}</div>
                    <div className="text-[11px] text-gray-400">{cmd.description}</div>
                  </div>
                </div>

                <ArrowRight size={14} className="text-gray-600 group-hover:text-indigo-400 transition-colors" />
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
