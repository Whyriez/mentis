"use client";

import React from "react";
import Link from "next/link";
import { AlertTriangle, CheckCircle2, ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TopicStrengthWeakness } from "../types";

interface Props {
  strengths: TopicStrengthWeakness[];
  weaknesses: TopicStrengthWeakness[];
}

export function WeaknessStrengthView({ strengths, weaknesses }: Props) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Topic Strengths */}
      <Card className="border-emerald-500/30 bg-emerald-500/5 shadow-xs">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-bold flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="h-5 w-5" />
            Top Strengths
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {strengths.map((item, idx) => (
            <div key={idx} className="p-3 rounded-lg bg-card border border-emerald-500/20 space-y-1.5">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-foreground">{item.topic}</span>
                <Badge variant="accent">{item.accuracy}% Acc ({item.avgTimeSec}s)</Badge>
              </div>
              <p className="text-[11px] text-muted-foreground">{item.recommendation}</p>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Weakness Detection */}
      <Card className="border-amber-500/30 bg-amber-500/5 shadow-xs">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-bold flex items-center gap-2 text-amber-600 dark:text-amber-400">
            <AlertTriangle className="h-5 w-5" />
            Areas for Improvement (Weaknesses)
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {weaknesses.map((item, idx) => (
            <div key={idx} className="p-3 rounded-lg bg-card border border-amber-500/20 space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-foreground">{item.topic}</span>
                <Badge variant="destructive">{item.accuracy}% Acc ({item.avgTimeSec}s)</Badge>
              </div>
              <p className="text-[11px] text-muted-foreground">{item.recommendation}</p>
              <div className="pt-1 flex justify-end">
                <Link href="/learn/multiplication/lesson-3">
                  <Button size="xs" variant="outline" className="gap-1 text-[11px] font-semibold">
                    Review Lesson
                    <ArrowRight className="h-3 w-3" />
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
