import { AuditLogRecord, AuditActionType } from "../types";

export class AuditService {
  private static logs: AuditLogRecord[] = [
    {
      id: "audit-101",
      actorName: "Super Admin",
      actorRole: "super_admin",
      action: "Role Change",
      target: "user-editor-1 (Budi Santoso)",
      details: "Promoted Budi Santoso from user to editor.",
      timestamp: "10 mins ago",
      ipAddress: "192.168.1.10",
    },
    {
      id: "audit-102",
      actorName: "Super Admin",
      actorRole: "super_admin",
      action: "AI Generation",
      target: "Job job-801 (10 Questions)",
      details: "Batch generated 10 Multiplication questions via Gemini 1.5 Pro.",
      timestamp: "25 mins ago",
      ipAddress: "192.168.1.10",
    },
    {
      id: "audit-103",
      actorName: "Admin User",
      actorRole: "admin",
      action: "Content Publish",
      target: "Lesson Base-100 Multiplication",
      details: "Published lesson structure to production learners.",
      timestamp: "1 hour ago",
      ipAddress: "192.168.1.15",
    },
    {
      id: "audit-104",
      actorName: "Super Admin",
      actorRole: "super_admin",
      action: "User Reset",
      target: "user-2 (Siti Rahma)",
      details: "Soft reset user learning progress per request.",
      timestamp: "3 hours ago",
      ipAddress: "192.168.1.10",
    },
  ];

  async getAuditLogs(query?: {
    search?: string;
    action?: AuditActionType;
  }): Promise<AuditLogRecord[]> {
    let res = AuditService.logs;

    if (query?.search) {
      const q = query.search.toLowerCase();
      res = res.filter(
        (l) =>
          l.actorName.toLowerCase().includes(q) ||
          l.target.toLowerCase().includes(q) ||
          (l.details && l.details.toLowerCase().includes(q))
      );
    }

    if (query?.action) {
      res = res.filter((l) => l.action === query.action);
    }

    return res;
  }

  logEvent(record: Omit<AuditLogRecord, "id" | "timestamp">): AuditLogRecord {
    const newLog: AuditLogRecord = {
      ...record,
      id: `audit-${Date.now()}`,
      timestamp: "Just now",
    };
    AuditService.logs.unshift(newLog);
    return newLog;
  }

  exportToCSV(logs: AuditLogRecord[]): string {
    const header = "ID,Actor,Role,Action,Target,Details,Timestamp,IP\n";
    const rows = logs
      .map((l) =>
        [
          l.id,
          `"${l.actorName}"`,
          l.actorRole,
          l.action,
          `"${l.target.replace(/"/g, '""')}"`,
          `"${(l.details || "").replace(/"/g, '""')}"`,
          `"${l.timestamp}"`,
          l.ipAddress || "N/A",
        ].join(",")
      )
      .join("\n");

    return header + rows;
  }
}
