"use client";

import React from "react";
import { ShieldAlert } from "lucide-react";
import { AuditLogTable } from "@/features/audit/components/audit-log-table";

export default function AdminAuditPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary">
          <ShieldAlert className="h-4 w-4" />
          <span>Security & Governance</span>
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight">Audit Logs</h1>
        <p className="text-muted-foreground text-sm max-w-2xl">
          Immutable event record tracking administrative mutations, role updates, content publishing, and user resets.
        </p>
      </div>

      <AuditLogTable />
    </div>
  );
}
