import React, { useState } from 'react';
import {
  Server,
  Key,
  ShieldCheck,
  ShieldAlert,
  Play,
  RotateCcw,
  CheckCircle2,
  XCircle,
  Plus,
  Trash2,
  Globe,
  FileCode2,
  ArrowRight,
  Database,
  Lock,
  RefreshCw,
  GitPullRequest
} from 'lucide-react';
import {
  ConnectionStatus,
  ConnectionType,
  PatchSimulationItem,
  PatchStatus,
  StagingCredential
} from '../types/staging';

const INITIAL_CREDENTIALS: StagingCredential[] = [
  {
    id: 'cred-1',
    name: 'Aura Cosmética Staging (SFTP)',
    type: 'sftp',
    hostUrl: 'staging.aura-botanica-shop.es',
    port: 22,
    username: 'deploy_staging_agent',
    secretKeyMasked: '••••••••••••••••••••••••••••••••',
    remoteRootPath: '/var/www/vhosts/staging.aura-botanica/public_html',
    isStagingFlagVerified: true,
    status: 'connected',
    lastTestedAt: 'Just now',
    latencyMs: 82,
    serverBanner: 'OpenSSH_9.3p1 Ubuntu-1ubuntu3.3 (Staging Environment)',
  },
  {
    id: 'cred-2',
    name: 'Shopify Development Theme (REST API)',
    type: 'shopify',
    hostUrl: 'aura-botanica-dev.myshopify.com',
    username: 'shpat_a8f9c118e9a2b7740',
    secretKeyMasked: '••••••••••••••••••••••••',
    remoteRootPath: '/themes/14982739281 (Staging Preview)',
    isStagingFlagVerified: true,
    status: 'connected',
    lastTestedAt: '12 min ago',
    latencyMs: 140,
    serverBanner: 'Shopify Admin REST API 2026-01 · Theme Role: Unlocked Dev',
  },
  {
    id: 'cred-3',
    name: 'B2B Portal WP REST Engine (OAuth / App Password)',
    type: 'wordpress',
    hostUrl: 'https://staging.nexus-cloud-erp.com',
    username: 'wp_seo_agent_service',
    secretKeyMasked: '••••••••••••••••••••••••',
    remoteRootPath: '/wp-content/themes/nexus-custom-child',
    isStagingFlagVerified: true,
    status: 'untested',
    lastTestedAt: undefined,
    latencyMs: undefined,
  },
];

