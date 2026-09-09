"use client";

import React, { useState, useEffect } from "react";
import { Users, Award, Download, Sparkles, AlertTriangle, BookOpen } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AdminAnalyticsService, PlatformAnalyticsData, ContentAnalyticsData, AIAnalyticsData } from "../services/admin-analytics-service";

const analyticsService = new AdminAnalyticsService();

export function AnalyticsDashboardView() {
  const [platform, setPlatform] = useState<PlatformAnalyticsData | null>(null);
  const [content, setContent] = useState<ContentAnalyticsData | null>(null);
  const [ai, setAi] = useState<AIAnalyticsData | null>(null);

  useEffect(() => {
    Promise.all([
      analyticsService.getPlatformAnalytics(),
      analyticsService.getContentAnalytics(),
      analyticsService.getAIAnalytics(),
    ]).then(([p, c, a]) => {
      setPlatform(p);
      setContent(c);
      setAi(a);
    });
  }, []);

  if (!platform || !content || !ai) return null;

  const handleExportCSV = () => {
    const csvContent = analyticsService.exportAnalyticsToCSV(platform, ai);
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `mentis-platform-analytics-${Date.now()}.csv`;
    a.click();
  };

  return (
    <div className="space-y-8">
      {/* Top Controls & Export */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold">Platform & Learning Intelligence</h2>
          <p className="text-xs text-muted-foreground">Aggregated user activity, quiz accuracy trends, and AI content performance.</p>
        </div>
        <Button variant="outline" size="sm" onClick={handleExportCSV} className="gap-1.5 font-semibold text-xs">
          <Download className="h-3.5 w-3.5" />
          Export Analytics CSV
        </Button>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-border/80 bg-card p-5 space-y-1">
          <div className="flex justify-between items-center text-xs font-semibold text-muted-foreground">
            <span>Daily Active Users (DAU)</span>
            <Users className="h-4 w-4 text-primary" />
          </div>
          <div className="text-2xl font-extrabold text-foreground">{platform.dau}</div>
          <div className="text-[11px] text-emerald-500 font-semibold">+12% vs last week</div>
        </Card>

        <Card className="border-border/80 bg-card p-5 space-y-1">
          <div className="flex justify-between items-center text-xs font-semibold text-muted-foreground">
            <span>Weekly Active (WAU)</span>
            <Users className="h-4 w-4 text-blue-500" />
          </div>
          <div className="text-2xl font-extrabold text-foreground">{platform.wau}</div>
          <div className="text-[11px] text-muted-foreground">Monthly: {platform.mau}</div>
        </Card>

        <Card className="border-border/80 bg-card p-5 space-y-1">
          <div className="flex justify-between items-center text-xs font-semibold text-muted-foreground">
            <span>Avg Quiz Score</span>
            <Award className="h-4 w-4 text-amber-500" />
          </div>
          <div className="text-2xl font-extrabold text-foreground">{platform.avgQuizScore}%</div>
          <div className="text-[11px] text-muted-foreground">Avg speed: {platform.avgResponseSeconds}s</div>
        </Card>

        <Card className="border-border/80 bg-card p-5 space-y-1">
          <div className="flex justify-between items-center text-xs font-semibold text-muted-foreground">
            <span>AI Approval Rate</span>
            <Sparkles className="h-4 w-4 text-purple-500" />
          </div>
          <div className="text-2xl font-extrabold text-foreground">{ai.approvalRate}%</div>
          <div className="text-[11px] text-muted-foreground">{ai.totalTokenUsage} tokens used</div>
        </Card>
      </div>

      {/* Content & Question Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Most & Least Studied Modules */}
        <Card className="border-border/80 bg-card shadow-xs">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-bold flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-primary" />
              Module Popularity & Completion Rate
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {content.mostStudiedModules.map((m, idx) => (
              <div key={idx} className="p-3 rounded-xl border border-border/80 bg-muted/20 flex justify-between items-center text-xs">
                <div>
                  <div className="font-bold text-foreground">{m.title}</div>
                  <div className="text-[11px] text-muted-foreground">{m.views} learners enrolled</div>
                </div>
                <Badge variant="accent" className="font-bold">{m.completionRate}% Completion</Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Most Failed Questions */}
        <Card className="border-border/80 bg-card shadow-xs">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-bold flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-destructive" />
              Hardest Questions (Most Failed)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {content.mostFailedQuestions.map((q, idx) => (
              <div key={idx} className="p-3 rounded-xl border border-border/80 bg-muted/20 flex justify-between items-center text-xs">
                <div>
                  <div className="font-bold text-foreground">&quot;{q.question}&quot;</div>
                  <div className="text-[11px] text-muted-foreground">{q.failCount} failed attempts</div>
                </div>
                <Badge variant="destructive" className="font-bold">{q.avgAccuracy}% Accuracy</Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
