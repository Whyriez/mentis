"use client";

import React, { useEffect, useState } from "react";
import { Sparkles, HelpCircle, BookOpen, Clock, AlertTriangle, Cpu } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { getOverviewStatsAction } from "../actions/ai-actions";

export function AIDashboardOverview() {
  const [stats, setStats] = useState({
    questionsCount: 0,
    lessonsCount: 0,
    draftQueueCount: 0,
    publishedCount: 0,
    failedCount: 0,
    tokenUsage: "0",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    getOverviewStatsAction().then((res) => {
      if (isMounted) {
        setStats(res);
        setLoading(false);
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  const cards = [
    {
      title: "Questions Generated",
      value: loading ? "..." : stats.questionsCount,
      sub: "Total Database Questions",
      icon: HelpCircle,
      color: "text-primary bg-primary/10",
    },
    {
      title: "Lessons Generated",
      value: loading ? "..." : stats.lessonsCount,
      sub: "Total Database Lessons",
      icon: BookOpen,
      color: "text-emerald-500 bg-emerald-500/10",
    },
    {
      title: "Draft Queue",
      value: loading ? "..." : stats.draftQueueCount,
      sub: "Awaiting Review",
      icon: Clock,
      color: "text-amber-500 bg-amber-500/10",
    },
    {
      title: "Published Content",
      value: loading ? "..." : stats.publishedCount,
      sub: "Live for Learners",
      icon: Sparkles,
      color: "text-blue-500 bg-blue-500/10",
    },
    {
      title: "Failed Generations",
      value: loading ? "..." : stats.failedCount,
      sub: "Rejected / API Errors",
      icon: AlertTriangle,
      color: "text-destructive bg-destructive/10",
    },
    {
      title: "Token Usage",
      value: loading ? "..." : stats.tokenUsage,
      sub: "Gemini API Tokens",
      icon: Cpu,
      color: "text-purple-500 bg-purple-500/10",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {cards.map((c, i) => {
        const Icon = c.icon;
        return (
          <Card key={i} className="border-border/80 bg-card shadow-xs hover:border-primary/40 transition-all">
            <CardContent className="p-5 flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-xs font-semibold text-muted-foreground">{c.title}</p>
                <div className="text-2xl font-extrabold tracking-tight text-foreground">{c.value}</div>
                <p className="text-[11px] text-muted-foreground">{c.sub}</p>
              </div>

              <div className={`p-3 rounded-2xl ${c.color} shrink-0`}>
                <Icon className="h-5 w-5" />
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
