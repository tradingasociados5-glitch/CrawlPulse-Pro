export interface LighthouseHistoricalRecord {
  id: string;
  auditTimestamp: string;
  dateLabel: string;
  domain: string;
  overallPerformanceScore: number; // 0 - 100
  lcpSeconds: number; // Largest Contentful Paint (Good: <= 2.5s)
  fidMs: number; // First Input Delay (Good: <= 100ms)
  clsScore: number; // Cumulative Layout Shift (Good: <= 0.1)
  inpMs: number; // Interaction to Next Paint (Good: <= 200ms)
  deviceType: 'mobile' | 'desktop';
  notes?: string;
}

export interface SqliteDbMetadata {
  dbPath: string;
  totalRecordsCount: number;
  engine: string;
  lastPersistedTimestamp: string;
}
