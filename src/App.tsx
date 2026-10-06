/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  Activity,
  Terminal,
  ShieldCheck,
  Zap,
  Layers,
  FileText,
  Search,
  ExternalLink,
  Cpu,
  CheckCircle2,
  AlertTriangle,
  Play,
  Server
} from 'lucide-react';
import { invokeTauriCommand, SystemSpecs, isTauriEnvironment } from './tauriBridge';
import { StagingSandboxModule } from './components/StagingSandboxModule';

interface AuditItem {
  id: string;
  category: 'Technical' | 'Performance' | 'On-Page' | 'Content';
  severity: 'critical' | 'warning' | 'info';
  title: string;
  impact: string;
  fixTime: string;
}

export default function App() {
  const [specs, setSpecs] = useState<SystemSpecs | null>(null);
  const [targetUrl, setTargetUrl] = useState('https://agency-client.com');
  const [isAuditing, setIsAuditing] = useState(false);
  const [auditProgress, setAuditProgress] = useState(100);
  const [activeTab, setActiveTab] = useState<'overview' | 'staging' | 'issues' | 'architecture' | 'config'>('overview');

  const [audits] = useState<AuditItem[]>([
    {
      id: '1',
      category: 'Technical',
      severity: 'critical',
      title: 'Canonical Tag Conflict on 320 Faceted Filter URLs',
      impact: 'Estimated -18% organic link equity leakage on collection paths',
      fixTime: '15 min (Auto-patch via Staging)',
    },
    {
      id: '2',
      category: 'Performance',
      severity: 'critical',
      title: 'LCP Exceeds 4.8s on Mobile (Google CrUX vs Lab Delta)',
      impact: '7% mobile conversion drop per second above recommended threshold',
      fixTime: '30 min (Hero image fetchpriority & defer scripts)',
    },
    {
      id: '3',
      category: 'On-Page',
      severity: 'warning',
      title: 'Missing Schema.org Product & AggregateRating JSON-LD',
      impact: 'Zero rich snippet star displays in Google mobile SERPs',
      fixTime: '10 min (Generated Schema payload ready)',
    },
    {
      id: '4',
      category: 'Content',
      severity: 'info',
      title: '14 Legacy Promotional URLs Returning 404 (External Backlinks Lost)',
      impact: 'Wasting 89 referring domains with positive domain authority',
      fixTime: '5 min (Nginx 301 direct rule mapping)',
    },
  ]);

  useEffect(() => {
    invokeTauriCommand<SystemSpecs>('get_system_specs').then((data) => {
      setSpecs(data);
    });
  }, []);

  const handleRunAudit = () => {
    setIsAuditing(true);
    setAuditProgress(15);

    const interval = setInterval(() => {
      setAuditProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsAuditing(false);
          return 100;
        }
        return prev + 25;
      });
    }, 300);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-blue-600 selection:text-white">
      {/* Native Desktop Window Top Bar */}
      <header className="bg-slate-900 border-b border-slate-800 px-5 py-3 flex items-center justify-between select-none">
        {/* Zone 1: Single text element wordmark */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 mr-2">
            <span className="w-3 h-3 rounded-full bg-red-500/80 inline-block"></span>
            <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block"></span>
            <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block"></span>
          </div>
          <span className="text-base font-bold tracking-tight text-white">
            SEO Flow Studio
          </span>
          <span className="text-xs text-slate-400 border border-slate-700/80 rounded px-1.5 py-0.2 font-mono">
            {isTauriEnvironment() ? 'Tauri Native' : 'Tauri Core (Web Preview)'}
          </span>
        </div>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 text-xs font-medium text-slate-300">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-1 transition-colors ${
              activeTab === 'overview'
                ? 'text-blue-400 border-b-2 border-blue-500'
                : 'hover:text-white'
            }`}
          >
            Dashboard
          </button>
          <button
            onClick={() => setActiveTab('staging')}
            className={`py-1 transition-colors flex items-center gap-1.5 ${
              activeTab === 'staging'
                ? 'text-blue-400 border-b-2 border-blue-500'
                : 'hover:text-white'
            }`}
          >
            <Server className="w-3.5 h-3.5 text-emerald-400" />
            Staging Sandbox
          </button>
          <button
            onClick={() => setActiveTab('issues')}
            className={`py-1 transition-colors ${
              activeTab === 'issues'
                ? 'text-blue-400 border-b-2 border-blue-500'
                : 'hover:text-white'
            }`}
          >
            Actionable Issues ({audits.length})
          </button>
          <button
            onClick={() => setActiveTab('architecture')}
            className={`py-1 transition-colors ${
              activeTab === 'architecture'
                ? 'text-blue-400 border-b-2 border-blue-500'
                : 'hover:text-white'
            }`}
          >
            Tauri + React Engine
          </button>
          <button
            onClick={() => setActiveTab('config')}
            className={`py-1 transition-colors ${
              activeTab === 'config'
                ? 'text-blue-400 border-b-2 border-blue-500'
                : 'hover:text-white'
            }`}
          >
            Staging & Safe Fixes
          </button>
        </nav>

        {/* Zone 3: Primary Action */}
        <div className="flex items-center gap-3">
          <div className="text-xs text-slate-400 hidden sm:flex items-center gap-1.5">
            <Cpu className="w-3.5 h-3.5 text-emerald-400" />
            <span className="font-mono tabular-nums">
              {specs ? `${specs.memory_footprint_mb} MB RAM` : '32 MB RAM'}
            </span>
          </div>
          <button
            onClick={handleRunAudit}
            disabled={isAuditing}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 disabled:opacity-50 rounded-md transition-colors cursor-pointer"
          >
            <Play className="w-3 h-3 fill-current" />
            {isAuditing ? `Auditing (${auditProgress}%)` : 'Run Audit'}
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-[1400px] w-full mx-auto px-5 py-6 space-y-6">
        {/* Project Target Bar */}
        <section className="bg-slate-900/90 border border-slate-800 rounded-lg p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex-1 flex items-center gap-3">
            <div className="relative flex-1 max-w-xl">
              <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={targetUrl}
                onChange={(e) => setTargetUrl(e.target.value)}
                placeholder="https://example.com"
                className="w-full pl-9 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-md text-xs font-mono text-slate-200 focus:outline-none focus:border-blue-500"
              />
            </div>
            <div className="text-xs text-slate-400 hidden lg:block">
              Engine: <strong className="text-slate-200">Playwright (SPA) + Cheerio DOM</strong>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs text-slate-300">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Production Safety: Staging Sandbox Locked</span>
            </div>
          </div>
        </section>

        {activeTab === 'staging' && <StagingSandboxModule />}

        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Top Stat Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 bg-slate-900 border border-slate-800 rounded-lg">
                <span className="text-xs text-slate-400 block">Health Score</span>
                <div className="text-2xl font-bold font-mono text-emerald-400 tabular-nums mt-1">
                  84 / 100
                </div>
                <span className="text-[11px] text-slate-500 mt-1 block">
                  Audited with Google Lighthouse + CrUX data
                </span>
              </div>

              <div className="p-4 bg-slate-900 border border-slate-800 rounded-lg">
                <span className="text-xs text-slate-400 block">Revenue at Risk (Monthly)</span>
                <div className="text-2xl font-bold font-mono text-red-400 tabular-nums mt-1">
                  -$18,420 USD
                </div>
                <span className="text-[11px] text-slate-500 mt-1 block">
                  Translated directly from technical traffic loss
                </span>
              </div>

              <div className="p-4 bg-slate-900 border border-slate-800 rounded-lg">
                <span className="text-xs text-slate-400 block">Desktop App Memory (Tauri)</span>
                <div className="text-2xl font-bold font-mono text-blue-400 tabular-nums mt-1">
                  ~34.8 MB
                </div>
                <span className="text-[11px] text-slate-500 mt-1 block">
                  10x lighter than Electron (prevents crawl freezes)
                </span>
              </div>

              <div className="p-4 bg-slate-900 border border-slate-800 rounded-lg">
                <span className="text-xs text-slate-400 block">Staging Auto-Fixes Ready</span>
                <div className="text-2xl font-bold font-mono text-amber-400 tabular-nums mt-1">
                  4 Patches
                </div>
                <span className="text-[11px] text-slate-500 mt-1 block">
                  Verified backups generated before deployment
                </span>
              </div>
            </div>

            {/* Issue Prioritization & Value Matrix */}
            <div className="bg-slate-900 border border-slate-800 rounded-lg p-5 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <h2 className="text-sm font-semibold text-white">
                  Audited Issues & Commercial Impact
                </h2>
                <span className="text-xs text-slate-400 font-mono">
                  {audits.length} critical opportunities identified
                </span>
              </div>

              <div className="divide-y divide-slate-800/80">
                {audits.map((item) => (
                  <div key={item.id} className="py-3 flex flex-col md:flex-row md:items-center justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        {item.severity === 'critical' ? (
                          <span className="text-xs font-semibold text-red-400 flex items-center gap-1">
                            <AlertTriangle className="w-3.5 h-3.5" />
                            Critical
                          </span>
                        ) : item.severity === 'warning' ? (
                          <span className="text-xs font-semibold text-amber-400 flex items-center gap-1">
                            <AlertTriangle className="w-3.5 h-3.5" />
                            Warning
                          </span>
                        ) : (
                          <span className="text-xs font-semibold text-blue-400 flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Opportunity
                          </span>
                        )}
                        <span className="text-xs text-slate-500">·</span>
                        <span className="text-xs text-slate-400 font-medium">{item.category}</span>
                      </div>
                      <div className="text-sm font-semibold text-slate-100">{item.title}</div>
                      <div className="text-xs text-slate-400">{item.impact}</div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-xs text-slate-500 font-mono">{item.fixTime}</span>
                      <button className="px-3 py-1.5 text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded transition-colors cursor-pointer whitespace-nowrap">
                        Generate Staging Patch
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'issues' && (
          <div className="bg-slate-900 border border-slate-800 rounded-lg p-5 space-y-4">
            <h2 className="text-sm font-semibold text-white">
              Action Engine & Code Generation
            </h2>
            <p className="text-xs text-slate-400 leading-relaxed">
              Every SEO finding produces ready-to-deploy code snippets for Shopify Themes, WordPress WP REST API, or Nginx/Apache configuration, guarded by Staging tests and Pull Request creation.
            </p>

            <div className="bg-slate-950 border border-slate-800 rounded p-4 font-mono text-xs text-emerald-400 space-y-2 overflow-x-auto">
              <div className="text-slate-500">// Generated Canonical Normalization Rule (Shopify Liquid / Staging)</div>
              <div>{`{% if template contains 'collection' and current_tags %}`}</div>
              <div className="pl-4">{`<link rel="canonical" href="{{ shop.url }}{{ collection.url }}" />`}</div>
              <div className="pl-4">{`<meta name="robots" content="noindex, follow" />`}</div>
              <div>{`{% else %}`}</div>
              <div className="pl-4">{`<link rel="canonical" href="{{ canonical_url }}" />`}</div>
              <div>{`{% endif %}`}</div>
            </div>
          </div>
        )}

        {activeTab === 'architecture' && (
          <div className="bg-slate-900 border border-slate-800 rounded-lg p-5 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h2 className="text-sm font-semibold text-white flex items-center gap-2">
                <Layers className="w-4 h-4 text-blue-400" />
                Tauri + React Desktop Architecture Setup
              </h2>
              <span className="text-xs font-mono text-slate-400">
                src-tauri/tauri.conf.json & Cargo.toml
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-4 bg-slate-950 border border-slate-800 rounded-lg space-y-2">
                <span className="font-semibold text-blue-400 block">
                  1. Native Rust Core (src-tauri)
                </span>
                <p className="text-slate-400 leading-relaxed">
                  The backend runs a lean Rust process (~30MB RAM footprint). It manages OS integration, system tray, native file access for reports, and connects to background crawling workers without freezing the UI.
                </p>
                <div className="font-mono text-slate-500 text-[11px] pt-1">
                  Targets: Windows (.msi/.exe), macOS (.dmg), Linux (.AppImage)
                </div>
              </div>

              <div className="p-4 bg-slate-950 border border-slate-800 rounded-lg space-y-2">
                <span className="font-semibold text-emerald-400 block">
                  2. Modern React 19 Frontend (src)
                </span>
                <p className="text-slate-400 leading-relaxed">
                  Built with Vite 8 + Tailwind CSS. Leverages high-performance rendering, zero-pill discipline, tabular numerals, and responsive dashboard layouts communicating via Tauri IPC.
                </p>
                <div className="font-mono text-slate-500 text-[11px] pt-1">
                  Vite Dev Server: port 3000 (strictPort: true)
                </div>
              </div>
            </div>

            <div className="p-4 bg-blue-950/40 border border-blue-900/50 rounded-lg text-xs space-y-2">
              <div className="font-semibold text-blue-300 flex items-center gap-1.5">
                <Terminal className="w-4 h-4" />
                Developer CLI Commands to Run Locally:
              </div>
              <pre className="font-mono text-slate-300 bg-slate-950 p-3 rounded">
                <code>{`# 1. Install frontend dependencies
