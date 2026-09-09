import { GamificationRepository } from "../repositories/gamification-repository";
import { AnalyticsRepository } from "@/features/analytics/repositories/analytics-repository";
import {
  UserGamificationProfile,
  LevelInfo,
  DailyStreakData,
  Achievement,
  WeeklyChallenge,
} from "../types";

export interface XPAwardConfig {
  LESSON_COMPLETE: number;
  QUIZ_COMPLETE: number;
  HIGH_ACCURACY_BONUS: number;
  DAILY_MISSION_COMPLETE: number;
  DAILY_STREAK_BONUS: number;
}

export const XP_CONFIG: XPAwardConfig = {
  LESSON_COMPLETE: 20,
  QUIZ_COMPLETE: 50,
  HIGH_ACCURACY_BONUS: 25,
  DAILY_MISSION_COMPLETE: 100,
  DAILY_STREAK_BONUS: 10,
};

export class GamificationService {
  private repository: GamificationRepository;
  private analyticsRepository: AnalyticsRepository;

  constructor() {
    this.repository = new GamificationRepository();
    this.analyticsRepository = new AnalyticsRepository();
  }

  /**
   * Get complete gamification profile for user
   */
  async getUserGamificationProfile(userId: string = "guest"): Promise<UserGamificationProfile> {
    const rawData = await this.repository.getUserGamificationData(userId);
    const attempts = await this.analyticsRepository.getUserAttempts(userId);
    const progress = await this.analyticsRepository.getUserProgress(userId);

    const completedLessonsCount = progress.filter((p) => p.completed).length;
    const totalAttempts = attempts.length;
    const totalQuestionsAnswered = attempts.reduce((acc, a) => acc + (a.total_questions || 0), 0);

    const totalXP = rawData?.total_xp ?? 0;

    const levelInfo = this.calculateLevel(totalXP);
    const streak = this.calculateStreak(attempts, rawData?.current_streak, rawData?.longest_streak);

    // Sync validated streak to database if different from stale database record
    if (userId && userId !== "guest" && (streak.currentStreak !== rawData?.current_streak || streak.longestStreak !== rawData?.longest_streak)) {
      this.repository.syncUserStreak(userId, streak.currentStreak, streak.longestStreak);
    }

    const achievements = this.getAchievements(
      totalXP,
      streak.currentStreak,
      completedLessonsCount,
      totalAttempts,
      totalQuestionsAnswered
    );
    const weeklyChallenge = this.getWeeklyChallenge(totalQuestionsAnswered);

    const recentUnlocks = achievements.filter((a) => a.isUnlocked).slice(0, 2);

    return {
      totalXP,
      levelInfo,
      streak,
      achievements,
      weeklyChallenge,
      recentUnlocks,
    };
  }

  /**
   * Calculate User Level Progression
   */
  calculateLevel(totalXP: number): LevelInfo {
    const levels = [
      { level: 1, title: "Novice Calculator", minXP: 0 },
      { level: 2, title: "Mental Apprentice", minXP: 250 },
      { level: 3, title: "Speed Mathematician", minXP: 600 },
      { level: 4, title: "Psychometric Specialist", minXP: 1000 },
      { level: 5, title: "Mental Math Master", minXP: 1500 },
    ];

    let currentLevel = levels[0];
    let nextLevel = levels[1];

    for (let i = 0; i < levels.length; i++) {
      if (totalXP >= levels[i].minXP) {
        currentLevel = levels[i];
        nextLevel = levels[i + 1] || levels[i];
      }
    }

    const isMaxLevel = currentLevel.level === nextLevel.level;
    const levelStartXP = currentLevel.minXP;
    const nextLevelXP = nextLevel.minXP;

    const xpEarnedInTier = totalXP - levelStartXP;
    const tierRange = nextLevelXP - levelStartXP;
    const progressPercent = isMaxLevel ? 100 : Math.min(100, Math.round((xpEarnedInTier / tierRange) * 100));
    const xpToNextLevel = isMaxLevel ? 0 : nextLevelXP - totalXP;

    return {
      level: currentLevel.level,
      title: currentLevel.title,
      currentXP: totalXP,
      levelStartXP,
      nextLevelXP,
      progressPercent,
      xpToNextLevel,
    };
  }

