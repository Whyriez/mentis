export interface TrendDataPoint {
  date: string;
  accuracy: number;
  avgTimeSec: number;
}

export interface ModulePerformance {
  moduleId: string;
  moduleTitle: string;
  slug: string;
  accuracy: number;
  avgTimeSec: number;
  completionPercent: number;
  totalAttempts: number;
}

export interface TopicStrengthWeakness {
  topic: string;
  accuracy: number;
  avgTimeSec: number;
  score: number;
  recommendation: string;
}

export interface QuizHistoryItem {
  id: string;
  date: string;
  moduleTitle: string;
  accuracy: number;
  avgTimeSec: number;
  totalQuestions: number;
  correctCount: number;
  durationSec: number;
}

export interface ReadinessMetrics {
  score: number;
  accuracyWeight: number;
  speedWeight: number;
  completionWeight: number;
  tier: "Beginner" | "Intermediate" | "Advanced" | "Exam Ready";
}

export interface UserAnalyticsSummary {
  overallAccuracy: number;
  avgResponseTimeSec: number;
  totalQuestionsAnswered: number;
  totalAttempts: number;
  totalStudyMinutes: number;
  completedLessonsCount: number;
  readiness: ReadinessMetrics;
  strengths: TopicStrengthWeakness[];
  weaknesses: TopicStrengthWeakness[];
  modulePerformance: ModulePerformance[];
  trends: TrendDataPoint[];
  history: QuizHistoryItem[];
}