npm install

# 2. Run in web browser mode
npm run dev

# 3. Run in native desktop Tauri window
npm run tauri dev

# 4. Build native installer bundle
npm run tauri build`}</code>
              </pre>
            </div>
          </div>
        )}

        {activeTab === 'config' && (
          <div className="bg-slate-900 border border-slate-800 rounded-lg p-5 space-y-4">
            <h2 className="text-sm font-semibold text-white flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              Golden Rule Safeguards (Staging & Production Lock)
            </h2>
            <div className="text-xs text-slate-300 leading-relaxed space-y-2">
              <p>
                <strong>Never modify client production sites directly:</strong> Direct file injection into a live website can break checkouts or forms. SEO Flow Studio guarantees:
              </p>
              <ul className="list-disc pl-5 space-y-1 text-slate-400">
                <li>Automatic backup snapshot taken prior to any dispatch.</li>
                <li>Isolated deployment to Staging branches or dev servers first.</li>
                <li>Pull Request / ticket creation with step-by-step diff inspection.</li>
              </ul>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 border-t border-slate-800 px-5 py-3 text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-2">
        <span>SEO Flow Studio · Tauri (Rust) + React Native Architecture Foundation</span>
        <div className="flex items-center gap-4">
          <span>Version 0.1.0</span>
          <span>·</span>
          <span>Port 3000 IPC Ready</span>
        </div>
      </footer>
    </div>
  );
}
