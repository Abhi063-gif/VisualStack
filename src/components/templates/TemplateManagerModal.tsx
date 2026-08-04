import React, { useState } from 'react';
import { Layout, Sparkles, X, Check, ArrowRight } from 'lucide-react';
import { projectTemplateEngine } from '../../templates/ProjectTemplateEngine';

export const TemplateManagerModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [appliedId, setAppliedId] = useState<string | null>(null);

  if (!isOpen) return null;

  const categories = ['All', 'Fullstack', 'Web', 'Enterprise'];
  const templates = projectTemplateEngine.getTemplates(selectedCategory === 'All' ? undefined : selectedCategory);

  const handleApply = (tmplId: string) => {
    projectTemplateEngine.applyTemplate(tmplId);
    setAppliedId(tmplId);
    setTimeout(() => {
      setAppliedId(null);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4 font-sans text-gray-100">
      <div className="bg-[#14161b] border border-[#232733] rounded-2xl w-full max-w-4xl max-h-[85vh] overflow-hidden shadow-2xl flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#232733] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-indigo-600/20 text-indigo-400 rounded-xl">
              <Layout size={20} />
            </div>
            <div>
              <h2 className="text-sm font-bold text-gray-100">Professional Project Template Gallery</h2>
              <p className="text-[11px] text-gray-400">Initialize fullstack applications with pre-built UI components & backend workflows</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-[#1f232d] text-gray-400 hover:text-white rounded">
            <X size={18} />
          </button>
        </div>

        {/* Category Tabs */}
        <div className="px-6 py-2.5 bg-[#0e0f12] border-b border-[#232733] flex items-center gap-2 text-xs">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-lg font-medium transition-colors ${
                selectedCategory === cat ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:text-gray-200 hover:bg-[#14161b]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Template Grid */}
        <div className="p-6 overflow-y-auto grid grid-cols-3 gap-4 custom-scrollbar">
          {templates.map((t) => (
            <div
              key={t.id}
              className="bg-[#0e0f12] border border-[#232733] hover:border-indigo-500/50 rounded-xl p-4 flex flex-col justify-between group transition-all"
            >
              <div>
                <div style={{ backgroundColor: `${t.thumbnailColor}20`, color: t.thumbnailColor }} className="p-3 rounded-lg w-fit mb-3">
                  <Sparkles size={20} />
                </div>
                <h3 className="text-xs font-bold text-gray-100 mb-1 group-hover:text-indigo-400 transition-colors">{t.title}</h3>
                <p className="text-[11px] text-gray-400 leading-relaxed mb-4">{t.description}</p>
              </div>

              <button
                onClick={() => handleApply(t.id)}
                className="w-full py-2 bg-[#14161b] group-hover:bg-indigo-600 text-gray-200 group-hover:text-white border border-[#232733] group-hover:border-indigo-500 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-sm"
              >
                {appliedId === t.id ? <Check size={14} className="text-emerald-400" /> : <ArrowRight size={14} />}
                <span>{appliedId === t.id ? 'Template Initialized!' : 'Use Template'}</span>
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
