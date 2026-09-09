import React from "react";
import { Flame, Zap } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export interface StreakCardData {
  currentStreak: number;
  longestStreak: number;
  isStreakActiveToday?: boolean;
  activeDaysOfWeek?: boolean[]; // 7 items for Mon-Sun
}

interface CurrentStreakCardProps {
  streakData?: StreakCardData;
}

export function CurrentStreakCard({ streakData }: CurrentStreakCardProps) {
  const currentStreak = streakData?.currentStreak || 0;
  const bestStreak = streakData?.longestStreak || currentStreak;
  const isStreakActiveToday = streakData?.isStreakActiveToday ?? false;

  // Day names M, T, W, T, F, S, S (Mon - Sun)
  const dayLabels = ["M", "T", "W", "T", "F", "S", "S"];
  
  // Calculate today's index (0 = Mon, 6 = Sun)
  const now = new Date();
  const dayIndex = (now.getDay() + 6) % 7; 

  const activeDays = streakData?.activeDaysOfWeek || [
    false,
    false,
    false,
    false,
    false,
    false,
    false,
  ];

  const days = dayLabels.map((day, idx) => ({
    day,
    active: !!activeDays[idx] || (idx === dayIndex && isStreakActiveToday && currentStreak > 0),
    today: idx === dayIndex,
  }));

  return (
    <Card className="border-border/80 bg-card hover:border-amber-500/40 transition-all duration-300 shadow-md">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-amber-500 font-semibold text-xs tracking-wider uppercase">
            <Flame className="h-4 w-4 fill-amber-500" />
            <span>Current Streak</span>
          </div>
          <Badge variant="amber" className="text-[11px] font-semibold">
            Best: {bestStreak} Days
          </Badge>
        </div>
        <CardTitle className="text-3xl font-extrabold flex items-baseline gap-2 mt-1">
          <span>{currentStreak} Days</span>
          <span className="text-xs font-normal text-muted-foreground">
            {currentStreak > 0 ? "Active Streak" : "No Active Streak"}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between items-center px-1">
          {days.map((item, idx) => (
            <div key={idx} className="flex flex-col items-center gap-1.5">
              <div
                className={`h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                  item.active
                    ? "bg-amber-500 text-white shadow-sm shadow-amber-500/30 scale-105"
                    : "bg-muted text-muted-foreground"
                } ${item.today ? "ring-2 ring-amber-500 ring-offset-2 ring-offset-background" : ""}`}
              >
                {item.active ? <Zap className="h-3.5 w-3.5 fill-current" /> : item.day}
              </div>
              <span className="text-[10px] text-muted-foreground font-medium">{item.day}</span>
            </div>
          ))}
        </div>

        <p className="text-xs text-muted-foreground text-center">
          {currentStreak > 0 ? (
            <>
              🔥 Keep training daily to unlock the <span className="font-semibold text-foreground">Brain Master Badge</span> at Day 7!
            </>
          ) : (
            <>
              ⚡ Complete your first drill today to ignite your <span className="font-semibold text-foreground">Daily Streak</span>!
            </>
          )}
        </p>
      </CardContent>
    </Card>
  );
}
