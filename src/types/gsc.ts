export interface GscDailyMetric {
  date: string;
  clicks: number;
  impressions: number;
  ctr: number; // percentage e.g. 3.42
  position: number; // average position e.g. 8.4
}

export interface GscTopQuery {
  query: string;
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
}

export interface GscTopPage {
  page: string;
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
}

export interface GscSearchAnalyticsSummary {
  domain: string;
  dateRange: string;
  totalClicks: number;
  totalImpressions: number;
  averageCtr: number;
  averagePosition: number;
  clicksChangePct: number;
  impressionsChangePct: number;
  ctrChangePct: number;
  timeSeries: GscDailyMetric[];
  topQueries: GscTopQuery[];
  topPages: GscTopPage[];
}
