export type UserRole = "super_admin" | "admin" | "editor" | "user";
export type UserAccountStatus = "active" | "deactivated";

export interface AdminUserItem {
  id: string;
  fullName: string;
  email: string;
  role: UserRole;
  level: number;
  xp: number;
  streakDays: number;
  roadmapProgress: number; // 0 - 100
  lastActive: string;
  status: UserAccountStatus;
  createdAt: string;
}

export interface UserDetailProfile extends AdminUserItem {
  completedLessonsCount: number;
  quizzesTakenCount: number;
  averageAccuracy: number;
  achievementsUnlocked: number;
  targetGoal: string;
  dailyStudyMinutes: number;
  quizHistory: {
    id: string;
    quizTitle: string;
    score: number;
    accuracy: number;
    takenAt: string;
  }[];
  adminNotes?: string;
}
