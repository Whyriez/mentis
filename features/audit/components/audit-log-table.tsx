"use client";

import React, { useState, useEffect, useCallback } from "react";
import { ShieldAlert, Search, Download, Lock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { AuditService } from "../services/audit-service";
import { AuditLogRecord, AuditActionType } from "../types";

const auditService = new AuditService();

export function AuditLogTable() {
  const [logs, setLogs] = useState<AuditLogRecord[]>([]);
  const [search, setSearch] = useState("");
  const [actionFilter, setActionFilter] = useState<string>("ALL");

  const fetchLogs = useCallback(() => {
    auditService
      .getAuditLogs({
        search,
        action: actionFilter === "ALL" ? undefined : (actionFilter as AuditActionType),
      })
      .then(setLogs);
  }, [search, actionFilter]);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  const handleExportCSV = () => {
    const csvContent = auditService.exportToCSV(logs);
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `mentis-audit-logs-${Date.now()}.csv`;
    a.click();
  };

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <Card className="border-border/80 bg-card shadow-xs">
        <CardContent className="p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-80">
            <Search className="h-4 w-4 absolute left-3 top-3 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search actor, target, or details..."
              className="pl-9 text-xs font-medium"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <select
              value={actionFilter}
              onChange={(e) => setActionFilter(e.target.value)}
              className="p-2 rounded-lg border border-border bg-background text-xs font-semibold"
            >
              <option value="ALL">All Actions</option>
              <option value="Role Change">Role Change</option>
              <option value="AI Generation">AI Generation</option>
              <option value="Content Publish">Content Publish</option>
              <option value="User Reset">User Reset</option>
              <option value="User Status Change">User Status Change</option>
            </select>

            <Button variant="outline" size="sm" onClick={handleExportCSV} className="gap-1.5 font-semibold text-xs">
              <Download className="h-3.5 w-3.5" />
              Export Audit CSV
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Audit Log Items */}
      <Card className="border-border/80 bg-card shadow-xs">
        <CardHeader className="pb-3 flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-base font-bold flex items-center gap-2">
              <ShieldAlert className="h-4 w-4 text-primary" />
              Immutable Administrative Audit Trail
            </CardTitle>
            <CardDescription className="text-xs">Security event record for Super Admin auditing.</CardDescription>
          </div>
          <Badge variant="outline" className="text-[10px] gap-1">
            <Lock className="h-3 w-3 text-emerald-500" />
            Append-Only Log
          </Badge>
        </CardHeader>

        <CardContent className="space-y-3">
          {logs.map((log) => (
            <div key={log.id} className="p-3.5 rounded-xl border border-border/80 bg-muted/20 space-y-1.5 text-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-foreground">{log.actorName}</span>
                  <Badge variant={log.actorRole === "super_admin" ? "destructive" : "accent"} className="text-[9px]">
                    {log.actorRole.toUpperCase()}
                  </Badge>
                  <Badge variant="outline" className="text-[10px] font-bold">
                    {log.action}
                  </Badge>
                </div>
                <span className="text-[11px] text-muted-foreground">{log.timestamp} • IP: {log.ipAddress || "N/A"}</span>
              </div>

              <div className="text-xs text-foreground font-medium">
                Target: <strong className="text-primary">{log.target}</strong>
              </div>

              {log.details && <div className="text-[11px] text-muted-foreground">{log.details}</div>}
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
