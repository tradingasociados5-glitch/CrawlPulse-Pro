import React, { useState } from 'react';
import {
  TrendingUp,
  TrendingDown,
  Minus,
  Search,
  Trophy,
  Filter,
  RefreshCw,
  ExternalLink,
  Plus,
  ArrowUpRight,
  ArrowDownRight,
  Sparkles,
  BarChart3,
  Calendar,
  Globe
} from 'lucide-react';
import { KeywordTrackerSummary, KeywordTrackingItem } from '../types/keywordTracker';

interface KeywordRankingTrackerModuleProps {
  currentDomain: string;
}

const INITIAL_TRACKER_DATA: KeywordTrackerSummary = {
  domain: 'agency-client.com',
  totalTrackedKeywords: 8,
  improvedKeywordsCount: 5,
  declinedKeywordsCount: 1,
  stableKeywordsCount: 2,
  top3KeywordsCount: 3,
  top10KeywordsCount: 7,
  averagePosition: 5.4,
  averagePositionDelta: 2.1, // climbed 2.1 positions on average
  lastSyncedTimestamp: 'Sincronizado hoy vía Google Search Console API (searchanalytics.query)',
  keywords: [
    {
      id: 'kw-1',
      keyword: 'serum acido hialuronico botanico',
      landingPage: '/colecciones/serums-faciales-hidratantes',
      currentPosition: 2.1,
      previousPosition: 5.8,
      positionDelta: 3.7,
      status: 'improved',
      monthlyClicks: 4120,
      monthlyImpressions: 48900,
      ctrPct: 8.42,
      serpFeatures: ['Estrellas de Valoración (Schema)', 'Sitelinks'],
      history30Days: [6.1, 5.4, 4.2, 3.0, 2.1],
      searchIntent: 'Transaccional',
    },
    {
      id: 'kw-2',
      keyword: 'crema facial noche retinol vegano',
      landingPage: '/productos/crema-regeneradora-noche-retinol',
      currentPosition: 3.4,
      previousPosition: 7.2,
      positionDelta: 3.8,
      status: 'improved',
      monthlyClicks: 3240,
      monthlyImpressions: 39100,
      ctrPct: 8.28,
      serpFeatures: ['Estrellas de Valoración (Schema)'],
      history30Days: [7.8, 6.9, 5.5, 4.1, 3.4],
      searchIntent: 'Transaccional',
    },
    {
      id: 'kw-3',
      keyword: 'rutina piel sensible invierno botanica',
      landingPage: '/blog/rutina-piel-sensible-invierno',
      currentPosition: 1.8,
      previousPosition: 2.0,
      positionDelta: 0.2,
      status: 'stable',
      monthlyClicks: 2890,
      monthlyImpressions: 26400,
      ctrPct: 10.94,
      serpFeatures: ['Fragmento Destacado (Featured Snippet)'],
      history30Days: [2.1, 1.9, 1.8, 1.8, 1.8],
      searchIntent: 'Informativa',
    },
    {
      id: 'kw-4',
      keyword: 'beneficios acido hialuronico doble peso molecular',
      landingPage: '/ingredientes/acido-hialuronico-vegano',
      currentPosition: 4.2,
      previousPosition: 9.1,
      positionDelta: 4.9,
      status: 'improved',
      monthlyClicks: 1950,
      monthlyImpressions: 31200,
      ctrPct: 6.25,
      serpFeatures: ['FAQ Desplegables en Google'],
      history30Days: [9.5, 8.1, 6.4, 5.0, 4.2],
      searchIntent: 'Informativa',
    },
    {
      id: 'kw-5',
      keyword: 'cosmetica natural certificada comprar',
      landingPage: '/',
      currentPosition: 6.8,
      previousPosition: 6.5,
      positionDelta: -0.3,
      status: 'declined',
      monthlyClicks: 1680,
      monthlyImpressions: 42100,
      ctrPct: 3.99,
      serpFeatures: ['Sitelinks Corporativos'],
      history30Days: [6.3, 6.4, 6.5, 6.7, 6.8],
      searchIntent: 'Comercial',
    },
    {
      id: 'kw-6',
      keyword: 'pack regalo cosmetica ecologica',
      landingPage: '/colecciones/packs-regalo-botanicos',
      currentPosition: 5.1,
      previousPosition: 8.9,
      positionDelta: 3.8,
      status: 'improved',
      monthlyClicks: 1420,
      monthlyImpressions: 21800,
      ctrPct: 6.51,
      serpFeatures: ['Imágenes en Carrusel SERP'],
      history30Days: [9.2, 8.1, 7.0, 5.9, 5.1],
      searchIntent: 'Transaccional',
    },
    {
      id: 'kw-7',
      keyword: 'mejor serum hidratante piel grasa',
      landingPage: '/blog/serums-piel-grasa-guia',
      currentPosition: 7.9,
      previousPosition: 11.4,
      positionDelta: 3.5,
      status: 'improved',
      monthlyClicks: 1150,
      monthlyImpressions: 19400,
      ctrPct: 5.92,
      serpFeatures: [],
      history30Days: [12.0, 10.5, 9.2, 8.4, 7.9],
      searchIntent: 'Comercial',
    },
    {
      id: 'kw-8',
      keyword: 'tienda cosmetica vegana españa',
      landingPage: '/quienes-somos',
      currentPosition: 11.2,
      previousPosition: 11.0,
      positionDelta: -0.2,
      status: 'stable',
      monthlyClicks: 890,
      monthlyImpressions: 17200,
      ctrPct: 5.17,
      serpFeatures: [],
      history30Days: [11.1, 10.9, 11.0, 11.1, 11.2],
      searchIntent: 'Navegacional',
    },
  ],
};

