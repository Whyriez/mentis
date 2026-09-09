import { Metadata } from "next";
import { BarChart3, TrendingUp, Clock, CheckCircle2, HelpCircle } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { AnalyticsService } from "@/features/analytics/services/analytics-service";
import { ReadinessScoreCard } from "@/features/analytics/components/readiness-score-card";
import { TrendCharts } from "@/features/analytics/components/trend-charts";
import { WeaknessStrengthView } from "@/features/analytics/components/weakness-strength-view";
import { QuizHistoryTable } from "@/features/analytics/components/quiz-history-table";
import { EmptyState } from "@/components/ui/ui-states";

export const metadata: Metadata = {
  title: "Analytics | Mentis",
  description: "Track speed performance, readiness metrics, and diagnostic topic strengths.",
};

const analyticsService = new AnalyticsService();

export default async function AnalyticsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const userId = user?.id || "guest";

  const analytics = await analyticsService.getUserAnalytics(userId);

  if (!analytics || analytics.totalAttempts === 0) {
    return (
      <EmptyState
        title="No Quiz Attempts Recorded"
        description="Complete at least one practice quiz drill to generate your performance statistics and readiness insights."
      />
    );
  }

  return (
    <div className="space-y-8 pb-12">
      {/* Top Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary">
          <BarChart3 className="h-4 w-4" />
          <span>Learning Analytics & Diagnostics</span>
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight">Performance Dashboard</h1>
        <p className="text-muted-foreground text-sm max-w-2xl">
          Comprehensive mental speed metrics, accuracy progression trends, readiness scores, and weakness detection.
        </p>
      </div>

      {/* Primary KPI Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-card border border-border/80 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-xs text-muted-foreground font-medium">
            <span>Overall Accuracy</span>
            <TrendingUp className="h-4 w-4 text-emerald-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-foreground">
            {analytics.overallAccuracy}%
          </div>
          <div className="text-[11px] text-emerald-500 font-semibold">Live Accuracy</div>
        </div>

        <div className="p-4 rounded-xl bg-card border border-border/80 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-xs text-muted-foreground font-medium">
            <span>Avg Response Speed</span>
            <Clock className="h-4 w-4 text-amber-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-foreground">
            {analytics.avgResponseTimeSec}s
          </div>
          <div className="text-[11px] text-emerald-500 font-semibold">
            Speed metric
          </div>
        </div>

        <div className="p-4 rounded-xl bg-card border border-border/80 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-xs text-muted-foreground font-medium">
            <span>Drills Solved</span>
            <HelpCircle className="h-4 w-4 text-primary" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-foreground">
            {analytics.totalQuestionsAnswered}
          </div>
          <div className="text-[11px] text-muted-foreground">{analytics.totalAttempts} total attempts</div>
        </div>

        <div className="p-4 rounded-xl bg-card border border-border/80 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-xs text-muted-foreground font-medium">
            <span>Lessons Completed</span>
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-foreground">
            {analytics.completedLessonsCount}
          </div>
          <div className="text-[11px] text-muted-foreground">{analytics.totalStudyMinutes} mins study time</div>
        </div>
      </div>

      {/* Readiness Score Beta */}
      <ReadinessScoreCard readiness={analytics.readiness} />

      {/* Topic Weakness & Strength Diagnostics */}
      <WeaknessStrengthView strengths={analytics.strengths} weaknesses={analytics.weaknesses} />

      {/* Accuracy & Speed Progression Charts */}
      <TrendCharts trends={analytics.trends} />

      {/* Quiz Attempt History */}
      <QuizHistoryTable history={analytics.history} />
    </div>
  );
}
