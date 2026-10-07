import React, { useState } from 'react';
import {
  CheckSquare,
  CheckCircle2,
  Clock,
  XCircle,
  MinusCircle,
  AlertTriangle,
  RotateCcw,
  Search,
  Filter,
  Layers,
  Sparkles,
  ShieldCheck,
  ChevronDown,
  ChevronRight,
  ExternalLink
} from 'lucide-react';
import { AuditChecklistItem, ChecklistCategory, ChecklistStatus } from '../types/checklist';

const INITIAL_CHECKLIST: AuditChecklistItem[] = [
  {
    id: 'chk-01',
    category: 'Technical & Crawlability',
    title: 'Validación de Directivas en robots.txt y Respeto a Crawl-Delay',
    description: 'Comprobar que rutas críticas (checkout, panel admin, feeds internos) están bloqueadas y no existen desajustes con el sitemap.',
    recommendedTool: 'Tauri / Cheerio Parser',
    status: 'passed',
    notes: 'Sitemap.xml referenciado y directiva Disallow: /admin/ verificada.',
    isCritical: true,
  },
  {
    id: 'chk-02',
    category: 'Technical & Crawlability',
    title: 'Auditoría de Enlaces Rotos (404) y Cadenas de Redirección 301',
    description: 'Garantizar que ninguna URL transaccional realice más de un salto de redirección para no diluir el Link Equity ni agotar el Crawl Budget.',
    recommendedTool: 'Crawler Engine (Playwright)',
    status: 'failed',
    notes: '14 rutas de campañas pasadas en 404 detectadas; parche 301 preparado para Staging.',
    isCritical: true,
  },
  {
    id: 'chk-03',
    category: 'Technical & Crawlability',
    title: 'Normalización de Canonical Tags en Filtros Parametrizados',
    description: 'Verificar que las URLs con parámetros (?color=, ?sort=) apunten canónicamente a la categoría raíz limpia.',
    recommendedTool: 'DOM Inspector',
    status: 'in_progress',
    notes: '320 URLs con canonical conflictivo en pruebas dentro de Staging Sandbox.',
    isCritical: true,
  },
  {
    id: 'chk-04',
    category: 'On-Page & Architecture',
    title: 'Jerarquía de Encabezados (H1 único y correlación H2-H3)',
    description: 'Asegurar que cada landing transaccional cuente con una única etiqueta H1 orientada a la keyword principal de intención comercial.',
    recommendedTool: 'Cheerio DOM Extractor',
    status: 'passed',
    notes: 'Corregidas 2 plantillas con doble etiqueta H1.',
    isCritical: false,
  },
  {
    id: 'chk-05',
    category: 'On-Page & Architecture',
    title: 'Longitud de Title (30-60 car.) y Meta Description (120-160 car.)',
    description: 'Evitar truncamientos en SERP y etiquetas vacías en páginas de alto potencial de tráfico orgánico.',
    recommendedTool: 'SERP Previewer',
    status: 'in_progress',
    notes: '48 productos revisados; faltan fichas de catálogo secundario.',
    isCritical: false,
  },
  {
    id: 'chk-06',
    category: 'On-Page & Architecture',
    title: 'Atributos Alt en Imágenes y Optimización WebP / AVIF',
    description: 'Comprobar que todas las imágenes contienen texto alternativo descriptivo y no se sirven formatos PNG pesados sin compresión.',
    recommendedTool: 'YellowLab / Lighthouse',
    status: 'passed',
    notes: 'Compresión WebP y carga perezosa (loading=lazy) verificadas.',
    isCritical: false,
  },
  {
    id: 'chk-07',
    category: 'Core Web Vitals',
    title: 'LCP Móvil en Datos Reales (Google CrUX API) inferior a 2.5s',
    description: 'Comprobar que el elemento principal (hero image / banner) se precarga con fetchpriority="high" y no compite con scripts de analítica.',
    recommendedTool: 'Lighthouse + CrUX Integration',
    status: 'failed',
    notes: 'LCP móvil en 4.8s; parche con link rel=preload pendiente de despliegue.',
    isCritical: true,
  },
  {
    id: 'chk-08',
    category: 'Core Web Vitals',
    title: 'Estabilidad Visual CLS (Cumulative Layout Shift) < 0.10',
    description: 'Verificar dimensiones explícitas de ancho y alto (width / height) en imágenes, iframes y banners dinámicos para evitar saltos.',
    recommendedTool: 'Lighthouse Layout Shift Tool',
    status: 'passed',
    notes: 'Aspect-ratio CSS aplicado globalmente.',
    isCritical: true,
  },
  {
    id: 'chk-09',
    category: 'Core Web Vitals',
    title: 'Interactividad INP / FID inferior a 200ms en Dispositivos Lentos',
    description: 'Evitar tareas largas de JavaScript que bloqueen el hilo principal durante eventos de clic y apertura de menús en móviles.',
    recommendedTool: 'Chrome DevTools / CrUX',
    status: 'in_progress',
    notes: 'Hydration bundle reducido en 38KB mediante code-splitting.',
    isCritical: false,
  },
  {
    id: 'chk-10',
    category: 'Schema & Rich Snippets',
    title: 'Marcado Estructurado Schema.org (Product, Offer, AggregateRating)',
    description: 'Validar JSON-LD para habilitar estrellas doradas de valoración y disponibilidad de stock directamente en Google.',
    recommendedTool: 'Rich Results Validator',
    status: 'passed',
    notes: 'Snippet Product + FAQPage inyectado vía Staging Sandbox.',
    isCritical: true,
  },
  {
    id: 'chk-11',
    category: 'Mobile & Security',
    title: 'Certificado SSL / HTTPS Forzado y Sin Contenido Mixto',
    description: 'Verificar redirección 301 de HTTP a HTTPS y ausencia de llamadas a recursos no seguros.',
    recommendedTool: 'SSL Labs / Curl Probe',
    status: 'passed',
    notes: 'HSTS activo y sin advertencias de mixed content.',
    isCritical: true,
  },
  {
    id: 'chk-12',
    category: 'Mobile & Security',
    title: 'Viewport Móvil y Tamaño Mínimo de Objetivos Táctiles (44px)',
    description: 'Comprobar legibilidad de tipografía en teléfonos y botones con suficiente separación para evitar pulsaciones erróneas.',
    recommendedTool: 'Mobile-Friendly Probe',
    status: 'passed',
    notes: 'Responsive test superado en resoluciones desde 360px a 1440px.',
    isCritical: false,
  },
];

