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
  const [dbMongoUri, setDbMongoUri] = useState('mongodb+srv://admin:secretPass123@cluster0.mongodb.net/production_db?retryWrites=true&w=majority');
  const [dbHost, setDbHost] = useState('localhost');
  const [dbPort, setDbPort] = useState(5432);
  const [dbUsername, setDbUsername] = useState('postgres');
  const [dbPassword, setDbPassword] = useState('••••••••');
  const [dbNameField, setDbNameField] = useState('production_db');
  const [dbSsl, setDbSsl] = useState(true);
  const [dbCollections, setDbCollections] = useState('users, orders, products, logs');

  // Auth State
  const [authName, setAuthName] = useState('Supabase Auth Service');
  const [authProvider, setAuthProvider] = useState<AuthProviderType>('supabase');
  const [supabaseUrl, setSupabaseUrl] = useState('https://xyzcompany.supabase.co');
  const [supabaseAnonKey, setSupabaseAnonKey] = useState('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...');
  const [firebaseApiKey, setFirebaseApiKey] = useState('AIzaSyD-1234567890EXAMPLEKEY');
  const [firebaseProjectId, setFirebaseProjectId] = useState('my-app-project-id');
  const [oauthClientId, setOauthClientId] = useState('1234567890-example.apps.googleusercontent.com');
  const [oauthClientSecret, setOauthClientSecret] = useState('GOCSPX-exampleSecretKey123');
  const [authSecret, setAuthSecret] = useState('super-secret-jwt-key-visualstack');

  // Storage State
  const [stName, setStName] = useState('Cloudinary Media Asset Storage');
  const [stProvider, setStProvider] = useState<StorageProviderType>('cloudinary');
  // Cloudinary Specific
  const [cloudinaryCloudName, setCloudinaryCloudName] = useState('dxy_my_cloud');
  const [cloudinaryApiKey, setCloudinaryApiKey] = useState('123456789012345');
  const [cloudinaryApiSecret, setCloudinaryApiSecret] = useState('••••••••••••••••••••••••');
  // AWS S3 Specific
  const [s3Bucket, setS3Bucket] = useState('my-app-production-assets');
  const [s3Region, setS3Region] = useState('us-west-2');
  const [s3AccessKey, setS3AccessKey] = useState('AKIAIOSFODNN7EXAMPLE');
  const [s3SecretKey, setS3SecretKey] = useState('••••••••••••••••••••••••');

  // API State
  const [apiName, setApiName] = useState('Stripe Checkout Gateway');
  const [apiServiceType, setApiServiceType] = useState<'stripe' | 'openai' | 'custom'>('stripe');
  const [stripeSecretKey, setStripeSecretKey] = useState('sk_test_51MzExampleSecretKey12345');
  const [stripePublishableKey, setStripePublishableKey] = useState('pk_test_51MzExamplePubKey12345');
  const [stripeWebhookSecret, setStripeWebhookSecret] = useState('whsec_ExampleWebhookSecret123');
  const [openaiApiKey, setOpenaiApiKey] = useState('sk-proj-ExampleOpenAIApiKey123');
  const [apiProtocol, setApiProtocol] = useState<APIProtocol>('REST');
  const [apiMethod, setApiMethod] = useState<'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'>('POST');
  const [apiUrl, setApiUrl] = useState('https://api.stripe.com/v1/checkout/sessions');
  const [apiAuthType, setApiAuthType] = useState<'None' | 'Bearer' | 'APIKey' | 'Basic'>('Bearer');

  // Env State
  const [envKey, setEnvKey] = useState('CLOUDINARY_URL');
  const [envVal, setEnvVal] = useState('cloudinary://123456789012345:secret@dxy_my_cloud');
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
        host: dbType === 'MongoDB' ? dbMongoUri : dbHost,
        port: dbPort,
        username: dbUsername,
        password: dbPassword,
        database: dbNameField,
        ssl: dbSsl,
        autoReconnect: true,
        status: 'connected',
        tables: collectionsArr.map((col) => ({
          name: col,
          type: dbType === 'MongoDB' || dbType === 'Firebase Firestore' ? 'collection' : 'table',
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
        clientId: authProvider === 'oauth2' ? oauthClientId : undefined,
        clientSecret: authProvider === 'oauth2' ? oauthClientSecret : undefined,
        jwtSecret: authProvider === 'supabase' ? supabaseAnonKey : authSecret,
        tokenExpirySeconds: 86400,
        socialProviders: ['google', 'github'],
      });
    } else if (type === 'storage') {
      storageManager.saveBucket({
        id: `st_${Date.now()}`,
        name: stName,
        provider: stProvider,
        bucketName: stProvider === 'cloudinary' ? cloudinaryCloudName : s3Bucket,
        region: stProvider === 's3' ? s3Region : undefined,
        accessKeyId: stProvider === 'cloudinary' ? cloudinaryApiKey : s3AccessKey,
        secretAccessKey: stProvider === 'cloudinary' ? cloudinaryApiSecret : s3SecretKey,
        isPublic: true,
      });
    } else if (type === 'api') {
      apiManager.saveAPI({
        id: `api_${Date.now()}`,
        name: apiName,
        protocol: apiProtocol,
        method: apiMethod,
        url: apiServiceType === 'stripe' ? 'https://api.stripe.com/v1/checkout/sessions' : apiUrl,
        headers: {
          'Content-Type': 'application/json',
          ...(apiServiceType === 'stripe' ? { Authorization: `Bearer ${stripeSecretKey}` } : {}),
          ...(apiServiceType === 'openai' ? { Authorization: `Bearer ${openaiApiKey}` } : {}),
        },
        authType: apiAuthType,
      });
    } else if (type === 'env') {
      environmentManager.setVar(envKey, envVal, envSecret, envTarget);
    }

    onSaved();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#14161d] border border-[#232733] rounded-xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col box-border text-gray-200">
        {/* Modal Header */}
        <div className="p-4 border-b border-[#232733] flex items-center justify-between bg-[#11131c]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              {type === 'database' && <Icons.Database size={16} />}
              {type === 'auth' && <Icons.ShieldCheck size={16} />}
              {type === 'storage' && <Icons.HardDrive size={16} />}
              {type === 'api' && <Icons.Globe size={16} />}
              {type === 'env' && <Icons.Key size={16} />}
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white capitalize">
                Configure {type === 'env' ? 'Environment Secret' : `${type} Credentials`}
              </h3>
              <p className="text-[11px] text-gray-400">Specify exact API keys, secrets, & connection strings.</p>
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
        <div className="p-4 space-y-3.5 max-h-[72vh] overflow-y-auto custom-scrollbar font-sans text-xs">
          {/* ========================================================================= */}
          {/* 1. STORAGE PROVIDERS SPECIFIC CREDENTIALS */}
          {/* ========================================================================= */}
          {type === 'storage' && (
            <>
              <div>
                <label className="text-[11px] font-medium text-gray-300 block mb-1">Configuration Name</label>
                <input
                  type="text"
                  value={stName}
                  onChange={(e) => setStName(e.target.value)}
                  className="w-full bg-[#181a20] border border-[#232733] rounded px-3 py-1.5 text-white font-mono outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="text-[11px] font-medium text-gray-300 block mb-1">Storage Provider</label>
                <select
                  value={stProvider}
                  onChange={(e) => {
                    const p = e.target.value as StorageProviderType;
                    setStProvider(p);
                    if (p === 'cloudinary') setStName('Cloudinary Media Asset Storage');
                    if (p === 's3') setStName('AWS S3 Bucket Storage');
                    if (p === 'supabase') setStName('Supabase Storage Bucket');
                  }}
                  className="w-full bg-[#181a20] border border-[#232733] rounded px-3 py-1.5 text-white font-mono outline-none focus:border-indigo-500"
                >
                  <option value="cloudinary">Cloudinary (Cloud Name, API Key, Secret)</option>
                  <option value="s3">AWS S3 (Bucket, Access Key, Secret Key, Region)</option>
                  <option value="supabase">Supabase Storage (Project URL, Service Key)</option>
                  <option value="firebase">Firebase Storage (Storage Bucket, Private Key)</option>
                  <option value="local">Local Storage (Disk Drive)</option>
                </select>
              </div>

              {/* CLOUDINARY SPECIFIC FIELDS */}
              {stProvider === 'cloudinary' && (
                <div className="p-3 bg-[#181a20] border border-[#232733] rounded-lg space-y-3">
                  <div className="text-[10px] font-semibold uppercase tracking-wider text-emerald-400">
                    Cloudinary API Credentials
                  </div>

                  <div>
                    <label className="text-[11px] font-medium text-gray-300 block mb-1">Cloud Name</label>
                    <input
                      type="text"
                      value={cloudinaryCloudName}
                      onChange={(e) => setCloudinaryCloudName(e.target.value)}
                      placeholder="e.g. dxy_my_cloud"
                      className="w-full bg-[#14161d] border border-[#232733] rounded px-3 py-1.5 text-white font-mono outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] font-medium text-gray-300 block mb-1">API Key</label>
                      <input
                        type="text"
                        value={cloudinaryApiKey}
                        onChange={(e) => setCloudinaryApiKey(e.target.value)}
                        placeholder="123456789012345"
                        className="w-full bg-[#14161d] border border-[#232733] rounded px-3 py-1.5 text-white font-mono outline-none focus:border-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-medium text-gray-300 block mb-1">API Secret</label>
                      <input
                        type="password"
                        value={cloudinaryApiSecret}
                        onChange={(e) => setCloudinaryApiSecret(e.target.value)}
                        placeholder="••••••••••••••••"
                        className="w-full bg-[#14161d] border border-[#232733] rounded px-3 py-1.5 text-white font-mono outline-none focus:border-indigo-500"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* AWS S3 SPECIFIC FIELDS */}
              {stProvider === 's3' && (
                <div className="p-3 bg-[#181a20] border border-[#232733] rounded-lg space-y-3">
                  <div className="text-[10px] font-semibold uppercase tracking-wider text-emerald-400">
                    AWS S3 Bucket & IAM Credentials
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] font-medium text-gray-300 block mb-1">Bucket Name</label>
                      <input
                        type="text"
                        value={s3Bucket}
                        onChange={(e) => setS3Bucket(e.target.value)}
                        placeholder="my-app-production-assets"
                        className="w-full bg-[#14161d] border border-[#232733] rounded px-3 py-1.5 text-white font-mono outline-none focus:border-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-medium text-gray-300 block mb-1">AWS Region</label>
                      <input
                        type="text"
                        value={s3Region}
                        onChange={(e) => setS3Region(e.target.value)}
                        placeholder="us-east-1"
                        className="w-full bg-[#14161d] border border-[#232733] rounded px-3 py-1.5 text-white font-mono outline-none focus:border-indigo-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-medium text-gray-300 block mb-1">Access Key ID</label>
                    <input
                      type="text"
                      value={s3AccessKey}
                      onChange={(e) => setS3AccessKey(e.target.value)}
                      placeholder="AKIAIOSFODNN7EXAMPLE"
                      className="w-full bg-[#14161d] border border-[#232733] rounded px-3 py-1.5 text-white font-mono outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-medium text-gray-300 block mb-1">Secret Access Key</label>
                    <input
                      type="password"
                      value={s3SecretKey}
                      onChange={(e) => setS3SecretKey(e.target.value)}
                      placeholder="wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY"
                      className="w-full bg-[#14161d] border border-[#232733] rounded px-3 py-1.5 text-white font-mono outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>
              )}
            </>
          )}

          {/* ========================================================================= */}
          {/* 2. DATABASE PROVIDERS SPECIFIC CREDENTIALS */}
          {/* ========================================================================= */}
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

              <div>
                <label className="text-[11px] font-medium text-gray-300 block mb-1">Database Engine</label>
                <select
                  value={dbType}
                  onChange={(e) => {
                    const t = e.target.value as DatabaseType;
                    setDbType(t);
                    if (t === 'MongoDB') setDbName('MongoDB Atlas Cluster');
                    if (t === 'PostgreSQL') setDbName('PostgreSQL Primary DB');
                  }}
                  className="w-full bg-[#181a20] border border-[#232733] rounded px-3 py-1.5 text-white font-mono outline-none focus:border-indigo-500"
                >
                  <option value="MongoDB">MongoDB / Atlas (URI Connection String)</option>
                  <option value="PostgreSQL">PostgreSQL / Neon / Supabase DB</option>
                  <option value="MySQL">MySQL / PlanetScale</option>
                  <option value="SQLite">SQLite (Local Embedded File)</option>
                  <option value="Firebase Firestore">Firebase Firestore</option>
                </select>
              </div>

              {/* MONGODB ATLAS SPECIFIC FIELDS */}
              {dbType === 'MongoDB' ? (
                <div className="p-3 bg-[#181a20] border border-[#232733] rounded-lg space-y-3">
                  <div className="text-[10px] font-semibold uppercase tracking-wider text-cyan-400">
                    MongoDB Atlas Connection URI
                  </div>

                  <div>
                    <label className="text-[11px] font-medium text-gray-300 block mb-1">Connection String (URI)</label>
                    <input
                      type="text"
                      value={dbMongoUri}
                      onChange={(e) => setDbMongoUri(e.target.value)}
                      placeholder="mongodb+srv://<username>:<password>@cluster0.mongodb.net/<dbname>"
                      className="w-full bg-[#14161d] border border-[#232733] rounded px-3 py-1.5 text-white font-mono outline-none focus:border-indigo-500 text-[11px]"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-medium text-gray-300 block mb-1">Database Name</label>
                    <input
                      type="text"
                      value={dbNameField}
                      onChange={(e) => setDbNameField(e.target.value)}
                      placeholder="production_app_db"
                      className="w-full bg-[#14161d] border border-[#232733] rounded px-3 py-1.5 text-white font-mono outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-medium text-gray-300 block mb-1">Collections (comma separated)</label>
                    <input
                      type="text"
                      value={dbCollections}
                      onChange={(e) => setDbCollections(e.target.value)}
                      placeholder="users, orders, products, analytics"
                      className="w-full bg-[#14161d] border border-[#232733] rounded px-3 py-1.5 text-white font-mono outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>
              ) : (
                /* POSTGRES / MYSQL STANDALONE FIELDS */
                <div className="p-3 bg-[#181a20] border border-[#232733] rounded-lg space-y-3">
                  <div className="grid grid-cols-3 gap-3">
                    <div className="col-span-2">
                      <label className="text-[11px] font-medium text-gray-300 block mb-1">Host / DSN</label>
                      <input
                        type="text"
                        value={dbHost}
                        onChange={(e) => setDbHost(e.target.value)}
                        placeholder="localhost or db.neon.tech"
                        className="w-full bg-[#14161d] border border-[#232733] rounded px-3 py-1.5 text-white font-mono outline-none focus:border-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-medium text-gray-300 block mb-1">Port</label>
                      <input
                        type="number"
                        value={dbPort}
                        onChange={(e) => setDbPort(Number(e.target.value))}
                        className="w-full bg-[#14161d] border border-[#232733] rounded px-3 py-1.5 text-white font-mono outline-none focus:border-indigo-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] font-medium text-gray-300 block mb-1">Username</label>
                      <input
                        type="text"
                        value={dbUsername}
                        onChange={(e) => setDbUsername(e.target.value)}
                        className="w-full bg-[#14161d] border border-[#232733] rounded px-3 py-1.5 text-white font-mono outline-none focus:border-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-medium text-gray-300 block mb-1">Password</label>
                      <input
                        type="password"
                        value={dbPassword}
                        onChange={(e) => setDbPassword(e.target.value)}
                        className="w-full bg-[#14161d] border border-[#232733] rounded px-3 py-1.5 text-white font-mono outline-none focus:border-indigo-500"
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-1">
                    <input
                      type="checkbox"
                      checked={dbSsl}
                      onChange={(e) => setDbSsl(e.target.checked)}
                      id="dbSslCheck"
                      className="rounded bg-[#14161d] border-[#232733] text-indigo-600 focus:ring-0 cursor-pointer"
                    />
                    <label htmlFor="dbSslCheck" className="text-[11px] text-gray-300 cursor-pointer">
                      Enable SSL / TLS Connection Encryption
                    </label>
                  </div>
                </div>
              )}
            </>
          )}

          {/* ========================================================================= */}
          {/* 3. AUTH PROVIDERS SPECIFIC CREDENTIALS */}
          {/* ========================================================================= */}
          {type === 'auth' && (
            <>
              <div>
                <label className="text-[11px] font-medium text-gray-300 block mb-1">Auth Name</label>
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
                  <option value="supabase">Supabase Auth (Project URL & Anon Key)</option>
                  <option value="firebase">Firebase Auth (API Key & Project ID)</option>
                  <option value="jwt">Custom JWT (Secret Key & Expiry)</option>
                  <option value="oauth2">OAuth2 (Google / GitHub Client ID & Secret)</option>
                </select>
              </div>

              {/* SUPABASE AUTH FIELDS */}
              {authProvider === 'supabase' && (
                <div className="p-3 bg-[#181a20] border border-[#232733] rounded-lg space-y-3">
                  <div>
                    <label className="text-[11px] font-medium text-gray-300 block mb-1">Supabase Project URL</label>
                    <input
                      type="text"
                      value={supabaseUrl}
                      onChange={(e) => setSupabaseUrl(e.target.value)}
                      placeholder="https://xyzcompany.supabase.co"
                      className="w-full bg-[#14161d] border border-[#232733] rounded px-3 py-1.5 text-white font-mono outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-medium text-gray-300 block mb-1">Anon / Public API Key</label>
                    <input
                      type="password"
                      value={supabaseAnonKey}
                      onChange={(e) => setSupabaseAnonKey(e.target.value)}
                      className="w-full bg-[#14161d] border border-[#232733] rounded px-3 py-1.5 text-white font-mono outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>
              )}

              {/* FIREBASE AUTH FIELDS */}
              {authProvider === 'firebase' && (
                <div className="p-3 bg-[#181a20] border border-[#232733] rounded-lg space-y-3">
                  <div>
                    <label className="text-[11px] font-medium text-gray-300 block mb-1">Firebase API Key</label>
                    <input
                      type="text"
                      value={firebaseApiKey}
                      onChange={(e) => setFirebaseApiKey(e.target.value)}
                      placeholder="AIzaSyD-1234567890EXAMPLEKEY"
                      className="w-full bg-[#14161d] border border-[#232733] rounded px-3 py-1.5 text-white font-mono outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-medium text-gray-300 block mb-1">Project ID</label>
                    <input
                      type="text"
                      value={firebaseProjectId}
                      onChange={(e) => setFirebaseProjectId(e.target.value)}
                      placeholder="my-app-project-id"
                      className="w-full bg-[#14161d] border border-[#232733] rounded px-3 py-1.5 text-white font-mono outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>
              )}

              {/* OAUTH2 FIELDS */}
              {authProvider === 'oauth2' && (
                <div className="p-3 bg-[#181a20] border border-[#232733] rounded-lg space-y-3">
                  <div>
                    <label className="text-[11px] font-medium text-gray-300 block mb-1">OAuth Client ID</label>
                    <input
                      type="text"
                      value={oauthClientId}
                      onChange={(e) => setOauthClientId(e.target.value)}
                      className="w-full bg-[#14161d] border border-[#232733] rounded px-3 py-1.5 text-white font-mono outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-medium text-gray-300 block mb-1">OAuth Client Secret</label>
                    <input
                      type="password"
                      value={oauthClientSecret}
                      onChange={(e) => setOauthClientSecret(e.target.value)}
                      className="w-full bg-[#14161d] border border-[#232733] rounded px-3 py-1.5 text-white font-mono outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>
              )}

              {/* JWT CUSTOM */}
              {authProvider === 'jwt' && (
                <div className="p-3 bg-[#181a20] border border-[#232733] rounded-lg space-y-3">
                  <div>
                    <label className="text-[11px] font-medium text-gray-300 block mb-1">JWT Secret Signing Key</label>
                    <input
                      type="password"
                      value={authSecret}
                      onChange={(e) => setAuthSecret(e.target.value)}
                      className="w-full bg-[#14161d] border border-[#232733] rounded px-3 py-1.5 text-white font-mono outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>
              )}
            </>
          )}

          {/* ========================================================================= */}
          {/* 4. EXTERNAL APIS SPECIFIC CREDENTIALS */}
          {/* ========================================================================= */}
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

              <div>
                <label className="text-[11px] font-medium text-gray-300 block mb-1">Service Type</label>
                <select
                  value={apiServiceType}
                  onChange={(e) => setApiServiceType(e.target.value as 'stripe' | 'openai' | 'custom')}
                  className="w-full bg-[#181a20] border border-[#232733] rounded px-3 py-1.5 text-white font-mono outline-none focus:border-indigo-500"
                >
                  <option value="stripe">Stripe Payment Gateway (Secret & Webhook Key)</option>
                  <option value="openai">OpenAI ChatGPT / Vision API (API Key & Org ID)</option>
                  <option value="custom">Custom REST / GraphQL API Endpoint</option>
                </select>
              </div>

              {/* STRIPE CREDENTIALS */}
              {apiServiceType === 'stripe' && (
                <div className="p-3 bg-[#181a20] border border-[#232733] rounded-lg space-y-3">
                  <div>
                    <label className="text-[11px] font-medium text-gray-300 block mb-1">Stripe Secret Key (sk_test_...)</label>
                    <input
                      type="password"
                      value={stripeSecretKey}
                      onChange={(e) => setStripeSecretKey(e.target.value)}
                      className="w-full bg-[#14161d] border border-[#232733] rounded px-3 py-1.5 text-white font-mono outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-medium text-gray-300 block mb-1">Stripe Publishable Key (pk_test_...)</label>
                    <input
                      type="text"
                      value={stripePublishableKey}
                      onChange={(e) => setStripePublishableKey(e.target.value)}
                      className="w-full bg-[#14161d] border border-[#232733] rounded px-3 py-1.5 text-white font-mono outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-medium text-gray-300 block mb-1">Webhook Signing Secret (whsec_...)</label>
                    <input
                      type="password"
                      value={stripeWebhookSecret}
                      onChange={(e) => setStripeWebhookSecret(e.target.value)}
                      className="w-full bg-[#14161d] border border-[#232733] rounded px-3 py-1.5 text-white font-mono outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>
              )}

              {/* OPENAI CREDENTIALS */}
              {apiServiceType === 'openai' && (
                <div className="p-3 bg-[#181a20] border border-[#232733] rounded-lg space-y-3">
                  <div>
                    <label className="text-[11px] font-medium text-gray-300 block mb-1">OpenAI API Key (sk-proj-...)</label>
                    <input
                      type="password"
                      value={openaiApiKey}
                      onChange={(e) => setOpenaiApiKey(e.target.value)}
                      className="w-full bg-[#14161d] border border-[#232733] rounded px-3 py-1.5 text-white font-mono outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>
              )}

              {/* CUSTOM REST / GRAPHQL */}
              {apiServiceType === 'custom' && (
                <div className="p-3 bg-[#181a20] border border-[#232733] rounded-lg space-y-3">
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="text-[11px] font-medium text-gray-300 block mb-1">Method</label>
                      <select
                        value={apiMethod}
                        onChange={(e) => setApiMethod(e.target.value as 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH')}
                        className="w-full bg-[#14161d] border border-[#232733] rounded px-2 py-1.5 text-white font-mono outline-none"
                      >
                        <option value="GET">GET</option>
                        <option value="POST">POST</option>
                        <option value="PUT">PUT</option>
                        <option value="DELETE">DELETE</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-[11px] font-medium text-gray-300 block mb-1">Protocol</label>
                      <select
                        value={apiProtocol}
                        onChange={(e) => setApiProtocol(e.target.value as APIProtocol)}
                        className="w-full bg-[#14161d] border border-[#232733] rounded px-2 py-1.5 text-white font-mono outline-none"
                      >
                        <option value="REST">REST</option>
                        <option value="GraphQL">GraphQL</option>
                        <option value="Webhook">Webhook</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-[11px] font-medium text-gray-300 block mb-1">Auth</label>
                      <select
                        value={apiAuthType}
                        onChange={(e) => setApiAuthType(e.target.value as 'None' | 'Bearer' | 'APIKey' | 'Basic')}
                        className="w-full bg-[#14161d] border border-[#232733] rounded px-2 py-1.5 text-white font-mono outline-none"
                      >
                        <option value="Bearer">Bearer JWT</option>
                        <option value="APIKey">API Key</option>
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
                      className="w-full bg-[#14161d] border border-[#232733] rounded px-3 py-1.5 text-white font-mono outline-none"
                    />
                  </div>
                </div>
              )}
            </>
          )}

          {/* ========================================================================= */}
          {/* 5. ENVIRONMENT VARIABLES */}
          {/* ========================================================================= */}
          {type === 'env' && (
            <>
              <div>
                <label className="text-[11px] font-medium text-gray-300 block mb-1">Secret Key Name</label>
                <input
                  type="text"
                  value={envKey}
                  onChange={(e) => setEnvKey(e.target.value)}
                  placeholder="e.g. CLOUDINARY_URL or MONGODB_ATLAS_URI"
                  className="w-full bg-[#181a20] border border-[#232733] rounded px-3 py-1.5 text-white font-mono outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="text-[11px] font-medium text-gray-300 block mb-1">Secret Value</label>
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
                    <option value="all">All Environments</option>
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
