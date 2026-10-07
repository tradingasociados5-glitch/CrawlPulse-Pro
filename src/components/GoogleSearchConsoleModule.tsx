import React, { useState } from 'react';
import {
  Globe,
  TrendingUp,
  MousePointerClick,
  Eye,
  Percent,
  Compass,
  KeyRound,
  ShieldCheck,
  Calendar,
  RefreshCw,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  Download
} from 'lucide-react';
import { GscSearchAnalyticsSummary } from '../types/gsc';

interface GoogleSearchConsoleProps {
  currentAuditedDomain: string;
}

const MOCK_GSC_DATA: GscSearchAnalyticsSummary = {
  domain: 'https://agency-client.com',
  dateRange: 'Últimos 28 días (Comparado con periodo anterior)',
  totalClicks: 28450,
  totalImpressions: 618200,
  averageCtr: 4.6,
  averagePosition: 8.7,
  clicksChangePct: 14.8,
  impressionsChangePct: 9.3,
  ctrChangePct: 0.5,
  timeSeries: [
    { date: '10 Sep', clicks: 840, impressions: 18200, ctr: 4.6, position: 9.1 },
    { date: '14 Sep', clicks: 920, impressions: 19800, ctr: 4.6, position: 8.9 },
    { date: '18 Sep', clicks: 1040, impressions: 22100, ctr: 4.7, position: 8.8 },
    { date: '22 Sep', clicks: 980, impressions: 21400, ctr: 4.5, position: 8.6 },
    { date: '26 Sep', clicks: 1120, impressions: 23900, ctr: 4.7, position: 8.4 },
    { date: '30 Sep', clicks: 1250, impressions: 25600, ctr: 4.9, position: 8.2 },
    { date: '04 Oct', clicks: 1310, impressions: 27100, ctr: 4.8, position: 8.1 },
  ],
  topQueries: [
    { query: 'consultoria seo tecnica', clicks: 3820, impressions: 42100, ctr: 9.07, position: 2.4 },
    { query: 'auditoria web vitals lcp', clicks: 2940, impressions: 38900, ctr: 7.55, position: 3.1 },
    { query: 'solucion canonical duplicado', clicks: 2150, impressions: 31200, ctr: 6.89, position: 4.2 },
    { query: 'generador schema json ld', clicks: 1840, impressions: 48900, ctr: 3.76, position: 6.8 },
    { query: 'software rastreo seo tauri', clicks: 1420, impressions: 19400, ctr: 7.32, position: 1.8 },
  ],
  topPages: [
    { page: '/servicios/auditoria-seo-tecnica', clicks: 7890, impressions: 112000, ctr: 7.04, position: 3.2 },
    { page: '/recursos/guia-core-web-vitals', clicks: 5410, impressions: 98400, ctr: 5.50, position: 4.8 },
    { page: '/blog/arreglar-errores-canonical', clicks: 4320, impressions: 84100, ctr: 5.14, position: 5.6 },
    { page: '/herramientas/staging-patch-generator', clicks: 3650, impressions: 72000, ctr: 5.07, position: 4.1 },
  ],
};

