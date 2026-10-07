import React, { useState } from 'react';
import {
  Compass,
  ArrowRight,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Copy,
  Check,
  Plus,
  RefreshCw,
  FolderTree,
  Filter,
  FileCode2,
  Trash2,
  ShieldCheck,
  Zap,
  Globe
} from 'lucide-react';
import { PathArchitectureSummary, UrlMappingItem } from '../types/pathArchitect';

interface SeoPathArchitectModuleProps {
  currentDomain: string;
}

const INITIAL_MAPPINGS: UrlMappingItem[] = [
  {
    id: 'map-1',
    originalPath: '/tienda/es/categorias/facial/serums/serum-acido-hialuronico-50ml/',
    ruleApplied: 'Aplanar Jerarquía Profunda (Flat URLs)',
    suggestedCleanPath: '/productos/serum-acido-hialuronico',
    status: 'valid',
    httpStatus: 301,
    trafficPriority: 'Alta',
  },
  {
    id: 'map-2',
    originalPath: '/Colecciones/Serums-Faciales-Hidratantes/?color=azul&sort=precio_asc',
    ruleApplied: 'Eliminar Parámetros y Minúsculas Estrictas',
    suggestedCleanPath: '/colecciones/serums-faciales-hidratantes',
    status: 'valid',
    httpStatus: 301,
    trafficPriority: 'Alta',
  },
  {
    id: 'map-3',
    originalPath: '/productos/crema-noche-retinol-antiedad-50ml/',
    ruleApplied: 'Normalizar Slugs Redundantes',
    suggestedCleanPath: '/productos/crema-noche-retinol',
    status: 'conflict_duplicate',
    conflictDetails: '¡Conflicto detectado! Otra URL ya mapea hacia "/productos/crema-noche-retinol", provocando canibalización y contenido duplicado.',
    httpStatus: 301,
    trafficPriority: 'Alta',
  },
  {
    id: 'map-4',
    originalPath: '/tratamientos/anti-arrugas/crema-noche-retinol',
    ruleApplied: 'Migración a Catálogo Unificado',
    suggestedCleanPath: '/productos/crema-noche-retinol',
    status: 'conflict_duplicate',
    conflictDetails: 'Colisión de slug con id map-3: dos rutas de origen generan la misma ruta final.',
    httpStatus: 301,
    trafficPriority: 'Media',
  },
  {
    id: 'map-5',
    originalPath: '/blog/post-categoria-invierno/2024/guia-piel-sensible-frio/',
    ruleApplied: 'Eliminar Fechas y Taxonomías del Blog',
    suggestedCleanPath: '/blog/guia-piel-sensible-invierno',
    status: 'valid',
    httpStatus: 301,
    trafficPriority: 'Media',
  },
  {
    id: 'map-6',
    originalPath: '/ofertas-primavera-2025/pack-luminosidad',
    ruleApplied: 'Redirección Permanente 301 sin Saltos',
    suggestedCleanPath: '/colecciones/packs-regalo-botanicos',
    status: 'valid',
    httpStatus: 301,
    trafficPriority: 'Alta',
  },
  {
    id: 'map-7',
    originalPath: '/contacto-soporte-atencion-al-cliente/',
    ruleApplied: 'Slug Conciso & Remoción de Trailing Slash',
    suggestedCleanPath: '/contacto',
    status: 'valid',
    httpStatus: 301,
    trafficPriority: 'Baja',
  },
];

