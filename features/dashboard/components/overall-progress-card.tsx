import React from "react";
import Link from "next/link";
import { BarChart3, TrendingUp, ArrowUpRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface Props {
  accuracy?: number;
  totalQuestions?: number;
}

export function OverallProgressCard({ accuracy = 84, totalQuestions = 80 }: Props) {
  return (
    <Card className="border-border/80 bg-card shadow-sm hover:shadow-md transition-shadow">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-semibold text-muted-foreground flex items-center gap-1.5">
          <BarChart3 className="h-4 w-4 text-primary" />
          Overall Mastery
        </CardTitle>
        <Link
          href="/analytics"
          className="text-xs font-medium text-primary hover:underline flex items-center gap-0.5"
        >
          Analytics
          <ArrowUpRight className="h-3 w-3" />
        </Link>
      </CardHeader>

      <CardContent className="space-y-3">
        <div className="flex items-baseline justify-between">
          <div className="text-2xl font-bold text-foreground">{accuracy}%</div>
          <div className="flex items-center gap-1 text-xs font-semibold text-emerald-500">
            <TrendingUp className="h-3.5 w-3.5" />
            <span>+4% this week</span>
          </div>
        </div>

        <Progress value={accuracy} className="h-2" />

        <div className="grid grid-cols-2 gap-2 text-xs pt-1 border-t border-border/50">
          <div>
            <span className="text-muted-foreground">Drills Solved: </span>
            <span className="font-semibold text-foreground">{totalQuestions}</span>
          </div>
          <div>
            <span className="text-muted-foreground">Target Tier: </span>
            <span className="font-semibold text-emerald-500">Exam Ready</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
