"use client";

import React from "react";
import Link from "next/link";
import { Sparkles, Play, Clock, HelpCircle, CheckCircle2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { DailyMission } from "../types";

export function DailyMissionWidget({ mission }: { mission: DailyMission }) {
  const percentCompleted = Math.round(
    (mission.completedMinutes / mission.targetMinutes) * 100
  );

  return (
    <Card className="border-primary/40 bg-gradient-to-br from-card via-card to-primary/5 shadow-md">
      <CardHeader className="pb-2 flex flex-row items-center justify-between">
        <CardTitle className="text-base font-bold flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-primary" />
          Today&apos;s Learning Mission
        </CardTitle>
        <span className="text-xs font-bold text-primary">{percentCompleted}% Done</span>
      </CardHeader>

      <CardContent className="space-y-4">
        <Progress value={percentCompleted} className="h-2" />

        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="p-2.5 rounded-lg bg-card border border-border/60 flex items-center gap-2">
            <Clock className="h-4 w-4 text-amber-500 shrink-0" />
            <div>
              <div className="font-bold">{mission.completedMinutes} / {mission.targetMinutes} Mins</div>
              <div className="text-[10px] text-muted-foreground">Study Time</div>
            </div>
          </div>

          <div className="p-2.5 rounded-lg bg-card border border-border/60 flex items-center gap-2">
            <HelpCircle className="h-4 w-4 text-primary shrink-0" />
            <div>
              <div className="font-bold">{mission.completedQuestions} / {mission.targetQuestions} Qs</div>
              <div className="text-[10px] text-muted-foreground">Questions Goal</div>
            </div>
          </div>
        </div>

        <div className="pt-2 flex justify-between items-center text-xs">
          <span className="text-muted-foreground flex items-center gap-1">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
            Target Speed: &lt;{mission.targetMaxSpeedSec}s per Q
          </span>

          <Link href="/quiz">
            <Button size="xs" className="gap-1 font-bold shadow-xs">
              <Play className="h-3.5 w-3.5 fill-current" />
              Complete Mission
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
