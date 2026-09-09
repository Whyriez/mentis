import { AdminSessionItem, FailedLoginAttempt } from "../types";
import { AuditService } from "@/features/audit/services/audit-service";

const auditService = new AuditService();

export class SecurityService {
  private static sessions: AdminSessionItem[] = [
    {
      id: "sess-1",
      userEmail: "alex@mentis.dev",
      role: "super_admin",
      ipAddress: "192.168.1.10",
      deviceInfo: "Chrome 127 on Windows 11",
      loginTime: "Today at 09:14",
      lastActivity: "Just now",
      isCurrentSession: true,
    },
    {
      id: "sess-2",
      userEmail: "budi@mentis.dev",
      role: "editor",
      ipAddress: "192.168.1.15",
      deviceInfo: "Safari on macOS Sonoma",
      loginTime: "Today at 11:30",
      lastActivity: "2 hours ago",
      isCurrentSession: false,
    },
  ];

  private static failedLogins: FailedLoginAttempt[] = [
    {
      id: "fail-101",
      email: "unknown@attacker.com",
      ipAddress: "185.220.101.4",
      attemptTime: "3 hours ago",
      reason: "Invalid password attempt (Blocked by Rate Limiter)",
    },
  ];

  async getActiveSessions(): Promise<AdminSessionItem[]> {
    return SecurityService.sessions;
  }

  async getFailedLogins(): Promise<FailedLoginAttempt[]> {
    return SecurityService.failedLogins;
  }

  async terminateSession(sessionId: string): Promise<boolean> {
    const idx = SecurityService.sessions.findIndex((s) => s.id === sessionId);
    if (idx === -1) return false;
    const [terminated] = SecurityService.sessions.splice(idx, 1);

    auditService.logEvent({
      actorName: "Super Admin",
      actorRole: "super_admin",
      action: "User Status Change",
      target: `Session: ${terminated.userEmail} (${terminated.ipAddress})`,
      details: "Force terminated active admin session.",
    });

    return true;
  }
}