  /**
   * Calculate Daily Streak & Milestones dynamically based on actual activity dates
   */
  calculateStreak(
    attempts: Array<{ started_at?: string; finished_at?: string | null }>,
    storedCurrentStreak?: number,
    storedLongestStreak?: number
  ): DailyStreakData {
    const now = new Date();
    const dayOfWeek = now.getDay();
    const diffToMonday = (dayOfWeek + 6) % 7;
    const monday = new Date(now);
    monday.setDate(now.getDate() - diffToMonday);
    monday.setHours(0, 0, 0, 0);

    const activeDaysOfWeek = [false, false, false, false, false, false, false];

    // If no activity attempts exist, a new/fresh user starts at 0 streak
    if (!attempts || attempts.length === 0) {
      return {
        currentStreak: 0,
        longestStreak: 0,
        lastActiveDate: "None",
        isStreakActiveToday: false,
        activeDaysOfWeek,
        milestones: [
          { days: 7, reached: false, title: "7-Day Habit Starter" },
          { days: 30, reached: false, title: "30-Day Speed Demon" },
          { days: 100, reached: false, title: "100-Day Math Master" },
        ],
      };
    }

    // Extract unique activity dates in YYYY-MM-DD
    const uniqueDates = Array.from(
      new Set(
        attempts
          .map((a) => a.started_at || a.finished_at)
          .filter(Boolean)
          .map((dateStr) => {
            const d = new Date(dateStr as string);
            return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
          })
      )
    ).sort().reverse(); // newest first

    // Populate active days for Monday to Sunday of the current week
    for (let i = 0; i < 7; i++) {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      const dStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
      if (uniqueDates.includes(dStr)) {
        activeDaysOfWeek[i] = true;
      }
    }

    const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;

    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = `${yesterday.getFullYear()}-${String(yesterday.getMonth() + 1).padStart(2, "0")}-${String(yesterday.getDate()).padStart(2, "0")}`;

    const isStreakActiveToday = uniqueDates.includes(todayStr);
    const practicedYesterday = uniqueDates.includes(yesterdayStr);

    let currentStreak = 0;

    if (isStreakActiveToday || practicedYesterday) {
      // Walk backward consecutive days starting from today (if active today) or yesterday
      const checkDate = isStreakActiveToday ? new Date(now) : new Date(yesterday);
      while (true) {
        const checkStr = `${checkDate.getFullYear()}-${String(checkDate.getMonth() + 1).padStart(2, "0")}-${String(checkDate.getDate()).padStart(2, "0")}`;
        if (uniqueDates.includes(checkStr)) {
          currentStreak++;
          checkDate.setDate(checkDate.getDate() - 1);
        } else {
          break;
        }
      }
    } else {
      // Inactive today and yesterday -> streak has lapsed (0)
      currentStreak = 0;
    }

    // Compute maximum historical streak
    let maxHistorical = currentStreak;
    if (uniqueDates.length > 0) {
      const sortedAsc = [...uniqueDates].sort();
      let tempStreak = 1;
      let maxStreak = 1;
      for (let i = 1; i < sortedAsc.length; i++) {
        const prev = new Date(sortedAsc[i - 1]);
        const curr = new Date(sortedAsc[i]);
        const diffDays = Math.round((curr.getTime() - prev.getTime()) / (1000 * 60 * 60 * 24));
        if (diffDays === 1) {
          tempStreak++;
          if (tempStreak > maxStreak) maxStreak = tempStreak;
        } else if (diffDays > 1) {
          tempStreak = 1;
        }
      }
      maxHistorical = Math.max(maxStreak, currentStreak);
    }

    const longestStreak = maxHistorical;
    const lastActiveDate = uniqueDates[0] || (currentStreak > 0 ? "Today" : "None");

    return {
      currentStreak,
      longestStreak,
      lastActiveDate,
      isStreakActiveToday,
      activeDaysOfWeek,
      milestones: [
        { days: 7, reached: currentStreak >= 7, title: "7-Day Habit Starter" },
        { days: 30, reached: currentStreak >= 30, title: "30-Day Speed Demon" },
        { days: 100, reached: currentStreak >= 100, title: "100-Day Math Master" },
      ],
    };
  }

  /**
   * Get Achievements list with real completion progress
   */
  getAchievements(
    totalXP: number,
    streakDays: number,
    completedLessonsCount: number = 0,
    totalAttempts: number = 0,
    totalQuestionsAnswered: number = 0
  ): Achievement[] {
    return [
      {
        id: "ach-1",
        title: "First Mental Lesson",
        description: "Complete your first lesson module.",
        category: "lesson",
        iconName: "BookOpen",
        targetValue: 1,
        currentProgress: completedLessonsCount,
        isUnlocked: completedLessonsCount >= 1,
        unlockedAt: completedLessonsCount >= 1 ? "Unlocked" : undefined,
        rewardXP: 50,
      },
      {
        id: "ach-2",
        title: "Speed Blitz Starter",
        description: "Complete 5 timed quiz drills.",
        category: "quiz",
        iconName: "Zap",
        targetValue: 5,
        currentProgress: Math.min(5, totalAttempts),
        isUnlocked: totalAttempts >= 5,
        unlockedAt: totalAttempts >= 5 ? "Unlocked" : undefined,
        rewardXP: 100,
      },
      {
        id: "ach-3",
        title: "7-Day Consistent Learner",
        description: "Maintain a learning streak for 7 consecutive days.",
        category: "streak",
        iconName: "Flame",
        targetValue: 7,
        currentProgress: streakDays,
        isUnlocked: streakDays >= 7,
        unlockedAt: streakDays >= 7 ? "Unlocked" : undefined,
        rewardXP: 150,
      },
      {
        id: "ach-4",
        title: "100 Questions Answered",
        description: "Solve 100 mental math drill questions.",
        category: "mastery",
        iconName: "Target",
        targetValue: 100,
        currentProgress: Math.min(100, totalQuestionsAnswered),
        isUnlocked: totalQuestionsAnswered >= 100,
        unlockedAt: totalQuestionsAnswered >= 100 ? "Unlocked" : undefined,
        rewardXP: 200,
      },
    ];
  }

  /**
   * Get Active Weekly Challenge
   */
  getWeeklyChallenge(totalQuestionsAnswered: number = 0): WeeklyChallenge {
    return {
      id: "wc-1",
      title: "Mental Multiplication Mastery",
      description: "Achieve 90% accuracy across 30 multiplication drill questions this week.",
      targetValue: 30,
      currentValue: Math.min(30, totalQuestionsAnswered),
      rewardXP: 250,
      deadlineDaysLeft: 3,
      isCompleted: totalQuestionsAnswered >= 30,
    };
  }
}
