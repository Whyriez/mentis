"use client";

import React, { useState, useEffect } from "react";
import { Activity, Cpu } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SystemHealthService } from "../services/system-health-service";
import { ServiceHealth, EnvironmentInfo } from "../types";

const healthService = new SystemHealthService();

export function SystemHealthTab() {
  const [services, setServices] = useState<ServiceHealth[]>([]);
  const [envInfo, setEnvInfo] = useState<EnvironmentInfo | null>(null);

  useEffect(() => {
    Promise.all([
      healthService.getServiceHealth(),
      healthService.getEnvironmentInfo(),
    ]).then(([s, e]) => {
      setServices(s);
      setEnvInfo(e);
    });
  }, []);

  return (
    <div className="space-y-6">
      {/* Services Health */}
      <Card className="border-border/80 bg-card shadow-xs">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-bold flex items-center gap-2">
            <Activity className="h-4 w-4 text-emerald-500" />
            Infrastructure & External API Status
          </CardTitle>
          <CardDescription className="text-xs">Real-time health monitoring of database, storage, auth, and AI generation services.</CardDescription>
        </CardHeader>

        <CardContent className="space-y-3">
          {services.map((s, idx) => (
            <div key={idx} className="p-3.5 rounded-xl border border-border/80 bg-muted/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2 font-extrabold text-foreground">
                  <span>{s.name}</span>
                  <Badge variant="outline" className="text-[10px]">{s.category}</Badge>
                </div>
                <div className="text-muted-foreground">{s.message}</div>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-[11px] text-muted-foreground font-mono">{s.latencyMs}ms latency</span>
                <Badge variant={s.status === "Healthy" ? "accent" : "destructive"} className="text-[10px]">
                  {s.status.toUpperCase()}
                </Badge>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Environment Details */}
      {envInfo && (
        <Card className="border-border/80 bg-card shadow-xs">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-bold flex items-center gap-2">
              <Cpu className="h-4 w-4 text-primary" />
              Runtime Environment & Build Details
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-3 rounded-lg border border-border bg-background">
              <div className="text-muted-foreground">App Version</div>
              <div className="font-extrabold text-foreground font-mono mt-0.5">{envInfo.appVersion}</div>
            </div>
            <div className="p-3 rounded-lg border border-border bg-background">
              <div className="text-muted-foreground">Commit Hash</div>
              <div className="font-extrabold text-foreground font-mono mt-0.5">{envInfo.commitHash}</div>
            </div>
            <div className="p-3 rounded-lg border border-border bg-background">
              <div className="text-muted-foreground">Supabase Region</div>
              <div className="font-extrabold text-foreground mt-0.5">{envInfo.supabaseRegion}</div>
            </div>
            <div className="p-3 rounded-lg border border-border bg-background">
              <div className="text-muted-foreground">Node Version</div>
              <div className="font-extrabold text-foreground font-mono mt-0.5">{envInfo.nodeVersion}</div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
