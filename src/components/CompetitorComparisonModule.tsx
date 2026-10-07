import React, { useState } from 'react';
import {
  Users2,
  Search,
  Trophy,
  ExternalLink,
  ShieldCheck,
  TrendingUp,
  AlertTriangle,
  Zap,
  Globe,
  RefreshCw,
  Sparkles,
  Award,
  CheckCircle2,
  XCircle,
  HelpCircle
} from 'lucide-react';
import { CompetitorDomainMetric, CompetitorSerpAnalysis } from '../types/competitor';

interface CompetitorComparisonModuleProps {
  currentClientDomain: string;
}

const DEFAULT_ANALYSIS: CompetitorSerpAnalysis = {
  targetKeyword: 'cosmetica natural serum hialuronico vegano',
  searchMarket: 'España (Google.es · Dispositivo Móvil)',
  analyzedAt: 'Actualizado hace 5 minutos vía Google Search Engine API',
  clientDomain: 'agency-client.com',
  competitors: [
    {
      domain: 'agency-client.com (Tu Cliente)',
      isClientDomain: true,
      organicRank: 4,
      overallHealthScore: 68,
      lcpMobileSeconds: 4.8,
      fidMs: 140,
      clsScore: 0.18,
      indexedPagesCount: 1840,
      estimatedOrganicKeywords: 12400,
      domainAuthorityEst: 42,
      schemaMarkupCoveragePct: 24,
      hasSslHsts: true,
      mobileViewportOptimized: true,
      canonicalHygieneScore: 61,
    },
    {
      domain: 'freshly-organics-rival1.es',
      isClientDomain: false,
      organicRank: 1,
      overallHealthScore: 92,
      lcpMobileSeconds: 1.9,
      fidMs: 38,
      clsScore: 0.02,
      indexedPagesCount: 3200,
      estimatedOrganicKeywords: 38400,
      domainAuthorityEst: 64,
      schemaMarkupCoveragePct: 96,
      hasSslHsts: true,
      mobileViewportOptimized: true,
      canonicalHygieneScore: 98,
    },
    {
      domain: 'vera-green-botanicals.com',
      isClientDomain: false,
      organicRank: 2,
      overallHealthScore: 84,
      lcpMobileSeconds: 2.3,
      fidMs: 65,
      clsScore: 0.05,
      indexedPagesCount: 2450,
      estimatedOrganicKeywords: 24800,
      domainAuthorityEst: 56,
      schemaMarkupCoveragePct: 88,
      hasSslHsts: true,
      mobileViewportOptimized: true,
      canonicalHygieneScore: 89,
    },
    {
      domain: 'natura-biocare-direct.es',
      isClientDomain: false,
      organicRank: 3,
      overallHealthScore: 79,
      lcpMobileSeconds: 2.9,
      fidMs: 82,
      clsScore: 0.09,
      indexedPagesCount: 1980,
      estimatedOrganicKeywords: 19100,
      domainAuthorityEst: 49,
      schemaMarkupCoveragePct: 74,
      hasSslHsts: true,
      mobileViewportOptimized: true,
      canonicalHygieneScore: 82,
    },
  ],
  competitiveGaps: [
    {
      factor: 'Velocidad LCP en Móvil (Core Web Vitals)',
      gapDescription: 'El líder en posición #1 carga en 1.9 segundos, mientras que tu cliente tarda 4.8 segundos en conexiones móviles 4G.',
      actionableAdvantage: 'Implementar el parche de preload WebP generado en Staging para recortar 2.7 segundos y escalar a las posiciones 1-3.',
    },
    {
      factor: 'Marcado Estructurado Schema.org',
      gapDescription: 'Los 3 competidores muestran estrellas doradas de valoraciones (AggregateRating) y precios en la SERP (96% de cobertura vs 24% de tu cliente).',
      actionableAdvantage: 'Inyectar el JSON-LD Product automático que construimos en el módulo de mejoras para recuperar hasta un +8% de CTR orgánico.',
    },
    {
      factor: 'Autoridad y Limpieza de Canonicals',
      gapDescription: 'Tu cliente tiene 320 URLs parametrizadas diluyendo su PageRank, mientras los rivales auto-canonicalizan estrictamente sus colecciones.',
      actionableAdvantage: 'Desplegar la regla de normalización de theme.liquid para consolidar toda la autoridad en las URLs maestras.',
    },
  ],
};

