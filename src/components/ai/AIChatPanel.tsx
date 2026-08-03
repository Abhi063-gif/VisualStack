import React, { useState } from 'react';
import { Bot, Send, User, Sparkles, X, StopCircle, Copy, Check, Download, Trash2, Code, Cpu } from 'lucide-react';
import { providerRegistry } from '../../ai/providers/ProviderRegistry';
import { aiModelManager } from '../../ai/models/AIModelManager';
import { aiSecurityFilter } from '../../ai/security/AISecurityFilter';
import { contextEngine } from '../../ai/core/ContextEngine';
import { toolCallingEngine } from '../../ai/tools/ToolCallingEngine';
import { visualDesignAssistant } from '../../ai/services/VisualDesignAssistant';

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  content: string;
  timestamp: string;
  isStreaming?: boolean;
  toolCallResult?: string;
}

export const AIChatPanel: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg_welcome',
      sender: 'assistant',
      content: 'Hello! I am **VisualStack AI Assistant**. How can I help you build, refactor, or deploy your application today?',
      timestamp: new Date().toLocaleTimeString(),
    },
  ]);

  const [inputPrompt, setInputPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState('openai');
  const [selectedModel, setSelectedModel] = useState('gpt-4o');
  const [copiedMsgId, setCopiedMsgId] = useState<string | null>(null);

  const providers = providerRegistry.getAllProviders();
  const models = aiModelManager.getAllModels();

  if (!isOpen) return null;

  const handleSendMessage = async (promptOverride?: string) => {
    const text = (promptOverride || inputPrompt).trim();
    if (!text || isGenerating) return;

    const userMsg: ChatMessage = {
      id: `usr_${Date.now().toString(36)}`,
      sender: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputPrompt('');
    setIsGenerating(true);

    const assistantMsgId = `ast_${Date.now().toString(36)}`;
    const assistantMsg: ChatMessage = {
      id: assistantMsgId,
      sender: 'assistant',
      content: '',
      timestamp: new Date().toLocaleTimeString(),
      isStreaming: true,
    };

    setMessages((prev) => [...prev, assistantMsg]);

    const provider = providerRegistry.getProvider(selectedProvider);
    const sanitizedInput = aiSecurityFilter.sanitizePrompt(text);
    const systemContext = contextEngine.getSystemPromptWithContext(sanitizedInput);

    // Real AI tool detection and execution
    let toolResultText = '';
    const lowerText = text.toLowerCase();

    if (lowerText.includes('landing page') || lowerText.includes('landing')) {
      toolResultText = visualDesignAssistant.createLandingPage();
    } else if (lowerText.includes('login') || lowerText.includes('auth page')) {
      toolResultText = visualDesignAssistant.createLoginScreen();
    } else if (lowerText.includes('dashboard') || lowerText.includes('crm')) {
      toolResultText = visualDesignAssistant.createCRMDashboard();
    } else if (lowerText.includes('commit') || lowerText.includes('push')) {
      toolResultText = await toolCallingEngine.executeToolCall('git_commit', { message: text, isAmend: false });
    } else if (lowerText.includes('deploy')) {
      toolResultText = await toolCallingEngine.executeToolCall('deploy_app', { provider: 'vercel', environment: 'production' });
    } else if (lowerText.includes('container') || lowerText.includes('docker')) {
      toolResultText = await toolCallingEngine.executeToolCall('build_docker_container', { name: 'visualstack-app', ports: '8080:8080' });
    }

    if (provider) {
      await provider.Stream(
        {
          model: selectedModel,
          messages: [
            { role: 'system', content: systemContext },
            { role: 'user', content: sanitizedInput },
          ],
        },
        (chunk) => {
          setMessages((prev) =>
            prev.map((m) =>
              m.id === assistantMsgId
                ? {
                    ...m,
                    content: m.content + chunk.delta,
                    isStreaming: !chunk.finished,
                    toolCallResult: toolResultText || m.toolCallResult,
                  }
                : m
            )
          );
        }
      );
    }

    setIsGenerating(false);
  };

  const handleCopyMessage = (id: string, content: string) => {
    navigator.clipboard.writeText(content);
    setCopiedMsgId(id);
    setTimeout(() => setCopiedMsgId(null), 2000);
  };

  const handleExportChat = () => {
    const md = messages
      .map((m) => `### ${m.sender === 'user' ? 'User' : 'VisualStack AI'} (${m.timestamp})\n${m.content}\n`)
      .join('\n---\n');
    const blob = new Blob([md], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `chat_transcript_${Date.now()}.md`;
    a.click();
  };

  return (
    <div className="fixed inset-y-0 right-0 w-[460px] bg-[#0c0d12] border-l border-[#232733] shadow-2xl z-50 flex flex-col font-sans text-gray-100">
      {/* Top Header */}
      <div className="bg-[#14161b] border-b border-[#232733] px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 bg-indigo-600/20 text-indigo-400 rounded-lg">
            <Sparkles size={18} />
          </div>
          <div>
            <h2 className="text-xs font-bold text-gray-200 tracking-tight">VisualStack AI Engineering Assistant</h2>
            <p className="text-[10px] text-gray-400">Context-Aware AI Code, UI, Workflow & DevOps Copilot</p>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button onClick={handleExportChat} title="Export Chat Transcript" className="p-1.5 hover:bg-[#1f232d] text-gray-400 hover:text-indigo-400 rounded">
            <Download size={14} />
          </button>
          <button onClick={() => setMessages([])} title="Clear Chat" className="p-1.5 hover:bg-rose-500/20 text-gray-400 hover:text-rose-400 rounded">
            <Trash2 size={14} />
          </button>
          <button onClick={onClose} className="p-1.5 hover:bg-[#1f232d] text-gray-400 hover:text-white rounded">
            <X size={16} />
          </button>
        </div>
      </div>

      {/* Provider & Model Selectors Bar */}
      <div className="bg-[#0e0f12] border-b border-[#232733] px-4 py-2 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <Cpu size={13} className="text-indigo-400" />
          <select
            value={selectedProvider}
            onChange={(e) => setSelectedProvider(e.target.value)}
            className="bg-[#14161b] border border-[#232733] rounded px-2 py-1 text-[11px] text-gray-300 font-medium outline-none"
          >
            {providers.map((p) => (
              <option key={p.id} value={p.id}>{p.name} ({p.category})</option>
            ))}
          </select>

          <select
            value={selectedModel}
            onChange={(e) => setSelectedModel(e.target.value)}
            className="bg-[#14161b] border border-[#232733] rounded px-2 py-1 text-[11px] text-indigo-400 font-semibold outline-none"
          >
            {models.map((m) => (
              <option key={m.modelId} value={m.modelId}>{m.displayName}</option>
            ))}
          </select>
        </div>

        <span className="text-[10px] text-emerald-400 font-mono">100% Context Synced</span>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col gap-1 ${
              msg.sender === 'user' ? 'items-end' : 'items-start'
            }`}
          >
            <div className="flex items-center gap-1.5 text-[10px] text-gray-500 font-mono">
              {msg.sender === 'user' ? <User size={11} /> : <Bot size={11} className="text-indigo-400" />}
              <span>{msg.sender === 'user' ? 'You' : 'VisualStack AI'}</span>
              <span>• {msg.timestamp}</span>
            </div>

            <div
              className={`p-3 rounded-xl text-xs max-w-[90%] leading-relaxed whitespace-pre-wrap relative group ${
                msg.sender === 'user'
                  ? 'bg-indigo-600 text-white rounded-tr-none'
                  : 'bg-[#14161b] border border-[#232733] text-gray-200 rounded-tl-none'
              }`}
            >
              {msg.content}

              {msg.toolCallResult && (
                <div className="mt-2 p-2 bg-[#090a0f] border border-emerald-500/30 rounded font-mono text-[10px] text-emerald-400 flex items-center gap-1.5">
                  <Code size={12} /> {msg.toolCallResult}
                </div>
              )}

              {msg.sender === 'assistant' && !msg.isStreaming && (
                <button
                  onClick={() => handleCopyMessage(msg.id, msg.content)}
                  className="absolute top-2 right-2 p-1 text-gray-400 hover:text-white bg-[#0e0f12] border border-[#232733] rounded opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  {copiedMsgId === msg.id ? <Check size={11} className="text-emerald-400" /> : <Copy size={11} />}
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Prompt Suggestions Chips */}
      <div className="px-4 py-2 bg-[#0e0f12] border-t border-[#232733] flex items-center gap-2 overflow-x-auto custom-scrollbar text-[11px]">
        {[
          'Create Landing Page',
          'Create Login Page',
          'Create CRM Dashboard',
          'Deploy to Vercel',
          'Commit Changes to Git',
          'Build Docker Container',
        ].map((chip) => (
          <button
            key={chip}
            onClick={() => handleSendMessage(chip)}
            className="px-2.5 py-1 bg-[#14161b] hover:bg-indigo-600/20 text-gray-300 hover:text-indigo-300 rounded border border-[#232733] whitespace-nowrap transition-colors"
          >
            {chip}
          </button>
        ))}
      </div>

      {/* Input Form Footer */}
      <div className="p-3 bg-[#14161b] border-t border-[#232733] flex items-center gap-2">
        <input
          type="text"
          value={inputPrompt}
          onChange={(e) => setInputPrompt(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
          placeholder="Ask AI to design UI, build workflow, commit git, deploy..."
          className="flex-1 bg-[#0e0f12] border border-[#232733] rounded-lg px-3 py-2 text-xs text-gray-200 outline-none focus:border-indigo-500 font-sans"
        />

        {isGenerating ? (
          <button onClick={() => setIsGenerating(false)} className="p-2 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-xs">
            <StopCircle size={16} />
          </button>
        ) : (
          <button onClick={() => handleSendMessage()} className="p-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs shadow-md">
            <Send size={16} />
          </button>
        )}
      </div>
    </div>
  );
};
