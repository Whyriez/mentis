"use client";

import React, { useState, useEffect } from "react";
import { Cpu } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AILog } from "../types";
import { getLogsAction } from "../actions/ai-actions";

export function AILogsTable() {
  const [logs, setLogs] = useState<AILog[]>([]);

  useEffect(() => {
    getLogsAction().then(setLogs);
  }, []);

  return (
    <Card className="border-border/80 bg-card shadow-xs">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-bold flex items-center gap-2">
          <Cpu className="h-4 w-4 text-primary" />
          AI Execution & Token Logs
        </CardTitle>
        <CardDescription className="text-xs">Audit log of Gemini API model latency, token count, and execution status.</CardDescription>
      </CardHeader>

      <CardContent className="space-y-3">
        {logs.length === 0 ? (
          <div className="p-8 rounded-xl border border-dashed border-border/80 text-center space-y-2">
            <Cpu className="h-8 w-8 text-muted-foreground/50 mx-auto" />
            <div className="text-xs font-bold text-foreground">No Audit Logs Recorded</div>
            <p className="text-[11px] text-muted-foreground max-w-xs mx-auto">
              Execution latency, model used, and token consumption metrics will be recorded here when generation jobs run.
            </p>
          </div>
        ) : (
          logs.map((log) => (
            <div key={log.id} className="p-3 rounded-xl border border-border/80 bg-muted/20 flex items-center justify-between gap-4 text-xs">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="font-bold text-[10px]">{log.model}</Badge>
                  <span className="font-bold text-foreground">{log.contentType} Job</span>
                  <Badge variant={log.status === "Success" ? "accent" : "destructive"} className="text-[10px]">
                    {log.status.toUpperCase()}
                  </Badge>
                </div>
                <div className="text-[11px] text-muted-foreground">Job ID: {log.jobId}</div>
              </div>

              <div className="flex items-center gap-4 text-xs text-muted-foreground shrink-0">
                <div className="text-right">
                  <div className="font-bold text-foreground">{log.tokenCount} Tokens</div>
                  <div className="text-[11px]">{log.latencyMs}ms Latency</div>
                </div>
                <div className="text-[11px] font-medium">{log.createdAt}</div>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