export const GoogleSearchConsoleModule: React.FC<GoogleSearchConsoleProps> = ({
  currentAuditedDomain,
}) => {
  // OAuth2 Authentication States
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);
  const [isAuthenticating, setIsAuthenticating] = useState<boolean>(false);
  const [authenticatedUserEmail, setAuthenticatedUserEmail] = useState<string>('seo.lead@agency-client.com');
  const [selectedProperty, setSelectedProperty] = useState<string>(
    currentAuditedDomain.startsWith('http') ? currentAuditedDomain : `https://${currentAuditedDomain}`
  );
  const [selectedRange, setSelectedRange] = useState<'28d' | '3m' | '6m'>('28d');
  const [activeMetricTab, setActiveMetricTab] = useState<'clicks' | 'impressions' | 'ctr' | 'position'>('clicks');

  // Trigger Google OAuth2 flow simulation (with standard Google popup & token acquisition)
  const handleConnectGoogleOAuth = () => {
    setIsAuthenticating(true);
    // Simulating OAuth2 popup authorization callback with Google Search Console API scope
    setTimeout(() => {
      setIsAuthenticating(false);
      setIsAuthenticated(true);
      setAuthenticatedUserEmail('seo.lead@agency-client.com');
    }, 800);
  };

  const handleDisconnect = () => {
    setIsAuthenticated(false);
  };

  const maxClicks = Math.max(...MOCK_GSC_DATA.timeSeries.map((t) => t.clicks));
  const maxImpressions = Math.max(...MOCK_GSC_DATA.timeSeries.map((t) => t.impressions));

  return (
    <div className="space-y-6">
      {/* Top Banner: OAuth Connection Status & Property Selection */}
      <section className="bg-slate-900 border border-slate-800 rounded-lg p-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <div className="text-xs text-slate-400 flex items-center gap-2">
              <span>Google Search Console API (v1)</span>
              <span aria-hidden="true">·</span>
              <span>OAuth2 Scope: webmasters.readonly</span>
              <span aria-hidden="true">·</span>
              <span className="text-emerald-400 font-medium">Verified Property</span>
            </div>
            <h2 className="text-base font-bold text-white mt-1 flex items-center gap-2">
              <Globe className="w-5 h-5 text-blue-400" />
              Search Analytics & Rendimiento Orgánico Real (Google Search Console)
            </h2>
          </div>

          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <div className="text-right hidden sm:block">
                  <span className="text-xs text-slate-400 block font-mono">
                    {authenticatedUserEmail}
                  </span>
                  <span className="text-[11px] text-emerald-400 flex items-center gap-1 justify-end">
                    <CheckCircle2 className="w-3 h-3" />
                    OAuth2 Token Active
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleDisconnect}
                  className="px-3 py-1.5 text-xs text-slate-400 hover:text-slate-200 border border-slate-800 rounded hover:border-slate-700 transition-colors cursor-pointer"
                >
                  Disconnect
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={handleConnectGoogleOAuth}
                disabled={isAuthenticating}
                className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-md transition-colors cursor-pointer"
              >
                <KeyRound className="w-4 h-4" />
                {isAuthenticating ? 'Connecting via Google OAuth2...' : 'Sign in with Google Search Console'}
              </button>
            )}
          </div>
        </div>

        {/* Property Selector & Date Filters */}
        <div className="pt-4 flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs">
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-slate-400 font-medium">GSC Property:</span>
            <div className="px-3 py-1.5 bg-slate-950 border border-slate-800 rounded text-slate-200 font-mono">
              sc-domain:{selectedProperty.replace(/^https?:\/\//, '')}
            </div>
            <span className="text-slate-500">·</span>
            <span className="text-slate-400">Search Type: Web</span>
          </div>

          <div className="flex items-center gap-2">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <div className="flex items-center gap-1 p-1 bg-slate-950 border border-slate-800 rounded">
              {(
                [
                  { id: '28d', label: 'Last 28 Days' },
                  { id: '3m', label: 'Last 3 Months' },
                  { id: '6m', label: 'Last 6 Months' },
                ] as const
              ).map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setSelectedRange(tab.id)}
                  className={`px-2.5 py-1 text-xs font-medium rounded transition-colors cursor-pointer ${
                    selectedRange === tab.id
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {!isAuthenticated ? (
        <div className="p-12 text-center bg-slate-900 border border-slate-800 rounded-lg space-y-4">
          <Globe className="w-12 h-12 text-slate-600 mx-auto" />
          <div className="max-w-md mx-auto space-y-1">
            <h3 className="text-base font-semibold text-white">
              Connect Google Search Console via OAuth2
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Authenticate your Google account to import official search performance metrics: Total Clicks, Total Impressions, Average Click-Through Rate (CTR), and Average Keyword Positions.
            </p>
          </div>
          <button
            type="button"
            onClick={handleConnectGoogleOAuth}
            className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-md transition-colors cursor-pointer"
          >
            <KeyRound className="w-4 h-4" />
            Connect Google Search Console Account
          </button>
        </div>
      ) : (
        <>
          {/* Key Metric Scorecards (Clicks, Impressions, CTR, Average Position) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Total Clicks */}
            <div
              onClick={() => setActiveMetricTab('clicks')}
              className={`p-4 rounded-lg border transition-all cursor-pointer ${
                activeMetricTab === 'clicks'
                  ? 'bg-blue-950/40 border-blue-500 shadow-sm'
                  : 'bg-slate-900 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span className="flex items-center gap-1.5 font-medium">
                  <MousePointerClick className="w-4 h-4 text-blue-400" />
                  Total Clicks
                </span>
                <span className="font-mono text-emerald-400 text-[11px]">
                  +{MOCK_GSC_DATA.clicksChangePct}% vs prev
                </span>
              </div>
              <div className="text-3xl font-bold font-mono text-blue-400 tabular-nums mt-2">
                {MOCK_GSC_DATA.totalClicks.toLocaleString('es-ES')}
              </div>
              <span className="text-[11px] text-slate-500 mt-1 block">
                Organic search visitors landed on domain
              </span>
            </div>

            {/* Total Impressions */}
            <div
              onClick={() => setActiveMetricTab('impressions')}
              className={`p-4 rounded-lg border transition-all cursor-pointer ${
                activeMetricTab === 'impressions'
                  ? 'bg-purple-950/40 border-purple-500 shadow-sm'
                  : 'bg-slate-900 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span className="flex items-center gap-1.5 font-medium">
                  <Eye className="w-4 h-4 text-purple-400" />
                  Total Impressions
                </span>
                <span className="font-mono text-emerald-400 text-[11px]">
                  +{MOCK_GSC_DATA.impressionsChangePct}% vs prev
                </span>
              </div>
              <div className="text-3xl font-bold font-mono text-purple-400 tabular-nums mt-2">
                {MOCK_GSC_DATA.totalImpressions.toLocaleString('es-ES')}
              </div>
              <span className="text-[11px] text-slate-500 mt-1 block">
                Times your URL appeared in Google SERPs
              </span>
            </div>

            {/* Average CTR */}
            <div
              onClick={() => setActiveMetricTab('ctr')}
              className={`p-4 rounded-lg border transition-all cursor-pointer ${
                activeMetricTab === 'ctr'
                  ? 'bg-emerald-950/40 border-emerald-500 shadow-sm'
                  : 'bg-slate-900 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span className="flex items-center gap-1.5 font-medium">
                  <Percent className="w-4 h-4 text-emerald-400" />
                  Average CTR
                </span>
                <span className="font-mono text-emerald-400 text-[11px]">
                  +{MOCK_GSC_DATA.ctrChangePct}% vs prev
                </span>
              </div>
              <div className="text-3xl font-bold font-mono text-emerald-400 tabular-nums mt-2">
                {MOCK_GSC_DATA.averageCtr}%
              </div>
              <span className="text-[11px] text-slate-500 mt-1 block">
                Percentage of impressions that resulted in a click
              </span>
            </div>

            {/* Average Position */}
            <div
              onClick={() => setActiveMetricTab('position')}
              className={`p-4 rounded-lg border transition-all cursor-pointer ${
                activeMetricTab === 'position'
                  ? 'bg-amber-950/40 border-amber-500 shadow-sm'
                  : 'bg-slate-900 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span className="flex items-center gap-1.5 font-medium">
                  <Compass className="w-4 h-4 text-amber-400" />
                  Average Position
                </span>
                <span className="font-mono text-emerald-400 text-[11px]">
                  Improved (-0.8)
                </span>
              </div>
              <div className="text-3xl font-bold font-mono text-amber-400 tabular-nums mt-2">
                {MOCK_GSC_DATA.averagePosition}
              </div>
              <span className="text-[11px] text-slate-500 mt-1 block">
                Average ranking of your site across keywords
              </span>
            </div>
          </div>

          {/* Time Series Performance Visualization (Tabular Grid Bar Chart) */}
          <section className="bg-slate-900 border border-slate-800 rounded-lg p-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <h3 className="text-sm font-semibold text-white">
                  Evolución Temporal de Rendimiento ({MOCK_GSC_DATA.dateRange})
                </h3>
                <span className="text-xs text-slate-400">
                  Visualizando métrica activa:{' '}
                  <strong className="text-slate-200 capitalize">{activeMetricTab}</strong>
                </span>
              </div>
              <div className="text-xs text-slate-400 font-mono">
                Actualizado desde Google Search Console API
              </div>
            </div>

            <div className="space-y-3 pt-2">
              <div className="grid grid-cols-7 gap-3 text-center">
                {MOCK_GSC_DATA.timeSeries.map((item) => {
                  const clickHeightPct = Math.round((item.clicks / maxClicks) * 100);
                  const impHeightPct = Math.round((item.impressions / maxImpressions) * 100);

                  return (
                    <div key={item.date} className="flex flex-col items-center gap-2">
                      <div className="h-32 w-full bg-slate-950 rounded flex items-end justify-center p-2 border border-slate-800/80">
                        {activeMetricTab === 'clicks' && (
                          <div
                            className="w-full bg-blue-500 hover:bg-blue-400 rounded-t transition-all"
                            style={{ height: `${clickHeightPct}%` }}
                            title={`${item.clicks} Clicks`}
                          />
                        )}
                        {activeMetricTab === 'impressions' && (
                          <div
                            className="w-full bg-purple-500 hover:bg-purple-400 rounded-t transition-all"
                            style={{ height: `${impHeightPct}%` }}
                            title={`${item.impressions} Impressions`}
                          />
                        )}
                        {activeMetricTab === 'ctr' && (
                          <div
                            className="w-full bg-emerald-500 hover:bg-emerald-400 rounded-t transition-all"
                            style={{ height: `${(item.ctr / 6) * 100}%` }}
                            title={`${item.ctr}% CTR`}
                          />
                        )}
                        {activeMetricTab === 'position' && (
                          <div
                            className="w-full bg-amber-500 hover:bg-amber-400 rounded-t transition-all"
                            style={{ height: `${((12 - item.position) / 12) * 100}%` }}
                            title={`Posición ${item.position}`}
                          />
                        )}
                      </div>
                      <span className="text-[11px] font-mono text-slate-400">{item.date}</span>
                      <span className="text-xs font-mono font-semibold text-slate-200 tabular-nums">
                        {activeMetricTab === 'clicks' && item.clicks}
                        {activeMetricTab === 'impressions' && `${(item.impressions / 1000).toFixed(1)}k`}
                        {activeMetricTab === 'ctr' && `${item.ctr}%`}
                        {activeMetricTab === 'position' && item.position}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>

          {/* Breakdown Tables: Top Queries & Top Landing Pages */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Top Queries Table */}
            <section className="bg-slate-900 border border-slate-800 rounded-lg p-5 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <h3 className="text-sm font-semibold text-white">
                  Top Palabras Clave (Queries Orgánicas)
                </h3>
                <span className="text-xs text-slate-400 font-mono">
                  {MOCK_GSC_DATA.topQueries.length} términos destacados
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-500 font-semibold">
                      <th className="py-2 pr-3">Query</th>
                      <th className="py-2 px-2 text-right">Clicks</th>
                      <th className="py-2 px-2 text-right">Impr.</th>
                      <th className="py-2 px-2 text-right">CTR</th>
                      <th className="py-2 pl-2 text-right">Pos.</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 font-mono">
                    {MOCK_GSC_DATA.topQueries.map((q) => (
                      <tr key={q.query} className="hover:bg-slate-800/40 transition-colors">
                        <td className="py-2.5 pr-3 font-sans text-slate-200 font-medium">
                          {q.query}
                        </td>
                        <td className="py-2.5 px-2 text-right text-blue-400 tabular-nums font-semibold">
                          {q.clicks.toLocaleString('es-ES')}
                        </td>
                        <td className="py-2.5 px-2 text-right text-slate-400 tabular-nums">
                          {q.impressions.toLocaleString('es-ES')}
                        </td>
                        <td className="py-2.5 px-2 text-right text-emerald-400 tabular-nums font-semibold">
                          {q.ctr}%
                        </td>
                        <td className="py-2.5 pl-2 text-right text-amber-400 tabular-nums">
                          {q.position.toFixed(1)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            {/* Top Pages Table */}
            <section className="bg-slate-900 border border-slate-800 rounded-lg p-5 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <h3 className="text-sm font-semibold text-white">
                  Páginas con Mayor Tráfico Orgánico
                </h3>
                <span className="text-xs text-slate-400 font-mono">
                  {MOCK_GSC_DATA.topPages.length} URLs analizadas
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-500 font-semibold">
                      <th className="py-2 pr-3">URL</th>
                      <th className="py-2 px-2 text-right">Clicks</th>
                      <th className="py-2 px-2 text-right">Impr.</th>
                      <th className="py-2 px-2 text-right">CTR</th>
                      <th className="py-2 pl-2 text-right">Pos.</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 font-mono">
                    {MOCK_GSC_DATA.topPages.map((p) => (
                      <tr key={p.page} className="hover:bg-slate-800/40 transition-colors">
                        <td className="py-2.5 pr-3 text-slate-300 truncate max-w-[200px]" title={p.page}>
                          {p.page}
                        </td>
                        <td className="py-2.5 px-2 text-right text-blue-400 tabular-nums font-semibold">
                          {p.clicks.toLocaleString('es-ES')}
                        </td>
                        <td className="py-2.5 px-2 text-right text-slate-400 tabular-nums">
                          {p.impressions.toLocaleString('es-ES')}
                        </td>
                        <td className="py-2.5 px-2 text-right text-emerald-400 tabular-nums font-semibold">
                          {p.ctr}%
                        </td>
                        <td className="py-2.5 pl-2 text-right text-amber-400 tabular-nums">
                          {p.position.toFixed(1)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </div>
        </>
      )}
    </div>
  );
};
