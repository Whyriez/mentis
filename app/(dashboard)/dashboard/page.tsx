import { Metadata } from "next";
import { Brain, Sparkles, AlertTriangle, CheckCircle2, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/server";
import { ContinueLearningCard } from "@/features/dashboard/components/continue-learning-card";
import { TodaysGoalCard } from "@/features/dashboard/components/todays-goal-card";
import { CurrentStreakCard } from "@/features/dashboard/components/current-streak-card";
import { LatestQuizCard } from "@/features/dashboard/components/latest-quiz-card";
import { OverallProgressCard } from "@/features/dashboard/components/overall-progress-card";
import { AnalyticsService } from "@/features/analytics/services/analytics-service";
import { RoadmapService } from "@/features/roadmap/services/roadmap-service";
import { GamificationService } from "@/features/gamification/services/gamification-service";
import { DailyMissionWidget } from "@/features/roadmap/components/daily-mission-widget";
import { ReviewQueueWidget } from "@/features/roadmap/components/review-queue-widget";
import { XPLevelCard } from "@/features/gamification/components/xp-level-card";
import { StreakWidget } from "@/features/gamification/components/streak-widget";
import { AchievementsGrid } from "@/features/gamification/components/achievements-grid";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Dashboard | Mentis",
  description: "Adaptive training dashboard and speed metrics overview.",
};

const analyticsService = new AnalyticsService();
const roadmapService = new RoadmapService();
const gamificationService = new GamificationService();

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const userId = user?.id || "guest";

  const { data: profile } = userId !== "guest" 
    ? await supabase.from("profiles").select("full_name, daily_goal_minutes").eq("user_id", userId).single()
    : { data: null };

  const userName = profile?.full_name || user?.user_metadata?.full_name || user?.email?.split("@")[0] || "Learner";
  const targetMinutes = profile?.daily_goal_minutes || 20;

  const analytics = await analyticsService.getUserAnalytics(userId);
  const roadmapSummary = await roadmapService.getUserRoadmap(userId);
  const gamification = await gamificationService.getUserGamificationProfile(userId);

  const weakest = analytics.weaknesses[0];
  const strongest = analytics.strengths[0];

  const latestAttempt = analytics.history[0];

  const continueModuleData = latestAttempt
    ? {
        title: latestAttempt.moduleTitle,
        currentLesson: `Recent Practice (${latestAttempt.correctCount}/${latestAttempt.totalQuestions} Correct)`,
        progress: latestAttempt.accuracy,
        estimatedMinutes: 5,
        difficulty: latestAttempt.accuracy >= 80 ? "Advanced" : "Intermediate",
        lessonHref: "/learn",
      }
    : null;

  const goalData = {
    targetMinutes,
    completedMinutes: analytics.totalStudyMinutes,
    drillsCompleted: analytics.totalAttempts,
    targetDrills: 5,
  };

  const streakCardData = {
    currentStreak: gamification.streak.currentStreak,
    longestStreak: gamification.streak.longestStreak,
    isStreakActiveToday: gamification.streak.isStreakActiveToday,
    activeDaysOfWeek: gamification.streak.activeDaysOfWeek,
  };

  const latestQuizData = latestAttempt
    ? {
        title: latestAttempt.moduleTitle,
        score: latestAttempt.accuracy,
        correctCount: latestAttempt.correctCount,
        totalQuestions: latestAttempt.totalQuestions,
        avgResponseTime: `${latestAttempt.avgTimeSec}s`,
        finishedAt: latestAttempt.date,
      }
    : null;

  return (
    <div className="space-y-8 pb-10">
      {/* Welcome Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border border-primary/20 shadow-xs">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-primary/10 text-primary">
            <Sparkles className="h-3.5 w-3.5" />
            Adaptive Learning Engine Active
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Welcome back, {userName}! 👋
          </h1>
          <p className="text-sm text-muted-foreground">
            Targeting {roadmapSummary.preferences.purpose} ({roadmapSummary.preferences.timeline} Goal).
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <Link href="/kraepelin">
            <Button size="lg" variant="outline" className="font-bold border-amber-500/40 text-amber-600 dark:text-amber-400 bg-amber-500/10 hover:bg-amber-500/20 shadow-xs gap-2 shrink-0">
              <Activity className="h-4 w-4" />
              Tes Koran (Kraepelin)
            </Button>
          </Link>

          <Link href="/quiz">
            <Button size="lg" className="font-bold shadow-md gap-2 shrink-0">
              <Brain className="h-4 w-4" />
              Start Mental Drill
            </Button>
          </Link>
        </div>
      </div>

      {/* Level Progression & Daily Streak Widgets */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <XPLevelCard levelInfo={gamification.levelInfo} />
        <StreakWidget streak={gamification.streak} />
      </div>

      {/* Daily Mission & Spaced Repetition Widgets */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DailyMissionWidget mission={roadmapSummary.dailyMission} />
        <ReviewQueueWidget queue={roadmapSummary.reviewQueue} />
      </div>

      {/* Achievements Showcase */}
      <AchievementsGrid achievements={gamification.achievements} />

      {/* Weakest vs Strongest Insight Widgets */}
      {(weakest || strongest) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {weakest && (
            <Card className="border-amber-500/30 bg-amber-500/5 p-4 shadow-2xs">
              <CardContent className="p-0 flex items-center justify-between">
                <div className="space-y-0.5">
                  <span className="text-[10px] uppercase font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1">
                    <AlertTriangle className="h-3.5 w-3.5" />
                    Weakest Topic Detected
                  </span>
                  <h4 className="text-sm font-bold text-foreground">{weakest.topic}</h4>
                  <p className="text-xs text-muted-foreground">Accuracy: {weakest.accuracy}% ({weakest.avgTimeSec}s)</p>
                </div>
                <Link href="/quiz">
                  <Button size="xs" variant="outline" className="font-semibold text-xs">
                    Practice Now
                  </Button>
                </Link>
              </CardContent>
            </Card>
          )}

          {strongest && (
            <Card className="border-emerald-500/30 bg-emerald-500/5 p-4 shadow-2xs">
              <CardContent className="p-0 flex items-center justify-between">
                <div className="space-y-0.5">
                  <span className="text-[10px] uppercase font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    Strongest Skill
                  </span>
                  <h4 className="text-sm font-bold text-foreground">{strongest.topic}</h4>
                  <p className="text-xs text-muted-foreground">Accuracy: {strongest.accuracy}% ({strongest.avgTimeSec}s)</p>
                </div>
                <Link href="/quiz">
                  <Button size="xs" variant="secondary" className="font-semibold text-xs">
                    Blitz Drill
                  </Button>
                </Link>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Main Grid: Core Dashboard Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <ContinueLearningCard currentModule={continueModuleData} />
        <TodaysGoalCard goalData={goalData} />
        <CurrentStreakCard streakData={streakCardData} />
        <LatestQuizCard quizData={latestQuizData} />
        <OverallProgressCard accuracy={analytics.overallAccuracy} totalQuestions={analytics.totalQuestionsAnswered} />
      </div>
    </div>
  );
}
