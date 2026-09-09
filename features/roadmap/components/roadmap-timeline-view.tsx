"use client";

import React from "react";
import Link from "next/link";
import { CheckCircle2, Lock, ArrowRight, PlayCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { RoadmapPhase } from "../types";

export function RoadmapTimelineView({ phases }: { phases: RoadmapPhase[] }) {
  return (
    <div className="space-y-6">
      <h3 className="text-xl font-extrabold tracking-tight">Adaptive Study Path</h3>

      <div className="space-y-6">
        {phases.map((phase) => (
          <Card key={phase.id} className="border-border/80 bg-card shadow-sm overflow-hidden">
            <CardHeader className="bg-muted/30 pb-3 border-b border-border/50">
              <div className="flex justify-between items-center">
                <Badge variant="outline" className="font-bold text-xs">
                  Target: {phase.targetCompletionDate}
                </Badge>
                <span className="text-xs font-bold text-primary">{phase.steps.length} Steps</span>
              </div>
              <CardTitle className="text-lg font-bold text-foreground pt-1">
                {phase.title}
              </CardTitle>
              <p className="text-xs text-muted-foreground">{phase.description}</p>
            </CardHeader>

            <CardContent className="p-4 space-y-3">
              {phase.steps.map((step) => {
                const isCompleted = step.status === "completed";
                const isInProgress = step.status === "in_progress";
                const isLocked = step.status === "locked";

                return (
                  <div
                    key={step.id}
                    className={`p-4 rounded-xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                      isCompleted
                        ? "border-emerald-500/30 bg-emerald-500/5"
                        : isInProgress
                        ? "border-primary bg-primary/5 shadow-2xs"
                        : "border-border/50 bg-card opacity-60"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5 shrink-0">
                        {isCompleted && <CheckCircle2 className="h-5 w-5 text-emerald-500" />}
                        {isInProgress && <PlayCircle className="h-5 w-5 text-primary animate-pulse" />}
                        {isLocked && <Lock className="h-5 w-5 text-muted-foreground" />}
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-foreground">{step.title}</span>
                          <Badge
                            variant={
                              isCompleted
                                ? "accent"
                                : isInProgress
                                ? "default"
                                : "outline"
                            }
                            className="text-[10px]"
                          >
                            {step.estimatedDays} Days
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">{step.description}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 justify-end shrink-0">
                      {isCompleted && (
                        <span className="text-xs font-bold text-emerald-500">
                          {step.accuracy}% Acc
                        </span>
                      )}

                      {!isLocked && (
                        <Link href={`/learn/${step.moduleSlug}/lesson-${step.orderIndex}`}>
                          <Button size="xs" variant={isInProgress ? "default" : "outline"} className="gap-1 font-semibold text-xs">
                            {isInProgress ? "Continue Lesson" : "Review"}
                            <ArrowRight className="h-3 w-3" />
                          </Button>
                        </Link>
                      )}
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
