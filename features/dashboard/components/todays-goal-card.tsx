import React from "react";
import { Target, CheckCircle2, Trophy } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

export interface DailyGoalData {
  targetMinutes: number;
  completedMinutes: number;
  drillsCompleted: number;
  targetDrills: number;
}

interface TodaysGoalCardProps {
  goalData?: DailyGoalData;
}

export function TodaysGoalCard({ goalData }: TodaysGoalCardProps) {
  const targetMinutes = goalData?.targetMinutes || 20;
  const completedMinutes = goalData?.completedMinutes || 0;
  const drillsCompleted = goalData?.drillsCompleted || 0;
  const targetDrills = goalData?.targetDrills || 5;

  const percentage = Math.min(100, Math.round((completedMinutes / targetMinutes) * 100));
  const minsLeft = Math.max(0, targetMinutes - completedMinutes);
  const isGoalAchieved = completedMinutes >= targetMinutes;

  return (
    <Card className="border-border/80 bg-card hover:border-primary/40 transition-all duration-300 shadow-md">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-emerald-500 font-semibold text-xs tracking-wider uppercase">
            <Target className="h-4 w-4" />
            <span>Today&apos;s Daily Goal</span>
          </div>
          <Badge variant={isGoalAchieved ? "accent" : "outline"} className="text-[11px] font-bold">
            {percentage}% Reached
          </Badge>
        </div>
        <CardTitle className="text-xl font-bold mt-1">
          {completedMinutes} of {targetMinutes} mins trained
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Progress value={percentage} className="h-2.5" />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>
              {isGoalAchieved
                ? "Target completed for today!"
                : `${minsLeft} mins left to hit daily target`}
            </span>
            <span className="font-medium">
              {drillsCompleted}/{targetDrills} Drills
            </span>
          </div>
        </div>

        <div className={`p-3 rounded-lg flex items-center gap-3 border ${
          isGoalAchieved
            ? "bg-emerald-500/15 border-emerald-500/30 text-emerald-600 dark:text-emerald-400"
            : "bg-muted/50 border-border/40 text-foreground"
        }`}>
          {isGoalAchieved ? (
            <Trophy className="h-5 w-5 text-emerald-500 shrink-0" />
          ) : (
            <CheckCircle2 className="h-5 w-5 text-primary shrink-0" />
          )}
          <p className="text-xs font-medium">
            {isGoalAchieved
              ? "Awesome work! You completed your daily study goal today."
              : drillsCompleted === 0
              ? "Complete your first drill today to kickstart your progress!"
              : "Great momentum! Complete 1 more drill to secure your daily bonus."}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
