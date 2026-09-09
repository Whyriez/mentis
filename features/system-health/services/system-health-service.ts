import { ServiceHealth, EnvironmentInfo, BackupHistoryItem } from "../types";

export class SystemHealthService {
  async getServiceHealth(): Promise<ServiceHealth[]> {
    return [
      {
        name: "Supabase PostgreSQL Database",
        category: "Database",
        status: "Healthy",
        latencyMs: 14,
        message: "All database pools operational (4/100 active connections).",
        updatedAt: "Just now",
      },
      {
        name: "Supabase Storage Bucket",
        category: "Storage",
        status: "Healthy",
        latencyMs: 32,
        message: "CDN Edge caching active (99.9% hit rate).",
        updatedAt: "Just now",
      },
      {
        name: "Google Gemini 1.5 Pro API",
        category: "AI Service",
        status: "Healthy",
        latencyMs: 240,
        message: "Generation endpoints responding normally.",
        updatedAt: "Just now",
      },
      {
        name: "Supabase Auth Service",
        category: "Authentication",
        status: "Healthy",
        latencyMs: 18,
        message: "JWT Token verification operational.",
        updatedAt: "Just now",
      },
      {
        name: "Asynchronous Background Job Queue",
        category: "Background Jobs",
        status: "Healthy",
        latencyMs: 5,
        message: "0 failed jobs in queue.",
        updatedAt: "Just now",
      },
    ];
  }

  async getEnvironmentInfo(): Promise<EnvironmentInfo> {
    return {
      appVersion: "1.4.0-sprintA6",
      commitHash: "8a4f91e",
      deploymentDate: "2026-08-07 23:22 UTC",
      supabaseRegion: "ap-southeast-1 (Singapore)",
      storageUsageMb: 240.5,
      databaseSizeMb: 84.2,
      nodeVersion: "v20.12.2",
    };
  }

  async getBackupHistory(): Promise<BackupHistoryItem[]> {
    return [
      {
        id: "bak-20260807",
        backupType: "Full System",
        sizeMb: 324.7,
        status: "Success",
        createdAt: "2026-08-07 00:00 UTC",
      },
      {
        id: "bak-20260806",
        backupType: "Database",
        sizeMb: 84.0,
        status: "Success",
        createdAt: "2026-08-06 00:00 UTC",
      },
    ];
  }

  async triggerManualBackup(): Promise<BackupHistoryItem> {
    return {
      id: `bak-${Date.now()}`,
      backupType: "Full System",
      sizeMb: 325.1,
      status: "Success",
      createdAt: "Just now",
    };
  }
}
