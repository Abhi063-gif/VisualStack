import React, { useState } from 'react';
import { Smile, Search, X } from 'lucide-react';
import { iconLibraryEngine, type IconItem } from '../../icons/IconLibraryEngine';
import { notificationService } from '../../services/NotificationService';

export const IconPickerModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const [selectedLib, setSelectedLib] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [icons, setIcons] = useState<IconItem[]>(iconLibraryEngine.searchIcons('', 'All'));

  if (!isOpen) return null;

  const libraries = ['All', 'Lucide', 'Material', 'Heroicons', 'FontAwesome', 'Bootstrap', 'Phosphor', 'Tabler'];

  const handleSearch = (q: string, lib = selectedLib) => {
    setSearchQuery(q);
    setIcons(iconLibraryEngine.searchIcons(q, lib as any));
  };

  const handleSelectIcon = (icon: IconItem) => {
    notificationService.success(`Selected Icon <${icon.name} /> from ${icon.library}!`);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4 font-sans text-gray-100">
      <div className="bg-[#14161b] border border-[#232733] rounded-3xl w-full max-w-3xl max-h-[80vh] overflow-hidden shadow-2xl flex flex-col">
        {/* Header */}
        <div className="px-6 py-5 border-b border-[#232733] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-gradient-to-tr from-purple-600 to-indigo-600 text-white rounded-2xl border border-purple-400/30">
              <Smile size={22} />
            </div>
            <div>
              <h2 className="text-sm font-bold text-gray-100">Enterprise Vector Icon Library</h2>
              <p className="text-[11px] text-gray-400">Search 20,000+ vector icons across 7 popular design icon sets</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 hover:bg-[#1f232d] text-gray-400 hover:text-white rounded-xl">
            <X size={18} />
          </button>
        </div>

        {/* Filters */}
        <div className="px-6 py-3 bg-[#0e0f12] border-b border-[#232733] flex items-center justify-between gap-4">
          <div className="flex items-center gap-1.5 overflow-x-auto text-xs custom-scrollbar">
            {libraries.map((lib) => (
              <button
                key={lib}
                onClick={() => {
                  setSelectedLib(lib);
                  handleSearch(searchQuery, lib);
                }}
                className={`px-3 py-1.5 rounded-xl font-bold text-[11px] transition-colors whitespace-nowrap ${
                  selectedLib === lib ? 'bg-purple-600 text-white shadow-md' : 'text-gray-400 hover:text-gray-200 hover:bg-[#14161b]'
                }`}
              >
                {lib}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 bg-[#14161b] border border-[#232733] rounded-xl px-3 py-1.5 text-xs shrink-0">
            <Search size={14} className="text-gray-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Search icons..."
              className="bg-transparent text-gray-200 outline-none w-36 font-sans text-xs"
            />
          </div>
        </div>

        {/* Icon Grid */}
        <div className="p-6 overflow-y-auto grid grid-cols-4 gap-4 custom-scrollbar">
          {icons.map((ic) => (
            <button
              key={ic.id}
              onClick={() => handleSelectIcon(ic)}
              className="p-4 bg-[#0e0f12] border border-[#232733] hover:border-purple-500 rounded-2xl flex flex-col items-center justify-center space-y-2 group transition-all"
            >
              <div className="p-2.5 bg-[#14161b] text-purple-400 group-hover:text-white group-hover:bg-purple-600 rounded-xl transition-all">
                <Smile size={22} />
              </div>
              <span className="text-xs font-bold text-gray-200 truncate w-full text-center">{ic.name}</span>
              <span className="text-[9px] font-mono text-gray-500">{ic.library}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
