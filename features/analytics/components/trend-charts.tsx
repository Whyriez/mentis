"use client";

import React from "react";
import { TrendingUp, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendDataPoint } from "../types";

export function TrendCharts({ trends }: { trends: TrendDataPoint[] }) {
  const maxAcc = 100;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Accuracy History Chart */}
      <Card className="border-border/80 bg-card shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-bold flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-emerald-500" />
            Accuracy Progression Trend (%)
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="h-44 w-full flex items-end justify-between gap-2 pt-6 px-2 border-b border-border/60">
            {trends.map((t, idx) => {
              const heightPercent = Math.round((t.accuracy / maxAcc) * 100);
              return (
                <div key={idx} className="flex-1 flex flex-col items-center gap-1 group">
                  <span className="text-[10px] font-bold text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">
                    {t.accuracy}%
                  </span>
                  <div
                    className="w-full max-w-[28px] bg-primary/80 group-hover:bg-primary rounded-t-md transition-all"
                    style={{ height: `${heightPercent}%` }}
                  />
                  <span className="text-[10px] font-semibold text-muted-foreground mt-1">{t.date}</span>
                </div>
              );
            })}
          </div>
          <div className="flex justify-between text-xs text-muted-foreground font-medium px-1">
            <span>Overall Accuracy Gain</span>
            <span className="text-emerald-500 font-bold">+16% this week</span>
          </div>
        </CardContent>
      </Card>

      {/* Response Speed Trend Chart */}
      <Card className="border-border/80 bg-card shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-bold flex items-center gap-2">
            <Clock className="h-4 w-4 text-amber-500" />
            Average Response Time (seconds)
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="h-44 w-full flex items-end justify-between gap-2 pt-6 px-2 border-b border-border/60">
            {trends.map((t, idx) => {
              const heightPercent = Math.round((t.avgTimeSec / 8) * 100);
              return (
                <div key={idx} className="flex-1 flex flex-col items-center gap-1 group">
                  <span className="text-[10px] font-bold text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">
                    {t.avgTimeSec}s
                  </span>
                  <div
                    className="w-full max-w-[28px] bg-amber-500/80 group-hover:bg-amber-500 rounded-t-md transition-all"
                    style={{ height: `${heightPercent}%` }}
                  />
                  <span className="text-[10px] font-semibold text-muted-foreground mt-1">{t.date}</span>
                </div>
              );
            })}
          </div>
          <div className="flex justify-between text-xs text-muted-foreground font-medium px-1">
            <span>Speed Reduction Target</span>
            <span className="text-amber-500 font-bold">2.1s faster</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
