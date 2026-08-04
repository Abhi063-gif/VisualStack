import React, { useState } from 'react';
import { Settings, Palette, Key, Shield, Globe, Cpu, Check, Sparkles, Code2 } from 'lucide-react';
import { designSystemManager, type DesignTokens } from '../designsystem/DesignSystemManager';
import { licenseManager, type LicenseInfo, type LicenseTier } from '../enterprise/LicenseManager';
import { i18nEngine, type SupportedLanguage } from '../i18n/I18nEngine';

export const SettingsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'editor' | 'theme' | 'license' | 'ai' | 'devops' | 'i18n'>('license');
  const [tokens, setTokens] = useState<DesignTokens>(designSystemManager.getTokens());
  const [currentLang, setCurrentLang] = useState<SupportedLanguage>(i18nEngine.getCurrentLanguage());
  const [license, setLicense] = useState<LicenseInfo>(licenseManager.getLicenseInfo());

  // Form State for License Purchase & Activation
  const [activationKeyInput, setActivationKeyInput] = useState('');
  const [purchaseToast, setPurchaseToast] = useState<string | null>(null);

  // Editor Settings State
  const [fontSize, setFontSize] = useState(14);
  const [tabSize, setTabSize] = useState(2);
  const [formatOnSave, setFormatOnSave] = useState(true);
  const [wordWrap, setWordWrap] = useState(true);

  // AI Keys State
  const [openaiKey, setOpenaiKey] = useState('');
  const [anthropicKey, setAnthropicKey] = useState('');

  const handleColorChange = (key: string, val: string) => {
    designSystemManager.updateColorToken(key, val);
    setTokens(designSystemManager.getTokens());
  };

  const handleLangChange = (lang: SupportedLanguage) => {
    i18nEngine.setLanguage(lang);
    setCurrentLang(lang);
  };

  const handlePurchasePlan = (tier: LicenseTier) => {
    const updated = licenseManager.purchaseLicense(tier, `${tier} Account`);
    setLicense(updated);
    setPurchaseToast(`Successfully purchased ${tier} Subscription License!`);
    setTimeout(() => setPurchaseToast(null), 3500);
  };

  const handleActivateKey = () => {
    if (!activationKeyInput.trim()) return;
    const ok = licenseManager.activateLicenseKey(activationKeyInput);
    if (ok) {
      setLicense(licenseManager.getLicenseInfo());
      setPurchaseToast('License Key Successfully Activated!');
      setActivationKeyInput('');
    } else {
      setPurchaseToast('Invalid License Key format. Key must start with VSTACK-');
    }
    setTimeout(() => setPurchaseToast(null), 3500);
  };

  return (
    <div className="flex-1 bg-[#0c0d12] flex flex-col font-sans text-gray-100 h-full overflow-hidden">
      {/* Top Header */}
      <div className="bg-[#14161b] border-b border-[#232733] px-8 py-5 flex items-center justify-between">
        <div className="flex items-center gap-3.5">
          <div className="p-3 bg-indigo-600/20 text-indigo-400 rounded-2xl border border-indigo-500/30 shadow-lg">
            <Settings size={26} />
          </div>
          <div>
            <h1 className="text-lg font-bold text-gray-100">VisualStack Studio Enterprise Settings</h1>
            <p className="text-xs text-gray-400">
              Configure editor preferences, license purchases, AI keys, design tokens & team subscriptions
            </p>
          </div>
        </div>

        {/* License Badge in Header */}
        <div className="flex items-center gap-2 px-3.5 py-1.5 bg-[#0e0f12] border border-[#232733] rounded-xl text-xs font-mono">
          <Shield size={14} className="text-emerald-400" />
          <span className="text-gray-400">Current Plan:</span>
          <span className="font-bold text-indigo-400 uppercase">{license.tier}</span>
        </div>
      </div>

      {purchaseToast && (
        <div className="bg-emerald-600/20 text-emerald-400 text-xs font-mono px-8 py-2.5 border-b border-emerald-500/30 flex items-center gap-2">
          <Check size={16} /> {purchaseToast}
        </div>
      )}

      <div className="flex flex-1 overflow-hidden">
        {/* Left Nav Bar */}
        <div className="w-64 bg-[#0e0f12] border-r border-[#232733] p-5 space-y-1 text-xs">
          {[
            { id: 'license', label: 'License & Subscription', icon: Key, badge: license.tier },
            { id: 'editor', label: 'Editor & Keybindings', icon: Code2 },
            { id: 'theme', label: 'Design Tokens & Theme', icon: Palette },
            { id: 'ai', label: 'AI Models & API Keys', icon: Sparkles },
            { id: 'devops', label: 'DevOps & Compiler', icon: Cpu },
            { id: 'i18n', label: 'Language & i18n', icon: Globe },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as any)}
                className={`w-full text-left px-3.5 py-3 rounded-xl font-bold flex items-center justify-between transition-all ${
                  activeTab === item.id
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'text-gray-400 hover:text-gray-200 hover:bg-[#14161b]'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon size={16} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="px-1.5 py-0.5 bg-[#0e0f12] text-indigo-300 rounded text-[9px] font-mono border border-indigo-500/30">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Right Content View */}
        <div className="flex-1 p-8 overflow-y-auto custom-scrollbar">
          {/* LICENSE & PURCHASE PANEL */}
          {activeTab === 'license' && (
            <div className="space-y-8 max-w-4xl">
              {/* Active License Details Card */}
              <div className="p-6 bg-[#14161b] border border-[#232733] rounded-2xl flex items-center justify-between shadow-lg">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Shield size={20} className="text-emerald-400" />
                    <h3 className="text-base font-bold text-gray-100">{license.tier} Plan Active</h3>
                  </div>
                  <div className="text-xs text-gray-400 space-y-1">
                    <div><strong>Licensed to:</strong> {license.licensee}</div>
                    <div><strong>License Key:</strong> <span className="font-mono text-indigo-400">{license.key}</span></div>
                    <div><strong>Seats & Validity:</strong> {license.maxSeats} Team Seats • {license.expiresAt}</div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-2xl font-bold text-white">${license.monthlyPriceUSD}<span className="text-xs text-gray-500 font-normal">/mo</span></div>
                  <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 rounded-full text-xs font-mono font-bold inline-block mt-2">
                    ACTIVE SUBSCRIPTION
                  </span>
                </div>
              </div>

              {/* Purchase Pricing Plans Panel */}
              <div>
                <h3 className="text-sm font-bold text-gray-100 mb-1">Select Subscription Plan to Purchase</h3>
                <p className="text-xs text-gray-400 mb-6">Upgrade your workspace to unlock multi-user collaboration, cloud deployments & custom plugins</p>

                <div className="grid grid-cols-3 gap-6">
                  {/* Community */}
                  <div className="bg-[#14161b] border border-[#232733] rounded-2xl p-6 flex flex-col justify-between space-y-4">
                    <div>
                      <div className="text-xs font-mono font-bold text-gray-400 uppercase tracking-wider mb-2">Community</div>
                      <div className="text-3xl font-extrabold text-white mb-2">$0 <span className="text-xs text-gray-500 font-normal">/forever</span></div>
                      <p className="text-xs text-gray-400 leading-relaxed mb-4">Single developer workspace, basic visual canvas & local preview runtime.</p>
                      <ul className="text-xs text-gray-300 space-y-2 font-mono">
                        <li>✓ 1 Active Developer Seat</li>
                        <li>✓ Local React / Node Runtime</li>
                        <li>✓ Basic Designer Components</li>
                      </ul>
                    </div>

                    <button
                      onClick={() => handlePurchasePlan('Community')}
                      className="w-full py-2.5 bg-[#0e0f12] hover:bg-[#1a1d24] text-gray-200 border border-[#232733] rounded-xl text-xs font-bold transition-colors"
                    >
                      Select Free Tier
                    </button>
                  </div>

                  {/* Professional */}
                  <div className="bg-[#14161b] border-2 border-indigo-500 rounded-2xl p-6 flex flex-col justify-between space-y-4 shadow-xl relative">
                    <span className="absolute -top-3 right-6 px-3 py-0.5 bg-indigo-600 text-white rounded-full text-[10px] font-bold uppercase tracking-wider">
                      Most Popular
                    </span>
                    <div>
                      <div className="text-xs font-mono font-bold text-indigo-400 uppercase tracking-wider mb-2">Professional</div>
                      <div className="text-3xl font-extrabold text-white mb-2">$29 <span className="text-xs text-gray-500 font-normal">/month</span></div>
                      <p className="text-xs text-gray-400 leading-relaxed mb-4">Small development teams, 5 seats, 1-click Vercel deployment & AI assistant.</p>
                      <ul className="text-xs text-gray-300 space-y-2 font-mono">
                        <li>✓ 5 Team Seats</li>
                        <li>✓ 1-Click Vercel / Netlify Deploy</li>
                        <li>✓ AI Copilot & Voice Dictation</li>
                        <li>✓ 50+ Plugin Marketplace Access</li>
                      </ul>
                    </div>

                    <button
                      onClick={() => handlePurchasePlan('Professional')}
                      className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold shadow-md transition-colors"
                    >
                      Purchase Professional ($29)
                    </button>
                  </div>

                  {/* Enterprise */}
                  <div className="bg-[#14161b] border border-[#232733] rounded-2xl p-6 flex flex-col justify-between space-y-4">
                    <div>
                      <div className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider mb-2">Enterprise</div>
                      <div className="text-3xl font-extrabold text-white mb-2">$99 <span className="text-xs text-gray-500 font-normal">/month</span></div>
                      <p className="text-xs text-gray-400 leading-relaxed mb-4">Unlimited seats, real-time multi-user collaboration, Docker & dedicated support.</p>
                      <ul className="text-xs text-gray-300 space-y-2 font-mono">
                        <li>✓ 50 Team Seats</li>
                        <li>✓ Live Multi-User Collaboration</li>
                        <li>✓ Custom Plugin SDK & SSO</li>
                        <li>✓ Docker & K8s Cluster Pipeline</li>
                      </ul>
                    </div>

                    <button
                      onClick={() => handlePurchasePlan('Enterprise')}
                      className="w-full py-2.5 bg-amber-500 hover:bg-amber-400 text-black font-bold rounded-xl text-xs shadow-md transition-colors"
                    >
                      Purchase Enterprise ($99)
                    </button>
                  </div>
                </div>
              </div>

              {/* Manual License Key Activation Card */}
              <div className="p-6 bg-[#14161b] border border-[#232733] rounded-2xl space-y-3">
                <h4 className="text-xs font-bold text-gray-200">Already Have an Enterprise License Key?</h4>
                <div className="flex items-center gap-3">
                  <input
                    type="text"
                    value={activationKeyInput}
                    onChange={(e) => setActivationKeyInput(e.target.value)}
                    placeholder="Enter License Key (e.g., VSTACK-ENT-XXXX-2026)..."
                    className="flex-1 bg-[#0e0f12] border border-[#232733] rounded-xl px-4 py-2.5 text-xs text-gray-200 font-mono outline-none focus:border-indigo-500"
                  />
                  <button
                    onClick={handleActivateKey}
                    className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold shadow-md transition-colors"
                  >
                    Activate Key
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* EDITOR & KEYBINDINGS PANEL */}
          {activeTab === 'editor' && (
            <div className="space-y-6 max-w-xl text-xs text-gray-300">
              <h3 className="text-sm font-bold text-gray-100">Code Editor & Monaco Preferences</h3>

              <div className="p-5 bg-[#14161b] border border-[#232733] rounded-2xl space-y-4">
                <div className="flex items-center justify-between">
                  <span>Font Size (px)</span>
                  <input
                    type="number"
                    value={fontSize}
                    onChange={(e) => setFontSize(Number(e.target.value))}
                    className="w-20 bg-[#0e0f12] border border-[#232733] rounded-lg px-2 py-1 text-center font-mono"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <span>Tab Indent Size</span>
                  <select
                    value={tabSize}
                    onChange={(e) => setTabSize(Number(e.target.value))}
                    className="bg-[#0e0f12] border border-[#232733] rounded-lg px-2 py-1 font-mono text-indigo-400"
                  >
                    <option value={2}>2 Spaces</option>
                    <option value={4}>4 Spaces</option>
                  </select>
                </div>

                <div className="flex items-center justify-between">
                  <span>Format on Save (Prettier)</span>
                  <input
                    type="checkbox"
                    checked={formatOnSave}
                    onChange={(e) => setFormatOnSave(e.target.checked)}
                    className="w-4 h-4 text-indigo-600 rounded"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <span>Word Wrap</span>
                  <input
                    type="checkbox"
                    checked={wordWrap}
                    onChange={(e) => setWordWrap(e.target.checked)}
                    className="w-4 h-4 text-indigo-600 rounded"
                  />
                </div>
              </div>
            </div>
          )}

          {/* DESIGN TOKENS PANEL */}
          {activeTab === 'theme' && (
            <div className="space-y-6 max-w-2xl">
              <div>
                <h3 className="text-sm font-bold text-gray-100 mb-1">Global Design System Tokens</h3>
                <p className="text-xs text-gray-400 mb-6">Modify studio CSS palette variables applied across all components</p>

                <div className="grid grid-cols-2 gap-4">
                  {Object.entries(tokens.colors).map(([k, v]) => (
                    <div key={k} className="p-3.5 bg-[#14161b] border border-[#232733] rounded-xl flex items-center justify-between">
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

          {/* AI MODELS & API KEYS */}
          {activeTab === 'ai' && (
            <div className="space-y-6 max-w-xl text-xs">
              <h3 className="text-sm font-bold text-gray-100">LLM Provider API Keys</h3>

              <div className="p-5 bg-[#14161b] border border-[#232733] rounded-2xl space-y-4">
                <div>
                  <label className="block font-bold text-gray-300 mb-1">OpenAI API Key (`OPENAI_API_KEY`)</label>
                  <input
                    type="password"
                    value={openaiKey}
                    onChange={(e) => setOpenaiKey(e.target.value)}
                    placeholder="sk-proj-..."
                    className="w-full bg-[#0e0f12] border border-[#232733] rounded-xl px-3 py-2 text-gray-200 font-mono"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-300 mb-1">Anthropic API Key (`ANTHROPIC_API_KEY`)</label>
                  <input
                    type="password"
                    value={anthropicKey}
                    onChange={(e) => setAnthropicKey(e.target.value)}
                    placeholder="sk-ant-..."
                    className="w-full bg-[#0e0f12] border border-[#232733] rounded-xl px-3 py-2 text-gray-200 font-mono"
                  />
                </div>
              </div>
            </div>
          )}

          {/* DEVOPS & COMPILER */}
          {activeTab === 'devops' && (
            <div className="space-y-6 max-w-xl text-xs">
              <h3 className="text-sm font-bold text-gray-100">Compiler & Docker Settings</h3>
              <div className="p-5 bg-[#14161b] border border-[#232733] rounded-2xl space-y-3 font-mono">
                <div>Build Output Directory: <span className="text-indigo-400">./dist</span></div>
                <div>Docker Daemon Socket: <span className="text-emerald-400">//./pipe/docker_engine</span></div>
              </div>
            </div>
          )}

          {/* LANGUAGE & I18N */}
          {activeTab === 'i18n' && (
            <div className="space-y-4 max-w-xl">
              <h3 className="text-sm font-bold text-gray-100">Studio Interface Language</h3>
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
                    className={`p-3.5 rounded-xl border text-left font-bold transition-all ${
                      currentLang === l.code ? 'bg-indigo-600 text-white border-indigo-500 shadow-md' : 'bg-[#14161b] text-gray-300 border-[#232733] hover:border-gray-600'
                    }`}
                  >
                    {l.name}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
