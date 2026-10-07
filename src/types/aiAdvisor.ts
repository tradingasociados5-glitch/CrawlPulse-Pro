export interface SuggestedTask {
  id: string;
  priority: 'P1 - Inmediato' | 'P2 - Alto Impacto' | 'P3 - Quick Win' | 'P4 - Optimización';
  title: string;
  category: 'SEO Técnico' | 'Core Web Vitals' | 'On-Page' | 'Schema.org';
  estimatedTrafficImpact: string;
  rationale: string;
  stepByStepAction: string;
  readySnippet?: string;
  targetFile?: string;
}

export interface AiAuditAdvisorResponse {
  executiveSummary: string;
  estimatedRecoverableRevenueUsd: number;
  priorityTasks: SuggestedTask[];
  competitiveEdgeAdvice: string;
  confidenceScore: number;
}
