export type TargetTimeline = "1 Month" | "3 Months" | "6 Months" | "12 Months";
export type PrepPurpose = "Job Interview" | "Internship" | "CPNS" | "Scholarship" | "General Learning";
export type DailyStudyMinutes = 15 | 30 | 45 | 60;

export interface AssessmentPreferences {
  timeline: TargetTimeline;
  purpose: PrepPurpose;
  dailyMinutes: DailyStudyMinutes;
  completedAt?: string;
}

export interface RoadmapStep {
  id: string;
  orderIndex: number;
  title: string;
  moduleSlug: string;
  description: string;
  estimatedDays: number;
  status: "completed" | "in_progress" | "locked";
  accuracy: number;
  avgTimeSec: number;
}

export interface RoadmapPhase {
  id: string;
  phaseNumber: number;
  title: string;
  description: string;
  targetCompletionDate: string;
  steps: RoadmapStep[];
}

export interface DailyMission {
  id: string;
  date: string;
  targetMinutes: number;
  completedMinutes: number;
  targetQuestions: number;
  completedQuestions: number;
  targetReviewCount: number;
  completedReviewCount: number;
  targetAccuracy: number;
  targetMaxSpeedSec: number;
  isCompleted: boolean;
}

export interface WeeklyGoal {
  id: string;
  weekTitle: string;
  moduleTitle: string;
  targetAccuracy: number;
  targetAvgSpeedSec: number;
  completed: boolean;
}

export interface ReviewQueueItem {
  id: string;
  questionId: string;
  questionText: string;
  moduleTitle: string;
  nextReviewAt: string;
  intervalDays: number;
  timesReviewed: number;
}

export interface UserRoadmapSummary {
  preferences: AssessmentPreferences;
  currentPhaseIndex: number;
  totalProgressPercent: number;
  estimatedFinishDate: string;
  phases: RoadmapPhase[];
  dailyMission: DailyMission;
  weeklyGoal: WeeklyGoal;
  reviewQueue: ReviewQueueItem[];
}
