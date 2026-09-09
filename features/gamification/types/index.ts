export interface LevelInfo {
  level: number;
  title: string;
  currentXP: number;
  levelStartXP: number;
  nextLevelXP: number;
  progressPercent: number;
  xpToNextLevel: number;
}

export interface DailyStreakData {
  currentStreak: number;
  longestStreak: number;
  lastActiveDate: string;
  isStreakActiveToday: boolean;
  activeDaysOfWeek?: boolean[];
  milestones: Array<{ days: number; reached: boolean; title: string }>;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  category: "lesson" | "quiz" | "streak" | "mastery";
  iconName: string;
  targetValue: number;
  currentProgress: number;
  isUnlocked: boolean;
  unlockedAt?: string;
  rewardXP: number;
}

export interface WeeklyChallenge {
  id: string;
  title: string;
  description: string;
  targetValue: number;
  currentValue: number;
  rewardXP: number;
  deadlineDaysLeft: number;
  isCompleted: boolean;
}

export interface UserGamificationProfile {
  totalXP: number;
  levelInfo: LevelInfo;
  streak: DailyStreakData;
  achievements: Achievement[];
  weeklyChallenge: WeeklyChallenge;
  recentUnlocks: Achievement[];
}