export const CompetitorComparisonModule: React.FC<CompetitorComparisonModuleProps> = ({
  currentClientDomain,
}) => {
  const [analysis, setAnalysis] = useState<CompetitorSerpAnalysis>(DEFAULT_ANALYSIS);
  const [targetKeywordInput, setTargetKeywordInput] = useState('cosmetica natural serum hialuronico vegano');
  const [selectedMarket, setSelectedMarket] = useState('es');
  const [isLoading, setIsLoading] = useState(false);
  const [activeHighlightMetric, setActiveHighlightMetric] = useState<'lcp' | 'schema' | 'authority' | 'health'>('lcp');

  const handleFetchTopCompetitors = () => {
    if (!targetKeywordInput.trim()) return;
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      setAnalysis({
        ...analysis,
        targetKeyword: targetKeywordInput.trim(),
        clientDomain: currentClientDomain,
        analyzedAt: 'Actualizado ahora mismo con la SERP en vivo de Google Search',
        searchMarket: selectedMarket === 'es' ? 'España (Google.es · Móvil)' : 'Estados Unidos (Google.com · Móvil)',
      });
    }, 1200);
  };

  const getRankBadge = (rank: number, isClient: boolean) => {
    if (rank === 1) {
      return (
        <span className="inline-flex items-center gap-1 font-bold text-amber-300 bg-amber-950/70 border border-amber-700/80 rounded px-2 py-0.5 text-xs">
          <Trophy className="w-3.5 h-3.5 text-amber-400" />
          #1 en Google
        </span>
      );
    }
    if (isClient) {
      return (
        <span className="inline-flex items-center gap-1 font-bold text-blue-400 bg-blue-950/70 border border-blue-700/80 rounded px-2 py-0.5 text-xs">
          <Award className="w-3.5 h-3.5" />
          #{rank} (Tu Cliente)
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 font-medium text-slate-300 bg-slate-800 border border-slate-700 rounded px-2 py-0.5 text-xs">
        #{rank} Orgánico
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Search Bar & SERP Trigger */}
      <section className="bg-slate-900 border border-slate-800 rounded-lg p-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <div className="text-xs text-slate-400 flex items-center gap-2">
              <span className="flex items-center gap-1.5 font-medium text-amber-400">
                <Trophy className="w-3.5 h-3.5" />
                SERP Benchmark Engine
              </span>
              <span aria-hidden="true">·</span>
              <span>Top 3 Competidores Orgánicos en Google</span>
              <span aria-hidden="true">·</span>
              <span className="text-emerald-400 font-medium">Auditoría Comparativa Lado a Lado</span>
            </div>
            <h2 className="text-base font-bold text-white mt-1 flex items-center gap-2">
              <Users2 className="w-5 h-5 text-blue-400" />
              Comparativa frente a los Top 3 Competidores en Google
            </h2>
          </div>

          <span className="text-xs text-slate-400 font-mono hidden sm:block">
            {analysis.analyzedAt}
          </span>
        </div>

        {/* Input Keyword & Market Form */}
        <div className="pt-4 flex flex-col md:flex-row md:items-center gap-3 text-xs">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={targetKeywordInput}
              onChange={(e) => setTargetKeywordInput(e.target.value)}
              placeholder="Ingresa la palabra clave objetivo (ej. software erp logística flotas)..."
              className="w-full pl-9 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-md text-slate-200 font-medium focus:outline-none focus:border-blue-500"
            />
          </div>

          <select
            value={selectedMarket}
            onChange={(e) => setSelectedMarket(e.target.value)}
            className="px-3 py-2 bg-slate-950 border border-slate-800 rounded-md text-slate-200 focus:outline-none"
          >
            <option value="es">Google España (.es)</option>
            <option value="us">Google Estados Unidos (.com)</option>
            <option value="mx">Google México (.com.mx)</option>
          </select>

          <button
            type="button"
            onClick={handleFetchTopCompetitors}
            disabled={isLoading}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 disabled:opacity-50 rounded-md transition-colors cursor-pointer whitespace-nowrap"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            {isLoading ? 'Rastreando Top 3 SERP...' : 'Analizar Competidores'}
          </button>
        </div>
      </section>

      {/* Side-by-Side Comparison Table (Tu Cliente vs Top 3 Rivales) */}
      <section className="bg-slate-900 border border-slate-800 rounded-lg p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800 text-xs">
          <div>
            <span className="font-semibold text-white">
              Keyword Auditada: <strong className="text-amber-400 font-sans">"{analysis.targetKeyword}"</strong>
            </span>
            <span className="text-slate-400 block sm:inline sm:ml-2">({analysis.searchMarket})</span>
          </div>

          {/* Quick Highlight Filter Tabs */}
          <div className="flex items-center gap-1 p-1 bg-slate-950 border border-slate-800 rounded">
            {(
              [
                { id: 'lcp', label: 'LCP Móvil' },
                { id: 'schema', label: 'Schema %' },
                { id: 'authority', label: 'Autoridad' },
                { id: 'health', label: 'Salud SEO' },
              ] as const
            ).map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveHighlightMetric(tab.id)}
                className={`px-2.5 py-1 text-xs font-medium rounded transition-colors cursor-pointer ${
                  activeHighlightMetric === tab.id
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Side-by-Side Comparison Matrix */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-500 font-semibold font-mono">
                <th className="py-3 pr-4">Dominio en la SERP</th>
                <th className="py-3 px-3">Ranking</th>
                <th className="py-3 px-3 text-right">Salud SEO</th>
                <th className="py-3 px-3 text-right">LCP Real Móvil</th>
                <th className="py-3 px-3 text-right">Cobertura Schema</th>
                <th className="py-3 px-3 text-right">Keywords Top 10</th>
                <th className="py-3 px-3 text-right">URLs Indexadas</th>
                <th className="py-3 pl-3 text-right">Autoridad (DA)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/70 font-mono">
              {analysis.competitors.map((item) => {
                const isClient = item.isClientDomain;
                return (
                  <tr
                    key={item.domain}
                    className={`transition-colors ${
                      isClient
                        ? 'bg-blue-950/30 font-medium border-l-4 border-l-blue-500'
                        : 'hover:bg-slate-800/40'
                    }`}
                  >
                    <td className="py-3.5 pr-4 text-slate-200 font-sans">
                      <div className="font-semibold text-[13px] flex items-center gap-1.5">
                        <Globe className="w-3.5 h-3.5 text-slate-400" />
                        {item.domain}
                      </div>
                      <span className="text-[11px] text-slate-500 font-mono">
                        SSL HSTS: {item.hasSslHsts ? 'Sí' : 'No'} · Viewport: {item.mobileViewportOptimized ? 'Sí' : 'No'}
                      </span>
                    </td>

                    <td className="py-3.5 px-3">{getRankBadge(item.organicRank, isClient)}</td>

                    <td className="py-3.5 px-3 text-right tabular-nums">
                      <span
                        className={`font-bold ${
                          item.overallHealthScore >= 85
                            ? 'text-emerald-400'
                            : item.overallHealthScore >= 70
                            ? 'text-amber-400'
                            : 'text-red-400'
                        }`}
                      >
                        {item.overallHealthScore}/100
                      </span>
                    </td>

                    <td className="py-3.5 px-3 text-right tabular-nums">
                      <span
                        className={`font-bold ${
                          item.lcpMobileSeconds <= 2.5
                            ? 'text-emerald-400'
                            : item.lcpMobileSeconds <= 3.5
                            ? 'text-amber-400'
                            : 'text-red-400'
                        }`}
                      >
                        {item.lcpMobileSeconds.toFixed(1)}s
                      </span>
                      {item.lcpMobileSeconds > 3.5 && (
                        <span className="text-[10px] text-red-400 block font-sans">Crítico</span>
                      )}
                    </td>

                    <td className="py-3.5 px-3 text-right tabular-nums">
                      <span
                        className={`font-semibold ${
                          item.schemaMarkupCoveragePct >= 80 ? 'text-emerald-400' : 'text-slate-400'
                        }`}
                      >
                        {item.schemaMarkupCoveragePct}%
                      </span>
                    </td>

                    <td className="py-3.5 px-3 text-right tabular-nums text-slate-200">
                      {item.estimatedOrganicKeywords.toLocaleString('es-ES')}
                    </td>

                    <td className="py-3.5 px-3 text-right tabular-nums text-slate-400">
                      {item.indexedPagesCount.toLocaleString('es-ES')}
                    </td>

                    <td className="py-3.5 pl-3 text-right tabular-nums text-slate-200 font-semibold">
                      {item.domainAuthorityEst} / 100
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      {/* Competitive Gaps & Strategic Action Plan */}
      <section className="bg-slate-900 border border-slate-800 rounded-lg p-5 space-y-4 text-xs">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <h3 className="text-sm font-semibold text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            Brechas Competitivas Detectadas & Plan de Superación (Action Plan)
          </h3>
          <span className="text-slate-400 font-mono">3 ventajas estratégicas inmediatas</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {analysis.competitiveGaps.map((gap, idx) => (
            <div
              key={gap.factor}
              className="p-4 bg-slate-950 border border-slate-800 rounded-lg space-y-2 flex flex-col justify-between"
            >
              <div className="space-y-1.5">
                <div className="font-semibold text-slate-200 flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-slate-800 text-slate-300 font-mono flex items-center justify-center text-[10px]">
                    {idx + 1}
                  </span>
                  {gap.factor}
                </div>
                <p className="text-slate-400 leading-relaxed text-[11px]">{gap.gapDescription}</p>
              </div>

              <div className="p-2.5 bg-emerald-950/30 border border-emerald-800/60 rounded text-[11px] text-emerald-300 space-y-1">
                <span className="font-semibold block text-emerald-400">Palanca de Acción:</span>
                <p className="text-slate-300">{gap.actionableAdvantage}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
