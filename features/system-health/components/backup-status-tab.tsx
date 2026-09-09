"use client";

import React, { useState, useEffect } from "react";
import { HardDrive, RefreshCw } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SystemHealthService } from "../services/system-health-service";
import { BackupHistoryItem } from "../types";

const healthService = new SystemHealthService();

export function BackupStatusTab() {
  const [backups, setBackups] = useState<BackupHistoryItem[]>([]);
  const [isBackingUp, setIsBackingUp] = useState(false);

  const fetchBackups = () => {
    healthService.getBackupHistory().then(setBackups);
  };

  useEffect(() => {
    fetchBackups();
  }, []);

  const handleManualBackup = async () => {
    setIsBackingUp(true);
    try {
      const newBackup = await healthService.triggerManualBackup();
      setBackups((prev) => [newBackup, ...prev]);
    } finally {
      setIsBackingUp(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="border-border/80 bg-card shadow-xs">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-base font-bold flex items-center gap-2">
              <HardDrive className="h-4 w-4 text-primary" />
              Database & Storage Backup History
            </CardTitle>
            <CardDescription className="text-xs">Automated daily snapshots and manual disaster recovery backups.</CardDescription>
          </div>

          <Button
            size="sm"
            onClick={handleManualBackup}
            disabled={isBackingUp}
            className="gap-2 font-bold shadow-xs"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isBackingUp ? "animate-spin" : ""}`} />
            {isBackingUp ? "Creating Snapshot..." : "Trigger Manual Snapshot"}
          </Button>
        </CardHeader>

        <CardContent className="space-y-3">
          {backups.map((b) => (
            <div key={b.id} className="p-3.5 rounded-xl border border-border/80 bg-muted/20 flex justify-between items-center text-xs">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2 font-bold text-foreground">
                  <span>{b.backupType} Backup</span>
                  <Badge variant="accent" className="text-[10px]">{b.status.toUpperCase()}</Badge>
                </div>
                <div className="text-[11px] text-muted-foreground">{b.createdAt} • Size: {b.sizeMb} MB</div>
              </div>

              <Badge variant="outline" className="text-[10px] font-mono">{b.id}</Badge>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
