"use client";

import React from "react";
import { BarChart3 } from "lucide-react";
import { AnalyticsDashboardView } from "@/features/admin-analytics/components/analytics-dashboard-view";

export default function AdminAnalyticsPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary">
          <BarChart3 className="h-4 w-4" />
          <span>Platform Intelligence</span>
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight">Platform Analytics</h1>
        <p className="text-muted-foreground text-sm max-w-2xl">
          Comprehensive learning trends, active user metrics, quiz accuracy stats, and AI generation performance.
        </p>
      </div>

      <AnalyticsDashboardView />
    </div>
  );
}
