import React, { useState } from 'react';
import { Rocket, ShieldCheck, Globe, RotateCcw, Server, Activity, RefreshCw, Lock, Cpu, Box, Code, Plus, Trash2 } from 'lucide-react';
import { deploymentCenter } from '../deployment/DeploymentCenter';
import { providerRegistry } from '../deployment/providers/ProviderRegistry';
import { secretsVault } from '../deployment/security/SecretsVault';
import { domainManager } from '../deployment/domain/DomainManager';
import { dockerManager } from '../deployment/docker/DockerManager';
import { VisualGitPanel } from '../components/deployment/VisualGitPanel';
import { VisualPipeline } from '../components/deployment/VisualPipeline';
import { rollbackEngine } from '../deployment/health/RollbackEngine';
import type { SupportedFramework } from '../deployment/build/BuildEngine';

export const DeploymentPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'git' | 'pipeline' | 'secrets' | 'docker' | 'domains'>('overview');
  const [selectedProvider, setSelectedProvider] = useState('vercel');
  const [selectedEnv, setSelectedEnv] = useState<'development' | 'testing' | 'staging' | 'production' | 'preview'>('production');
  const [history, setHistory] = useState(deploymentCenter.getDeploymentHistory());
  const [analytics, setAnalytics] = useState(deploymentCenter.getAnalytics());
  const [isDeploying, setIsDeploying] = useState(false);

  // Docker State
  const [dockerFramework, setDockerFramework] = useState<SupportedFramework>('Next.js');
  const [containers, setContainers] = useState(dockerManager.getContainers());
  const [containerName, setContainerName] = useState('');
  const [containerPort, setContainerPort] = useState('8080');

  // Secrets State
  const [secrets, setSecrets] = useState(secretsVault.getSecrets());
  const [newSecretKey, setNewSecretKey] = useState('');
  const [newSecretValue, setNewSecretValue] = useState('');

  // Domain State
  const [domains, setDomains] = useState(domainManager.getDomains());
  const [newDomainInput, setNewDomainInput] = useState('');

  const providers = providerRegistry.getAll();

  const handleDeployNow = async () => {
    setIsDeploying(true);
    await deploymentCenter.createDeployment('visualstack-app', selectedProvider, selectedEnv);
    setTimeout(() => {
      setHistory(deploymentCenter.getDeploymentHistory());
      setAnalytics(deploymentCenter.getAnalytics());
      setIsDeploying(false);
    }, 2500);
  };

  const handleRollback = async (id: string) => {
    await rollbackEngine.rollbackTo(id);
    setHistory(deploymentCenter.getDeploymentHistory());
  };

  const handleBuildContainer = async () => {
    if (!containerName.trim()) return;
    await dockerManager.buildAndRunContainer(containerName, `visualstack/${containerName.toLowerCase()}:v1.0.0`, `${containerPort}:8080`);
    setContainers(dockerManager.getContainers());
    setContainerName('');
  };

  const handleAddSecret = () => {
    if (!newSecretKey.trim() || !newSecretValue.trim()) return;
    secretsVault.setSecret(newSecretKey, newSecretValue, 'api_key');
    setSecrets(secretsVault.getSecrets());
    setNewSecretKey('');
    setNewSecretValue('');
  };

  const handleAddDomain = () => {
    if (!newDomainInput.trim()) return;
    domainManager.addDomain(newDomainInput);
    setDomains(domainManager.getDomains());
    setNewDomainInput('');
  };

  return (
    <div className="w-full h-full bg-[#090a0f] text-gray-100 flex flex-col overflow-hidden font-sans">
      {/* Top Header */}
      <div className="bg-[#14161b] border-b border-[#232733] px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-600/20 text-indigo-400 rounded-lg">
            <Rocket size={22} />
          </div>
          <div>
            <h1 className="text-base font-bold tracking-tight">Deployment & DevOps Center</h1>
            <p className="text-xs text-gray-400">One-click build, containerize, deploy, monitor, and rollback across 18 cloud providers.</p>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1 bg-[#0e0f12] p-1 border border-[#232733] rounded-lg">
          {(['overview', 'pipeline', 'git', 'secrets', 'docker', 'domains'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-1.5 rounded text-xs font-medium capitalize transition-colors ${
                activeTab === tab ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Main Body */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Metric Cards */}
            <div className="grid grid-cols-4 gap-4">
              <div className="bg-[#14161b] border border-[#232733] p-4 rounded-xl flex items-center justify-between">
                <div>
                  <div className="text-xs font-medium text-gray-400">Total Deployments</div>
                  <div className="text-2xl font-extrabold text-white mt-1">{analytics.totalDeployments}</div>
                </div>
                <Activity className="text-indigo-400" size={24} />
              </div>
              <div className="bg-[#14161b] border border-[#232733] p-4 rounded-xl flex items-center justify-between">
                <div>
                  <div className="text-xs font-medium text-gray-400">Success Rate</div>
                  <div className="text-2xl font-extrabold text-emerald-400 mt-1">{analytics.successRatePct}%</div>
                </div>
                <ShieldCheck className="text-emerald-400" size={24} />
              </div>
              <div className="bg-[#14161b] border border-[#232733] p-4 rounded-xl flex items-center justify-between">
                <div>
                  <div className="text-xs font-medium text-gray-400">Avg Build Time</div>
                  <div className="text-2xl font-extrabold text-indigo-400 mt-1">{analytics.avgDurationMs / 1000}s</div>
                </div>
                <Cpu className="text-indigo-400" size={24} />
              </div>
              <div className="bg-[#14161b] border border-[#232733] p-4 rounded-xl flex items-center justify-between">
                <div>
                  <div className="text-xs font-medium text-gray-400">Connected Providers</div>
                  <div className="text-2xl font-extrabold text-amber-400 mt-1">18 / 18</div>
                </div>
                <Server className="text-amber-400" size={24} />
              </div>
            </div>

            {/* Quick Deployment Launcher */}
            <div className="bg-[#14161b] border border-[#232733] p-5 rounded-xl flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div>
                  <label className="text-xs font-semibold text-gray-400 block mb-1">Target Cloud Provider</label>
                  <select
                    value={selectedProvider}
                    onChange={(e) => setSelectedProvider(e.target.value)}
                    className="bg-[#0e0f12] border border-[#232733] rounded px-3 py-1.5 text-xs text-gray-200 outline-none"
                  >
                    {providers.map((p) => (
                      <option key={p.id} value={p.id}>{p.name} ({p.category})</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-400 block mb-1">Environment</label>
                  <select
                    value={selectedEnv}
                    onChange={(e) => setSelectedEnv(e.target.value as any)}
                    className="bg-[#0e0f12] border border-[#232733] rounded px-3 py-1.5 text-xs text-gray-200 outline-none"
                  >
                    <option value="production">Production</option>
                    <option value="staging">Staging</option>
                    <option value="development">Development</option>
                    <option value="preview">Preview</option>
                  </select>
                </div>
              </div>

              <button
                onClick={handleDeployNow}
                disabled={isDeploying}
                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-bold rounded-lg transition-all shadow-lg flex items-center gap-2"
              >
                {isDeploying ? <RefreshCw className="animate-spin" size={16} /> : <Rocket size={16} />}
                {isDeploying ? 'Deploying...' : 'Deploy Now'}
              </button>
            </div>

            {/* Deployment History Table */}
            <div className="bg-[#14161b] border border-[#232733] rounded-xl p-4">
              <h2 className="text-xs font-bold text-gray-300 uppercase tracking-wider mb-3">Deployment History & Rollback Logs</h2>
              {history.length === 0 ? (
                <div className="text-xs text-gray-500 py-6 text-center">No deployments recorded yet. Click "Deploy Now" above to trigger your first deployment.</div>
              ) : (
                <div className="space-y-2">
                  {history.map((dep) => (
                    <div key={dep.id} className="flex items-center justify-between bg-[#0e0f12] p-3 rounded-lg border border-[#232733] text-xs">
                      <div className="flex items-center gap-3">
                        <span className="w-2 h-2 rounded-full bg-emerald-400" />
                        <span className="font-mono text-indigo-400 font-semibold">{dep.id}</span>
                        <span className="font-medium text-gray-200">{dep.provider}</span>
                        <span className="px-2 py-0.5 bg-indigo-500/20 text-indigo-400 rounded text-[10px] uppercase font-semibold">{dep.targetEnvironment}</span>
                        {dep.deploymentUrl && (
                          <a href={dep.deploymentUrl} target="_blank" rel="noreferrer" className="text-xs text-indigo-400 hover:underline">
                            {dep.deploymentUrl}
                          </a>
                        )}
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="text-gray-500 text-[11px] font-mono">{new Date(dep.startedAt).toLocaleTimeString()}</span>
                        <button
                          onClick={() => handleRollback(dep.id)}
                          className="px-2.5 py-1 bg-[#1f232d] hover:bg-rose-600/20 hover:text-rose-400 text-gray-300 rounded text-[11px] transition-colors flex items-center gap-1"
                        >
                          <RotateCcw size={12} /> Rollback
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'pipeline' && <VisualPipeline />}

        {activeTab === 'git' && <VisualGitPanel />}

        {activeTab === 'secrets' && (
          <div className="bg-[#14161b] border border-[#232733] rounded-xl p-5 space-y-4">
            <h2 className="text-sm font-bold text-gray-200 flex items-center gap-2">
              <Lock size={16} className="text-indigo-400" /> Secrets Vault & Environment Variables
            </h2>

            {/* Secret Add Form */}
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={newSecretKey}
                onChange={(e) => setNewSecretKey(e.target.value.toUpperCase())}
                placeholder="KEY_NAME"
                className="bg-[#0e0f12] border border-[#232733] rounded px-3 py-1.5 text-xs text-gray-200 outline-none font-mono"
              />
              <input
                type="password"
                value={newSecretValue}
                onChange={(e) => setNewSecretValue(e.target.value)}
                placeholder="Secret Value"
                className="bg-[#0e0f12] border border-[#232733] rounded px-3 py-1.5 text-xs text-gray-200 outline-none font-mono flex-1"
              />
              <button onClick={handleAddSecret} className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded text-xs font-bold flex items-center gap-1">
                <Plus size={14} /> Add Secret
              </button>
            </div>

            {/* Secret List */}
            {secrets.length === 0 ? (
              <div className="text-xs text-gray-500 py-6 text-center">No secrets stored in vault. Use the form above to add API keys or environment secrets.</div>
            ) : (
              <div className="space-y-2">
                {secrets.map((sec) => (
                  <div key={sec.key} className="flex items-center justify-between bg-[#0e0f12] p-3 rounded border border-[#232733] text-xs font-mono">
                    <span className="text-indigo-400 font-semibold">{sec.key}</span>
                    <span className="text-gray-400">{sec.maskedValue}</span>
                    <span className="text-[10px] px-2 py-0.5 bg-gray-800 text-gray-400 rounded uppercase">{sec.category}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'docker' && (
          <div className="space-y-6">
            {/* Docker Engine Generator & Builder */}
            <div className="bg-[#14161b] border border-[#232733] rounded-xl p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-[#232733] pb-3">
                <h2 className="text-sm font-bold text-gray-200 flex items-center gap-2">
                  <Box size={16} className="text-indigo-400" /> Docker Engine & Container Generator
                </h2>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-400">Framework Preset:</span>
                  <select
                    value={dockerFramework}
                    onChange={(e) => setDockerFramework(e.target.value as SupportedFramework)}
                    className="bg-[#0e0f12] border border-[#232733] rounded px-3 py-1 text-xs text-indigo-400 font-semibold outline-none"
                  >
                    <option value="Next.js">Next.js</option>
                    <option value="React">React (Vite)</option>
                    <option value="Express">Express.js</option>
                    <option value="NestJS">NestJS</option>
                    <option value="Python">Python (Flask/FastAPI)</option>
                    <option value="Spring Boot">Spring Boot (Java)</option>
                  </select>
                </div>
              </div>

              {/* Code Preview */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                    <Code size={13} className="text-indigo-400" /> Generated Dockerfile
                  </div>
                  <pre className="bg-[#0e0f12] border border-[#232733] rounded-lg p-3 text-[11px] font-mono text-indigo-300 overflow-x-auto h-48 custom-scrollbar">
                    {dockerManager.generateDockerfile(dockerFramework)}
                  </pre>
                </div>
                <div>
                  <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                    <Code size={13} className="text-indigo-400" /> Generated docker-compose.yml
                  </div>
                  <pre className="bg-[#0e0f12] border border-[#232733] rounded-lg p-3 text-[11px] font-mono text-emerald-300 overflow-x-auto h-48 custom-scrollbar">
                    {dockerManager.generateCompose('web-app', containerPort)}
                  </pre>
                </div>
              </div>

              {/* Run Container Form */}
              <div className="flex items-center gap-3 pt-2 border-t border-[#232733]">
                <input
                  type="text"
                  value={containerName}
                  onChange={(e) => setContainerName(e.target.value)}
                  placeholder="Container Name (e.g. visualstack-prod)"
                  className="bg-[#0e0f12] border border-[#232733] rounded px-3 py-1.5 text-xs text-gray-200 outline-none flex-1 font-mono"
                />
                <input
                  type="text"
                  value={containerPort}
                  onChange={(e) => setContainerPort(e.target.value)}
                  placeholder="Host Port (8080)"
                  className="bg-[#0e0f12] border border-[#232733] rounded px-3 py-1.5 text-xs text-gray-200 outline-none w-28 font-mono"
                />
                <button onClick={handleBuildContainer} className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded text-xs font-bold transition-colors flex items-center gap-1.5">
                  <Box size={14} /> Build & Run Container
                </button>
              </div>
            </div>

            {/* Containers List */}
            <div className="bg-[#14161b] border border-[#232733] rounded-xl p-5 space-y-4">
              <h2 className="text-sm font-bold text-gray-200">Active Container Instances ({containers.length})</h2>
              {containers.length === 0 ? (
                <div className="text-xs text-gray-500 py-6 text-center">No active Docker containers running. Build a container above to start runtime services.</div>
              ) : (
                <div className="space-y-2">
                  {containers.map((c) => (
                    <div key={c.id} className="flex items-center justify-between bg-[#0e0f12] p-3 rounded border border-[#232733] text-xs">
                      <div className="flex items-center gap-3">
                        <span className="w-2 h-2 rounded-full bg-emerald-400" />
                        <span className="font-mono text-gray-200 font-bold">{c.name}</span>
                        <span className="text-gray-400 font-mono">{c.image}</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-xs text-indigo-400 font-mono">Ports: {c.ports}</span>
                        <button
                          onClick={async () => {
                            await dockerManager.deleteContainer(c.id);
                            setContainers(dockerManager.getContainers());
                          }}
                          className="p-1 hover:bg-rose-500/20 text-gray-400 hover:text-rose-400 rounded"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'domains' && (
          <div className="bg-[#14161b] border border-[#232733] rounded-xl p-5 space-y-4">
            <h2 className="text-sm font-bold text-gray-200 flex items-center gap-2">
              <Globe size={16} className="text-indigo-400" /> Custom Domains & SSL Certificates
            </h2>

            {/* Add Domain Form */}
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={newDomainInput}
                onChange={(e) => setNewDomainInput(e.target.value)}
                placeholder="e.g. app.mycompany.com"
                className="bg-[#0e0f12] border border-[#232733] rounded px-3 py-1.5 text-xs text-gray-200 outline-none flex-1 font-mono"
              />
              <button onClick={handleAddDomain} className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded text-xs font-bold flex items-center gap-1">
                <Plus size={14} /> Add Domain
              </button>
            </div>

            {/* Domain List */}
            {domains.length === 0 ? (
              <div className="text-xs text-gray-500 py-6 text-center">No custom domains configured. Add your domain above to generate DNS records and SSL certificates.</div>
            ) : (
              <div className="space-y-2">
                {domains.map((d) => (
                  <div key={d.id} className="flex items-center justify-between bg-[#0e0f12] p-3 rounded border border-[#232733] text-xs">
                    <span className="font-mono text-indigo-400 font-bold">{d.domain}</span>
                    <span className="text-emerald-400 font-medium">SSL Active • DNS Verified</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
