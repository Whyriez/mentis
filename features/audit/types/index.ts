import { UserRole } from "@/features/admin-users/types";

export type AuditActionType =
  | "Login"
  | "Role Change"
  | "Content Publish"
  | "Lesson Update"
  | "Question Edit"
  | "AI Generation"
  | "User Reset"
  | "User Status Change";

export interface AuditLogRecord {
  id: string;
  actorName: string;
  actorRole: UserRole;
  action: AuditActionType;
  target: string;
  details?: string;
  timestamp: string;
  ipAddress?: string;
}