export const SeoPathArchitectModule: React.FC<SeoPathArchitectModuleProps> = ({
  currentDomain,
}) => {
  const [mappings, setMappings] = useState<UrlMappingItem[]>(INITIAL_MAPPINGS);
  const [statusFilter, setStatusFilter] = useState<'all' | 'conflicts' | 'valid'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // New rule input form
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newOriginal, setNewOriginal] = useState('');
  const [newSuggested, setNewSuggested] = useState('');
  const [newRuleName, setNewRuleName] = useState('Aplanar Jerarquía Profunda (Flat URLs)');

  // Conflict Detection Engine
  const detectConflicts = (items: UrlMappingItem[]): UrlMappingItem[] => {
    const slugCounts: Record<string, number> = {};
    items.forEach((item) => {
      const clean = item.suggestedCleanPath.toLowerCase().trim();
      slugCounts[clean] = (slugCounts[clean] || 0) + 1;
    });

    return items.map((item) => {
      const clean = item.suggestedCleanPath.toLowerCase().trim();
      const hasConflict = slugCounts[clean] > 1;

      if (hasConflict) {
        return {
          ...item,
          status: 'conflict_duplicate',
          conflictDetails: `¡Conflicto de Slug Duplicado! Hay ${slugCounts[clean]} URLs diferentes apuntando exactamente al mismo destino: "${clean}".`,
        };
      }
      return {
        ...item,
        status: item.status === 'conflict_duplicate' ? 'valid' : item.status,
        conflictDetails: undefined,
      };
    });
  };

  const handleAddNewMapping = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newOriginal.trim() || !newSuggested.trim()) return;

    const newItem: UrlMappingItem = {
      id: `map-${Date.now()}`,
      originalPath: newOriginal.trim(),
      suggestedCleanPath: newSuggested.trim(),
      ruleApplied: newRuleName,
      status: 'valid',
      httpStatus: 301,
      trafficPriority: 'Media',
    };

    const updated = detectConflicts([newItem, ...mappings]);
    setMappings(updated);
    setNewOriginal('');
    setNewSuggested('');
    setIsAddingNew(false);
  };

  const handleDeleteMapping = (id: string) => {
    const remaining = mappings.filter((m) => m.id !== id);
    setMappings(detectConflicts(remaining));
  };

  const handleGenerateNginxConfig = () => {
    const rules = mappings
      .filter((m) => m.status === 'valid')
      .map((m) => `rewrite ^${m.originalPath.replace(/\//g, '\\/')}/?$ ${m.suggestedCleanPath} permanent;`)
      .join('\n');

    navigator.clipboard.writeText(`# Reglas Generadas por SEO Path Architect (${currentDomain})\n${rules}`);
    setCopiedId('nginx-all');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const totalUrls = mappings.length;
  const conflictCount = mappings.filter((m) => m.status === 'conflict_duplicate').length;
  const validCount = mappings.filter((m) => m.status === 'valid').length;

  const filteredMappings = mappings.filter((item) => {
    const matchesSearch =
      item.originalPath.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.suggestedCleanPath.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.ruleApplied.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === 'all' ||
      (statusFilter === 'conflicts' && item.status === 'conflict_duplicate') ||
      (statusFilter === 'valid' && item.status === 'valid');

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner: Architecture Control & Conflict Summary */}
      <section className="bg-slate-900 border border-slate-800 rounded-lg p-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <div className="text-xs text-slate-400 flex items-center gap-2">
              <span className="flex items-center gap-1.5 font-medium text-blue-400">
                <Compass className="w-3.5 h-3.5" />
                Arquitectura de Rutas & Normalización de Slugs
              </span>
              <span aria-hidden="true">·</span>
              <span className="font-mono text-slate-300">{currentDomain}</span>
              <span aria-hidden="true">·</span>
              <span className="text-emerald-400 font-medium">Detector Anticolisión Activo</span>
            </div>
            <h2 className="text-base font-bold text-white mt-1 flex items-center gap-2">
              <FolderTree className="w-5 h-5 text-blue-400" />
              SEO Path Architect (Mapeo Antes / Después & Detección de Conflictos)
            </h2>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => setIsAddingNew(!isAddingNew)}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-md transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              {isAddingNew ? 'Cancelar' : 'Añadir Regla de Ruta'}
            </button>

            <button
              type="button"
              onClick={handleGenerateNginxConfig}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-md transition-colors cursor-pointer"
            >
              {copiedId === 'nginx-all' ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Reglas 301 Copiadas</span>
                </>
              ) : (
                <>
                  <FileCode2 className="w-3.5 h-3.5" />
                  <span>Exportar .htaccess / Nginx</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* 3 Metrics Cards */}
        <div className="pt-4 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono">
          <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-lg">
            <span className="text-slate-400 text-[11px] block">RUTAS MAPHEADAS</span>
            <div className="text-2xl font-bold text-white tabular-nums mt-1">
              {totalUrls} URLs
            </div>
            <span className="text-[10px] text-slate-500 mt-0.5 block font-sans">
              Estructura canónica auditada
            </span>
          </div>

          <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-lg">
            <span className="text-slate-400 text-[11px] block">MAPEOS VÁLIDOS (LIMPIOS)</span>
            <div className="text-2xl font-bold text-emerald-400 tabular-nums mt-1">
              {validCount} Rutas
            </div>
            <span className="text-[10px] text-emerald-400 mt-0.5 block font-sans">
              Sin canibalización de palabras clave
            </span>
          </div>

          <div
            className={`p-3 rounded-lg border ${
              conflictCount > 0
                ? 'bg-red-950/40 border-red-800/80'
                : 'bg-slate-950/70 border-slate-800'
            }`}
          >
            <span className="text-red-400 text-[11px] font-semibold block">CONFLICTOS DE SLUG DUPLICADO</span>
            <div className="text-2xl font-bold text-red-400 tabular-nums mt-1">
              {conflictCount} Colisiones
            </div>
            <span className="text-[10px] text-red-300 mt-0.5 block font-sans">
              {conflictCount > 0
                ? '¡Acción requerida antes de aplicar en Staging!'
                : 'Cero colisiones detectadas'}
            </span>
          </div>
        </div>

        {/* New Rule Modal / Drawer Form */}
        {isAddingNew && (
          <form
            onSubmit={handleAddNewMapping}
            className="mt-4 p-4 bg-slate-950 border border-slate-800 rounded-lg space-y-3 text-xs"
          >
            <div className="font-semibold text-slate-200 pb-1 border-b border-slate-800 flex items-center justify-between">
              <span>Definir Nueva Regla de Estructura de URL</span>
              <span className="text-[11px] text-slate-400 font-mono">Dominio: {currentDomain}</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <label className="block text-slate-400 mb-1">Ruta Original (Antes)</label>
                <input
                  type="text"
                  value={newOriginal}
                  onChange={(e) => setNewOriginal(e.target.value)}
                  placeholder="/categoria/antigua/producto-50ml/"
                  className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded text-slate-200 font-mono text-xs focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Ruta Limpia Sugerida (Después)</label>
                <input
                  type="text"
                  value={newSuggested}
                  onChange={(e) => setNewSuggested(e.target.value)}
                  placeholder="/productos/producto-limpio"
                  className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded text-slate-200 font-mono text-xs focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Tipo de Regla Aplicada</label>
                <select
                  value={newRuleName}
                  onChange={(e) => setNewRuleName(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded text-slate-200 text-xs focus:outline-none"
                >
                  <option value="Aplanar Jerarquía Profunda (Flat URLs)">Aplanar Jerarquía Profunda (Flat URLs)</option>
                  <option value="Eliminar Parámetros y Minúsculas Estrictas">Eliminar Parámetros y Minúsculas</option>
                  <option value="Normalizar Slugs Redundantes">Normalizar Slugs Redundantes</option>
                  <option value="Eliminar Fechas y Taxonomías del Blog">Eliminar Fechas del Blog</option>
                  <option value="Slug Conciso & Remoción de Trailing Slash">Remover Trailing Slash</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => setIsAddingNew(false)}
                className="px-3 py-1.5 bg-slate-800 text-slate-300 rounded hover:bg-slate-700 cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 bg-blue-600 text-white font-semibold rounded hover:bg-blue-500 cursor-pointer"
              >
                Probar y Verificar Colisiones
              </button>
            </div>
          </form>
        )}
      </section>

      {/* Filter Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-lg p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs">
        <div className="flex flex-wrap items-center gap-3">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar por ruta o regla..."
            className="px-3 py-1.5 bg-slate-950 border border-slate-800 rounded text-slate-200 text-xs w-64 focus:outline-none focus:border-blue-500"
          />

          <div className="flex items-center gap-1 p-1 bg-slate-950 border border-slate-800 rounded">
            <button
              type="button"
              onClick={() => setStatusFilter('all')}
              className={`px-2.5 py-1 text-xs font-medium rounded transition-colors cursor-pointer ${
                statusFilter === 'all' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Todas ({totalUrls})
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter('conflicts')}
              className={`px-2.5 py-1 text-xs font-medium rounded transition-colors cursor-pointer flex items-center gap-1 ${
                statusFilter === 'conflicts' ? 'bg-red-600 text-white' : 'text-red-400 hover:text-red-300'
              }`}
            >
              <AlertTriangle className="w-3 h-3" />
              Conflictos ({conflictCount})
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter('valid')}
              className={`px-2.5 py-1 text-xs font-medium rounded transition-colors cursor-pointer ${
                statusFilter === 'valid' ? 'bg-emerald-600 text-white' : 'text-emerald-400 hover:text-emerald-300'
              }`}
            >
              Válidas ({validCount})
            </button>
          </div>
        </div>

        <span className="text-slate-400 font-mono text-[11px]">
          Mostrando {filteredMappings.length} rutas mapeadas
        </span>
      </div>

      {/* Visual Before and After Mapping Table */}
      <section className="bg-slate-900 border border-slate-800 rounded-lg p-5 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-xs">
          <h3 className="text-sm font-semibold text-white flex items-center gap-2">
            <FolderTree className="w-4 h-4 text-emerald-400" />
            Tabla Comparativa Visual de Mapeo (Antes vs Después)
          </h3>
          <span className="text-slate-400 font-mono text-[11px]">Redirecciones 301 Limpias</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-500 font-semibold font-mono">
                <th className="py-2.5 pr-3">Estructura Antigua (Antes)</th>
                <th className="py-2.5 px-2 text-center w-8"></th>
                <th className="py-2.5 px-3">Estructura Canónica Optimizada (Después)</th>
                <th className="py-2.5 px-2">Regla Aplicada</th>
                <th className="py-2.5 px-2">Estado Anticolisión</th>
                <th className="py-2.5 pl-2 text-right">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {filteredMappings.map((m) => {
                const hasConflict = m.status === 'conflict_duplicate';

                return (
                  <tr
                    key={m.id}
                    className={`transition-colors ${
                      hasConflict
                        ? 'bg-red-950/25 border-l-4 border-l-red-500'
                        : 'hover:bg-slate-800/40'
                    }`}
                  >
                    {/* Before Path */}
                    <td className="py-3 pr-3 text-slate-400 max-w-xs break-all">
                      <span className="text-red-400/80 mr-1 line-through select-none">✕</span>
                      {m.originalPath}
                    </td>

                    {/* Arrow Divider */}
                    <td className="py-3 px-2 text-center text-slate-500">
                      <ArrowRight className="w-3.5 h-3.5 text-blue-400 inline" />
                    </td>

                    {/* After Path */}
                    <td className="py-3 px-3 text-emerald-300 font-semibold max-w-xs break-all">
                      <span className="text-emerald-400 mr-1 select-none">✓</span>
                      {m.suggestedCleanPath}
                    </td>

                    {/* Rule applied */}
                    <td className="py-3 px-2 font-sans text-slate-300 text-[11px] whitespace-nowrap">
                      {m.ruleApplied}
                    </td>

                    {/* Status badge & conflict details */}
                    <td className="py-3 px-2 font-sans">
                      {hasConflict ? (
                        <div className="space-y-1">
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-red-400 bg-red-950/80 border border-red-800 rounded px-2 py-0.5">
                            <AlertTriangle className="w-3 h-3 text-red-400" />
                            Colisión de Slug
                          </span>
                          {m.conflictDetails && (
                            <p className="text-[10px] text-red-300 font-sans max-w-xs leading-snug">
                              {m.conflictDetails}
                            </p>
                          )}
                        </div>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-400 bg-emerald-950/60 border border-emerald-800/80 rounded px-2 py-0.5">
                          <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                          Slug Limpio (301)
                        </span>
                      )}
                    </td>

                    {/* Delete action */}
                    <td className="py-3 pl-2 text-right">
                      <button
                        type="button"
                        onClick={() => handleDeleteMapping(m.id)}
                        className="text-slate-500 hover:text-red-400 p-1 cursor-pointer"
                        title="Eliminar mapeo"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
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