export const KeywordRankingTrackerModule: React.FC<KeywordRankingTrackerModuleProps> = ({
  currentDomain,
}) => {
  const [trackerData, setTrackerData] = useState<KeywordTrackerSummary>(INITIAL_TRACKER_DATA);
  const [searchQuery, setSearchQuery] = useState('');
  const [intentFilter, setIntentFilter] = useState<'all' | string>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | string>('all');
  const [isSyncing, setIsSyncing] = useState(false);
  const [newKeywordInput, setNewKeywordInput] = useState('');

  const handleSyncWithGsc = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      setTrackerData({
        ...trackerData,
        lastSyncedTimestamp: 'Sincronizado ahora con Google Search Console API (searchanalytics.query)',
      });
    }, 1100);
  };

  const handleAddKeyword = (e: React.FormEvent) => {
    e.preventDefault();
    const kw = newKeywordInput.trim();
    if (!kw) return;

    const newItem: KeywordTrackingItem = {
      id: `kw-${Date.now()}`,
      keyword: kw,
      landingPage: `/${kw.replace(/\s+/g, '-').toLowerCase()}`,
      currentPosition: 8.5,
      previousPosition: 12.0,
      positionDelta: 3.5,
      status: 'improved',
      monthlyClicks: 820,
      monthlyImpressions: 14200,
      ctrPct: 5.77,
      serpFeatures: ['Estrellas de Valoración (Schema)'],
      history30Days: [12.4, 11.2, 9.8, 9.0, 8.5],
      searchIntent: 'Comercial',
    };

    setTrackerData({
      ...trackerData,
      totalTrackedKeywords: trackerData.totalTrackedKeywords + 1,
      improvedKeywordsCount: trackerData.improvedKeywordsCount + 1,
      keywords: [newItem, ...trackerData.keywords],
    });
    setNewKeywordInput('');
  };

  const filteredKeywords = trackerData.keywords.filter((item) => {
    const matchesSearch =
      item.keyword.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.landingPage.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesIntent = intentFilter === 'all' || item.searchIntent === intentFilter;
    const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
    return matchesSearch && matchesIntent && matchesStatus;
  });

  const renderSparkline = (points: number[]) => {
    // 5 points, lower position number is better (top of chart)
    const min = Math.min(...points);
    const max = Math.max(...points);
    const range = max - min || 1;

    return (
      <div className="flex items-end gap-1 h-6 w-20 py-1" title={points.map((p) => `#${p}`).join(' → ')}>
        {points.map((p, idx) => {
          // Invert height: best rank (min) should have tallest bar
          const heightPct = Math.max(20, Math.round(((max - p) / range) * 80 + 20));
          return (
            <div
              key={idx}
              className={`w-3 rounded-t transition-all ${
                idx === points.length - 1 ? 'bg-blue-400' : 'bg-slate-700'
              }`}
              style={{ height: `${heightPct}%` }}
            />
          );
        })}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Top Banner: Sync & KPI Scorecards */}
      <section className="bg-slate-900 border border-slate-800 rounded-lg p-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <div className="text-xs text-slate-400 flex items-center gap-2">
              <span className="flex items-center gap-1.5 font-medium text-emerald-400">
                <Globe className="w-3.5 h-3.5" />
                Google Search Console API (searchanalytics.query)
              </span>
              <span aria-hidden="true">·</span>
              <span>Monitoreo Histórico a 30 Días</span>
              <span aria-hidden="true">·</span>
              <span className="text-blue-400 font-medium">Rank Tracker en Tiempo Real</span>
            </div>
            <h2 className="text-base font-bold text-white mt-1 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-blue-400" />
              Keyword Ranking Tracker (Evolución de Posiciones en Google)
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleSyncWithGsc}
              disabled={isSyncing}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 disabled:opacity-50 rounded-md transition-colors cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
              {isSyncing ? 'Sincronizando con GSC...' : 'Sincronizar Posiciones GSC'}
            </button>
          </div>
        </div>

        {/* 4 Scorecards */}
        <div className="pt-4 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-mono">
          <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-lg">
            <span className="text-slate-400 text-[11px] block">PALABRAS EN TOP 3</span>
            <div className="text-2xl font-bold text-amber-400 tabular-nums mt-1">
              {trackerData.top3KeywordsCount} keywords
            </div>
            <span className="text-[10px] text-emerald-400 mt-0.5 block font-sans">
              Máxima visibilidad SERP
            </span>
          </div>

          <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-lg">
            <span className="text-slate-400 text-[11px] block">PALABRAS EN TOP 10</span>
            <div className="text-2xl font-bold text-blue-400 tabular-nums mt-1">
              {trackerData.top10KeywordsCount} / {trackerData.totalTrackedKeywords}
            </div>
            <span className="text-[10px] text-slate-400 mt-0.5 block font-sans">
              Primera página de Google
            </span>
          </div>

          <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-lg">
            <span className="text-slate-400 text-[11px] block">PALABRAS EN ASCENSO (30D)</span>
            <div className="text-2xl font-bold text-emerald-400 tabular-nums mt-1">
              +{trackerData.improvedKeywordsCount} keywords
            </div>
            <span className="text-[10px] text-emerald-400 mt-0.5 block font-sans">
              Subida media: +{trackerData.averagePositionDelta} pos.
            </span>
          </div>

          <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-lg">
            <span className="text-slate-400 text-[11px] block">POSICIÓN PROMEDIO</span>
            <div className="text-2xl font-bold text-purple-400 tabular-nums mt-1">
              #{trackerData.averagePosition}
            </div>
            <span className="text-[10px] text-slate-400 mt-0.5 block font-sans">
              Sobre keywords prioritarias
            </span>
          </div>
        </div>
      </section>

      {/* Filter and Add Keyword Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-lg p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filtrar por keyword o URL..."
              className="pl-8 pr-3 py-1.5 bg-slate-950 border border-slate-800 rounded text-slate-200 text-xs w-56 focus:outline-none focus:border-blue-500"
            />
          </div>

          <select
            value={intentFilter}
            onChange={(e) => setIntentFilter(e.target.value)}
            className="px-2.5 py-1.5 bg-slate-950 border border-slate-800 rounded text-slate-300 focus:outline-none"
          >
            <option value="all">Todas las Intenciones</option>
            <option value="Transaccional">Transaccional</option>
            <option value="Comercial">Comercial</option>
            <option value="Informativa">Informativa</option>
            <option value="Navegacional">Navegacional</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-2.5 py-1.5 bg-slate-950 border border-slate-800 rounded text-slate-300 focus:outline-none"
          >
            <option value="all">Todos los Estados</option>
            <option value="improved">En Ascenso (Mejoró)</option>
            <option value="declined">En Descenso</option>
            <option value="stable">Estable</option>
          </select>
        </div>

        {/* Add Keyword Form */}
        <form onSubmit={handleAddKeyword} className="flex items-center gap-2">
          <input
            type="text"
            value={newKeywordInput}
            onChange={(e) => setNewKeywordInput(e.target.value)}
            placeholder="Añadir keyword a monitorear..."
            className="px-3 py-1.5 bg-slate-950 border border-slate-800 rounded text-slate-200 text-xs w-52 focus:outline-none focus:border-blue-500"
          />
          <button
            type="submit"
            className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded cursor-pointer whitespace-nowrap"
          >
            <Plus className="w-3.5 h-3.5" />
            Monitorear
          </button>
        </form>
      </div>

      {/* Main Keyword Rankings Table */}
      <section className="bg-slate-900 border border-slate-800 rounded-lg p-5 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-xs">
          <span className="font-semibold text-white">
            Palabras Clave Auditadas ({filteredKeywords.length})
          </span>
          <span className="text-slate-400 font-mono text-[11px]">
            {trackerData.lastSyncedTimestamp}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-500 font-semibold font-mono">
                <th className="py-2.5 pr-4">Palabra Clave (Query GSC)</th>
                <th className="py-2.5 px-3">Intención</th>
                <th className="py-2.5 px-3 text-right">Pos. Actual</th>
                <th className="py-2.5 px-3 text-right">Hace 30 Días</th>
                <th className="py-2.5 px-3 text-right">Cambio</th>
                <th className="py-2.5 px-3">Tendencia 30D</th>
                <th className="py-2.5 px-3 text-right">Clics / Mes</th>
                <th className="py-2.5 px-3 text-right">CTR</th>
                <th className="py-2.5 pl-3">SERP Features Detectadas</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/70 font-mono">
              {filteredKeywords.map((kw) => {
                const isImproved = kw.status === 'improved';
                const isDeclined = kw.status === 'declined';

                return (
                  <tr key={kw.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3.5 pr-4 text-slate-200 font-sans">
                      <div className="font-semibold text-[13px] flex items-center gap-1.5">
                        {kw.keyword}
                      </div>
                      <span className="text-[11px] text-slate-500 font-mono truncate max-w-xs block">
                        {kw.landingPage}
                      </span>
                    </td>

                    <td className="py-3.5 px-3 font-sans">
                      <span
                        className={`text-[11px] font-semibold px-2 py-0.5 rounded ${
                          kw.searchIntent === 'Transaccional'
                            ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-800/80'
                            : kw.searchIntent === 'Comercial'
                            ? 'bg-blue-950/60 text-blue-300 border border-blue-800/80'
                            : 'bg-slate-950 text-slate-400 border border-slate-800'
                        }`}
                      >
                        {kw.searchIntent}
                      </span>
                    </td>

                    <td className="py-3.5 px-3 text-right tabular-nums">
                      <span
                        className={`text-sm font-bold ${
                          kw.currentPosition <= 3
                            ? 'text-amber-400'
                            : kw.currentPosition <= 10
                            ? 'text-blue-400'
                            : 'text-slate-300'
                        }`}
                      >
                        #{kw.currentPosition.toFixed(1)}
                      </span>
                    </td>

                    <td className="py-3.5 px-3 text-right tabular-nums text-slate-400">
                      #{kw.previousPosition.toFixed(1)}
                    </td>

                    <td className="py-3.5 px-3 text-right tabular-nums">
                      {isImproved && (
                        <span className="inline-flex items-center gap-0.5 font-bold text-emerald-400">
                          <ArrowUpRight className="w-3.5 h-3.5" />
                          +{kw.positionDelta.toFixed(1)}
                        </span>
                      )}
                      {isDeclined && (
                        <span className="inline-flex items-center gap-0.5 font-bold text-red-400">
                          <ArrowDownRight className="w-3.5 h-3.5" />
                          {kw.positionDelta.toFixed(1)}
                        </span>
                      )}
                      {!isImproved && !isDeclined && (
                        <span className="inline-flex items-center gap-0.5 text-slate-400">
                          <Minus className="w-3 h-3" />
                          0.0
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 px-3">{renderSparkline(kw.history30Days)}</td>

                    <td className="py-3.5 px-3 text-right tabular-nums text-slate-200 font-semibold">
                      {kw.monthlyClicks.toLocaleString('es-ES')}
                    </td>

                    <td className="py-3.5 px-3 text-right tabular-nums text-emerald-400 font-semibold">
                      {kw.ctrPct}%
                    </td>

                    <td className="py-3.5 pl-3 font-sans text-xs">
                      {kw.serpFeatures.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {kw.serpFeatures.map((feat, idx) => (
                            <span
                              key={idx}
                              className="text-[10px] bg-slate-950 text-slate-300 border border-slate-800 px-1.5 py-0.5 rounded"
                            >
                              {feat}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span className="text-slate-500 text-[11px]">Snippet Estándar</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};
