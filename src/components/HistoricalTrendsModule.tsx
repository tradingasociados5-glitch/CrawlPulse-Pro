import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  Database,
  Plus,
  RotateCcw,
  Gauge,
  Zap,
  LayoutGrid,
  Clock,
  Sparkles,
  ShieldCheck,
  Smartphone,
  Laptop
} from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { LighthouseHistoricalRecord } from '../types/historical';
import {
  loadSqliteHistoricalRecords,
  saveSqliteHistoricalRecord,
  clearSqliteHistoricalRecords,
  getSqliteDbMetadata
} from '../services/historicalDb';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface HistoricalTrendsModuleProps {
  currentDomain: string;
}

export const HistoricalTrendsModule: React.FC<HistoricalTrendsModuleProps> = ({
  currentDomain,
}) => {
  const [records, setRecords] = useState<LighthouseHistoricalRecord[]>([]);
  const [activeMetric, setActiveMetric] = useState<'lcp' | 'fid' | 'cls' | 'overall'>('lcp');
  const [deviceFilter, setDeviceFilter] = useState<'all' | 'mobile' | 'desktop'>('mobile');
  const [isAddingNew, setIsAddingNew] = useState(false);

  // Form state for adding new audit entry into SQLite database
  const [newLcp, setNewLcp] = useState<number>(2.1);
  const [newFid, setNewFid] = useState<number>(45);
  const [newCls, setNewCls] = useState<number>(0.04);
  const [newScore, setNewScore] = useState<number>(88);
  const [newNotes, setNewNotes] = useState<string>('Post-staging patch verification');

  useEffect(() => {
    setRecords(loadSqliteHistoricalRecords());
  }, []);

  const filteredRecords = records.filter(
    (r) => deviceFilter === 'all' || r.deviceType === deviceFilter
  );

  const dbMetadata = getSqliteDbMetadata(records.length);

  const handleAddNewRecord = (e: React.FormEvent) => {
    e.preventDefault();
    const today = new Date();
    const dateLabel = `${today.getDate()} ${today.toLocaleString('en-US', { month: 'short' })}`;

    const newRec: LighthouseHistoricalRecord = {
      id: `lh-rec-${Date.now()}`,
      auditTimestamp: today.toISOString(),
      dateLabel,
      domain: currentDomain,
      overallPerformanceScore: Math.min(100, Math.max(1, newScore)),
      lcpSeconds: Math.max(0.1, newLcp),
      fidMs: Math.max(1, newFid),
      clsScore: Math.max(0, newCls),
      inpMs: Math.max(10, Math.round(newFid * 2.2)),
      deviceType: 'mobile',
      notes: newNotes.trim() || 'Scheduled SQLite audit log',
    };

    const updated = saveSqliteHistoricalRecord(newRec);
    setRecords(updated);
    setIsAddingNew(false);
  };

  const handleResetRecords = () => {
    const defaultRecords = clearSqliteHistoricalRecords();
    setRecords(defaultRecords);
  };

  // Latest status vs Initial comparison
  const latestRec = filteredRecords[filteredRecords.length - 1];
  const initialRec = filteredRecords[0];

  const lcpImprovement = initialRec && latestRec
    ? ((initialRec.lcpSeconds - latestRec.lcpSeconds) / initialRec.lcpSeconds * 100).toFixed(1)
    : '0';

  const fidImprovement = initialRec && latestRec
    ? ((initialRec.fidMs - latestRec.fidMs) / initialRec.fidMs * 100).toFixed(1)
    : '0';

  const clsImprovement = initialRec && latestRec
    ? ((initialRec.clsScore - latestRec.clsScore) / initialRec.clsScore * 100).toFixed(1)
    : '0';

  // --- CHART.JS CONFIGURATION ---
  const chartLabels = filteredRecords.map((r) => r.dateLabel);

  const getMetricData = () => {
    switch (activeMetric) {
      case 'lcp':
        return {
          label: 'LCP (Largest Contentful Paint in Seconds - Target: <= 2.5s)',
          data: filteredRecords.map((r) => r.lcpSeconds),
          borderColor: '#3b82f6',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          goodThreshold: 2.5,
          unit: 's',
        };
      case 'fid':
        return {
          label: 'FID (First Input Delay in Milliseconds - Target: <= 100ms)',
          data: filteredRecords.map((r) => r.fidMs),
          borderColor: '#10b981',
          backgroundColor: 'rgba(16, 185, 129, 0.1)',
          goodThreshold: 100,
          unit: 'ms',
        };
      case 'cls':
        return {
          label: 'CLS (Cumulative Layout Shift - Target: <= 0.10)',
          data: filteredRecords.map((r) => r.clsScore),
          borderColor: '#f59e0b',
          backgroundColor: 'rgba(245, 158, 11, 0.1)',
          goodThreshold: 0.1,
          unit: '',
        };
      case 'overall':
      default:
        return {
          label: 'Lighthouse Overall Performance Score (0 - 100)',
          data: filteredRecords.map((r) => r.overallPerformanceScore),
          borderColor: '#8b5cf6',
          backgroundColor: 'rgba(139, 92, 246, 0.1)',
          goodThreshold: 90,
          unit: 'pts',
        };
    }
  };

  const metricInfo = getMetricData();

  const chartData = {
    labels: chartLabels,
    datasets: [
      {
        label: metricInfo.label,
        data: metricInfo.data,
        borderColor: metricInfo.borderColor,
        backgroundColor: metricInfo.backgroundColor,
        fill: true,
        tension: 0.35,
        pointRadius: 5,
        pointHoverRadius: 7,
        pointBackgroundColor: metricInfo.borderColor,
        pointBorderColor: '#0f172a',
        pointBorderWidth: 2,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: '#cbd5e1',
          font: {
            family: "'Plus Jakarta Sans', sans-serif",
            size: 12,
          },
        },
      },
      tooltip: {
        backgroundColor: '#0f172a',
        borderColor: '#334155',
        borderWidth: 1,
        titleColor: '#ffffff',
        bodyColor: '#94a3b8',
        padding: 10,
        cornerRadius: 6,
      },
    },
    scales: {
      x: {
        grid: {
          color: 'rgba(51, 65, 85, 0.25)',
        },
        ticks: {
          color: '#94a3b8',
          font: {
            family: "'JetBrains Mono', monospace",
            size: 11,
          },
        },
      },
      y: {
        grid: {
          color: 'rgba(51, 65, 85, 0.25)',
        },
        ticks: {
          color: '#94a3b8',
          font: {
            family: "'JetBrains Mono', monospace",
            size: 11,
          },
        },
      },
    },
  };

  return (
    <div className="space-y-6">
      {/* Header Banner & SQLite Driver Telemetry */}
      <section className="bg-slate-900 border border-slate-800 rounded-lg p-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <div className="text-xs text-slate-400 flex items-center gap-2">
              <span className="flex items-center gap-1.5 font-medium text-emerald-400">
                <Database className="w-3.5 h-3.5" />
                {dbMetadata.engine}
              </span>
              <span aria-hidden="true">·</span>
              <span className="font-mono text-slate-400">{dbMetadata.dbPath}</span>
              <span aria-hidden="true">·</span>
              <span>{records.length} Audit Points Stored</span>
            </div>
            <h2 className="text-base font-bold text-white mt-1 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-blue-400" />
              Evolución Histórica de Core Web Vitals (LCP · FID · CLS)
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsAddingNew(!isAddingNew)}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-md transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              {isAddingNew ? 'Cancel' : 'Log New Audit Point'}
            </button>
            <button
              type="button"
              onClick={handleResetRecords}
              className="p-1.5 text-slate-400 hover:text-slate-200 border border-slate-800 rounded hover:border-slate-700 transition-colors cursor-pointer"
              title="Reset SQLite database to baseline"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Modal / Form to insert a record into SQLite */}
        {isAddingNew && (
          <form
            onSubmit={handleAddNewRecord}
            className="mt-4 p-4 bg-slate-950 border border-slate-800 rounded-lg space-y-3 text-xs"
          >
            <div className="font-semibold text-slate-200 pb-1 border-b border-slate-800 flex items-center justify-between">
              <span>Insert New Lighthouse Audit Result into SQLite Database</span>
              <span className="font-mono text-[11px] text-slate-400">Target: {currentDomain}</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <div>
                <label className="block text-slate-400 mb-1">LCP (Seconds)</label>
                <input
                  type="number"
                  step="0.1"
                  value={newLcp}
                  onChange={(e) => setNewLcp(Number(e.target.value))}
                  className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded text-slate-200 font-mono"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">FID (Milliseconds)</label>
                <input
                  type="number"
                  value={newFid}
                  onChange={(e) => setNewFid(Number(e.target.value))}
                  className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded text-slate-200 font-mono"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">CLS Score</label>
                <input
                  type="number"
                  step="0.01"
                  value={newCls}
                  onChange={(e) => setNewCls(Number(e.target.value))}
                  className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded text-slate-200 font-mono"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Performance (0-100)</label>
                <input
                  type="number"
                  value={newScore}
                  onChange={(e) => setNewScore(Number(e.target.value))}
                  className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded text-slate-200 font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-400 mb-1">Audit Notes / Changes Deployed</label>
              <input
                type="text"
                value={newNotes}
                onChange={(e) => setNewNotes(e.target.value)}
                placeholder="e.g. Critical CSS inline applied in Staging"
                className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded text-slate-200 text-xs"
              />
            </div>

            <div className="flex justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => setIsAddingNew(false)}
                className="px-3 py-1.5 bg-slate-800 text-slate-300 rounded hover:bg-slate-700 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 bg-blue-600 text-white font-semibold rounded hover:bg-blue-500 cursor-pointer"
              >
                Persist Audit to SQLite
              </button>
            </div>
          </form>
        )}

        {/* Vital Scorecards with % Improvement since baseline */}
        <div className="pt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* LCP Scorecard */}
          <div
            onClick={() => setActiveMetric('lcp')}
            className={`p-3.5 rounded-lg border transition-all cursor-pointer ${
              activeMetric === 'lcp'
                ? 'bg-blue-950/40 border-blue-500 shadow-sm'
                : 'bg-slate-950/70 border-slate-800 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="font-semibold text-slate-200">LCP (Largest Contentful)</span>
              <span className="font-mono text-emerald-400">+{lcpImprovement}% faster</span>
            </div>
            <div className="text-2xl font-bold font-mono text-blue-400 tabular-nums mt-1">
              {latestRec ? `${latestRec.lcpSeconds.toFixed(1)}s` : '--'}
            </div>
            <span className="text-[11px] text-slate-500 mt-0.5 block">
              Baseline: {initialRec?.lcpSeconds}s → Target: &lt;2.5s
            </span>
          </div>

          {/* FID Scorecard */}
          <div
            onClick={() => setActiveMetric('fid')}
            className={`p-3.5 rounded-lg border transition-all cursor-pointer ${
              activeMetric === 'fid'
                ? 'bg-emerald-950/40 border-emerald-500 shadow-sm'
                : 'bg-slate-950/70 border-slate-800 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="font-semibold text-slate-200">FID (First Input Delay)</span>
              <span className="font-mono text-emerald-400">+{fidImprovement}% quicker</span>
            </div>
            <div className="text-2xl font-bold font-mono text-emerald-400 tabular-nums mt-1">
              {latestRec ? `${latestRec.fidMs}ms` : '--'}
            </div>
            <span className="text-[11px] text-slate-500 mt-0.5 block">
              Baseline: {initialRec?.fidMs}ms → Target: &lt;100ms
            </span>
          </div>

          {/* CLS Scorecard */}
          <div
            onClick={() => setActiveMetric('cls')}
            className={`p-3.5 rounded-lg border transition-all cursor-pointer ${
              activeMetric === 'cls'
                ? 'bg-amber-950/40 border-amber-500 shadow-sm'
                : 'bg-slate-950/70 border-slate-800 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="font-semibold text-slate-200">CLS (Layout Shift)</span>
              <span className="font-mono text-emerald-400">+{clsImprovement}% stable</span>
            </div>
            <div className="text-2xl font-bold font-mono text-amber-400 tabular-nums mt-1">
              {latestRec ? `${latestRec.clsScore.toFixed(2)}` : '--'}
            </div>
            <span className="text-[11px] text-slate-500 mt-0.5 block">
              Baseline: {initialRec?.clsScore} → Target: &lt;0.10
            </span>
          </div>

          {/* Overall Performance */}
          <div
            onClick={() => setActiveMetric('overall')}
            className={`p-3.5 rounded-lg border transition-all cursor-pointer ${
              activeMetric === 'overall'
                ? 'bg-purple-950/40 border-purple-500 shadow-sm'
                : 'bg-slate-950/70 border-slate-800 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="font-semibold text-slate-200">Lighthouse Score</span>
              <span className="font-mono text-emerald-400">
                +{latestRec && initialRec ? latestRec.overallPerformanceScore - initialRec.overallPerformanceScore : 0} pts
              </span>
            </div>
            <div className="text-2xl font-bold font-mono text-purple-400 tabular-nums mt-1">
              {latestRec ? `${latestRec.overallPerformanceScore} / 100` : '--'}
            </div>
            <span className="text-[11px] text-slate-500 mt-0.5 block">
              Baseline: {initialRec?.overallPerformanceScore} → Target: 90+
            </span>
          </div>
        </div>
      </section>

      {/* Interactive Chart.js Canvas */}
      <section className="bg-slate-900 border border-slate-800 rounded-lg p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
          <div>
            <h3 className="text-sm font-semibold text-white">
              Gráfica de Tendencia Temporal (Chart.js Engine)
            </h3>
            <span className="text-xs text-slate-400">
              Mostrando métrica activa: <strong className="text-slate-200 uppercase">{activeMetric}</strong>
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500">Dispositivo:</span>
            <div className="flex items-center gap-1 p-1 bg-slate-950 border border-slate-800 rounded">
              <button
                type="button"
                onClick={() => setDeviceFilter('mobile')}
                className={`px-2.5 py-1 text-xs font-medium rounded transition-colors cursor-pointer flex items-center gap-1 ${
                  deviceFilter === 'mobile'
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Smartphone className="w-3 h-3" />
                Mobile (CrUX)
              </button>
              <button
                type="button"
                onClick={() => setDeviceFilter('all')}
                className={`px-2.5 py-1 text-xs font-medium rounded transition-colors cursor-pointer ${
                  deviceFilter === 'all'
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                All Audits
              </button>
            </div>
          </div>
        </div>

        {/* Chart.js Line Container */}
        <div className="h-80 w-full pt-2">
          <Line data={chartData} options={chartOptions} />
        </div>
      </section>

      {/* SQLite Database Audit Log Table */}
      <section className="bg-slate-900 border border-slate-800 rounded-lg p-5 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <h3 className="text-sm font-semibold text-white flex items-center gap-2">
            <Database className="w-4 h-4 text-emerald-400" />
            Registros Persistidos en Base de Datos Local SQLite
          </h3>
          <span className="text-xs text-slate-400 font-mono">
            {filteredRecords.length} checkpoints registrados
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-500 font-semibold font-mono">
                <th className="py-2.5 pr-3">Fecha</th>
                <th className="py-2.5 px-2 text-right">LCP (s)</th>
                <th className="py-2.5 px-2 text-right">FID (ms)</th>
                <th className="py-2.5 px-2 text-right">CLS</th>
                <th className="py-2.5 px-2 text-right">INP (ms)</th>
                <th className="py-2.5 px-2 text-right">Score</th>
                <th className="py-2.5 pl-3">Notas Técnicas / Despliegue en Staging</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {filteredRecords.map((r) => (
                <tr key={r.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-2.5 pr-3 text-slate-300 font-semibold">{r.dateLabel}</td>
                  <td className="py-2.5 px-2 text-right text-blue-400 tabular-nums">
                    {r.lcpSeconds.toFixed(1)}s
                  </td>
                  <td className="py-2.5 px-2 text-right text-emerald-400 tabular-nums">
                    {r.fidMs}ms
                  </td>
                  <td className="py-2.5 px-2 text-right text-amber-400 tabular-nums">
                    {r.clsScore.toFixed(2)}
                  </td>
                  <td className="py-2.5 px-2 text-right text-slate-400 tabular-nums">
                    {r.inpMs}ms
                  </td>
                  <td className="py-2.5 px-2 text-right font-semibold text-purple-400 tabular-nums">
                    {r.overallPerformanceScore}/100
                  </td>
                  <td className="py-2.5 pl-3 font-sans text-slate-400 truncate max-w-xs">
                    {r.notes || '--'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};
