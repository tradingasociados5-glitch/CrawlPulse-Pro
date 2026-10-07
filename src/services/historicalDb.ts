import { LighthouseHistoricalRecord, SqliteDbMetadata } from '../types/historical';

const STORAGE_KEY = 'seoflow_lighthouse_sqlite_records_v1';

const INITIAL_RECORDS: LighthouseHistoricalRecord[] = [
  {
    id: 'lh-rec-01',
    auditTimestamp: '2026-08-15T10:00:00Z',
    dateLabel: '15 Aug',
    domain: 'agency-client.com',
    overallPerformanceScore: 54,
    lcpSeconds: 5.6,
    fidMs: 185,
    clsScore: 0.28,
    inpMs: 340,
    deviceType: 'mobile',
    notes: 'Initial audit: uncompressed hero banners and render-blocking fonts',
  },
  {
    id: 'lh-rec-02',
    auditTimestamp: '2026-08-25T14:30:00Z',
    dateLabel: '25 Aug',
    domain: 'agency-client.com',
    overallPerformanceScore: 61,
    lcpSeconds: 4.8,
    fidMs: 140,
    clsScore: 0.22,
    inpMs: 290,
    deviceType: 'mobile',
    notes: 'WebP converted images deployed to staging',
  },
  {
    id: 'lh-rec-03',
    auditTimestamp: '2026-09-05T09:15:00Z',
    dateLabel: '05 Sep',
    domain: 'agency-client.com',
    overallPerformanceScore: 69,
    lcpSeconds: 3.9,
    fidMs: 115,
    clsScore: 0.17,
    inpMs: 240,
    deviceType: 'mobile',
    notes: 'Deferred Google Tag Manager and third-party chat scripts',
  },
  {
    id: 'lh-rec-04',
    auditTimestamp: '2026-09-15T16:00:00Z',
    dateLabel: '15 Sep',
    domain: 'agency-client.com',
    overallPerformanceScore: 78,
    lcpSeconds: 3.1,
    fidMs: 85,
    clsScore: 0.11,
    inpMs: 190,
    deviceType: 'mobile',
    notes: 'Font-display: swap and CSS containment added',
  },
  {
    id: 'lh-rec-05',
    auditTimestamp: '2026-09-25T11:20:00Z',
    dateLabel: '25 Sep',
    domain: 'agency-client.com',
    overallPerformanceScore: 84,
    lcpSeconds: 2.4,
    fidMs: 55,
    clsScore: 0.07,
    inpMs: 145,
    deviceType: 'mobile',
    notes: 'Critical CSS inline and responsive srcset hydration enabled',
  },
  {
    id: 'lh-rec-06',
    auditTimestamp: '2026-10-05T15:45:00Z',
    dateLabel: '05 Oct',
    domain: 'agency-client.com',
    overallPerformanceScore: 92,
    lcpSeconds: 1.9,
    fidMs: 38,
    clsScore: 0.03,
    inpMs: 110,
    deviceType: 'mobile',
    notes: 'Full Core Web Vitals optimization verified on Staging Sandbox',
  },
];

export const loadSqliteHistoricalRecords = (): LighthouseHistoricalRecord[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch {
    // fallback
  }
  return INITIAL_RECORDS;
};

export const saveSqliteHistoricalRecord = (
  record: LighthouseHistoricalRecord
): LighthouseHistoricalRecord[] => {
  const existing = loadSqliteHistoricalRecords();
  const updated = [...existing, record];
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch {
    // fallback
  }
  return updated;
};

export const clearSqliteHistoricalRecords = (): LighthouseHistoricalRecord[] => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // fallback
  }
  return INITIAL_RECORDS;
};

export const getSqliteDbMetadata = (count: number): SqliteDbMetadata => {
  return {
    dbPath: 'src-tauri/data/seo_historical_lighthouse.sqlite3',
    totalRecordsCount: count,
    engine: 'SQLite 3.45 (Local Tauri Driver)',
    lastPersistedTimestamp: new Date().toISOString(),
  };
};
