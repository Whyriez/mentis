"use client";

import React, { useState, useEffect } from "react";
import { ToggleLeft } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FeatureFlagService } from "../services/feature-flag-service";
import { FeatureFlag } from "../types";
import { toggleFeatureFlagAction } from "../actions/feature-flag-actions";

const flagService = new FeatureFlagService();

export function FeatureFlagsTab() {
  const [flags, setFlags] = useState<FeatureFlag[]>([]);
  const [isToggling, setIsToggling] = useState(false);

  const fetchFlags = () => {
    flagService.getFlags().then(setFlags);
  };

  useEffect(() => {
    fetchFlags();
  }, []);

  const handleToggle = async (key: string, current: boolean) => {
    setIsToggling(true);
    try {
      await toggleFeatureFlagAction(key, !current);
      fetchFlags();
    } finally {
      setIsToggling(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="border-border/80 bg-card shadow-xs">
        <CardHeader>
          <CardTitle className="text-base font-bold flex items-center gap-2">
            <ToggleLeft className="h-4 w-4 text-primary" />
            Runtime Feature Flag Controls
          </CardTitle>
          <CardDescription className="text-xs">
            Enable or disable major application features instantly without redeploying code.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-3">
          {flags.map((f) => (
            <div
              key={f.key}
              className="p-4 rounded-xl border border-border/80 bg-muted/20 flex items-center justify-between gap-4"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm text-foreground">{f.name}</span>
                  <Badge variant={f.category === "AI" ? "amber" : f.category === "Gamification" ? "accent" : "outline"} className="text-[10px]">
                    {f.category.toUpperCase()}
                  </Badge>
                  <code className="text-[10px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded">{f.key}</code>
                </div>
                <p className="text-xs text-muted-foreground">{f.description}</p>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <Badge variant={f.isEnabled ? "accent" : "secondary"} className="text-[10px]">
                  {f.isEnabled ? "ENABLED" : "DISABLED"}
                </Badge>
                <input
                  type="checkbox"
                  checked={f.isEnabled}
                  disabled={isToggling}
                  onChange={() => handleToggle(f.key, f.isEnabled)}
                  className="w-5 h-5 rounded accent-primary cursor-pointer"
                />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
