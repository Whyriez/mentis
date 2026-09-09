"use client";

import React from "react";
import { Award, Zap } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { LevelInfo } from "../types";

export function XPLevelCard({ levelInfo }: { levelInfo: LevelInfo }) {
  return (
    <Card className="border-primary/40 bg-gradient-to-br from-card via-card to-primary/10 shadow-md">
      <CardHeader className="pb-2 flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <Badge variant="default" className="text-xs font-extrabold px-2.5 py-0.5 gap-1">
            <Award className="h-3.5 w-3.5" />
            Level {levelInfo.level}
          </Badge>
          <span className="text-sm font-bold text-foreground">{levelInfo.title}</span>
        </div>

        <div className="flex items-center gap-1 text-xs font-bold text-primary">
          <Zap className="h-3.5 w-3.5 text-amber-500 fill-amber-500" />
          <span>{levelInfo.currentXP} XP</span>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        <Progress value={levelInfo.progressPercent} className="h-2.5" />

        <div className="flex justify-between items-center text-xs">
          <span className="text-muted-foreground font-medium">
            {levelInfo.xpToNextLevel > 0
              ? `${levelInfo.xpToNextLevel} XP needed for Level ${levelInfo.level + 1}`
              : "Max Level Reached!"}
          </span>
          <span className="font-bold text-foreground">{levelInfo.progressPercent}%</span>
        </div>
      </CardContent>
    </Card>
  );
}
