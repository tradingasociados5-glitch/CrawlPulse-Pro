export type UrlRuleType =
  | 'remove_trailing_slash'
  | 'enforce_lowercase'
  | 'strip_category_slug'
  | 'clean_faceted_params'
  | 'custom_regex_rewrite'
  | 'ecommerce_flat_hierarchy';

export interface UrlMappingItem {
  id: string;
  originalPath: string;
  ruleApplied: string;
  suggestedCleanPath: string;
  status: 'valid' | 'conflict_duplicate' | 'redirect_loop' | 'preserved';
  conflictDetails?: string;
  httpStatus: 301 | 308;
  trafficPriority: 'Alta' | 'Media' | 'Baja';
}

export interface PathArchitectureSummary {
  domain: string;
  totalMappedUrls: number;
  cleanUrlsCount: number;
  conflictsDetectedCount: number;
  deepHierarchyFlattenedCount: number;
  mappings: UrlMappingItem[];
}
