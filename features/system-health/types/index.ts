export type HealthStatus = "Healthy" | "Warning" | "Offline";

export interface SystemServiceHealth {
  name: string;
  category: "Database" | "Storage" | "AI Service" | "Authentication" | "Queue" | "Background Jobs";
  status: HealthStatus;
  latencyMs: number;
  message?: string;
  updatedAt: string;
}

export type ServiceHealth = SystemServiceHealth;

export interface EnvironmentInfo {
  appVersion: string;
  commitHash: string;
  deploymentDate: string;
  supabaseRegion: string;
  storageUsageMb: number;
  databaseSizeMb: number;
  nodeVersion: string;
}

export interface BackupHistoryItem {
  id: string;
  backupType: "Database" | "Storage" | "Full System";
  sizeMb: number;
  status: "Success" | "Failed";
  createdAt: string;
}
