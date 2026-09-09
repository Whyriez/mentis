"use client";

import React from "react";
import { Sparkles, ShieldAlert, TrendingUp, Clock, BookOpen } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ReadinessMetrics } from "../types";

export function ReadinessScoreCard({ readiness }: { readiness: ReadinessMetrics }) {
  return (
    <Card className="border-primary/40 bg-gradient-to-br from-card via-card to-primary/5 shadow-md">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-primary/20 bg-primary/10 text-primary text-xs font-bold">
            <Sparkles className="h-3.5 w-3.5" />
            Readiness Score (Beta)
          </div>
          <Badge variant="accent">{readiness.tier}</Badge>
        </div>

        <CardTitle className="text-xl font-bold pt-2">Psychometric Exam Readiness</CardTitle>
        <CardDescription className="text-xs">
          An estimated progress indicator based on accuracy, response speed, and completed lessons.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="flex flex-col sm:flex-row items-center gap-6 p-4 rounded-xl bg-card border border-border/60">
          <div className="relative flex items-center justify-center w-28 h-28 rounded-full border-4 border-primary/20 bg-primary/5 shrink-0">
            <div className="text-center">
              <span className="text-3xl font-extrabold text-primary">{readiness.score}%</span>
              <span className="block text-[10px] uppercase font-bold text-muted-foreground tracking-wider">
                Overall Index
              </span>
            </div>
          </div>

          <div className="space-y-3 w-full">
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-medium">
                <span className="flex items-center gap-1 text-muted-foreground">
                  <TrendingUp className="h-3.5 w-3.5 text-emerald-500" />
                  Accuracy Factor (50% max)
                </span>
                <span className="font-bold text-foreground">{readiness.accuracyWeight}%</span>
              </div>
              <Progress value={(readiness.accuracyWeight / 50) * 100} className="h-1.5" />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-xs font-medium">
                <span className="flex items-center gap-1 text-muted-foreground">
                  <Clock className="h-3.5 w-3.5 text-amber-500" />
                  Speed Factor (30% max)
                </span>
                <span className="font-bold text-foreground">{readiness.speedWeight}%</span>
              </div>
              <Progress value={(readiness.speedWeight / 30) * 100} className="h-1.5" />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-xs font-medium">
                <span className="flex items-center gap-1 text-muted-foreground">
                  <BookOpen className="h-3.5 w-3.5 text-primary" />
                  Lesson Completion (20% max)
                </span>
                <span className="font-bold text-foreground">{readiness.completionWeight}%</span>
              </div>
              <Progress value={(readiness.completionWeight / 20) * 100} className="h-1.5" />
            </div>
          </div>
        </div>

        <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20 text-xs text-amber-800 dark:text-amber-300 flex items-start gap-2">
          <ShieldAlert className="h-4 w-4 shrink-0 mt-0.5" />
          <span>
            <strong>Disclaimer:</strong> Readiness Score is an analytical learning tool. It does not predict or guarantee job recruitment or official exam outcomes.
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