const INITIAL_PATCHES: PatchSimulationItem[] = [
  {
    id: 'patch-1',
    targetFile: '.htaccess (Root Server Configuration)',
    targetSnippetName: 'Direct 301 Normalization for Discontinued Campaign URLs',
    patchType: 'htaccess_301',
    originalCode: `# Legacy redirects\nRewriteRule ^ofertas-primavera-2025/pack-luminosidad/?$ /ofertas [R=302,L]\nRewriteRule ^blog/rutina-invierno/?$ /guia/piel-sensible-invierno [R=301,L]`,
    patchedCode: `# Patched by SEO Flow Studio (Single 301 Hop - Zero Equity Decay)\nRewriteRule ^ofertas-primavera-2025/pack-luminosidad/?$ /colecciones/packs-regalo-botanicos [R=301,L]\nRewriteRule ^blog/rutina-invierno/?$ /blog/rutina-piel-sensible-invierno [R=301,L]\nRewriteRule ^guia/piel-sensible-invierno/?$ /blog/rutina-piel-sensible-invierno [R=301,L]`,
    dryRunDiff: `- RewriteRule ^ofertas-primavera-2025/pack-luminosidad/?$ /ofertas [R=302,L]\n+ RewriteRule ^ofertas-primavera-2025/pack-luminosidad/?$ /colecciones/packs-regalo-botanicos [R=301,L]\n+ RewriteRule ^guia/piel-sensible-invierno/?$ /blog/rutina-piel-sensible-invierno [R=301,L]`,
    status: 'applied_staging',
    lastRunTimestamp: '10:42 AM · Backup Snapshot #BKP-8821',
    simulatedSafetyCheckPassed: true,
  },
  {
    id: 'patch-2',
    targetFile: 'layout/theme.liquid (Faceted Canonical Enforcement)',
    targetSnippetName: 'Prevent Duplicate Indexation on Filter Query Strings',
    patchType: 'liquid_canonical',
    originalCode: `<link rel="canonical" href="{{ canonical_url }}" />`,
    patchedCode: `{% if template contains 'collection' and current_tags %}\n  <link rel="canonical" href="{{ shop.url }}{{ collection.url }}" />\n  <meta name="robots" content="noindex, follow" />\n{% else %}\n  <link rel="canonical" href="{{ canonical_url }}" />\n{% endif %}`,
    dryRunDiff: `- <link rel="canonical" href="{{ canonical_url }}" />\n+ {% if template contains 'collection' and current_tags %}\n+   <link rel="canonical" href="{{ shop.url }}{{ collection.url }}" />\n+   <meta name="robots" content="noindex, follow" />\n+ {% else %}\n+   <link rel="canonical" href="{{ canonical_url }}" />\n+ {% endif %}`,
    status: 'idle',
    simulatedSafetyCheckPassed: true,
  },
  {
    id: 'patch-3',
    targetFile: 'functions.php (JSON-LD Schema Automated Injector)',
    targetSnippetName: 'Inject Product & AggregateRating Rich Snippets via WP Hook',
    patchType: 'wp_functions_schema',
    originalCode: `// No structured data filter registered for custom taxonomy`,
    patchedCode: `add_action('wp_head', function() {\n  if (is_singular('producto')) {\n    echo '<script type="application/ld+json">' . wp_json_encode(seo_flow_build_schema()) . '</script>';\n  }\n});`,
    dryRunDiff: `+ add_action('wp_head', function() {\n+   if (is_singular('producto')) {\n+     echo '<script type="application/ld+json">' . wp_json_encode(seo_flow_build_schema()) . '</script>';\n+   }\n+ });`,
    status: 'idle',
    simulatedSafetyCheckPassed: true,
  },
];

