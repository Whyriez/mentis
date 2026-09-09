"use client";

import React from "react";
import { Flame, ShieldCheck } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DailyStreakData } from "../types";

export function StreakWidget({ streak }: { streak: DailyStreakData }) {
  const isActive = !!streak.isStreakActiveToday && streak.currentStreak > 0;

  return (
    <Card className="border-amber-500/30 bg-gradient-to-br from-card via-card to-amber-500/5 shadow-sm">
      <CardHeader className="pb-2 flex flex-row items-center justify-between">
        <CardTitle className="text-base font-bold flex items-center gap-2">
          <Flame
            className={`h-5 w-5 text-amber-500 ${
              isActive ? "fill-amber-500 animate-pulse" : "opacity-60"
            }`}
          />
          {streak.currentStreak} Day Learning Streak
        </CardTitle>
        <Badge
          variant="outline"
          className={`text-[10px] gap-1 ${
            isActive
              ? "border-amber-500/40 text-amber-600 dark:text-amber-400 bg-amber-500/10 font-semibold"
              : "border-border text-muted-foreground bg-muted/40 font-normal"
          }`}
        >
          <ShieldCheck className="h-3 w-3" />
          {isActive ? "Active Today" : "Inactive Today"}
        </Badge>
      </CardHeader>

      <CardContent className="space-y-3">
        <p className="text-xs text-muted-foreground">
          {streak.currentStreak > 0 ? (
            <>
              Longest streak: <strong className="text-foreground">{streak.longestStreak} days</strong>. Keep practicing daily to protect your streak!
            </>
          ) : (
            <>
              No streak yet. Complete any drill today to start your daily streak!
            </>
          )}
        </p>

        <div className="flex items-center gap-2 pt-1">
          {streak.milestones.map((m) => (
            <div
              key={m.days}
              className={`flex-1 p-2 rounded-lg border text-center text-xs space-y-0.5 ${
                m.reached
                  ? "border-amber-500/50 bg-amber-500/10 text-amber-600 dark:text-amber-400 font-bold"
                  : "border-border/60 bg-muted/20 text-muted-foreground opacity-60"
              }`}
            >
              <div className="text-[10px] uppercase">{m.days} Days</div>
              <div className="text-[11px] truncate">{m.reached ? "Unlocked" : "Locked"}</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
