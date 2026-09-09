export interface PlatformGeneralSettings {
  platformName: string;
  logoUrl: string;
  faviconUrl: string;
  defaultLanguage: string;
  timezone: string;
  dateFormat: string;
  maintenanceMessage: string;
  contactEmail: string;
}

export interface LearningQuizSettings {
  defaultDailyGoalMinutes: number;
  defaultStudyTimeMinutes: number;
  passingScorePercentage: number;
  completionThresholdPercentage: number;
  defaultQuizTimerSeconds: number;
  minQuizQuestions: number;
  maxQuizQuestions: number;
  shuffleQuestions: boolean;
  shuffleOptions: boolean;
  autoNextQuestion: boolean;
  allowPauseQuiz: boolean;
  defaultDifficulty: "Easy" | "Medium" | "Hard";
}

export interface AISettingsConfig {
  provider: string;
  geminiModel: string;
  temperature: number;
  maxTokens: number;
  retryCount: number;
  dailyAIQuota: number;
  safetyLevel: "Block None" | "Block Medium" | "Block High";
  promptVersion: number;
  aiEnabled: boolean;
}

export interface MaintenanceConfig {
  enabled: boolean;
  message: string;
  expectedFinishTime: string;
  whitelistedAdmins: string[];
}
