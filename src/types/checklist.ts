export type ChecklistStatus = 'pending' | 'in_progress' | 'passed' | 'failed' | 'not_applicable';
export type ChecklistCategory = 'Technical & Crawlability' | 'On-Page & Architecture' | 'Core Web Vitals' | 'Schema & Rich Snippets' | 'Mobile & Security';

export interface AuditChecklistItem {
  id: string;
  category: ChecklistCategory;
  title: string;
  description: string;
  recommendedTool: string;
  status: ChecklistStatus;
  notes?: string;
  isCritical: boolean;
}
