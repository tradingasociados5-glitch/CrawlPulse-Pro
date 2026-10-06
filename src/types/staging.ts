export type ConnectionType = 'sftp' | 'ftp' | 'wordpress' | 'shopify';
export type ConnectionStatus = 'untested' | 'testing' | 'connected' | 'failed';
export type BackupStatus = 'none' | 'generating' | 'ready';
export type PatchStatus = 'idle' | 'simulating' | 'applied_staging' | 'reverted';

export interface StagingCredential {
  id: string;
  name: string;
  type: ConnectionType;
  hostUrl: string;
  port?: number;
  username: string;
  secretKeyMasked: string;
  remoteRootPath: string; // e.g. /var/www/staging.example.com or /themes/staging
  isStagingFlagVerified: boolean; // safeguard: verifies domain is not production
  status: ConnectionStatus;
  lastTestedAt?: string;
  latencyMs?: number;
  serverBanner?: string;
}

export interface PatchSimulationItem {
  id: string;
  targetFile: string;
  targetSnippetName: string;
  patchType: 'htaccess_301' | 'liquid_canonical' | 'wp_functions_schema' | 'robots_txt';
  originalCode: string;
  patchedCode: string;
  dryRunDiff: string;
  backupSnapshotId?: string;
  status: PatchStatus;
  lastRunTimestamp?: string;
  simulatedSafetyCheckPassed: boolean;
}
