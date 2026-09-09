import {
  AssessmentPreferences,
  UserRoadmapSummary,
  RoadmapPhase,
  DailyMission,
  WeeklyGoal,
  ReviewQueueItem,
  TargetTimeline,
} from "../types";

export class RoadmapEngine {
  /**
   * Dynamically generate a personalized roadmap based on assessment preferences & performance metrics
   */
  generatePersonalizedRoadmap(
    prefs: AssessmentPreferences,
    existingReviewQueue: ReviewQueueItem[] = [],
    userStats?: { completedMinutes: number; completedQuestions: number }
  ): UserRoadmapSummary {
    const daysMultiplier = this.getTimelineDaysMultiplier(prefs.timeline);

    const phases: RoadmapPhase[] = [
      {
        id: "phase-1",
        phaseNumber: 1,
        title: "Phase 1: Foundational Mental Math Shortcuts",
        description: "Focus on rapid multiplication shortcuts, base-100 mental math, and 11-sandwich rules.",
        targetCompletionDate: this.calculateTargetDate(14 * daysMultiplier),
        steps: [
          {
            id: "step-1-1",
            orderIndex: 1,
            title: "11-Sandwich Multiplication Shortcut",
            moduleSlug: "multiplication",
            description: "Master two-digit multiplication by 11 in under 3 seconds.",
            estimatedDays: Math.ceil(3 * daysMultiplier),
            status: "completed",
            accuracy: 92,
            avgTimeSec: 2.8,
          },
          {
            id: "step-1-2",
            orderIndex: 2,
            title: "Squaring Numbers Ending in 5",
            moduleSlug: "multiplication",
            description: "Instant square root & multiplication shortcuts for numbers ending in 5.",
            estimatedDays: Math.ceil(4 * daysMultiplier),
            status: "in_progress",
            accuracy: 88,
            avgTimeSec: 3.4,
          },
          {
            id: "step-1-3",
            orderIndex: 3,
            title: "Base-100 Deviation Multiplication",
            moduleSlug: "multiplication",
            description: "Solve complex multiplication near 100 with zero scratch paper.",
            estimatedDays: Math.ceil(7 * daysMultiplier),
            status: "locked",
            accuracy: 64,
            avgTimeSec: 7.2,
          },
        ],
      },
      {
        id: "phase-2",
        phaseNumber: 2,
        title: "Phase 2: Speed Division & Fraction Conversion",
        description: "Target mental division shortcuts, reciprocal estimation, and decimal conversions.",
        targetCompletionDate: this.calculateTargetDate(30 * daysMultiplier),
        steps: [
          {
            id: "step-2-1",
            orderIndex: 1,
            title: "Reciprocal Percentage Conversion",
            moduleSlug: "percentages",
            description: "Convert fractions like 1/7, 1/8, 1/12 to percentages instantly.",
            estimatedDays: Math.ceil(7 * daysMultiplier),
            status: "locked",
            accuracy: 0,
            avgTimeSec: 0,
          },
          {
            id: "step-2-2",
            orderIndex: 2,
            title: "Division by 5, 25, and 125 Shortcuts",
            moduleSlug: "division",
            description: "Use double-and-halving tricks for rapid psychometric division.",
            estimatedDays: Math.ceil(8 * daysMultiplier),
            status: "locked",
            accuracy: 0,
            avgTimeSec: 0,
          },
        ],
      },
      {
        id: "phase-3",
        phaseNumber: 3,
        title: "Phase 3: Syllogisms & Numerical Reasoning Blitz",
        description: "Combine rapid math with logical reasoning, pattern recognition, and speed word problems.",
        targetCompletionDate: this.calculateTargetDate(60 * daysMultiplier),
        steps: [
          {
            id: "step-3-1",
            orderIndex: 1,
            title: "Number Series Pattern Recognition",
            moduleSlug: "numerical-reasoning",
            description: "Identify geometric and arithmetic progression patterns in under 5 seconds.",
            estimatedDays: Math.ceil(14 * daysMultiplier),
            status: "locked",
            accuracy: 0,
            avgTimeSec: 0,
          },
          {
            id: "step-3-2",
            orderIndex: 2,
            title: "Spatial & Logical Reasoning Euler Diagrams",
            moduleSlug: "spatial-reasoning",
            description: "Evaluate syllogisms and spatial net folds without getting tricked.",
            estimatedDays: Math.ceil(14 * daysMultiplier),
            status: "locked",
            accuracy: 0,
            avgTimeSec: 0,
          },
        ],
      },
    ];

    const completedMinutes = userStats ? userStats.completedMinutes : 0;
    const completedQuestions = userStats ? userStats.completedQuestions : 0;

    // Dynamically update step statuses based on user study statistics
    let currentPhaseIndex = 0;

    if (completedQuestions >= 10 || completedMinutes >= 20) {
      phases[0].steps.forEach((s) => (s.status = "completed"));
      phases[1].steps[0].status = "in_progress";
      phases[1].steps[1].status = "in_progress";
      currentPhaseIndex = 1;
    }

    if (completedQuestions >= 25 || completedMinutes >= 50) {
      phases[0].steps.forEach((s) => (s.status = "completed"));
      phases[1].steps.forEach((s) => (s.status = "completed"));
      phases[2].steps[0].status = "in_progress";
      phases[2].steps[1].status = "in_progress";
      currentPhaseIndex = 2;
    }

    const totalStepsCount = phases.reduce((acc, p) => acc + p.steps.length, 0);
    const completedStepsCount = phases.reduce(
      (acc, p) => acc + p.steps.filter((s) => s.status === "completed").length,
      0
    );
    const totalProgressPercent = Math.max(
      15,
      Math.round((completedStepsCount / totalStepsCount) * 100)
    );

    const dailyMission: DailyMission = {
      id: `mission-${Date.now()}`,
      date: "Today",
      targetMinutes: prefs.dailyMinutes,
      completedMinutes,
      targetQuestions: Math.round(prefs.dailyMinutes * 0.8),
      completedQuestions,
      targetReviewCount: 5,
      completedReviewCount: 0,
      targetAccuracy: 90,
      targetMaxSpeedSec: 4.0,
      isCompleted: completedMinutes >= prefs.dailyMinutes,
    };

    const weeklyGoal: WeeklyGoal = {
      id: `goal-${Date.now()}`,
      weekTitle: `Phase ${currentPhaseIndex + 1} Focus Goal`,
      moduleTitle: phases[currentPhaseIndex]?.steps[0]?.title || "Mental Shortcuts",
      targetAccuracy: 90,
      targetAvgSpeedSec: 3.5,
      completed: false,
    };

    return {
      preferences: prefs,
      currentPhaseIndex,
      totalProgressPercent,
      estimatedFinishDate: this.calculateTargetDate(30 * daysMultiplier),
      phases,
      dailyMission,
      weeklyGoal,
      reviewQueue: existingReviewQueue,
    };
  }

  private getTimelineDaysMultiplier(timeline: TargetTimeline): number {
    switch (timeline) {
      case "1 Month":
        return 1;
      case "3 Months":
        return 2.5;
      case "6 Months":
        return 4.5;
      case "12 Months":
        return 8;
      default:
        return 2;
    }
  }

  private calculateTargetDate(addDays: number): string {
    const d = new Date();
    d.setDate(d.getDate() + addDays);
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  }
}
