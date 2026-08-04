import React, { useState, useEffect } from 'react';
import { Package, Search, Star, Download, Check, X, ShieldCheck } from 'lucide-react';
import { pluginMarketplace, type MarketplacePlugin } from '../../marketplace/PluginMarketplace';

export const PluginMarketplaceModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [plugins, setPlugins] = useState<MarketplacePlugin[]>(pluginMarketplace.getPlugins());

  useEffect(() => {
    const unsub = pluginMarketplace.subscribe(() => {
      setPlugins(pluginMarketplace.getPlugins());
    });
    return () => unsub();
  }, []);

  if (!isOpen) return null;

  const categories = ['All', 'UI Kits & Figma', 'Editor Extensions', 'Backend Connectors', 'AI & Copilots', 'Themes', 'DevOps & Cloud'];

  const filtered = plugins.filter((p) => {
    const matchesCat = selectedCategory === 'All' || p.category === selectedCategory;
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const handleToggle = (id: string) => {
    pluginMarketplace.toggleInstall(id);
    setPlugins(pluginMarketplace.getPlugins());
  };

  return (
    <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4 font-sans text-gray-100">
      <div className="bg-[#14161b] border border-[#232733] rounded-2xl w-full max-w-4xl max-h-[85vh] overflow-hidden shadow-2xl flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#232733] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-indigo-600/20 text-indigo-400 rounded-xl">
              <Package size={20} />
            </div>
            <div>
              <h2 className="text-sm font-bold text-gray-100">VisualStack Plugin Marketplace SDK</h2>
              <p className="text-[11px] text-gray-400">Extend your studio with community & official SDK plugins</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-[#1f232d] text-gray-400 hover:text-white rounded">
            <X size={18} />
          </button>
        </div>

        {/* Search & Categories Bar */}
        <div className="px-6 py-3 bg-[#0e0f12] border-b border-[#232733] flex items-center justify-between gap-4">
          <div className="flex items-center gap-1.5 overflow-x-auto text-xs custom-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 rounded-lg font-medium whitespace-nowrap transition-colors ${
                  selectedCategory === cat ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:text-gray-200 hover:bg-[#14161b]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 bg-[#14161b] border border-[#232733] rounded-lg px-2.5 py-1 text-xs shrink-0">
            <Search size={14} className="text-gray-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search marketplace..."
              className="bg-transparent text-gray-200 outline-none w-36 font-sans text-xs"
            />
          </div>
        </div>

        {/* Plugin Grid */}
        <div className="p-6 overflow-y-auto grid grid-cols-2 gap-4 custom-scrollbar">
          {filtered.map((p) => (
            <div key={p.id} className="bg-[#0e0f12] border border-[#232733] rounded-xl p-4 flex flex-col justify-between space-y-3">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-1.5">
                    <h3 className="text-xs font-bold text-gray-100">{p.name}</h3>
                    <span title="Verified Official Plugin">
                      <ShieldCheck size={13} className="text-indigo-400" />
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-gray-500">v{p.version}</span>
                </div>

                <div className="text-[10px] text-indigo-400 font-medium mb-2">by {p.author} • {p.category}</div>
                <p className="text-[11px] text-gray-400 leading-relaxed">{p.description}</p>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-[#1a1d24]">
                <div className="flex items-center gap-3 text-[10px] text-gray-500 font-mono">
                  <span className="flex items-center gap-1 text-amber-400"><Star size={11} className="fill-amber-400" /> {p.rating}</span>
                  <span className="flex items-center gap-1"><Download size={11} /> {p.downloads.toLocaleString()}</span>
                </div>

                <button
                  onClick={() => handleToggle(p.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 transition-colors ${
                    p.isInstalled
                      ? 'bg-emerald-600/20 text-emerald-400 border border-emerald-500/40 hover:bg-rose-500/20 hover:text-rose-400 hover:border-rose-500/40'
                      : 'bg-indigo-600 hover:bg-indigo-500 text-white'
                  }`}
                >
                  {p.isInstalled ? <Check size={12} /> : <Download size={12} />}
                  <span>{p.isInstalled ? 'Installed' : 'Install'}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
