import React, { useState } from 'react';
import { Settings, Palette, Key, Shield, Globe, Cpu, Check, Save } from 'lucide-react';
import { designSystemManager, type DesignTokens } from '../designsystem/DesignSystemManager';
import { licenseManager } from '../enterprise/LicenseManager';
import { i18nEngine, type SupportedLanguage } from '../i18n/I18nEngine';

export const SettingsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'general' | 'theme' | 'license' | 'i18n'>('general');
  const [tokens, setTokens] = useState<DesignTokens>(designSystemManager.getTokens());
  const [currentLang, setCurrentLang] = useState<SupportedLanguage>(i18nEngine.getCurrentLanguage());
  const [savedToast, setSavedToast] = useState(false);

  const license = licenseManager.getLicenseInfo();

  const handleColorChange = (key: string, val: string) => {
    designSystemManager.updateColorToken(key, val);
    setTokens(designSystemManager.getTokens());
  };

  const handleLangChange = (lang: SupportedLanguage) => {
    i18nEngine.setLanguage(lang);
    setCurrentLang(lang);
  };

  const handleSave = () => {
    setSavedToast(true);
    setTimeout(() => setSavedToast(false), 2000);
  };

  return (
    <div className="flex-1 bg-[#0c0d12] flex flex-col font-sans text-gray-100 h-full overflow-hidden">
      {/* Top Header */}
      <div className="bg-[#14161b] border-b border-[#232733] px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-indigo-600/20 text-indigo-400 rounded-xl">
            <Settings size={22} />
          </div>
          <div>
            <h1 className="text-base font-bold text-gray-100">VisualStack Studio Settings & Enterprise Tokens</h1>
            <p className="text-xs text-gray-400">Configure design system colors, licenses, AI keys & workspace localization</p>
          </div>
        </div>

        <button
          onClick={handleSave}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-md transition-colors"
        >
          {savedToast ? <Check size={14} className="text-emerald-400" /> : <Save size={14} />}
          <span>{savedToast ? 'Settings Saved!' : 'Save Settings'}</span>
        </button>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar Nav */}
        <div className="w-56 bg-[#0e0f12] border-r border-[#232733] p-4 space-y-1 text-xs">
          {[
            { id: 'general', label: 'General & Editor', icon: Settings },
            { id: 'theme', label: 'Design Tokens & Theme', icon: Palette },
            { id: 'license', label: 'License & Enterprise', icon: Key },
            { id: 'i18n', label: 'Language & i18n', icon: Globe },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as any)}
                className={`w-full text-left px-3 py-2.5 rounded-xl font-semibold flex items-center gap-2.5 transition-colors ${
                  activeTab === item.id ? 'bg-indigo-600/20 text-indigo-400 border border-indigo-500/30' : 'text-gray-400 hover:text-gray-200 hover:bg-[#14161b]'
                }`}
              >
                <Icon size={16} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* Right Content Area */}
        <div className="flex-1 p-6 overflow-y-auto custom-scrollbar">
          {activeTab === 'theme' && (
            <div className="space-y-6 max-w-2xl">
              <div>
                <h3 className="text-sm font-bold text-gray-100 mb-1">Global Color Tokens</h3>
                <p className="text-xs text-gray-400 mb-4">Modify studio palette variables applied to all components and UI widgets</p>

                <div className="grid grid-cols-2 gap-4">
                  {Object.entries(tokens.colors).map(([k, v]) => (
                    <div key={k} className="p-3 bg-[#14161b] border border-[#232733] rounded-xl flex items-center justify-between">
                      <div>
                        <div className="text-xs font-bold text-gray-200 capitalize">{k}</div>
                        <div className="text-[10px] font-mono text-gray-500">{v}</div>
                      </div>
                      <input
                        type="color"
                        value={v}
                        onChange={(e) => handleColorChange(k, e.target.value)}
                        className="w-8 h-8 rounded border-none bg-transparent cursor-pointer"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'license' && (
            <div className="space-y-6 max-w-xl">
              <div className="p-5 bg-[#14161b] border border-[#232733] rounded-2xl space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Shield size={18} className="text-emerald-400" />
                    <h3 className="text-sm font-bold text-gray-100">{license.tier} Subscription Active</h3>
                  </div>
                  <span className="px-2.5 py-1 bg-emerald-500/20 text-emerald-400 rounded text-xs font-mono font-bold">PROD ACTIVATED</span>
                </div>

                <div className="text-xs text-gray-400 space-y-1">
                  <div><strong>Licensee:</strong> {license.licensee}</div>
                  <div><strong>License Key:</strong> <span className="font-mono text-indigo-400">{license.key}</span></div>
                  <div><strong>Seats:</strong> {license.maxSeats} Team Seats</div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'i18n' && (
            <div className="space-y-4 max-w-xl">
              <h3 className="text-sm font-bold text-gray-100">Select Studio Language</h3>
              <div className="grid grid-cols-2 gap-3 text-xs">
                {[
                  { code: 'en', name: 'English (US)' },
                  { code: 'hi', name: 'हिंदी (Hindi)' },
                  { code: 'es', name: 'Español (Spanish)' },
                  { code: 'fr', name: 'Français (French)' },
                  { code: 'de', name: 'Deutsch (German)' },
                  { code: 'ja', name: '日本語 (Japanese)' },
                  { code: 'zh', name: '中文 (Chinese)' },
                  { code: 'ar', name: 'العربية (Arabic)' },
                ].map((l) => (
                  <button
                    key={l.code}
                    onClick={() => handleLangChange(l.code as SupportedLanguage)}
                    className={`p-3 rounded-xl border text-left font-bold transition-all ${
                      currentLang === l.code ? 'bg-indigo-600 text-white border-indigo-500' : 'bg-[#14161b] text-gray-300 border-[#232733] hover:border-gray-600'
                    }`}
                  >
                    {l.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'general' && (
            <div className="space-y-4 max-w-xl text-xs text-gray-300">
              <div className="p-4 bg-[#14161b] border border-[#232733] rounded-xl space-y-2">
                <div className="font-bold text-gray-100 flex items-center gap-2"><Cpu size={16} className="text-indigo-400" /> Auto-Save & Synchronization</div>
                <p className="text-gray-400">Automatically saves design changes to local `.vstack` workspace checkpoints every 30 seconds.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
