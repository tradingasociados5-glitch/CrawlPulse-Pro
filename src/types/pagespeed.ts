export interface CruxMetricValue {
  value: number; // e.g. 4.8s or 55ms
  category: 'FAST' | 'AVERAGE' | 'SLOW';
  goodPct: number; // e.g. 45% of real users
  needsImprovementPct: number; // e.g. 25%
  poorPct: number; // e.g. 30%
}

export interface PageSpeedAuditProfile {
  targetUrl: string;
  fetchTimestamp: string;
  strategy: 'mobile' | 'desktop';
  overallScoreLab: number; // 0 - 100
  overallScoreCrUx: number; // 0 - 100
  // Lab vs Field (Google CrUX) comparison
  labMetrics: {
    lcpSeconds: number;
    clsScore: number;
    tbtMs: number; // Total Blocking Time
    fcpSeconds: number; // First Contentful Paint
    speedIndexSeconds: number;
  };
  fieldMetricsCrUx: {
    lcp: CruxMetricValue;
    cls: CruxMetricValue;
    inp: CruxMetricValue; // Interaction to Next Paint
    fcp: CruxMetricValue;
  };
  deltaInsights: {
    lcpDeltaSeconds: number; // field - lab
    isLabFieldDivergenceCritical: boolean;
    primaryMobileBottleneck: string;
  };
  savingsOpportunities: {
    id: string;
    title: string;
    estimatedSavingsMs: number;
    estimatedSavingsKb: number;
    suggestedFix: string;
  }[];
}
