import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Bot,
  TrendingUp,
  AlertTriangle,
  ArrowRight,
  Copy,
  Check,
  ShieldCheck,
  Zap,
  Target,
  FileCode2,
  RefreshCw,
  Lightbulb,
  DollarSign
} from 'lucide-react';
import { AiAuditAdvisorResponse, SuggestedTask } from '../types/aiAdvisor';
import { generateAdvisorAnalysis } from '../services/aiAdvisorService';

interface SeoAiAdvisorModuleProps {
  currentDomain: string;
  issuesCount: number;
  healthScore: number;
}

export const SeoAiAdvisorModule: React.FC<SeoAiAdvisorModuleProps> = ({
  currentDomain,
  issuesCount,
  healthScore,
}) => {
  const [analysis, setAnalysis] = useState<AiAuditAdvisorResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [copiedTaskId, setCopiedTaskId] = useState<string | null>(null);
  const [selectedTask, setSelectedTask] = useState<SuggestedTask | null>(null);

  const fetchAdvice = async () => {
    setIsLoading(true);
    const result = await generateAdvisorAnalysis(currentDomain, issuesCount, healthScore);
    setAnalysis(result);
    setSelectedTask(result.priorityTasks[0]);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchAdvice();
  }, [currentDomain]);

  const handleCopyCode = (task: SuggestedTask) => {
    if (!task.readySnippet) return;
    navigator.clipboard.writeText(task.readySnippet);
    setCopiedTaskId(task.id);
    setTimeout(() => setCopiedTaskId(null), 2000);
  };

  const getPriorityBadge = (priority: string) => {
    if (priority.startsWith('P1')) {
      return (
        <span className="text-[11px] font-bold text-red-400 bg-red-950/70 border border-red-800/80 px-2 py-0.5 rounded">
          {priority}
        </span>
      );
    }
    if (priority.startsWith('P2')) {
      return (
        <span className="text-[11px] font-bold text-amber-400 bg-amber-950/70 border border-amber-800/80 px-2 py-0.5 rounded">
          {priority}
        </span>
      );
    }
    return (
      <span className="text-[11px] font-bold text-blue-400 bg-blue-950/70 border border-blue-800/80 px-2 py-0.5 rounded">
        {priority}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Module Header Bar */}
      <section className="bg-slate-900 border border-slate-800 rounded-lg p-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <div className="text-xs text-slate-400 flex items-center gap-2">
              <span className="flex items-center gap-1.5 font-medium text-purple-400">
                <Sparkles className="w-3.5 h-3.5" />
                Gemini 3.8 Flash Engine
              </span>
              <span aria-hidden="true">·</span>
              <span>Priorización Heurística de Tareas SEO</span>
              <span aria-hidden="true">·</span>
              <span className="text-emerald-400 font-medium">94% Nivel de Confianza</span>
            </div>
            <h2 className="text-base font-bold text-white mt-1 flex items-center gap-2">
              <Bot className="w-5 h-5 text-purple-400" />
              SEO AI Advisor (Recomendaciones Estratégicas Inteligentes)
            </h2>
          </div>

          <button
            type="button"
            onClick={fetchAdvice}
            disabled={isLoading}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold text-white bg-purple-600 hover:bg-purple-500 disabled:opacity-50 rounded-md transition-colors cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            {isLoading ? 'Analizando con Gemini...' : 'Re-analizar Auditoría'}
          </button>
        </div>

        {/* AI Executive Summary Box */}
        {analysis && (
          <div className="pt-4 grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
            <div className="lg:col-span-8 space-y-2 text-xs">
              <div className="flex items-center gap-2 font-semibold text-purple-300">
                <Lightbulb className="w-4 h-4 text-purple-400" />
                Dictamen Ejecutivo del Modelo:
              </div>
              <p className="text-slate-300 leading-relaxed bg-slate-950 p-3.5 rounded-lg border border-slate-800/80">
                {analysis.executiveSummary}
              </p>
            </div>

            <div className="lg:col-span-4 p-4 bg-purple-950/30 border border-purple-800/60 rounded-lg text-xs space-y-1 text-center">
              <span className="text-slate-400 block">Potencial de Recuperación Mensual</span>
              <div className="text-2xl font-bold font-mono text-emerald-400 tabular-nums">
                +${analysis.estimatedRecoverableRevenueUsd.toLocaleString('es-ES')} USD
              </div>
              <span className="text-[11px] text-slate-500 block">
                Calculado sobre el tráfico de {currentDomain}
              </span>
            </div>
          </div>
        )}
      </section>

      {/* Main Split: Ranked Task List & Deep Task Details */}
      {analysis && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Priority-Ranked Tasks List */}
          <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-lg p-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-xs">
              <span className="font-semibold text-white flex items-center gap-1.5">
                <Target className="w-4 h-4 text-blue-400" />
                Tareas Clasificadas por Prioridad ({analysis.priorityTasks.length})
              </span>
              <span className="text-slate-400 font-mono">Ordenadas por ROI</span>
            </div>

            <div className="space-y-3">
              {analysis.priorityTasks.map((task) => {
                const isSelected = selectedTask?.id === task.id;
                return (
                  <div
                    key={task.id}
                    onClick={() => setSelectedTask(task)}
                    className={`p-3.5 rounded-lg border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-purple-950/40 border-purple-500 shadow-sm'
                        : 'bg-slate-950/70 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs mb-1">
                      {getPriorityBadge(task.priority)}
                      <span className="text-[11px] font-mono text-slate-400">
                        {task.category}
                      </span>
                    </div>

                    <h4 className="text-sm font-semibold text-slate-100 mt-1.5 leading-snug">
                      {task.title}
                    </h4>

                    <div className="mt-2 text-xs text-emerald-400 font-medium flex items-center gap-1">
                      <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                      <span>{task.estimatedTrafficImpact}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Deep Action Plan & Ready Code Snippet */}
          <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-lg p-5 space-y-4">
            {selectedTask ? (
              <div className="space-y-4">
                <div className="pb-3 border-b border-slate-800 flex items-center justify-between">
                  <div>
                    <div className="text-xs text-slate-400 flex items-center gap-2">
                      <span>{selectedTask.category}</span>
                      <span aria-hidden="true">·</span>
                      <span className="text-purple-400 font-medium">{selectedTask.priority}</span>
                    </div>
                    <h3 className="text-base font-semibold text-white mt-1">
                      {selectedTask.title}
                    </h3>
                  </div>

                  <span className="text-xs font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-800/80 px-2.5 py-1 rounded">
                    {selectedTask.estimatedTrafficImpact}
                  </span>
                </div>

                {/* Why this matters (Rationale) */}
                <div className="p-3.5 bg-slate-950 border border-slate-800 rounded-lg text-xs space-y-1">
                  <span className="font-semibold text-amber-400 flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    ¿Por qué esta tarea es prioritaria según Gemini?
                  </span>
                  <p className="text-slate-300 leading-relaxed pt-0.5">
                    {selectedTask.rationale}
                  </p>
                </div>

                {/* Step by step action */}
                <div className="p-3.5 bg-slate-950 border border-slate-800 rounded-lg text-xs space-y-1">
                  <span className="font-semibold text-blue-400 flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5" />
                    Instrucciones de Implementación Paso a Paso:
                  </span>
                  <p className="text-slate-300 leading-relaxed pt-0.5">
                    {selectedTask.stepByStepAction}
                  </p>
                  {selectedTask.targetFile && (
                    <div className="pt-1 text-[11px] text-slate-400 font-mono">
                      Archivo objetivo: <code className="text-slate-200">{selectedTask.targetFile}</code>
                    </div>
                  )}
                </div>

                {/* Ready Code Snippet to Copy */}
                {selectedTask.readySnippet && (
                  <div className="space-y-1.5 pt-1">
                    <div className="flex items-center justify-between text-xs text-slate-400">
                      <span className="font-semibold text-slate-200 flex items-center gap-1.5">
                        <FileCode2 className="w-3.5 h-3.5 text-emerald-400" />
                        Código Listo para Pegar en Staging Sandbox:
                      </span>
                      <button
                        type="button"
                        onClick={() => handleCopyCode(selectedTask)}
                        className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 px-2.5 py-1 rounded border border-slate-700 cursor-pointer"
                      >
                        {copiedTaskId === selectedTask.id ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-400" />
                            <span>Copiado</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span>Copiar Snippet</span>
                          </>
                        )}
                      </button>
                    </div>

                    <pre className="p-3.5 bg-slate-950 border border-slate-800 rounded text-xs font-mono text-emerald-300 overflow-x-auto leading-relaxed">
                      <code>{selectedTask.readySnippet}</code>
                    </pre>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-12 text-xs text-slate-500">
                Selecciona una tarea en la columna izquierda para ver los detalles.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
