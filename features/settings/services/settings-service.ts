import {
  PlatformGeneralSettings,
  LearningQuizSettings,
  AISettingsConfig,
  MaintenanceConfig,
} from "../types";
import { AuditService } from "@/features/audit/services/audit-service";

const auditService = new AuditService();

export class SettingsService {
  private static general: PlatformGeneralSettings = {
    platformName: "Mentis Adaptive Brain Platform",
    logoUrl: "/logo.png",
    faviconUrl: "/favicon.ico",
    defaultLanguage: "en",
    timezone: "Asia/Jakarta (UTC+7)",
    dateFormat: "YYYY-MM-DD",
    maintenanceMessage: "Mentis is currently undergoing scheduled infrastructure upgrades.",
    contactEmail: "support@mentis.dev",
  };

  private static learningQuiz: LearningQuizSettings = {
    defaultDailyGoalMinutes: 30,
    defaultStudyTimeMinutes: 45,
    passingScorePercentage: 75,
    completionThresholdPercentage: 80,
    defaultQuizTimerSeconds: 30,
    minQuizQuestions: 5,
    maxQuizQuestions: 50,
    shuffleQuestions: true,
    shuffleOptions: true,
    autoNextQuestion: true,
    allowPauseQuiz: false,
    defaultDifficulty: "Medium",
  };

  private static aiConfig: AISettingsConfig = {
    provider: "Google Gemini",
    geminiModel: "gemini-1.5-pro",
    temperature: 0.7,
    maxTokens: 2048,
    retryCount: 3,
    dailyAIQuota: 500,
    safetyLevel: "Block Medium",
    promptVersion: 1,
    aiEnabled: true,
  };

  private static maintenance: MaintenanceConfig = {
    enabled: false,
    message: "Mentis is under maintenance. We will be back shortly!",
    expectedFinishTime: "2026-08-08 02:00 UTC",
    whitelistedAdmins: ["super_admin", "admin"],
  };

  async getGeneralSettings(): Promise<PlatformGeneralSettings> {
    return SettingsService.general;
  }

  async updateGeneralSettings(data: Partial<PlatformGeneralSettings>): Promise<PlatformGeneralSettings> {
    SettingsService.general = { ...SettingsService.general, ...data };
    auditService.logEvent({
      actorName: "Super Admin",
      actorRole: "super_admin",
      action: "Lesson Update",
      target: "General Platform Settings",
      details: "Updated platform branding and general configuration.",
    });
    return SettingsService.general;
  }

  async getLearningQuizSettings(): Promise<LearningQuizSettings> {
    return SettingsService.learningQuiz;
  }

  async updateLearningQuizSettings(data: Partial<LearningQuizSettings>): Promise<LearningQuizSettings> {
    SettingsService.learningQuiz = { ...SettingsService.learningQuiz, ...data };
    auditService.logEvent({
      actorName: "Super Admin",
      actorRole: "super_admin",
      action: "Question Edit",
      target: "Quiz & Learning Settings",
      details: "Updated default timers, passing score thresholds, and question count limits.",
    });
    return SettingsService.learningQuiz;
  }

  async getAISettings(): Promise<AISettingsConfig> {
    return SettingsService.aiConfig;
  }

  async updateAISettings(data: Partial<AISettingsConfig>): Promise<AISettingsConfig> {
    SettingsService.aiConfig = { ...SettingsService.aiConfig, ...data };
    auditService.logEvent({
      actorName: "Super Admin",
      actorRole: "super_admin",
      action: "AI Generation",
      target: "AI System Configuration",
      details: `Updated Gemini model to ${SettingsService.aiConfig.geminiModel} and temperature to ${SettingsService.aiConfig.temperature}.`,
    });
    return SettingsService.aiConfig;
  }

  async getMaintenanceConfig(): Promise<MaintenanceConfig> {
    return SettingsService.maintenance;
  }

  async toggleMaintenanceMode(enabled: boolean, message?: string): Promise<MaintenanceConfig> {
    SettingsService.maintenance.enabled = enabled;
    if (message) SettingsService.maintenance.message = message;

    auditService.logEvent({
      actorName: "Super Admin",
      actorRole: "super_admin",
      action: "User Status Change",
      target: "Platform Maintenance Mode",
      details: `Maintenance mode ${enabled ? "ENABLED" : "DISABLED"}.`,
    });

    return SettingsService.maintenance;
  }
}
