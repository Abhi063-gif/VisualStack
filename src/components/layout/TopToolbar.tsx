import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layers, Play, Rocket, Undo2, Redo2, Monitor, Tablet, Smartphone, Save, Download, Activity, Code2, Sparkles, Command, Users } from 'lucide-react';
import { Button } from '../ui/Button';
import { useHistoryStore } from '../../stores/HistoryStore';
import { useSelectionStore } from '../../stores/SelectionStore';
import { commandManager } from '../../core/commands/CommandManager';
import { notificationService } from '../../services/NotificationService';
import { cn } from '../../utils/cn';
import { CodeInspectorModal } from './CodeInspectorModal';
import { AIChatPanel } from '../ai/AIChatPanel';
import { AICommandPalette } from '../ai/AICommandPalette';
import { ProjectSharingModal } from '../collaboration/ProjectSharingModal';
import { CollaborationOverlay } from '../collaboration/CollaborationOverlay';
import { collaborationManager } from '../../collaboration/CollaborationManager';

export const TopToolbar: React.FC = () => {
  const navigate = useNavigate();
  const { canUndo, canRedo } = useHistoryStore();
  const { selectedComponentIds } = useSelectionStore();
  const [deviceMode, setDeviceMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [isCodeInspectorOpen, setIsCodeInspectorOpen] = useState(false);
  const [isAiChatOpen, setIsAiChatOpen] = useState(false);
  const [isAiCommandPaletteOpen, setIsAiCommandPaletteOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  const activeSessions = collaborationManager.sessions.getActiveSessions();

  const handleSave = () => {
    notificationService.success('Project saved (.vstack format)');
  };

  const handleExport = () => {
    setIsCodeInspectorOpen(true);
  };

  const handleRun = () => {
    notificationService.info('Starting local runtime preview server (React + Node.js)...');
  };

  const handleDeploy = () => {
    navigate('/deployment');
  };

  return (
    <>
      <CollaborationOverlay />

      <CodeInspectorModal
        isOpen={isCodeInspectorOpen}
        onClose={() => setIsCodeInspectorOpen(false)}
      />

      <AIChatPanel
        isOpen={isAiChatOpen}
        onClose={() => setIsAiChatOpen(false)}
      />

      <AICommandPalette
        isOpen={isAiCommandPaletteOpen}
        onClose={() => setIsAiCommandPaletteOpen(false)}
      />

      <ProjectSharingModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
      />

      <div className="h-9 bg-[#0e0f12] border-b border-[#232733] flex items-center justify-between px-3 text-xs text-gray-300 select-none z-20">
        {/* Left: Branding & Project Title */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 font-bold text-indigo-400">
            <Layers size={16} />
            <span>VisualStack Studio</span>
          </div>
          <span className="text-gray-600">|</span>
          <span className="text-gray-200 font-medium truncate max-w-[140px]">My Application</span>
          {selectedComponentIds.length > 0 && (
            <span className="bg-indigo-600/30 text-indigo-300 border border-indigo-500/40 px-1.5 py-0.5 rounded text-[10px] font-mono">
              {selectedComponentIds.length} Selected
            </span>
          )}
        </div>

        {/* Center: History Controls, Device Preview Switcher & FPS */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-0.5 border-r border-[#232733] pr-2">
            <Button
              variant="ghost"
              size="icon"
              disabled={!canUndo}
              onClick={() => commandManager.undo()}
              title="Undo (Ctrl+Z)"
            >
              <Undo2 size={13} />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              disabled={!canRedo}
              onClick={() => commandManager.redo()}
              title="Redo (Ctrl+Y)"
            >
              <Redo2 size={13} />
            </Button>
          </div>

          <div className="flex items-center gap-1 bg-[#14161b] p-0.5 rounded border border-[#232733]">
            <button
              onClick={() => setDeviceMode('desktop')}
              title="Desktop View (1440px)"
              className={cn('p-1 rounded cursor-pointer', deviceMode === 'desktop' ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:text-gray-200')}
            >
              <Monitor size={13} />
            </button>
            <button
              onClick={() => setDeviceMode('tablet')}
              title="Tablet View (768px)"
              className={cn('p-1 rounded cursor-pointer', deviceMode === 'tablet' ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:text-gray-200')}
            >
              <Tablet size={13} />
            </button>
            <button
              onClick={() => setDeviceMode('mobile')}
              title="Mobile View (375px)"
              className={cn('p-1 rounded cursor-pointer', deviceMode === 'mobile' ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:text-gray-200')}
            >
              <Smartphone size={13} />
            </button>
          </div>

          <div className="flex items-center gap-1 text-[11px] font-mono text-emerald-400 bg-[#14161b] px-2 py-0.5 rounded border border-[#232733]">
            <Activity size={12} />
            <span>60 FPS</span>
          </div>
        </div>

        {/* Right: Actions, Share Team & AI Triggers */}
        <div className="flex items-center gap-1.5">
          {/* Active Collaborators Presence Badge */}
          <button
            onClick={() => setIsShareModalOpen(true)}
            className="flex items-center gap-1 px-2 py-1 bg-[#14161b] hover:bg-[#1a1d24] text-emerald-400 border border-[#232733] rounded text-xs font-semibold transition-colors"
            title="Team Collaboration & Share Project"
          >
            <Users size={13} />
            <span>Share ({activeSessions.length})</span>
          </button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsAiCommandPaletteOpen(true)}
            className="gap-1 text-xs text-amber-400 hover:text-amber-300"
            title="Open AI Command Palette (Ctrl+K)"
          >
            <Command size={13} />
            <span>AI Palette</span>
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsAiChatOpen(!isAiChatOpen)}
            className="gap-1 text-xs text-indigo-400 hover:text-indigo-300 font-bold"
            title="Open AI Assistant Chat"
          >
            <Sparkles size={13} />
            <span>AI Copilot</span>
          </Button>

          <span className="text-gray-600">|</span>

          <Button variant="ghost" size="sm" onClick={handleSave} className="gap-1 text-xs">
            <Save size={13} />
            <span>Save</span>
          </Button>
          <Button variant="ghost" size="sm" onClick={() => setIsCodeInspectorOpen(true)} className="gap-1 text-xs text-indigo-400">
            <Code2 size={13} />
            <span>View Code</span>
          </Button>
          <Button variant="ghost" size="sm" onClick={handleExport} className="gap-1 text-xs">
            <Download size={13} />
            <span>Export</span>
          </Button>
          <span className="text-gray-600">|</span>
          <Button variant="secondary" size="sm" onClick={handleRun} className="gap-1.5 text-xs">
            <Play size={12} className="text-emerald-400 fill-emerald-400" />
            <span>Run</span>
          </Button>
          <Button variant="default" size="sm" onClick={handleDeploy} className="gap-1.5 text-xs bg-indigo-600 hover:bg-indigo-500 text-white">
            <Rocket size={12} />
            <span>Deploy</span>
          </Button>
        </div>
      </div>
    </>
  );
};
