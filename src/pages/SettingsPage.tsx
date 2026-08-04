import React, { useState } from 'react';
import { Settings, Palette, Key, Shield, Globe, Cpu, Sparkles, Code2, CheckCircle2 } from 'lucide-react';
import { designSystemManager, type DesignTokens } from '../designsystem/DesignSystemManager';
import { licenseManager, type LicenseInfo, type LicenseTier } from '../enterprise/LicenseManager';
import { i18nEngine, type SupportedLanguage } from '../i18n/I18nEngine';

export const SettingsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'license' | 'editor' | 'theme' | 'ai' | 'devops' | 'i18n'>('license');
  const [tokens, setTokens] = useState<DesignTokens>(designSystemManager.getTokens());
  const [currentLang, setCurrentLang] = useState<SupportedLanguage>(i18nEngine.getCurrentLanguage());
  const [license, setLicense] = useState<LicenseInfo>(licenseManager.getLicenseInfo());

  // Form State for License Purchase & Activation
  const [activationKeyInput, setActivationKeyInput] = useState('');
  const [purchaseToast, setPurchaseToast] = useState<string | null>(null);

  // Editor Settings State
  const [fontSize, setFontSize] = useState(14);
  const [fontFamily, setFontFamily] = useState('JetBrains Mono');
  const [tabSize, setTabSize] = useState(2);
  const [formatOnSave, setFormatOnSave] = useState(true);
  const [wordWrap, setWordWrap] = useState(true);
  const [cursorBlinking, setCursorBlinking] = useState('smooth');

  // AI Keys State
  const [openaiKey, setOpenaiKey] = useState('sk-proj-********************************');
  const [anthropicKey, setAnthropicKey] = useState('sk-ant-********************************');
  const [geminiKey, setGeminiKey] = useState('AIzaSy********************************');
  const [ollamaHost, setOllamaHost] = useState('http://localhost:11434');

  // DevOps State
  const [gitName, setGitName] = useState('Developer');
  const [gitEmail, setGitEmail] = useState('dev@visualstack.io');
  const [buildDir, setBuildDir] = useState('./dist');
  const [dockerSocket, setDockerSocket] = useState('//./pipe/docker_engine');

  const handleColorChange = (key: string, val: string) => {
    designSystemManager.updateColorToken(key, val);
    setTokens(designSystemManager.getTokens());
  };

  const handleLangChange = (lang: SupportedLanguage) => {
    i18nEngine.setLanguage(lang);
    setCurrentLang(lang);
  };

  const handlePurchasePlan = (tier: LicenseTier) => {
    const updated = licenseManager.purchaseLicense(tier, `${tier} Developer`);
    setLicense(updated);
    setPurchaseToast(`🎉 Successfully upgraded & activated ${tier} Subscription License!`);
    setTimeout(() => setPurchaseToast(null), 4000);
  };

  const handleActivateKey = () => {
    if (!activationKeyInput.trim()) return;
    const ok = licenseManager.activateLicenseKey(activationKeyInput);
    if (ok) {
      setLicense(licenseManager.getLicenseInfo());
      setPurchaseToast('🎉 License Key Successfully Activated!');
      setActivationKeyInput('');
    } else {
      setPurchaseToast('❌ Invalid License Key format. Key must start with VSTACK-');
    }
    setTimeout(() => setPurchaseToast(null), 4000);
  };

  return (
    <div className="flex-1 bg-[#0c0d12] flex flex-col font-sans text-gray-100 h-full overflow-hidden">
      {/* Premium Top Navigation Header */}
      <div className="bg-[#14161b] border-b border-[#232733] px-8 py-5 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-gradient-to-tr from-indigo-600 to-purple-600 text-white rounded-2xl border border-indigo-400/30 shadow-lg">
            <Settings size={26} />
          </div>
          <div>
            <h1 className="text-lg font-bold text-gray-100 tracking-tight">VisualStack Enterprise IDE Settings & License Suite</h1>
            <p className="text-xs text-gray-400">Configure editor keybindings, license subscriptions, design tokens & compiler pipelines</p>
          </div>
        </div>

        {/* Current License Badge */}
        <div className="flex items-center gap-3 bg-[#0e0f12] border border-[#232733] rounded-2xl px-4 py-2 text-xs">
          <Shield size={16} className="text-emerald-400" />
          <div>
            <div className="text-[10px] text-gray-500 font-mono uppercase">Subscription Status</div>
            <div className="font-extrabold text-indigo-400 font-mono tracking-wider">{license.tier} PLAN ({license.maxSeats} SEATS)</div>
          </div>
        </div>
      </div>

      {/* Success Notification Banner */}
      {purchaseToast && (
        <div className="bg-emerald-600/20 text-emerald-400 text-xs font-mono px-8 py-3 border-b border-emerald-500/40 flex items-center gap-2 animate-fade-in">
          <CheckCircle2 size={16} /> {purchaseToast}
        </div>
      )}

      <div className="flex flex-1 overflow-hidden">
        {/* Left Vertical Navigation Menu */}
        <div className="w-72 bg-[#0e0f12] border-r border-[#232733] p-5 space-y-1.5 text-xs shrink-0">
          {[
            { id: 'license', label: 'License & Subscriptions', desc: 'Manage & purchase software tier', icon: Key, badge: license.tier },
            { id: 'editor', label: 'Editor & Keybindings', desc: 'Monaco font, tab size & shortcuts', icon: Code2 },
            { id: 'theme', label: 'Design Tokens & Theme', desc: 'Brand colors, typography & radius', icon: Palette },
            { id: 'ai', label: 'AI Models & API Keys', desc: 'OpenAI, Anthropic & local Ollama', icon: Sparkles },
            { id: 'devops', label: 'DevOps & Compiler', desc: 'Docker socket, Git & build targets', icon: Cpu },
            { id: 'i18n', label: 'Language & i18n', desc: 'Multi-language studio localization', icon: Globe },
          ].map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as any)}
                className={`w-full text-left p-3.5 rounded-2xl font-bold flex items-center justify-between transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white shadow-lg border border-indigo-400/40'
                    : 'text-gray-400 hover:text-gray-100 hover:bg-[#14161b]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon size={18} className={isActive ? 'text-white' : 'text-indigo-400'} />
                  <div>
                    <div className="text-xs font-bold">{item.label}</div>
                    <div className={`text-[10px] font-normal ${isActive ? 'text-indigo-200' : 'text-gray-500'}`}>{item.desc}</div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Right Main Content Body */}
        <div className="flex-1 p-8 overflow-y-auto custom-scrollbar">
          <div className="max-w-6xl mx-auto space-y-8">
            
            {/* 1. LICENSE & SUBSCRIPTION PURCHASE PANEL */}
            {activeTab === 'license' && (
              <div className="space-y-8">
                {/* Active License Header Card */}
                <div className="p-6 bg-[#14161b] border border-[#232733] rounded-3xl flex items-center justify-between shadow-xl relative overflow-hidden">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-emerald-500/20 text-emerald-400 rounded-2xl border border-emerald-500/30">
                      <Shield size={28} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h2 className="text-lg font-bold text-gray-100">{license.tier} License Active</h2>
                        <span className="px-2.5 py-0.5 bg-emerald-500/20 text-emerald-400 rounded-full text-[10px] font-mono font-bold">
                          LICENSED & VERIFIED
                        </span>
                      </div>
                      <div className="text-xs text-gray-400 space-y-1">
                        <div><strong>License Holder:</strong> {license.licensee}</div>
                        <div><strong>Serial Key:</strong> <span className="font-mono text-indigo-400 font-bold">{license.key}</span></div>
                        <div><strong>Capacity:</strong> {license.maxSeats} Developer Seats • Unlimited Projects & Workflows</div>
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-3xl font-black text-white">${license.monthlyPriceUSD}<span className="text-xs text-gray-500 font-normal">/month</span></div>
                    <div className="text-xs text-emerald-400 font-mono mt-1 font-bold">Expires: {license.expiresAt}</div>
                  </div>
                </div>

                {/* Pricing Plans Grid */}
                <div>
                  <div className="mb-6">
                    <h3 className="text-base font-bold text-gray-100">Purchase Software License & Upgrade Tier</h3>
                    <p className="text-xs text-gray-400">Choose a subscription plan to unlock team multi-user collaboration, cloud deployments, and custom plugin SDKs</p>
                  </div>

                  <div className="grid grid-cols-3 gap-6">
                    {/* Community Plan */}
                    <div className="bg-[#14161b] border border-[#232733] rounded-3xl p-6 flex flex-col justify-between space-y-6 hover:border-gray-600 transition-all shadow-lg">
                      <div>
                        <div className="text-xs font-mono font-bold text-gray-400 uppercase tracking-wider mb-2">Community Free</div>
                        <div className="text-3xl font-black text-white mb-2">$0 <span className="text-xs text-gray-500 font-normal">/forever</span></div>
                        <p className="text-xs text-gray-400 leading-relaxed mb-6">Single developer workspace for learning, building small visual applications, and local runtime previewing.</p>

                        <div className="space-y-2.5 text-xs text-gray-300 font-mono">
                          <div className="flex items-center gap-2"><CheckCircle2 size={14} className="text-emerald-400" /> 1 Local Developer Seat</div>
                          <div className="flex items-center gap-2"><CheckCircle2 size={14} className="text-emerald-400" /> Local React & Node.js Preview</div>
                          <div className="flex items-center gap-2"><CheckCircle2 size={14} className="text-emerald-400" /> Basic UI Component Library</div>
                          <div className="flex items-center gap-2 text-gray-600">✕ Multi-user live collaboration</div>
                          <div className="flex items-center gap-2 text-gray-600">✕ 1-Click Vercel / Netlify Deploy</div>
                        </div>
                      </div>

                      <button
                        onClick={() => handlePurchasePlan('Community')}
                        className="w-full py-3 bg-[#0e0f12] hover:bg-[#1a1d24] text-gray-200 border border-[#232733] rounded-xl text-xs font-bold transition-all"
                      >
                        Select Free Community Tier
                      </button>
                    </div>

                    {/* Professional Plan */}
                    <div className="bg-[#14161b] border-2 border-indigo-500 rounded-3xl p-6 flex flex-col justify-between space-y-6 shadow-2xl relative">
                      <span className="absolute -top-3 right-6 px-3.5 py-1 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-full text-[10px] font-extrabold uppercase tracking-wider shadow-md">
                        Recommended
                      </span>
                      <div>
                        <div className="text-xs font-mono font-bold text-indigo-400 uppercase tracking-wider mb-2">Professional Studio</div>
                        <div className="text-3xl font-black text-white mb-2">$29 <span className="text-xs text-gray-500 font-normal">/month</span></div>
                        <p className="text-xs text-gray-400 leading-relaxed mb-6">For startups and small development teams requiring AI assistance, Vercel deployments, and 50+ plugins.</p>

                        <div className="space-y-2.5 text-xs text-gray-300 font-mono">
                          <div className="flex items-center gap-2"><CheckCircle2 size={14} className="text-emerald-400" /> 5 Team Seats</div>
                          <div className="flex items-center gap-2"><CheckCircle2 size={14} className="text-emerald-400" /> 1-Click Vercel & Netlify Deploy</div>
                          <div className="flex items-center gap-2"><CheckCircle2 size={14} className="text-emerald-400" /> Full AI Assistant & Voice Dictation</div>
                          <div className="flex items-center gap-2"><CheckCircle2 size={14} className="text-emerald-400" /> 50+ VS Code & Figma Extensions</div>
                          <div className="flex items-center gap-2"><CheckCircle2 size={14} className="text-emerald-400" /> Threaded Comments & Versioning</div>
                        </div>
                      </div>

                      <button
                        onClick={() => handlePurchasePlan('Professional')}
                        className="w-full py-3 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white rounded-xl text-xs font-extrabold shadow-lg transition-all"
                      >
                        Purchase Professional ($29)
                      </button>
                    </div>

                    {/* Enterprise Plan */}
                    <div className="bg-[#14161b] border border-[#232733] rounded-3xl p-6 flex flex-col justify-between space-y-6 hover:border-amber-500/50 transition-all shadow-lg">
                      <div>
                        <div className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider mb-2">Enterprise Edition</div>
                        <div className="text-3xl font-black text-white mb-2">$99 <span className="text-xs text-gray-500 font-normal">/month</span></div>
                        <p className="text-xs text-gray-400 leading-relaxed mb-6">For enterprise engineering orgs requiring live multi-user collaboration, Docker, Kubernetes, and dedicated support.</p>

                        <div className="space-y-2.5 text-xs text-gray-300 font-mono">
                          <div className="flex items-center gap-2"><CheckCircle2 size={14} className="text-emerald-400" /> 50 Developer Seats</div>
                          <div className="flex items-center gap-2"><CheckCircle2 size={14} className="text-emerald-400" /> Live Multi-User Real-time Collaboration</div>
                          <div className="flex items-center gap-2"><CheckCircle2 size={14} className="text-emerald-400" /> Custom Plugin SDK & SSO Integration</div>
                          <div className="flex items-center gap-2"><CheckCircle2 size={14} className="text-emerald-400" /> Docker & K8s Cluster Pipeline</div>
                          <div className="flex items-center gap-2"><CheckCircle2 size={14} className="text-emerald-400" /> 24/7 Dedicated Priority Support</div>
                        </div>
                      </div>

                      <button
                        onClick={() => handlePurchasePlan('Enterprise')}
                        className="w-full py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-extrabold rounded-xl text-xs shadow-lg transition-all"
                      >
                        Purchase Enterprise ($99)
                      </button>
                    </div>
                  </div>
                </div>

                {/* Instant License Key Activation Box */}
                <div className="p-6 bg-[#14161b] border border-[#232733] rounded-3xl space-y-4 shadow-md">
                  <div className="flex items-center gap-2">
                    <Key size={18} className="text-indigo-400" />
                    <h4 className="text-sm font-bold text-gray-200">Already Received an Enterprise License Key?</h4>
                  </div>
                  <div className="flex items-center gap-3">
                    <input
                      type="text"
                      value={activationKeyInput}
                      onChange={(e) => setActivationKeyInput(e.target.value)}
                      placeholder="Paste your serial license key (e.g. VSTACK-ENT-8940-2026)..."
                      className="flex-1 bg-[#0e0f12] border border-[#232733] rounded-xl px-4 py-3 text-xs text-gray-200 font-mono outline-none focus:border-indigo-500"
                    />
                    <button
                      onClick={handleActivateKey}
                      className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold shadow-md transition-colors whitespace-nowrap"
                    >
                      Activate License Key
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* 2. EDITOR & KEYBINDINGS PANEL */}
            {activeTab === 'editor' && (
              <div className="space-y-8">
                <div>
                  <h3 className="text-base font-bold text-gray-100 mb-1">Code Editor & Monaco Preferences</h3>
                  <p className="text-xs text-gray-400">Configure font size, indentation, word wrap, and formatting rules for code views</p>
                </div>

                <div className="p-6 bg-[#14161b] border border-[#232733] rounded-3xl grid grid-cols-2 gap-6 text-xs text-gray-300">
                  <div className="space-y-2">
                    <label className="font-bold text-gray-200">Editor Font Size (px)</label>
                    <input
                      type="number"
                      value={fontSize}
                      onChange={(e) => setFontSize(Number(e.target.value))}
                      className="w-full bg-[#0e0f12] border border-[#232733] rounded-xl px-3.5 py-2.5 font-mono text-gray-200"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="font-bold text-gray-200">Font Family</label>
                    <select
                      value={fontFamily}
                      onChange={(e) => setFontFamily(e.target.value)}
                      className="w-full bg-[#0e0f12] border border-[#232733] rounded-xl px-3.5 py-2.5 font-mono text-indigo-400"
                    >
                      <option value="JetBrains Mono">JetBrains Mono</option>
                      <option value="Fira Code">Fira Code</option>
                      <option value="Figma Code">Figma Code</option>
                      <option value="Cascadia Code">Cascadia Code</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="font-bold text-gray-200">Tab Indent Size</label>
                    <select
                      value={tabSize}
                      onChange={(e) => setTabSize(Number(e.target.value))}
                      className="w-full bg-[#0e0f12] border border-[#232733] rounded-xl px-3.5 py-2.5 font-mono text-indigo-400"
                    >
                      <option value={2}>2 Spaces (Standard React)</option>
                      <option value={4}>4 Spaces (Standard Python/C++)</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="font-bold text-gray-200">Cursor Blinking Animation</label>
                    <select
                      value={cursorBlinking}
                      onChange={(e) => setCursorBlinking(e.target.value)}
                      className="w-full bg-[#0e0f12] border border-[#232733] rounded-xl px-3.5 py-2.5 font-mono text-indigo-400"
                    >
                      <option value="smooth">Smooth Blink</option>
                      <option value="phase">Phase Blink</option>
                      <option value="solid">Solid (No Blink)</option>
                    </select>
                  </div>

                  <div className="flex items-center justify-between p-3.5 bg-[#0e0f12] border border-[#232733] rounded-xl">
                    <span className="font-bold">Format on Save (Prettier)</span>
                    <input
                      type="checkbox"
                      checked={formatOnSave}
                      onChange={(e) => setFormatOnSave(e.target.checked)}
                      className="w-4 h-4 text-indigo-600 rounded cursor-pointer"
                    />
                  </div>

                  <div className="flex items-center justify-between p-3.5 bg-[#0e0f12] border border-[#232733] rounded-xl">
                    <span className="font-bold">Word Wrap Long Lines</span>
                    <input
                      type="checkbox"
                      checked={wordWrap}
                      onChange={(e) => setWordWrap(e.target.checked)}
                      className="w-4 h-4 text-indigo-600 rounded cursor-pointer"
                    />
                  </div>
                </div>

                {/* Keyboard Shortcuts Table */}
                <div className="p-6 bg-[#14161b] border border-[#232733] rounded-3xl space-y-4">
                  <h4 className="text-xs font-bold text-gray-200 uppercase tracking-wider">Default IDE Keyboard Shortcuts</h4>

                  <div className="space-y-2 font-mono text-xs">
                    {[
                      { key: 'Ctrl + K', action: 'Open AI Spotlight Command Palette' },
                      { key: 'Ctrl + Z', action: 'Undo last canvas mutation' },
                      { key: 'Ctrl + Y', action: 'Redo last canvas mutation' },
                      { key: 'Ctrl + S', action: 'Save project (.vstack)' },
                      { key: 'Ctrl + Shift + P', action: 'Open Command Manager Registry' },
                      { key: 'Ctrl + Shift + F', action: 'Global Code & Component Search' },
                    ].map((sc) => (
                      <div key={sc.key} className="p-3 bg-[#0e0f12] border border-[#232733] rounded-xl flex items-center justify-between">
                        <span className="text-gray-300 font-sans">{sc.action}</span>
                        <span className="px-2.5 py-1 bg-[#14161b] text-indigo-400 rounded border border-[#232733] font-bold">{sc.key}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* 3. DESIGN TOKENS & THEME */}
            {activeTab === 'theme' && (
              <div className="space-y-8">
                <div>
                  <h3 className="text-base font-bold text-gray-100 mb-1">Global Design System Tokens</h3>
                  <p className="text-xs text-gray-400">Modify global color tokens, typography styles, border radius scales & shadows</p>
                </div>

                <div className="p-6 bg-[#14161b] border border-[#232733] rounded-3xl space-y-4">
                  <h4 className="text-xs font-bold text-gray-300 uppercase tracking-wider">Brand Palette Tokens</h4>
                  <div className="grid grid-cols-2 gap-4">
                    {Object.entries(tokens.colors).map(([k, v]) => (
                      <div key={k} className="p-4 bg-[#0e0f12] border border-[#232733] rounded-2xl flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div style={{ backgroundColor: v }} className="w-8 h-8 rounded-xl border border-gray-700 shadow-md shrink-0" />
                          <div>
                            <div className="text-xs font-bold text-gray-200 capitalize">{k}</div>
                            <div className="text-[10px] font-mono text-gray-500">{v}</div>
                          </div>
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

            {/* 4. AI MODELS & API KEYS */}
            {activeTab === 'ai' && (
              <div className="space-y-8">
                <div>
                  <h3 className="text-base font-bold text-gray-100 mb-1">AI Providers & LLM API Keys</h3>
                  <p className="text-xs text-gray-400">Configure cloud AI service tokens or local Ollama GPU endpoints</p>
                </div>

                <div className="grid grid-cols-2 gap-6 text-xs">
                  {/* OpenAI */}
                  <div className="p-6 bg-[#14161b] border border-[#232733] rounded-3xl space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="font-bold text-gray-100">OpenAI (GPT-4o, GPT-4o-mini)</div>
                      <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 rounded text-[10px] font-mono">ACTIVE</span>
                    </div>
                    <input
                      type="password"
                      value={openaiKey}
                      onChange={(e) => setOpenaiKey(e.target.value)}
                      className="w-full bg-[#0e0f12] border border-[#232733] rounded-xl px-3.5 py-2.5 font-mono text-gray-300"
                    />
                  </div>

                  {/* Anthropic */}
                  <div className="p-6 bg-[#14161b] border border-[#232733] rounded-3xl space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="font-bold text-gray-100">Anthropic (Claude 3.5 Sonnet)</div>
                      <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 rounded text-[10px] font-mono">ACTIVE</span>
                    </div>
                    <input
                      type="password"
                      value={anthropicKey}
                      onChange={(e) => setAnthropicKey(e.target.value)}
                      className="w-full bg-[#0e0f12] border border-[#232733] rounded-xl px-3.5 py-2.5 font-mono text-gray-300"
                    />
                  </div>

                  {/* Google Gemini */}
                  <div className="p-6 bg-[#14161b] border border-[#232733] rounded-3xl space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="font-bold text-gray-100">Google Gemini (Gemini 1.5 Pro)</div>
                      <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 rounded text-[10px] font-mono">ACTIVE</span>
                    </div>
                    <input
                      type="password"
                      value={geminiKey}
                      onChange={(e) => setGeminiKey(e.target.value)}
                      className="w-full bg-[#0e0f12] border border-[#232733] rounded-xl px-3.5 py-2.5 font-mono text-gray-300"
                    />
                  </div>

                  {/* Ollama Local */}
                  <div className="p-6 bg-[#14161b] border border-[#232733] rounded-3xl space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="font-bold text-gray-100">Ollama Local GPU Host</div>
                      <span className="px-2 py-0.5 bg-indigo-500/20 text-indigo-400 rounded text-[10px] font-mono">LOCAL FREE</span>
                    </div>
                    <input
                      type="text"
                      value={ollamaHost}
                      onChange={(e) => setOllamaHost(e.target.value)}
                      className="w-full bg-[#0e0f12] border border-[#232733] rounded-xl px-3.5 py-2.5 font-mono text-indigo-400"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* 5. DEVOPS & COMPILER */}
            {activeTab === 'devops' && (
              <div className="space-y-8">
                <div>
                  <h3 className="text-base font-bold text-gray-100 mb-1">DevOps, Docker & Compiler Configuration</h3>
                  <p className="text-xs text-gray-400">Configure build outputs, Git author details, and Docker daemon connections</p>
                </div>

                <div className="p-6 bg-[#14161b] border border-[#232733] rounded-3xl grid grid-cols-2 gap-6 text-xs text-gray-300">
                  <div className="space-y-2">
                    <label className="font-bold text-gray-200">Git Committer Name</label>
                    <input
                      type="text"
                      value={gitName}
                      onChange={(e) => setGitName(e.target.value)}
                      className="w-full bg-[#0e0f12] border border-[#232733] rounded-xl px-3.5 py-2.5 font-mono text-gray-200"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="font-bold text-gray-200">Git Committer Email</label>
                    <input
                      type="email"
                      value={gitEmail}
                      onChange={(e) => setGitEmail(e.target.value)}
                      className="w-full bg-[#0e0f12] border border-[#232733] rounded-xl px-3.5 py-2.5 font-mono text-gray-200"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="font-bold text-gray-200">Build Output Directory</label>
                    <input
                      type="text"
                      value={buildDir}
                      onChange={(e) => setBuildDir(e.target.value)}
                      className="w-full bg-[#0e0f12] border border-[#232733] rounded-xl px-3.5 py-2.5 font-mono text-indigo-400"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="font-bold text-gray-200">Docker Daemon Socket</label>
                    <input
                      type="text"
                      value={dockerSocket}
                      onChange={(e) => setDockerSocket(e.target.value)}
                      className="w-full bg-[#0e0f12] border border-[#232733] rounded-xl px-3.5 py-2.5 font-mono text-emerald-400"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* 6. LANGUAGE & I18N */}
            {activeTab === 'i18n' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-base font-bold text-gray-100 mb-1">Studio Interface Language & Localization</h3>
                  <p className="text-xs text-gray-400">Select preferred language pack for studio menus, buttons, and tooltips</p>
                </div>

                <div className="grid grid-cols-4 gap-4 text-xs">
                  {[
                    { code: 'en', name: 'English (US)', flag: '🇺🇸' },
                    { code: 'hi', name: 'हिंदी (Hindi)', flag: '🇮🇳' },
                    { code: 'es', name: 'Español (Spanish)', flag: '🇪🇸' },
                    { code: 'fr', name: 'Français (French)', flag: '🇫🇷' },
                    { code: 'de', name: 'Deutsch (German)', flag: '🇩🇪' },
                    { code: 'ja', name: '日本語 (Japanese)', flag: '🇯🇵' },
                    { code: 'zh', name: '中文 (Chinese)', flag: '🇨🇳' },
                    { code: 'ar', name: 'العربية (Arabic)', flag: '🇸🇦' },
                  ].map((l) => (
                    <button
                      key={l.code}
                      onClick={() => handleLangChange(l.code as SupportedLanguage)}
                      className={`p-5 rounded-2xl border text-left font-bold transition-all flex flex-col justify-between space-y-3 ${
                        currentLang === l.code
                          ? 'bg-gradient-to-br from-indigo-600 to-indigo-700 text-white border-indigo-500 shadow-xl'
                          : 'bg-[#14161b] text-gray-300 border-[#232733] hover:border-gray-600'
                      }`}
                    >
                      <span className="text-2xl">{l.flag}</span>
                      <div>
                        <div className="text-xs font-bold">{l.name}</div>
                        <div className="text-[10px] opacity-70 font-mono uppercase">{l.code}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
