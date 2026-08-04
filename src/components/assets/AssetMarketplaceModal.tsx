import React, { useState, useEffect } from 'react';
import { Image, Search, X, Sparkles, Download } from 'lucide-react';
import { assetMarketplace, type AssetItem } from '../../assets/AssetMarketplace';
import { notificationService } from '../../services/NotificationService';

export const AssetMarketplaceModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const [activeType, setActiveType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [assets, setAssets] = useState<AssetItem[]>(assetMarketplace.getAssets());

  useEffect(() => {
    const unsub = assetMarketplace.subscribe(() => {
      setAssets(assetMarketplace.getAssets());
    });
    return () => unsub();
  }, []);

  if (!isOpen) return null;

  const filtered = assets.filter((a) => {
    const matchesType = activeType === 'all' || a.type === activeType;
    const matchesSearch = a.name.toLowerCase().includes(searchQuery.toLowerCase()) || a.author.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesSearch;
  });

  const handleInsert = (asset: AssetItem) => {
    notificationService.success(`Inserted ${asset.name} onto active Visual Canvas!`);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4 font-sans text-gray-100">
      <div className="bg-[#14161b] border border-[#232733] rounded-3xl w-full max-w-4xl max-h-[85vh] overflow-hidden shadow-2xl flex flex-col">
        {/* Header */}
        <div className="px-6 py-5 border-b border-[#232733] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-gradient-to-tr from-emerald-600 to-teal-600 text-white rounded-2xl border border-emerald-400/30">
              <Image size={22} />
            </div>
            <div>
              <h2 className="text-sm font-bold text-gray-100">Asset & Media Marketplace</h2>
              <p className="text-[11px] text-gray-400">Lottie animations, Unsplash images, illustrations & Google Fonts</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 hover:bg-[#1f232d] text-gray-400 hover:text-white rounded-xl">
            <X size={18} />
          </button>
        </div>

        {/* Filter Bar */}
        <div className="px-6 py-3 bg-[#0e0f12] border-b border-[#232733] flex items-center justify-between gap-4">
          <div className="flex items-center gap-1.5 text-xs font-bold">
            {['all', 'illustration', 'lottie', 'font', 'image'].map((t) => (
              <button
                key={t}
                onClick={() => setActiveType(t)}
                className={`px-3.5 py-1.5 rounded-xl uppercase tracking-wider text-[10px] transition-colors ${
                  activeType === t ? 'bg-emerald-600 text-white shadow-md' : 'text-gray-400 hover:text-gray-200 hover:bg-[#14161b]'
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 bg-[#14161b] border border-[#232733] rounded-xl px-3 py-1.5 text-xs">
            <Search size={14} className="text-gray-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search assets..."
              className="bg-transparent text-gray-200 outline-none w-44 font-sans text-xs"
            />
          </div>
        </div>

        {/* Asset Grid */}
        <div className="p-6 overflow-y-auto grid grid-cols-3 gap-6 custom-scrollbar">
          {filtered.map((a) => (
            <div key={a.id} className="bg-[#0e0f12] border border-[#232733] rounded-2xl overflow-hidden flex flex-col justify-between group hover:border-emerald-500/50 transition-all shadow-md">
              <div className="h-32 bg-[#14161b] relative overflow-hidden flex items-center justify-center p-2">
                {a.type === 'image' || a.type === 'illustration' ? (
                  <img src={a.previewUrl} alt={a.name} className="w-full h-full object-cover rounded-lg group-hover:scale-105 transition-transform" />
                ) : (
                  <div className="text-center p-3">
                    <Sparkles size={28} className="text-emerald-400 mx-auto mb-2" />
                    <span className="font-mono text-[10px] text-gray-300 font-bold uppercase">{a.previewUrl}</span>
                  </div>
                )}
              </div>

              <div className="p-4 space-y-3">
                <div>
                  <h3 className="text-xs font-bold text-gray-100 truncate">{a.name}</h3>
                  <div className="text-[10px] text-gray-500 font-mono">by {a.author} • {a.category}</div>
                </div>

                <button
                  onClick={() => handleInsert(a)}
                  className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors shadow-md"
                >
                  <Download size={13} />
                  <span>Insert to Canvas</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
