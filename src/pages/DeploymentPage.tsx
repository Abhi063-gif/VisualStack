import React, { useState } from 'react';
import { Rocket, ShieldCheck, Globe, RotateCcw, Server, Activity, RefreshCw, Lock, Cpu } from 'lucide-react';
import { deploymentCenter } from '../deployment/DeploymentCenter';
import { providerRegistry } from '../deployment/providers/ProviderRegistry';
import { secretsVault } from '../deployment/security/SecretsVault';
import { domainManager } from '../deployment/domain/DomainManager';
import { dockerManager } from '../deployment/docker/DockerManager';
import { VisualGitPanel } from '../components/deployment/VisualGitPanel';
import { VisualPipeline } from '../components/deployment/VisualPipeline';
import { rollbackEngine } from '../deployment/health/RollbackEngine';

export const DeploymentPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'git' | 'pipeline' | 'secrets' | 'docker' | 'domains'>('overview');
  const [selectedProvider, setSelectedProvider] = useState('vercel');
  const [selectedEnv, setSelectedEnv] = useState<'development' | 'testing' | 'staging' | 'production' | 'preview'>('production');
  const [history, setHistory] = useState(deploymentCenter.getDeploymentHistory());
  const [analytics, setAnalytics] = useState(deploymentCenter.getAnalytics());
  const [isDeploying, setIsDeploying] = useState(false);

  const providers = providerRegistry.getAll();
  const secrets = secretsVault.getSecrets();
  const domains = domainManager.getDomains();
  const containers = dockerManager.getContainers();

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
            <div className="space-y-2">
              {secrets.map((sec) => (
                <div key={sec.key} className="flex items-center justify-between bg-[#0e0f12] p-3 rounded border border-[#232733] text-xs font-mono">
                  <span className="text-indigo-400 font-semibold">{sec.key}</span>
                  <span className="text-gray-400">{sec.maskedValue}</span>
                  <span className="text-[10px] px-2 py-0.5 bg-gray-800 text-gray-400 rounded uppercase">{sec.category}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'docker' && (
          <div className="bg-[#14161b] border border-[#232733] rounded-xl p-5 space-y-4">
            <h2 className="text-sm font-bold text-gray-200 flex items-center gap-2">
              <Server size={16} className="text-indigo-400" /> Docker Containers & Registries
            </h2>
            <div className="space-y-2">
              {containers.map((c) => (
                <div key={c.id} className="flex items-center justify-between bg-[#0e0f12] p-3 rounded border border-[#232733] text-xs">
                  <div className="flex items-center gap-3">
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                    <span className="font-mono text-gray-200 font-bold">{c.name}</span>
                    <span className="text-gray-400 font-mono">{c.image}</span>
                  </div>
                  <span className="text-xs text-indigo-400 font-mono">Ports: {c.ports}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'domains' && (
          <div className="bg-[#14161b] border border-[#232733] rounded-xl p-5 space-y-4">
            <h2 className="text-sm font-bold text-gray-200 flex items-center gap-2">
              <Globe size={16} className="text-indigo-400" /> Custom Domains & SSL Certificates
            </h2>
            <div className="space-y-2">
              {domains.map((d) => (
                <div key={d.id} className="flex items-center justify-between bg-[#0e0f12] p-3 rounded border border-[#232733] text-xs">
                  <span className="font-mono text-indigo-400 font-bold">{d.domain}</span>
                  <span className="text-emerald-400 font-medium">SSL Active • DNS Verified</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
