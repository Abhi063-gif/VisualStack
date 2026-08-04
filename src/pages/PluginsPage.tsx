import React, { useState } from 'react';
import { Package, Search, Star, Download, Check, ShieldCheck } from 'lucide-react';
import { pluginMarketplace, type MarketplacePlugin } from '../marketplace/PluginMarketplace';

export const PluginsPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [plugins, setPlugins] = useState<MarketplacePlugin[]>(pluginMarketplace.getPlugins());

  const categories = ['All', 'UI Components', 'Backend Nodes', 'Integrations', 'AI Models', 'Themes'];

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
    <div className="flex-1 bg-[#0c0d12] flex flex-col font-sans text-gray-100 h-full overflow-hidden">
      {/* Header */}
      <div className="bg-[#14161b] border-b border-[#232733] px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-indigo-600/20 text-indigo-400 rounded-xl">
            <Package size={22} />
          </div>
          <div>
            <h1 className="text-base font-bold text-gray-100">VisualStack Plugin Marketplace & Extensions</h1>
            <p className="text-xs text-gray-400">Discover, install, and manage official & community plugins to extend your studio</p>
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="px-6 py-3 bg-[#0e0f12] border-b border-[#232733] flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 overflow-x-auto text-xs custom-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors ${
                selectedCategory === cat ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:text-gray-200 hover:bg-[#14161b]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 bg-[#14161b] border border-[#232733] rounded-lg px-3 py-1.5 text-xs shrink-0">
          <Search size={14} className="text-gray-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search plugins & integrations..."
            className="bg-transparent text-gray-200 outline-none w-48 font-sans text-xs"
          />
        </div>
      </div>

      {/* Grid Content */}
      <div className="flex-1 p-6 overflow-y-auto grid grid-cols-3 gap-5 custom-scrollbar">
        {filtered.map((p) => (
          <div key={p.id} className="bg-[#14161b] border border-[#232733] rounded-2xl p-5 flex flex-col justify-between space-y-4 hover:border-indigo-500/50 transition-all shadow-md">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-gray-100">{p.name}</h3>
                  <span title="Verified Official Plugin">
                    <ShieldCheck size={14} className="text-indigo-400" />
                  </span>
                </div>
                <span className="text-[11px] font-mono text-gray-500">v{p.version}</span>
              </div>

              <div className="text-xs text-indigo-400 font-semibold mb-2">by {p.author} • {p.category}</div>
              <p className="text-xs text-gray-400 leading-relaxed">{p.description}</p>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-[#232733]">
              <div className="flex items-center gap-3 text-xs text-gray-500 font-mono">
                <span className="flex items-center gap-1 text-amber-400"><Star size={12} className="fill-amber-400" /> {p.rating}</span>
                <span className="flex items-center gap-1"><Download size={12} /> {p.downloads.toLocaleString()}</span>
              </div>

              <button
                onClick={() => handleToggle(p.id)}
                className={`px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm ${
                  p.isInstalled
                    ? 'bg-emerald-600/20 text-emerald-400 border border-emerald-500/40 hover:bg-rose-500/20 hover:text-rose-400 hover:border-rose-500/40'
                    : 'bg-indigo-600 hover:bg-indigo-500 text-white'
                }`}
              >
                {p.isInstalled ? <Check size={14} /> : <Download size={14} />}
                <span>{p.isInstalled ? 'Installed' : 'Install'}</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PluginsPage;
