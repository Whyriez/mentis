"use client";

import React from "react";
import Link from "next/link";
import { History, Play, Clock, RotateCcw } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { QuizHistoryItem } from "../types";

export function QuizHistoryTable({ history }: { history: QuizHistoryItem[] }) {
  return (
    <Card className="border-border/80 bg-card shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-bold flex items-center gap-2">
          <History className="h-5 w-5 text-primary" />
          Quiz Attempt History
        </CardTitle>
        <Link href="/quiz">
          <Button size="sm" variant="outline" className="gap-1 text-xs font-semibold">
            <Play className="h-3.5 w-3.5 fill-current" />
            New Practice Session
          </Button>
        </Link>
      </CardHeader>

      <CardContent>
        <div className="space-y-3">
          {history.map((item) => (
            <div
              key={item.id}
              className="p-4 rounded-xl border border-border/60 bg-muted/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-[10px]">
                    {item.date}
                  </Badge>
                  <span className="text-xs font-bold text-foreground">{item.moduleTitle}</span>
                </div>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span>Questions: {item.totalQuestions}</span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    Avg {item.avgTimeSec}s / Q
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3 justify-between sm:justify-end">
                <div className="text-right">
                  <div className="text-sm font-extrabold text-primary">{item.accuracy}% Accuracy</div>
                  <div className="text-[11px] text-emerald-500 font-medium">
                    {item.correctCount} / {item.totalQuestions} Correct
                  </div>
                </div>

                <Link href="/quiz">
                  <Button size="xs" variant="ghost" className="gap-1 text-xs">
                    <RotateCcw className="h-3.5 w-3.5" />
                    Retry
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