interface AuditChecklistModuleProps {
  currentDomain: string;
}

export const AuditChecklistModule: React.FC<AuditChecklistModuleProps> = ({
  currentDomain,
}) => {
  const [checklist, setChecklist] = useState<AuditChecklistItem[]>(INITIAL_CHECKLIST);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedNotesId, setExpandedNotesId] = useState<string | null>(null);

  const categories: ChecklistCategory[] = [
    'Technical & Crawlability',
    'On-Page & Architecture',
    'Core Web Vitals',
    'Schema & Rich Snippets',
    'Mobile & Security',
  ];

  const handleStatusChange = (id: string, newStatus: ChecklistStatus) => {
    setChecklist((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: newStatus } : item))
    );
  };

  const handleNotesChange = (id: string, notes: string) => {
    setChecklist((prev) =>
      prev.map((item) => (item.id === id ? { ...item, notes } : item))
    );
  };

  const handleResetChecklist = () => {
    setChecklist(INITIAL_CHECKLIST);
  };

  // Metrics
  const totalTasks = checklist.length;
  const passedTasks = checklist.filter((t) => t.status === 'passed').length;
  const inProgressTasks = checklist.filter((t) => t.status === 'in_progress').length;
  const failedTasks = checklist.filter((t) => t.status === 'failed').length;
  const pendingTasks = checklist.filter((t) => t.status === 'pending').length;
  const progressPct = Math.round((passedTasks / totalTasks) * 100);

  const filteredTasks = checklist.filter((task) => {
    const matchesCategory = selectedCategory === 'all' || task.category === selectedCategory;
    const matchesStatus = statusFilter === 'all' || task.status === statusFilter;
    const matchesSearch =
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesStatus && matchesSearch;
  });

  const getStatusBadge = (status: ChecklistStatus) => {
    switch (status) {
      case 'passed':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-400 bg-emerald-950/60 border border-emerald-800/80 rounded px-2 py-0.5">
            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
            Passed
          </span>
        );
      case 'in_progress':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-400 bg-blue-950/60 border border-blue-800/80 rounded px-2 py-0.5">
            <Clock className="w-3 h-3 text-blue-400" />
            In Progress
          </span>
        );
      case 'failed':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-red-400 bg-red-950/60 border border-red-800/80 rounded px-2 py-0.5">
            <XCircle className="w-3 h-3 text-red-400" />
            Failed / Action Req.
          </span>
        );
      case 'not_applicable':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-400 bg-slate-900 border border-slate-800 rounded px-2 py-0.5">
            <MinusCircle className="w-3 h-3" />
            N/A
          </span>
        );
      case 'pending':
      default:
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-400 bg-slate-900 border border-slate-800 rounded px-2 py-0.5">
            <MinusCircle className="w-3 h-3" />
            Pending Verification
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Progress Summary */}
      <section className="bg-slate-900 border border-slate-800 rounded-lg p-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <div className="text-xs text-slate-400 flex items-center gap-2">
              <span>Auditoría Manual & Flujo de Verificación</span>
              <span aria-hidden="true">·</span>
              <span className="font-mono text-slate-300">{currentDomain}</span>
              <span aria-hidden="true">·</span>
              <span>12 Puntos Críticos de Calidad SEO</span>
            </div>
            <h2 className="text-base font-bold text-white mt-1 flex items-center gap-2">
              <CheckSquare className="w-5 h-5 text-blue-400" />
              Checklist de Auditoría Técnica & Control de Calidad
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-400">Progreso Verificado:</span>
            <div className="flex items-center gap-2">
              <div className="w-32 bg-slate-950 rounded-full h-2.5 overflow-hidden border border-slate-800">
                <div
                  className="bg-emerald-500 h-full transition-all duration-300"
                  style={{ width: `${progressPct}%` }}
                />
              </div>
              <span className="font-mono text-xs font-bold text-emerald-400 tabular-nums">
                {progressPct}%
              </span>
            </div>
            <button
              type="button"
              onClick={handleResetChecklist}
              className="p-1.5 text-slate-400 hover:text-slate-200 border border-slate-800 rounded hover:border-slate-700 transition-colors cursor-pointer ml-2"
              title="Restablecer checklist por defecto"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Status Scorecard Grid */}
        <div className="pt-4 grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
          <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-md">
            <span className="text-[11px] text-emerald-400 font-semibold block">SUPERADOS (PASSED)</span>
            <div className="text-xl font-bold font-mono text-white tabular-nums mt-0.5">
              {passedTasks} / {totalTasks}
            </div>
          </div>
          <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-md">
            <span className="text-[11px] text-blue-400 font-semibold block">EN PROCESO (STAGING)</span>
            <div className="text-xl font-bold font-mono text-white tabular-nums mt-0.5">
              {inProgressTasks}
            </div>
          </div>
          <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-md">
            <span className="text-[11px] text-red-400 font-semibold block">FALLIDOS (ACCIÓN)</span>
            <div className="text-xl font-bold font-mono text-white tabular-nums mt-0.5">
              {failedTasks}
            </div>
          </div>
          <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-md">
            <span className="text-[11px] text-slate-400 font-semibold block">PENDIENTES</span>
            <div className="text-xl font-bold font-mono text-white tabular-nums mt-0.5">
              {pendingTasks}
            </div>
          </div>
        </div>
      </section>

      {/* Filter and Search Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-lg p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar tarea o directiva..."
              className="pl-8 pr-3 py-1.5 bg-slate-950 border border-slate-800 rounded text-slate-200 text-xs w-56 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="flex items-center gap-1.5">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-2.5 py-1.5 bg-slate-950 border border-slate-800 rounded text-slate-300 focus:outline-none"
            >
              <option value="all">Todas las Categorías</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-2.5 py-1.5 bg-slate-950 border border-slate-800 rounded text-slate-300 focus:outline-none"
          >
            <option value="all">Todos los Estados</option>
            <option value="passed">Superados (Passed)</option>
            <option value="in_progress">En Progreso</option>
            <option value="failed">Fallidos</option>
            <option value="pending">Pendientes</option>
          </select>
        </div>

        <span className="text-slate-400 font-mono">
          Mostrando {filteredTasks.length} de {totalTasks} tareas
        </span>
      </div>

      {/* Interactive Task Cards List */}
      <div className="space-y-3">
        {filteredTasks.map((task) => {
          const isExpanded = expandedNotesId === task.id;
          return (
            <div
              key={task.id}
              className={`p-4 rounded-lg border transition-all ${
                task.status === 'failed'
                  ? 'bg-slate-900 border-red-900/60'
                  : task.status === 'passed'
                  ? 'bg-slate-900 border-slate-800 hover:border-slate-700'
                  : 'bg-slate-900 border-slate-800'
              }`}
            >
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                <div className="space-y-1.5 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    {getStatusBadge(task.status)}
                    <span className="text-slate-500 text-xs">·</span>
                    <span className="text-xs font-mono text-slate-400 uppercase tracking-wider text-[10px]">
                      {task.category}
                    </span>
                    {task.isCritical && (
                      <span className="text-[10px] font-semibold text-amber-400 bg-amber-950/60 border border-amber-800/80 rounded px-1.5 py-0.2">
                        Impacto Crítico
                      </span>
                    )}
                  </div>

                  <h3 className="text-sm font-semibold text-slate-100">{task.title}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">{task.description}</p>

                  <div className="text-[11px] text-slate-500 flex items-center gap-2 pt-1">
                    <span>Herramienta recomendada: <strong className="text-slate-300">{task.recommendedTool}</strong></span>
                  </div>
                </div>

                {/* Status Toggle Buttons Bar */}
                <div className="flex flex-col sm:flex-row items-end sm:items-center gap-2 shrink-0">
                  <div className="flex items-center gap-1 p-1 bg-slate-950 border border-slate-800 rounded text-xs">
                    {(
                      [
                        { id: 'passed', label: 'Pass', color: 'hover:text-emerald-400' },
                        { id: 'in_progress', label: 'Progress', color: 'hover:text-blue-400' },
                        { id: 'failed', label: 'Fail', color: 'hover:text-red-400' },
                        { id: 'pending', label: 'Reset', color: 'hover:text-slate-300' },
                      ] as const
                    ).map((btn) => (
                      <button
                        key={btn.id}
                        type="button"
                        onClick={() => handleStatusChange(task.id, btn.id)}
                        className={`px-2.5 py-1 rounded font-medium transition-colors cursor-pointer ${
                          task.status === btn.id
                            ? btn.id === 'passed'
                              ? 'bg-emerald-600 text-white'
                              : btn.id === 'in_progress'
                              ? 'bg-blue-600 text-white'
                              : btn.id === 'failed'
                              ? 'bg-red-600 text-white'
                              : 'bg-slate-700 text-white'
                            : `text-slate-400 ${btn.color}`
                        }`}
                      >
                        {btn.label}
                      </button>
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={() => setExpandedNotesId(isExpanded ? null : task.id)}
                    className="text-xs text-slate-400 hover:text-slate-200 px-2 py-1 flex items-center gap-1 cursor-pointer"
                  >
                    <span>Notas</span>
                    {isExpanded ? (
                      <ChevronDown className="w-3.5 h-3.5" />
                    ) : (
                      <ChevronRight className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Expandable Auditor Notes Field */}
              {isExpanded && (
                <div className="mt-3 pt-3 border-t border-slate-800 text-xs space-y-1">
                  <label className="block text-slate-400 font-medium">
                    Notas y Observaciones del Consultor:
                  </label>
                  <textarea
                    rows={2}
                    value={task.notes || ''}
                    onChange={(e) => handleNotesChange(task.id, e.target.value)}
                    placeholder="Añadir observaciones específicas para el informe del cliente..."
                    className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded text-slate-200 text-xs focus:outline-none focus:border-blue-500"
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
