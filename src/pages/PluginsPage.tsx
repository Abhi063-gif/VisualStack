import React, { useState, useEffect } from 'react';
import { Package, Search, Star, Download, ShieldCheck, Trash2, Code2, Sparkles } from 'lucide-react';
import { pluginMarketplace, type MarketplacePlugin } from '../marketplace/PluginMarketplace';

export const PluginsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'marketplace' | 'sdk_docs'>('marketplace');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [filterType, setFilterType] = useState<'all' | 'installed' | 'featured' | 'popular'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [plugins, setPlugins] = useState<MarketplacePlugin[]>(pluginMarketplace.getPlugins());

  useEffect(() => {
    const unsub = pluginMarketplace.subscribe(() => {
      refreshList();
    });
    return () => unsub();
  }, []);

  const categories = ['All', 'UI Kits & Figma', 'Editor Extensions', 'Backend Connectors', 'AI & Copilots', 'Themes', 'DevOps & Cloud'];

  const refreshList = (cat = selectedCategory, filt = filterType) => {
    let list = pluginMarketplace.getPlugins(cat, filt);
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.author.toLowerCase().includes(q) ||
          p.tags.some((t) => t.includes(q))
      );
    }
    setPlugins(list);
  };

  const handleCategoryChange = (cat: string) => {
    setSelectedCategory(cat);
    refreshList(cat, filterType);
  };

  const handleFilterChange = (filt: 'all' | 'installed' | 'featured' | 'popular') => {
    setFilterType(filt);
    refreshList(selectedCategory, filt);
  };

  const handleSearchChange = (q: string) => {
    setSearchQuery(q);
    const list = pluginMarketplace.getPlugins(selectedCategory, filterType).filter(
      (p) =>
        p.name.toLowerCase().includes(q.toLowerCase()) ||
        p.description.toLowerCase().includes(q.toLowerCase()) ||
        p.author.toLowerCase().includes(q.toLowerCase()) ||
        p.tags.some((t) => t.includes(q.toLowerCase()))
    );
    setPlugins(list);
  };

  const handleToggle = (id: string) => {
    pluginMarketplace.toggleInstall(id);
    refreshList();
  };

  return (
    <div className="flex-1 bg-[#0c0d12] flex flex-col font-sans text-gray-100 h-full overflow-hidden">
      {/* Top Banner Header */}
      <div className="bg-[#14161b] border-b border-[#232733] px-8 py-5 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-3.5">
          <div className="p-3 bg-gradient-to-tr from-indigo-600 to-purple-600 text-white rounded-2xl border border-indigo-400/30 shadow-lg">
            <Package size={26} />
          </div>
          <div>
            <h1 className="text-lg font-bold text-gray-100 tracking-tight">VisualStack Extension Marketplace & Plugin SDK</h1>
            <p className="text-xs text-gray-400">
              50+ VS Code extensions, Figma community kits, AI copilots & cloud backend integrators
            </p>
          </div>
        </div>

        {/* View Tab Switcher & Stats */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1 bg-[#0e0f12] p-1 rounded-2xl border border-[#232733] text-xs font-bold">
            <button
              onClick={() => setActiveTab('marketplace')}
              className={`px-4 py-2 rounded-xl transition-all ${activeTab === 'marketplace' ? 'bg-indigo-600 text-white shadow-md' : 'text-gray-400 hover:text-gray-200'}`}
            >
              Marketplace ({pluginMarketplace.getTotalCount()})
            </button>
            <button
              onClick={() => setActiveTab('sdk_docs')}
              className={`px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 ${activeTab === 'sdk_docs' ? 'bg-indigo-600 text-white shadow-md' : 'text-gray-400 hover:text-gray-200'}`}
            >
              <Code2 size={14} />
              <span>Plugin SDK Docs</span>
            </button>
          </div>

          <div className="flex items-center gap-3 text-xs font-mono">
            <div className="px-3 py-2 bg-[#0e0f12] border border-[#232733] rounded-xl text-indigo-400">
              <span className="font-bold text-white">{pluginMarketplace.getInstalledCount()}</span> Installed
            </div>
          </div>
        </div>
      </div>

      {activeTab === 'marketplace' ? (
        <>
          {/* Filter Tabs & Search Bar */}
          <div className="px-8 py-3 bg-[#0e0f12] border-b border-[#232733] flex items-center justify-between gap-4">
            {/* Category Chips */}
            <div className="flex items-center gap-2 overflow-x-auto text-xs custom-scrollbar">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => handleCategoryChange(cat)}
                  className={`px-3.5 py-1.5 rounded-xl font-semibold whitespace-nowrap transition-all ${
                    selectedCategory === cat
                      ? 'bg-indigo-600 text-white shadow-md'
                      : 'text-gray-400 hover:text-gray-200 hover:bg-[#14161b]'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Secondary Filter Buttons & Search Input */}
            <div className="flex items-center gap-3 shrink-0">
              <div className="flex items-center gap-1 bg-[#14161b] p-1 rounded-xl border border-[#232733] text-xs">
                <button
                  onClick={() => handleFilterChange('all')}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-medium ${filterType === 'all' ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:text-white'}`}
                >
                  All
                </button>
                <button
                  onClick={() => handleFilterChange('installed')}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-medium ${filterType === 'installed' ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:text-white'}`}
                >
                  Installed
                </button>
                <button
                  onClick={() => handleFilterChange('popular')}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-medium ${filterType === 'popular' ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:text-white'}`}
                >
                  Popular
                </button>
                <button
                  onClick={() => handleFilterChange('featured')}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-medium ${filterType === 'featured' ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:text-white'}`}
                >
                  Top Rated
                </button>
              </div>

              <div className="flex items-center gap-2 bg-[#14161b] border border-[#232733] rounded-xl px-3 py-1.5 text-xs">
                <Search size={14} className="text-gray-500" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  placeholder="Search VS Code / Figma extensions..."
                  className="bg-transparent text-gray-200 outline-none w-56 font-sans text-xs"
                />
              </div>
            </div>
          </div>

          {/* Plugin Grid Area */}
          <div className="flex-1 p-8 overflow-y-auto grid grid-cols-3 gap-6 custom-scrollbar">
            {plugins.length === 0 ? (
              <div className="col-span-3 py-16 text-center text-gray-500 text-xs font-mono">
                No extensions found matching "{searchQuery}".
              </div>
            ) : (
              plugins.map((p) => (
                <div
                  key={p.id}
                  className={`bg-[#14161b] border rounded-2xl p-5 flex flex-col justify-between space-y-4 transition-all shadow-md group ${
                    p.isInstalled ? 'border-indigo-500/40 bg-[#161821]' : 'border-[#232733] hover:border-gray-600'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-bold text-gray-100 group-hover:text-indigo-400 transition-colors">{p.name}</h3>
                        <span title="Verified Official Extension">
                          <ShieldCheck size={14} className="text-indigo-400 shrink-0" />
                        </span>
                      </div>
                      <span className="text-[10px] font-mono text-gray-500">v{p.version}</span>
                    </div>

                    <div className="text-[11px] text-indigo-400 font-semibold mb-2">by {p.author} • {p.category}</div>
                    <p className="text-xs text-gray-400 leading-relaxed mb-3">{p.description}</p>

                    {/* Tags */}
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {p.tags.map((t) => (
                        <span key={t} className="px-2 py-0.5 bg-[#0e0f12] text-gray-400 rounded text-[10px] font-mono border border-[#232733]">
                          #{t}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-[#232733]">
                    <div className="flex items-center gap-3 text-xs text-gray-500 font-mono">
                      <span className="flex items-center gap-1 text-amber-400"><Star size={12} className="fill-amber-400" /> {p.rating}</span>
                      <span className="flex items-center gap-1"><Download size={12} /> {p.downloads.toLocaleString()}</span>
                    </div>

                    <button
                      onClick={() => handleToggle(p.id)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm ${
                        p.isInstalled
                          ? 'bg-rose-500/10 text-rose-400 border border-rose-500/30 hover:bg-rose-600 hover:text-white'
                          : 'bg-indigo-600 hover:bg-indigo-500 text-white'
                      }`}
                    >
                      {p.isInstalled ? <Trash2 size={13} /> : <Download size={13} />}
                      <span>{p.isInstalled ? 'Uninstall' : 'Install'}</span>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </>
      ) : (
        /* Plugin SDK Developer Documentation View */
        <div className="flex-1 p-8 overflow-y-auto custom-scrollbar">
          <div className="max-w-4xl mx-auto space-y-8 text-xs text-gray-300">
            <div className="p-6 bg-[#14161b] border border-[#232733] rounded-3xl space-y-4 shadow-xl">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-indigo-600/20 text-indigo-400 rounded-2xl border border-indigo-500/30">
                  <Sparkles size={24} />
                </div>
                <div>
                  <h2 className="text-base font-bold text-gray-100">VisualStack Plugin SDK Reference Guide</h2>
                  <p className="text-xs text-gray-400">Build custom visual UI widgets, backend workflow nodes, and theme presets</p>
                </div>
              </div>
            </div>

            <div className="p-6 bg-[#14161b] border border-[#232733] rounded-3xl space-y-4">
              <h3 className="text-sm font-bold text-gray-100">1. Initializing Plugin SDK</h3>
              <p className="text-gray-400">Import `VisualStackPluginSDK` and pass your plugin manifest details:</p>
              <pre className="p-4 bg-[#0e0f12] border border-[#232733] rounded-xl font-mono text-indigo-300 overflow-x-auto">
{`import { VisualStackPluginSDK } from '@visualstack/sdk';

const plugin = new VisualStackPluginSDK({
  id: 'com.acme.custom_chart',
  name: 'ACME Realtime Chart Widget',
  version: '1.0.0',
  author: 'ACME Corp',
  category: 'UI Kits & Figma',
});`}
              </pre>
            </div>

            <div className="p-6 bg-[#14161b] border border-[#232733] rounded-3xl space-y-4">
              <h3 className="text-sm font-bold text-gray-100">2. Registering Custom UI Component</h3>
              <pre className="p-4 bg-[#0e0f12] border border-[#232733] rounded-xl font-mono text-emerald-400 overflow-x-auto">
{`// Registers a new drag-and-drop widget in the Designer Palette
plugin.registerComponent('Realtime Line Chart', 'Analytics UI');`}
              </pre>
            </div>

            <div className="p-6 bg-[#14161b] border border-[#232733] rounded-3xl space-y-4">
              <h3 className="text-sm font-bold text-gray-100">3. Registering Custom IDE Command</h3>
              <pre className="p-4 bg-[#0e0f12] border border-[#232733] rounded-xl font-mono text-amber-400 overflow-x-auto">
{`// Binds custom keyboard shortcut or spotlight command
plugin.registerCommand('export_pdf_report', () => {
  console.log('Exporting canvas visual report as PDF...');
});`}
              </pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PluginsPage;
