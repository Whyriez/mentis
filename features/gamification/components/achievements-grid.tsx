"use client";

import React from "react";
import { Trophy, Lock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Achievement } from "../types";

export function AchievementsGrid({ achievements }: { achievements: Achievement[] }) {
  return (
    <Card className="border-border/80 bg-card shadow-sm">
      <CardHeader className="pb-2 flex flex-row items-center justify-between">
        <CardTitle className="text-base font-bold flex items-center gap-2">
          <Trophy className="h-4 w-4 text-amber-500" />
          Badges & Achievements
        </CardTitle>
        <span className="text-xs text-muted-foreground font-semibold">
          {achievements.filter((a) => a.isUnlocked).length} / {achievements.length} Unlocked
        </span>
      </CardHeader>

      <CardContent className="space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {achievements.map((item) => {
            const percent = Math.round((item.currentProgress / item.targetValue) * 100);

            return (
              <div
                key={item.id}
                className={`p-3 rounded-xl border flex items-start gap-3 text-xs transition-all ${
                  item.isUnlocked
                    ? "border-amber-500/30 bg-amber-500/5 shadow-2xs"
                    : "border-border/60 bg-muted/20 opacity-70"
                }`}
              >
                <div className="mt-0.5 shrink-0">
                  {item.isUnlocked ? (
                    <div className="h-8 w-8 rounded-full bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold">
                      🏆
                    </div>
                  ) : (
                    <div className="h-8 w-8 rounded-full bg-muted text-muted-foreground flex items-center justify-center">
                      <Lock className="h-4 w-4" />
                    </div>
                  )}
                </div>

                <div className="space-y-1 flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-foreground">{item.title}</span>
                    <Badge variant={item.isUnlocked ? "accent" : "outline"} className="text-[10px]">
                      +{item.rewardXP} XP
                    </Badge>
                  </div>

                  <p className="text-[11px] text-muted-foreground line-clamp-1">{item.description}</p>

                  <div className="pt-1 space-y-1">
                    <Progress value={percent} className="h-1.5" />
                    <div className="flex justify-between text-[10px] text-muted-foreground font-medium">
                      <span>
                        {item.currentProgress} / {item.targetValue}
                      </span>
                      <span>{percent}%</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
