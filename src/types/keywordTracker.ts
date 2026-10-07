export interface KeywordTrackingItem {
  id: string;
  keyword: string;
  landingPage: string;
  currentPosition: number; // e.g. 2.4
  previousPosition: number; // e.g. 5.8
  positionDelta: number; // previous - current (positive is improved)
  status: 'improved' | 'declined' | 'stable';
  monthlyClicks: number;
  monthlyImpressions: number;
  ctrPct: number;
  serpFeatures: string[]; // e.g. ['Rich Snippet Estrellas', 'SiteLinks', 'Featured Snippet']
  history30Days: number[]; // 5 samples over 30 days
  searchIntent: 'Transaccional' | 'Comercial' | 'Informativa' | 'Navegacional';
}

export interface KeywordTrackerSummary {
  domain: string;
  totalTrackedKeywords: number;
  improvedKeywordsCount: number;
  declinedKeywordsCount: number;
  stableKeywordsCount: number;
  top10KeywordsCount: number;
  top3KeywordsCount: number;
  averagePosition: number;
  averagePositionDelta: number;
  lastSyncedTimestamp: string;
  keywords: KeywordTrackingItem[];
}
