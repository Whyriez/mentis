"use client";

import React, { useState, useEffect } from "react";
import { AlertOctagon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { SettingsService } from "../services/settings-service";
import { MaintenanceConfig } from "../types";
import { toggleMaintenanceModeAction } from "../actions/settings-actions";

const settingsService = new SettingsService();

export function MaintenanceModeTab() {
  const [config, setConfig] = useState<MaintenanceConfig | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    settingsService.getMaintenanceConfig().then(setConfig);
  }, []);

  if (!config) return null;

  const handleToggle = async () => {
    setIsSaving(true);
    try {
      const res = await toggleMaintenanceModeAction(!config.enabled, config.message);
      setConfig(res.config);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="border-border/80 bg-card shadow-xs">
        <CardHeader>
          <CardTitle className="text-base font-bold flex items-center gap-2">
            <AlertOctagon className="h-4 w-4 text-amber-500" />
            Platform Maintenance Mode & Infrastructure Lock
          </CardTitle>
          <CardDescription className="text-xs">
            When Maintenance Mode is enabled, non-admin learners are redirected to a branded maintenance screen.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="p-4 rounded-xl border border-border/80 bg-muted/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm text-foreground">Current Platform State</span>
                <Badge variant={config.enabled ? "amber" : "accent"}>
                  {config.enabled ? "MAINTENANCE MODE ACTIVE" : "PLATFORM OPERATIONAL"}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground mt-1">Super Admins & Admins remain whitelisted during maintenance.</p>
            </div>

            <Button
              type="button"
              onClick={handleToggle}
              disabled={isSaving}
              variant={config.enabled ? "default" : "destructive"}
              size="sm"
              className="font-bold text-xs shadow-xs"
            >
              {config.enabled ? "Disable Maintenance Mode" : "Enable Maintenance Mode"}
            </Button>
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-bold">Learner Maintenance Display Message</Label>
            <Input
              value={config.message}
              onChange={(e) => setConfig({ ...config, message: e.target.value })}
              className="text-xs font-medium"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
