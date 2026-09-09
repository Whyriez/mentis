"use client";

import React, { useState, useEffect } from "react";
import { LogOut, AlertTriangle, Lock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SecurityService } from "../services/security-service";
import { AdminSessionItem, FailedLoginAttempt } from "../types";

const securityService = new SecurityService();

export function SecurityDashboardTab() {
  const [sessions, setSessions] = useState<AdminSessionItem[]>([]);
  const [failedLogins, setFailedLogins] = useState<FailedLoginAttempt[]>([]);
  const [isTerminating, setIsTerminating] = useState(false);

  const fetchSecurityData = () => {
    securityService.getActiveSessions().then(setSessions);
    securityService.getFailedLogins().then(setFailedLogins);
  };

  useEffect(() => {
    fetchSecurityData();
  }, []);

  const handleTerminateSession = async (id: string) => {
    setIsTerminating(true);
    try {
      await securityService.terminateSession(id);
      fetchSecurityData();
    } finally {
      setIsTerminating(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Active Sessions */}
      <Card className="border-border/80 bg-card shadow-xs">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-bold flex items-center gap-2">
            <Lock className="h-4 w-4 text-primary" />
            Active Administrator Sessions
          </CardTitle>
          <CardDescription className="text-xs">Monitor and terminate logged-in administrator browser sessions.</CardDescription>
        </CardHeader>

        <CardContent className="space-y-3">
          {sessions.map((s) => (
            <div key={s.id} className="p-3.5 rounded-xl border border-border/80 bg-muted/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2 font-bold text-foreground">
                  <span>{s.userEmail}</span>
                  <Badge variant={s.role === "super_admin" ? "destructive" : "accent"} className="text-[10px]">{s.role.toUpperCase()}</Badge>
                  {s.isCurrentSession && <Badge variant="outline" className="text-[10px]">CURRENT SESSION</Badge>}
                </div>
                <div className="text-muted-foreground">{s.deviceInfo} • IP: {s.ipAddress}</div>
              </div>

              {!s.isCurrentSession && (
                <Button
                  size="xs"
                  variant="outline"
                  disabled={isTerminating}
                  onClick={() => handleTerminateSession(s.id)}
                  className="gap-1 font-semibold text-destructive hover:bg-destructive/10 text-xs shrink-0"
                >
                  <LogOut className="h-3 w-3" />
                  Terminate Session
                </Button>
              )}
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Failed Login Attempts */}
      <Card className="border-border/80 bg-card shadow-xs">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-bold flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-destructive" />
            Failed & Suspicious Login Attempts
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {failedLogins.map((f) => (
            <div key={f.id} className="p-3 rounded-xl border border-border/80 bg-muted/20 flex justify-between items-center text-xs">
              <div>
                <div className="font-bold text-foreground">{f.email} (IP: {f.ipAddress})</div>
                <div className="text-[11px] text-muted-foreground">{f.reason}</div>
              </div>
              <span className="text-[11px] text-muted-foreground font-semibold">{f.attemptTime}</span>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
