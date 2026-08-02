import React, { useState } from 'react';
import * as Icons from 'lucide-react';
import { databaseManager, type DatabaseType } from '../../../../application/resources/DatabaseManager';
import { authManager, type AuthProviderType } from '../../../../application/resources/AuthManager';
import { storageManager, type StorageProviderType } from '../../../../application/resources/StorageManager';
import { apiManager, type APIProtocol } from '../../../../application/resources/APIManager';
import { environmentManager, type EnvVariable } from '../../../../application/resources/EnvironmentManager';

export type ResourceModalType = 'database' | 'auth' | 'storage' | 'api' | 'env' | null;

interface ResourceModalProps {
  type: ResourceModalType;
  onClose: () => void;
  onSaved: () => void;
}

export const ResourceModal: React.FC<ResourceModalProps> = ({ type, onClose, onSaved }) => {
  const [testing, setTesting] = useState(false);
  const [testSuccess, setTestSuccess] = useState<boolean | null>(null);

  // Database State
  const [dbName, setDbName] = useState('MongoDB Atlas Cluster');
  const [dbType, setDbType] = useState<DatabaseType>('MongoDB');
  const [dbHost, setDbHost] = useState('cluster0.mongodb.net');
  const [dbPort, setDbPort] = useState(27017);
  const [dbUsername, setDbUsername] = useState('admin');
  const [dbPassword, setDbPassword] = useState('••••••••');
  const [dbNameField, setDbNameField] = useState('production_app_db');
  const [dbSsl, setDbSsl] = useState(true);
  const [dbCollections, setDbCollections] = useState('users, orders, products, analytics');

  // Auth State
  const [authName, setAuthName] = useState('Supabase Auth Provider');
  const [authProvider, setAuthProvider] = useState<AuthProviderType>('supabase');
  const [authSecret, setAuthSecret] = useState('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...');

  // Storage State
  const [stName, setStName] = useState('AWS S3 Production Bucket');
  const [stProvider, setStProvider] = useState<StorageProviderType>('s3');
  const [stBucket, setStBucket] = useState('my-app-production-assets');
  const [stRegion, setStRegion] = useState('us-west-2');

  // API State
  const [apiName, setApiName] = useState('Custom Payment Gateway Endpoint');
  const [apiProtocol, setApiProtocol] = useState<APIProtocol>('REST');
  const [apiMethod, setApiMethod] = useState<'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'>('POST');
  const [apiUrl, setApiUrl] = useState('https://api.paymentgateway.com/v1/charge');
  const [apiAuthType, setApiAuthType] = useState<'None' | 'Bearer' | 'APIKey' | 'Basic'>('Bearer');

  // Env State
  const [envKey, setEnvKey] = useState('MONGODB_ATLAS_URI');
  const [envVal, setEnvVal] = useState('mongodb+srv://admin:pass@cluster0.mongodb.net/production_app_db');
  const [envSecret, setEnvSecret] = useState(true);
  const [envTarget, setEnvTarget] = useState<EnvVariable['targetEnv']>('production');

  if (!type) return null;

  const handleTestConnection = async () => {
    setTesting(true);
    setTestSuccess(null);
    const ok = await databaseManager.testConnection({});
    setTesting(false);
    setTestSuccess(ok);
  };

  const handleSave = () => {
    if (type === 'database') {
      const collectionsArr = dbCollections
        .split(',')
        .map((c) => c.trim())
        .filter(Boolean);

      databaseManager.saveConnection({
        id: `db_${Date.now()}`,
        name: dbName,
        type: dbType,
        host: dbHost,
        port: dbPort,
        username: dbUsername,
        password: dbPassword,
        database: dbNameField,
        ssl: dbSsl,
        autoReconnect: true,
        status: 'connected',
        tables: collectionsArr.map((col) => ({
          name: col,
          type: dbType === 'MongoDB' ? 'collection' : 'table',
          columns: [
            { name: '_id', type: 'objectId', isPrimaryKey: true, isNullable: false },
            { name: 'created_at', type: 'timestamp', isPrimaryKey: false, isNullable: false },
          ],
          foreignKeys: [],
        })),
      });
    } else if (type === 'auth') {
      authManager.saveConfig({
        id: `auth_${Date.now()}`,
        name: authName,
        provider: authProvider,
        enabled: true,
        jwtSecret: authSecret,
        tokenExpirySeconds: 86400,
        socialProviders: ['google', 'github'],
      });
    } else if (type === 'storage') {
      storageManager.saveBucket({
        id: `st_${Date.now()}`,
        name: stName,
        provider: stProvider,
        bucketName: stBucket,
        region: stRegion,
        isPublic: true,
      });
    } else if (type === 'api') {
      apiManager.saveAPI({
        id: `api_${Date.now()}`,
        name: apiName,
        protocol: apiProtocol,
        method: apiMethod,
        url: apiUrl,
        headers: { 'Content-Type': 'application/json' },
        authType: apiAuthType,
      });
    } else if (type === 'env') {
      environmentManager.setVar(envKey, envVal, envSecret, envTarget);
    }

    onSaved();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#14161d] border border-[#232733] rounded-xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col box-border text-gray-200">
        {/* Modal Header */}
        <div className="p-4 border-b border-[#232733] flex items-center justify-between bg-[#11131c]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              {type === 'database' && <Icons.Database size={16} />}
              {type === 'auth' && <Icons.ShieldCheck size={16} />}
              {type === 'storage' && <Icons.HardDrive size={16} />}
              {type === 'api' && <Icons.Globe size={16} />}
              {type === 'env' && <Icons.Key size={16} />}
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white capitalize">
                Configure {type === 'env' ? 'Environment Variable' : `${type} Resource`}
              </h3>
              <p className="text-[11px] text-gray-400">Enter custom credentials & settings for your project.</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white p-1 rounded hover:bg-[#181a20] transition-colors"
          >
            <Icons.X size={16} />
          </button>
        </div>

        {/* Modal Form Body */}
        <div className="p-4 space-y-3 max-h-[70vh] overflow-y-auto custom-scrollbar font-sans text-xs">
          {/* DATABASE FORM */}
          {type === 'database' && (
            <>
              <div>
                <label className="text-[11px] font-medium text-gray-300 block mb-1">Connection Name</label>
                <input
                  type="text"
                  value={dbName}
                  onChange={(e) => setDbName(e.target.value)}
                  className="w-full bg-[#181a20] border border-[#232733] rounded px-3 py-1.5 text-white font-mono outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-medium text-gray-300 block mb-1">Database Type</label>
                  <select
                    value={dbType}
                    onChange={(e) => setDbType(e.target.value as DatabaseType)}
                    className="w-full bg-[#181a20] border border-[#232733] rounded px-3 py-1.5 text-white font-mono outline-none focus:border-indigo-500"
                  >
                    <option value="MongoDB">MongoDB / Atlas</option>
                    <option value="PostgreSQL">PostgreSQL</option>
                    <option value="MySQL">MySQL</option>
                    <option value="SQLite">SQLite</option>
                    <option value="Supabase">Supabase</option>
                    <option value="Firebase Firestore">Firebase Firestore</option>
                    <option value="PlanetScale">PlanetScale</option>
                    <option value="Neon">Neon DB</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-medium text-gray-300 block mb-1">Port</label>
                  <input
                    type="number"
                    value={dbPort}
                    onChange={(e) => setDbPort(Number(e.target.value))}
                    className="w-full bg-[#181a20] border border-[#232733] rounded px-3 py-1.5 text-white font-mono outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-medium text-gray-300 block mb-1">Host / Connection String</label>
                <input
                  type="text"
                  value={dbHost}
                  onChange={(e) => setDbHost(e.target.value)}
                  placeholder="e.g. cluster0.mongodb.net or localhost"
                  className="w-full bg-[#181a20] border border-[#232733] rounded px-3 py-1.5 text-white font-mono outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-medium text-gray-300 block mb-1">Username</label>
                  <input
                    type="text"
                    value={dbUsername}
                    onChange={(e) => setDbUsername(e.target.value)}
                    className="w-full bg-[#181a20] border border-[#232733] rounded px-3 py-1.5 text-white font-mono outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-medium text-gray-300 block mb-1">Password</label>
                  <input
                    type="password"
                    value={dbPassword}
                    onChange={(e) => setDbPassword(e.target.value)}
                    className="w-full bg-[#181a20] border border-[#232733] rounded px-3 py-1.5 text-white font-mono outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-medium text-gray-300 block mb-1">Database Name</label>
                <input
                  type="text"
                  value={dbNameField}
                  onChange={(e) => setDbNameField(e.target.value)}
                  className="w-full bg-[#181a20] border border-[#232733] rounded px-3 py-1.5 text-white font-mono outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="text-[11px] font-medium text-gray-300 block mb-1">
                  Collections / Tables (comma separated)
                </label>
                <input
                  type="text"
                  value={dbCollections}
                  onChange={(e) => setDbCollections(e.target.value)}
                  placeholder="users, orders, products"
                  className="w-full bg-[#181a20] border border-[#232733] rounded px-3 py-1.5 text-white font-mono outline-none focus:border-indigo-500"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  checked={dbSsl}
                  onChange={(e) => setDbSsl(e.target.checked)}
                  id="dbSslCheck"
                  className="rounded bg-[#181a20] border-[#232733] text-indigo-600 focus:ring-0 cursor-pointer"
                />
                <label htmlFor="dbSslCheck" className="text-[11px] text-gray-300 cursor-pointer">
                  Enable SSL / TLS Connection Encryption
                </label>
              </div>
            </>
          )}

          {/* AUTH FORM */}
          {type === 'auth' && (
            <>
              <div>
                <label className="text-[11px] font-medium text-gray-300 block mb-1">Configuration Name</label>
                <input
                  type="text"
                  value={authName}
                  onChange={(e) => setAuthName(e.target.value)}
                  className="w-full bg-[#181a20] border border-[#232733] rounded px-3 py-1.5 text-white font-mono outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="text-[11px] font-medium text-gray-300 block mb-1">Auth Provider</label>
                <select
                  value={authProvider}
                  onChange={(e) => setAuthProvider(e.target.value as AuthProviderType)}
                  className="w-full bg-[#181a20] border border-[#232733] rounded px-3 py-1.5 text-white font-mono outline-none focus:border-indigo-500"
                >
                  <option value="supabase">Supabase Auth</option>
                  <option value="firebase">Firebase Auth</option>
                  <option value="jwt">Custom JWT Bearer</option>
                  <option value="oauth2">OAuth2 (Google / GitHub)</option>
                  <option value="clerk">Clerk Auth</option>
                  <option value="auth0">Auth0</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-medium text-gray-300 block mb-1">JWT Secret / Client Secret</label>
                <input
                  type="password"
                  value={authSecret}
                  onChange={(e) => setAuthSecret(e.target.value)}
                  className="w-full bg-[#181a20] border border-[#232733] rounded px-3 py-1.5 text-white font-mono outline-none focus:border-indigo-500"
                />
              </div>
            </>
          )}

          {/* STORAGE FORM */}
          {type === 'storage' && (
            <>
              <div>
                <label className="text-[11px] font-medium text-gray-300 block mb-1">Bucket Title</label>
                <input
                  type="text"
                  value={stName}
                  onChange={(e) => setStName(e.target.value)}
                  className="w-full bg-[#181a20] border border-[#232733] rounded px-3 py-1.5 text-white font-mono outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-medium text-gray-300 block mb-1">Storage Provider</label>
                  <select
                    value={stProvider}
                    onChange={(e) => setStProvider(e.target.value as StorageProviderType)}
                    className="w-full bg-[#181a20] border border-[#232733] rounded px-3 py-1.5 text-white font-mono outline-none focus:border-indigo-500"
                  >
                    <option value="s3">AWS S3</option>
                    <option value="supabase">Supabase Storage</option>
                    <option value="firebase">Firebase Storage</option>
                    <option value="cloudinary">Cloudinary</option>
                    <option value="azure">Azure Blob</option>
                  </select>
                </div>
                <div>
                  <label className="text-[11px] font-medium text-gray-300 block mb-1">Region</label>
                  <input
                    type="text"
                    value={stRegion}
                    onChange={(e) => setStRegion(e.target.value)}
                    className="w-full bg-[#181a20] border border-[#232733] rounded px-3 py-1.5 text-white font-mono outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-medium text-gray-300 block mb-1">Bucket Name</label>
                <input
                  type="text"
                  value={stBucket}
                  onChange={(e) => setStBucket(e.target.value)}
                  className="w-full bg-[#181a20] border border-[#232733] rounded px-3 py-1.5 text-white font-mono outline-none focus:border-indigo-500"
                />
              </div>
            </>
          )}

          {/* API FORM */}
          {type === 'api' && (
            <>
              <div>
                <label className="text-[11px] font-medium text-gray-300 block mb-1">API Name</label>
                <input
                  type="text"
                  value={apiName}
                  onChange={(e) => setApiName(e.target.value)}
                  className="w-full bg-[#181a20] border border-[#232733] rounded px-3 py-1.5 text-white font-mono outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-[11px] font-medium text-gray-300 block mb-1">Method</label>
                  <select
                    value={apiMethod}
                    onChange={(e) => setApiMethod(e.target.value as 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH')}
                    className="w-full bg-[#181a20] border border-[#232733] rounded px-2 py-1.5 text-white font-mono outline-none focus:border-indigo-500"
                  >
                    <option value="GET">GET</option>
                    <option value="POST">POST</option>
                    <option value="PUT">PUT</option>
                    <option value="DELETE">DELETE</option>
                    <option value="PATCH">PATCH</option>
                  </select>
                </div>
                <div>
                  <label className="text-[11px] font-medium text-gray-300 block mb-1">Protocol</label>
                  <select
                    value={apiProtocol}
                    onChange={(e) => setApiProtocol(e.target.value as APIProtocol)}
                    className="w-full bg-[#181a20] border border-[#232733] rounded px-2 py-1.5 text-white font-mono outline-none focus:border-indigo-500"
                  >
                    <option value="REST">REST</option>
                    <option value="GraphQL">GraphQL</option>
                    <option value="Webhook">Webhook</option>
                    <option value="WebSocket">WebSocket</option>
                  </select>
                </div>
                <div>
                  <label className="text-[11px] font-medium text-gray-300 block mb-1">Auth Type</label>
                  <select
                    value={apiAuthType}
                    onChange={(e) => setApiAuthType(e.target.value as 'None' | 'Bearer' | 'APIKey' | 'Basic')}
                    className="w-full bg-[#181a20] border border-[#232733] rounded px-2 py-1.5 text-white font-mono outline-none focus:border-indigo-500"
                  >
                    <option value="Bearer">Bearer JWT</option>
                    <option value="APIKey">API Key</option>
                    <option value="Basic">Basic Auth</option>
                    <option value="None">None</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[11px] font-medium text-gray-300 block mb-1">Endpoint URL</label>
                <input
                  type="text"
                  value={apiUrl}
                  onChange={(e) => setApiUrl(e.target.value)}
                  className="w-full bg-[#181a20] border border-[#232733] rounded px-3 py-1.5 text-white font-mono outline-none focus:border-indigo-500"
                />
              </div>
            </>
          )}

          {/* ENV FORM */}
          {type === 'env' && (
            <>
              <div>
                <label className="text-[11px] font-medium text-gray-300 block mb-1">Key Name</label>
                <input
                  type="text"
                  value={envKey}
                  onChange={(e) => setEnvKey(e.target.value)}
                  placeholder="e.g. MONGODB_ATLAS_URI"
                  className="w-full bg-[#181a20] border border-[#232733] rounded px-3 py-1.5 text-white font-mono outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="text-[11px] font-medium text-gray-300 block mb-1">Variable Value</label>
                <input
                  type="text"
                  value={envVal}
                  onChange={(e) => setEnvVal(e.target.value)}
                  className="w-full bg-[#181a20] border border-[#232733] rounded px-3 py-1.5 text-white font-mono outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3 pt-1">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={envSecret}
                    onChange={(e) => setEnvSecret(e.target.checked)}
                    id="secretCheck"
                    className="rounded bg-[#181a20] border-[#232733] text-indigo-600 focus:ring-0 cursor-pointer"
                  />
                  <label htmlFor="secretCheck" className="text-[11px] text-gray-300 cursor-pointer">
                    Encrypt Secret
                  </label>
                </div>

                <div>
                  <select
                    value={envTarget}
                    onChange={(e) => setEnvTarget(e.target.value as EnvVariable['targetEnv'])}
                    className="w-full bg-[#181a20] border border-[#232733] rounded px-2 py-1 text-white font-mono outline-none"
                  >
                    <option value="all">All Envs</option>
                    <option value="development">Development</option>
                    <option value="production">Production</option>
                  </select>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Modal Footer Actions */}
        <div className="p-3 border-t border-[#232733] bg-[#11131c] flex items-center justify-between">
          {type === 'database' ? (
            <button
              onClick={handleTestConnection}
              disabled={testing}
              className="px-3 py-1.5 rounded bg-[#181a20] hover:bg-[#232733] text-indigo-400 border border-[#232733] text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              {testing ? <Icons.RefreshCw size={13} className="animate-spin" /> : <Icons.Activity size={13} />}
              <span>{testing ? 'Testing...' : 'Test Connection'}</span>
            </button>
          ) : (
            <div />
          )}

          <div className="flex items-center gap-2">
            {testSuccess !== null && (
              <span className="text-[10px] text-emerald-400 font-mono flex items-center gap-1">
                <Icons.CheckCircle size={12} /> Connected!
              </span>
            )}
            <button
              onClick={onClose}
              className="px-3 py-1.5 rounded text-gray-400 hover:text-white text-xs transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-1.5 rounded bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow transition-colors cursor-pointer"
            >
              Save Credentials
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