export const StagingSandboxModule: React.FC = () => {
  const [credentials, setCredentials] = useState<StagingCredential[]>(INITIAL_CREDENTIALS);
  const [patches, setPatches] = useState<PatchSimulationItem[]>(INITIAL_PATCHES);
  const [selectedCredId, setSelectedCredId] = useState<string>(INITIAL_CREDENTIALS[0].id);
  const [activePatchId, setActivePatchId] = useState<string>(INITIAL_PATCHES[0].id);

  // New credential form state
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newName, setNewName] = useState('');
  const [newType, setNewType] = useState<ConnectionType>('sftp');
  const [newHost, setNewHost] = useState('');
  const [newPort, setNewPort] = useState<number>(22);
  const [newUser, setNewUser] = useState('');
  const [newSecret, setNewSecret] = useState('');
  const [newRemotePath, setNewRemotePath] = useState('');

  // Sandbox simulation logging state
  const [dryRunLogs, setDryRunLogs] = useState<string[]>([
    '[INIT] Staging Sandbox protocol activated: Production IP protection check OK.',
    '[VERIFY] Snapshot generator active. Host target checked against known production domains.',
  ]);

  const activeCredential = credentials.find((c) => c.id === selectedCredId) || credentials[0];
  const activePatch = patches.find((p) => p.id === activePatchId) || patches[0];

  // Test connection simulation with realistic latency
  const handleTestConnection = (credId: string) => {
    setCredentials((prev) =>
      prev.map((c) => (c.id === credId ? { ...c, status: 'testing' } : c))
    );

    setDryRunLogs((logs) => [
      ...logs,
      `[HANDSHAKE] Initiating test probe to ${activeCredential.hostUrl}...`,
    ]);

    setTimeout(() => {
      // Simulate validation: domain must not contain pure production domain without staging/dev keywords
      const isDangerous =
        !activeCredential.hostUrl.toLowerCase().includes('staging') &&
        !activeCredential.hostUrl.toLowerCase().includes('dev') &&
        !activeCredential.hostUrl.toLowerCase().includes('test') &&
        !activeCredential.hostUrl.toLowerCase().includes('sandbox');

      if (isDangerous) {
        setCredentials((prev) =>
          prev.map((c) =>
            c.id === credId
              ? {
                  ...c,
                  status: 'failed',
                  lastTestedAt: 'Just now',
                  serverBanner: 'ABORTED: Host target appears to be Production! Safety rule requires staging/dev environment keyword.',
                }
              : c
          )
        );
        setDryRunLogs((logs) => [
          ...logs,
          `[FAIL-SAFE] Connection to ${activeCredential.hostUrl} refused. Golden Rule violation: Cannot target production directly!`,
        ]);
        return;
      }

      setCredentials((prev) =>
        prev.map((c) =>
          c.id === credId
            ? {
                ...c,
                status: 'connected',
                lastTestedAt: 'Just now',
                latencyMs: Math.floor(65 + Math.random() * 90),
                serverBanner:
                  c.type === 'shopify'
                    ? 'Shopify Theme REST API · Status 200 OK · Role: Dev Theme'
                    : c.type === 'wordpress'
                    ? 'WordPress REST API /wp-json/wp/v2/ · Authenticated as Editor'
                    : 'SSH-2.0-OpenSSH · Key Authentication Accepted · Read/Write Staging Sandbox verified',
              }
            : c
        )
      );

      setDryRunLogs((logs) => [
        ...logs,
        `[SUCCESS] Connection verified for ${activeCredential.name}. Staging sandbox environment confirmed safe.`,
      ]);
    }, 900);
  };

  const handleCreateCredential = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHost.trim() || !newUser.trim()) return;

    const newCred: StagingCredential = {
      id: `cred-${Date.now()}`,
      name: newName.trim() || `${newType.toUpperCase()} Sandbox`,
      type: newType,
      hostUrl: newHost.trim(),
      port: newType === 'sftp' ? newPort : undefined,
      username: newUser.trim(),
      secretKeyMasked: '••••••••••••••••••••••••',
      remoteRootPath: newRemotePath.trim() || '/var/www/staging',
      isStagingFlagVerified:
        newHost.includes('staging') || newHost.includes('dev') || newHost.includes('test'),
      status: 'untested',
    };

    setCredentials((prev) => [...prev, newCred]);
    setSelectedCredId(newCred.id);
    setIsAddingNew(false);
    setNewName('');
    setNewHost('');
    setNewUser('');
    setNewSecret('');
    setNewRemotePath('');

    setDryRunLogs((logs) => [
      ...logs,
      `[ADDED] Added staging endpoint ${newCred.name}. Click "Test Connection" to verify sandbox access.`,
    ]);
  };

  const handleDeleteCredential = (id: string) => {
    setCredentials((prev) => prev.filter((c) => c.id !== id));
  };

  // Safe patch simulation & apply on staging
  const handleSimulatePatchDryRun = (patchId: string) => {
    setPatches((prev) =>
      prev.map((p) => (p.id === patchId ? { ...p, status: 'simulating' } : p))
    );

    setDryRunLogs((logs) => [
      ...logs,
      `[SIMULATION] Executing Dry-Run Diff comparison on ${activePatch.targetFile}...`,
    ]);

    setTimeout(() => {
      setPatches((prev) =>
        prev.map((p) =>
          p.id === patchId
            ? {
                ...p,
                status: 'idle',
                lastRunTimestamp: 'Simulated Dry-Run Passed (0 Syntax Errors)',
              }
            : p
        )
      );
      setDryRunLogs((logs) => [
        ...logs,
        `[DIFF CHECK] Patch dry-run on ${activePatch.targetFile} validated without syntax breakage. Ready for staging deployment.`,
      ]);
    }, 700);
  };

  const handleDeployToStaging = (patchId: string) => {
    setPatches((prev) =>
      prev.map((p) => (p.id === patchId ? { ...p, status: 'simulating' } : p))
    );

    const snapshotNum = Math.floor(1000 + Math.random() * 9000);

    setDryRunLogs((logs) => [
      ...logs,
      `[BACKUP] Generating rollback snapshot snapshot_staging_${snapshotNum}.bak...`,
      `[DISPATCH] Deploying atomic patch payload to ${activeCredential.remoteRootPath}/${activePatch.targetFile}...`,
    ]);

    setTimeout(() => {
      setPatches((prev) =>
        prev.map((p) =>
          p.id === patchId
            ? {
                ...p,
                status: 'applied_staging',
                backupSnapshotId: `BKP-${snapshotNum}`,
                lastRunTimestamp: `Applied in Staging · Snapshot #BKP-${snapshotNum}`,
              }
            : p
        )
      );
      setDryRunLogs((logs) => [
        ...logs,
        `[STAGING LIVE] Patch successfully applied to staging environment! Rollback snapshot verified. Production remains untampered.`,
      ]);
    }, 950);
  };

  const handleRollbackStaging = (patchId: string) => {
    setPatches((prev) =>
      prev.map((p) =>
        p.id === patchId
          ? {
              ...p,
              status: 'reverted',
              lastRunTimestamp: 'Reverted to backup snapshot',
            }
          : p
      )
    );
    setDryRunLogs((logs) => [
      ...logs,
      `[ROLLBACK] Restored original clean file state for ${activePatch.targetFile} from snapshot.`,
    ]);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner: Golden Rule Safeguard */}
      <section className="bg-slate-900 border border-slate-800 rounded-lg p-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <div className="text-xs text-slate-400 flex items-center gap-2">
              <span>Staging Sandbox Engine</span>
              <span aria-hidden="true">·</span>
              <span>SFTP / FTP & CMS REST APIs</span>
              <span aria-hidden="true">·</span>
              <span className="text-emerald-400 font-medium">Production Locked</span>
            </div>
            <h2 className="text-base font-bold text-white mt-1">
              Staging Credentials & Safe Patch Simulator
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-400">Connected Sandboxes:</span>
            <span className="font-mono text-xs font-semibold text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 rounded px-2 py-0.5">
              {credentials.filter((c) => c.status === 'connected').length} / {credentials.length} Online
            </span>
          </div>
        </div>

        <div className="pt-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-3 bg-slate-950/70 border border-slate-800/80 rounded-md">
            <div className="font-semibold text-slate-200 flex items-center gap-1.5 mb-1">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              1. Non-Production Verification
            </div>
            <p className="text-slate-400 leading-relaxed">
              Target hosts must explicitly resolve to staging/dev domains. Writing to live production endpoints is strictly blocked to prevent checkout or cart disruptions.
            </p>
          </div>

          <div className="p-3 bg-slate-950/70 border border-slate-800/80 rounded-md">
            <div className="font-semibold text-slate-200 flex items-center gap-1.5 mb-1">
              <Database className="w-4 h-4 text-blue-400" />
              2. Mandatory Backup Snapshots
            </div>
            <p className="text-slate-400 leading-relaxed">
              Every code simulation automatically copies a timestamped <code className="text-slate-300">.bak</code> snapshot before deploying changes, enabling one-click instant rollbacks.
            </p>
          </div>

          <div className="p-3 bg-slate-950/70 border border-slate-800/80 rounded-md">
            <div className="font-semibold text-slate-200 flex items-center gap-1.5 mb-1">
              <GitPullRequest className="w-4 h-4 text-amber-400" />
              3. Pull Request / Ticket Bridge
            </div>
            <p className="text-slate-400 leading-relaxed">
              Verified staging patches can be converted directly into clean Git Pull Requests or dev tickets for client engineering sign-off.
            </p>
          </div>
        </div>
      </section>

      {/* Main Grid: Credentials List + Active Endpoint Connection Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Credentials List & Add Button */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-lg p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <Server className="w-4 h-4 text-blue-400" />
              Staging Endpoints ({credentials.length})
            </h3>
            <button
              onClick={() => setIsAddingNew(!isAddingNew)}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-white bg-blue-600 hover:bg-blue-500 rounded transition-colors cursor-pointer"
            >
              <Plus className="w-3 h-3" />
              {isAddingNew ? 'Cancel' : 'Add Credential'}
            </button>
          </div>

          {/* Add Credential Form Modal/Drawer */}
          {isAddingNew && (
            <form
              onSubmit={handleCreateCredential}
              className="p-4 bg-slate-950 border border-slate-800 rounded-lg space-y-3 text-xs"
            >
              <div className="font-semibold text-slate-200 pb-1 border-b border-slate-800">
                Define New Staging Connection
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Profile Name</label>
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="e.g. Client Staging SFTP"
                  className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded text-slate-200 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-400 mb-1">Protocol / API Type</label>
                  <select
                    value={newType}
                    onChange={(e) => setNewType(e.target.value as ConnectionType)}
                    className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded text-slate-200 focus:outline-none"
                  >
                    <option value="sftp">SFTP (SSH File Transfer)</option>
                    <option value="ftp">FTP (Explicit TLS)</option>
                    <option value="shopify">Shopify Admin REST API</option>
                    <option value="wordpress">WordPress REST API</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Port</label>
                  <input
                    type="number"
                    value={newPort}
                    onChange={(e) => setNewPort(Number(e.target.value))}
                    disabled={newType !== 'sftp' && newType !== 'ftp'}
                    className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded text-slate-200 disabled:opacity-40"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Host / Domain URL</label>
                <input
                  type="text"
                  value={newHost}
                  onChange={(e) => setNewHost(e.target.value)}
                  placeholder="staging.client-domain.com or my-dev.myshopify.com"
                  className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded text-slate-200 font-mono text-[11px]"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-400 mb-1">Username / Key ID</label>
                  <input
                    type="text"
                    value={newUser}
                    onChange={(e) => setNewUser(e.target.value)}
                    placeholder="deploy_user"
                    className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded text-slate-200 font-mono text-[11px]"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Password / Secret Token</label>
                  <input
                    type="password"
                    value={newSecret}
                    onChange={(e) => setNewSecret(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded text-slate-200 font-mono text-[11px]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Remote Working Path</label>
                <input
                  type="text"
                  value={newRemotePath}
                  onChange={(e) => setNewRemotePath(e.target.value)}
                  placeholder="/var/www/staging/public_html or /themes/staging"
                  className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded text-slate-200 font-mono text-[11px]"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded transition-colors cursor-pointer"
              >
                Save Staging Credential
              </button>
            </form>
          )}

          {/* Credentials Card List */}
          <div className="space-y-2.5">
            {credentials.map((cred) => {
              const isSelected = cred.id === selectedCredId;
              return (
                <div
                  key={cred.id}
                  onClick={() => setSelectedCredId(cred.id)}
                  className={`p-3.5 rounded-lg border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-slate-800/80 border-blue-500 shadow-sm'
                      : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-mono text-slate-400 uppercase tracking-wider text-[10px]">
                      {cred.type}
                    </span>
                    {cred.status === 'connected' ? (
                      <span className="text-emerald-400 flex items-center gap-1 font-medium text-[11px]">
                        <CheckCircle2 className="w-3 h-3" />
                        Connected ({cred.latencyMs}ms)
                      </span>
                    ) : cred.status === 'testing' ? (
                      <span className="text-blue-400 flex items-center gap-1 font-medium text-[11px]">
                        <RefreshCw className="w-3 h-3 animate-spin" />
                        Probing...
                      </span>
                    ) : cred.status === 'failed' ? (
                      <span className="text-red-400 flex items-center gap-1 font-medium text-[11px]">
                        <XCircle className="w-3 h-3" />
                        Refused
                      </span>
                    ) : (
                      <span className="text-slate-500 text-[11px]">Untested</span>
                    )}
                  </div>

                  <div className="text-sm font-semibold text-slate-100">{cred.name}</div>
                  <div className="text-xs font-mono text-slate-400 truncate mt-0.5">
                    {cred.hostUrl}
                  </div>

                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-800/60 text-[11px] text-slate-400">
                    <span className="truncate max-w-[200px]">Path: {cred.remoteRootPath}</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteCredential(cred.id);
                      }}
                      className="text-slate-500 hover:text-red-400 p-0.5 cursor-pointer"
                      title="Remove profile"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Connection Diagnostics & Interactive Test Workbench */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-lg p-5 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
            <div>
              <div className="text-xs text-slate-400">Selected Endpoint</div>
              <h3 className="text-base font-semibold text-white mt-0.5">
                {activeCredential.name}
              </h3>
            </div>

            <button
              onClick={() => handleTestConnection(activeCredential.id)}
              disabled={activeCredential.status === 'testing'}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 disabled:opacity-50 rounded-md transition-colors cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${activeCredential.status === 'testing' ? 'animate-spin' : ''}`} />
              Test Connection Now
            </button>
          </div>

          {/* Connection Specification Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3 bg-slate-950 border border-slate-800 rounded-md">
              <span className="text-slate-500 block">Host & Port</span>
              <span className="font-mono text-slate-200 text-[13px] block mt-0.5">
                {activeCredential.hostUrl} {activeCredential.port ? `:${activeCredential.port}` : ''}
              </span>
            </div>

            <div className="p-3 bg-slate-950 border border-slate-800 rounded-md">
              <span className="text-slate-500 block">Authenticated User</span>
              <span className="font-mono text-slate-200 text-[13px] block mt-0.5">
                {activeCredential.username}
              </span>
            </div>

            <div className="p-3 bg-slate-950 border border-slate-800 rounded-md">
              <span className="text-slate-500 block">Target Working Directory</span>
              <span className="font-mono text-slate-200 text-[13px] block mt-0.5 truncate">
                {activeCredential.remoteRootPath}
              </span>
            </div>

            <div className="p-3 bg-slate-950 border border-slate-800 rounded-md">
              <span className="text-slate-500 block">Safety Guard Status</span>
              <span className="font-semibold text-emerald-400 text-[13px] block mt-0.5 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                Verified Non-Production Staging
              </span>
            </div>
          </div>

          {/* Server Response Banner / Telemetry */}
          {activeCredential.serverBanner && (
            <div
              className={`p-3 rounded-md text-xs font-mono border ${
                activeCredential.status === 'connected'
                  ? 'bg-emerald-950/30 border-emerald-800/60 text-emerald-300'
                  : 'bg-red-950/30 border-red-800/60 text-red-300'
              }`}
            >
              <div className="font-sans font-semibold text-[11px] mb-1 uppercase tracking-wider">
                Remote Server Handshake Response
              </div>
              {activeCredential.serverBanner}
            </div>
          )}

          {/* Dry-Run Sandbox Console Logs */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="font-semibold text-slate-300">Sandbox Safety Execution Log</span>
              <span className="font-mono text-[11px]">{dryRunLogs.length} events logged</span>
            </div>
            <div className="p-3 bg-slate-950 border border-slate-800 rounded-md font-mono text-[11px] text-slate-400 space-y-1 h-36 overflow-y-auto">
              {dryRunLogs.map((log, index) => (
                <div key={index} className="leading-relaxed">
                  <span className="text-blue-400">{log.split(' ')[0]}</span>{' '}
                  <span className="text-slate-300">{log.substring(log.indexOf(' ') + 1)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Code Patch Simulation & Staging Deployment Panel */}
      <section className="bg-slate-900 border border-slate-800 rounded-lg p-5 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
          <div>
            <div className="text-xs text-slate-400">Simulation Module</div>
            <h3 className="text-base font-semibold text-white mt-0.5">
              Code Patch Dry-Run & Staging Dispatcher
            </h3>
          </div>

          <div className="flex items-center gap-2">
            {patches.map((p) => (
              <button
                key={p.id}
                onClick={() => setActivePatchId(p.id)}
                className={`px-3 py-1.5 text-xs font-medium rounded transition-colors cursor-pointer ${
                  activePatch.id === p.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                {p.patchType === 'htaccess_301'
                  ? '.htaccess 301'
                  : p.patchType === 'liquid_canonical'
                  ? 'Liquid Canonical'
                  : 'WP Schema'}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Diff View */}
          <div className="lg:col-span-8 space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-200">
                Target File: <code className="text-blue-400 font-mono">{activePatch.targetFile}</code>
              </span>
              <span className="text-slate-400">{activePatch.targetSnippetName}</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-mono">
              <div className="p-3 bg-slate-950 border border-slate-800 rounded space-y-1">
                <div className="text-red-400 font-semibold text-[11px] pb-1 border-b border-slate-800">
                  Original Staging Content
                </div>
                <pre className="text-slate-400 overflow-x-auto whitespace-pre-wrap leading-relaxed">
                  {activePatch.originalCode}
                </pre>
              </div>

              <div className="p-3 bg-slate-950 border border-slate-800 rounded space-y-1">
                <div className="text-emerald-400 font-semibold text-[11px] pb-1 border-b border-slate-800">
                  Simulated Patch Payload
                </div>
                <pre className="text-emerald-300 overflow-x-auto whitespace-pre-wrap leading-relaxed">
                  {activePatch.patchedCode}
                </pre>
              </div>
            </div>

            <div className="p-3 bg-slate-950 border border-slate-800 rounded text-xs font-mono">
              <div className="text-blue-400 font-semibold text-[11px] mb-1">
                Unified Dry-Run Git Diff:
              </div>
              <pre className="text-slate-300 leading-relaxed overflow-x-auto">
                {activePatch.dryRunDiff}
              </pre>
            </div>
          </div>

          {/* Action Execution Card */}
          <div className="lg:col-span-4 bg-slate-950 border border-slate-800 rounded-lg p-4 flex flex-col justify-between space-y-4">
            <div className="space-y-3 text-xs">
              <span className="font-semibold text-slate-200 block border-b border-slate-800 pb-2">
                Staging Deployment Controls
              </span>

              <div className="space-y-1.5 text-slate-400">
                <div className="flex justify-between">
                  <span>Target Endpoint:</span>
                  <span className="font-semibold text-slate-200">{activeCredential.name}</span>
                </div>
                <div className="flex justify-between">
                  <span>Current State:</span>
                  <span
                    className={`font-semibold ${
                      activePatch.status === 'applied_staging'
                        ? 'text-emerald-400'
                        : activePatch.status === 'simulating'
                        ? 'text-blue-400'
                        : 'text-slate-400'
                    }`}
                  >
                    {activePatch.status === 'applied_staging'
                      ? 'Live on Staging'
                      : activePatch.status === 'simulating'
                      ? 'Simulating...'
                      : 'Pending Simulation'}
                  </span>
                </div>
                {activePatch.lastRunTimestamp && (
                  <div className="pt-1 text-[11px] text-slate-500 font-mono">
                    {activePatch.lastRunTimestamp}
                  </div>
                )}
              </div>

              <div className="p-2.5 bg-slate-900 border border-slate-800 rounded text-[11px] text-slate-300 space-y-1">
                <div className="font-semibold text-emerald-400 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Pre-Flight Backup Assured
                </div>
                <p className="text-slate-400">
                  Automatic rollback snapshot is guaranteed before touching the remote filesystem.
                </p>
              </div>
            </div>

            <div className="space-y-2 pt-2">
              <button
                onClick={() => handleSimulatePatchDryRun(activePatch.id)}
                disabled={activePatch.status === 'simulating'}
                className="w-full py-2 text-xs font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 disabled:opacity-50 border border-slate-700 rounded transition-colors cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Play className="w-3.5 h-3.5" />
                Run Dry-Run Syntax Test
              </button>

              {activePatch.status === 'applied_staging' ? (
                <button
                  onClick={() => handleRollbackStaging(activePatch.id)}
                  className="w-full py-2 text-xs font-semibold text-amber-300 bg-amber-950/60 hover:bg-amber-900/60 border border-amber-800 rounded transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Rollback to Clean Backup
                </button>
              ) : (
                <button
                  onClick={() => handleDeployToStaging(activePatch.id)}
                  disabled={activePatch.status === 'simulating' || activeCredential.status !== 'connected'}
                  className="w-full py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 disabled:opacity-40 rounded transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Server className="w-3.5 h-3.5" />
                  Deploy Patch to Staging Sandbox
                </button>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
