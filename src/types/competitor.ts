export interface CompetitorDomainMetric {
  domain: string;
  isClientDomain: boolean;
  organicRank: number; // e.g. Position #1 in SERP
  overallHealthScore: number; // 0 - 100
  lcpMobileSeconds: number; // Core Web Vitals
  fidMs: number;
  clsScore: number;
  indexedPagesCount: number;
  estimatedOrganicKeywords: number;
  domainAuthorityEst: number; // 0 - 100
  schemaMarkupCoveragePct: number;
  hasSslHsts: boolean;
  mobileViewportOptimized: boolean;
  canonicalHygieneScore: number; // 0 - 100
}

export interface CompetitorSerpAnalysis {
  targetKeyword: string;
  searchMarket: string; // e.g. Spain (google.es) / US (google.com)
  analyzedAt: string;
  clientDomain: string;
  competitors: CompetitorDomainMetric[];
  competitiveGaps: {
    factor: string;
    gapDescription: string;
    actionableAdvantage: string;
  }[];
}
