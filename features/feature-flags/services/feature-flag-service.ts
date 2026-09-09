import { FeatureFlag } from "../types";
import { AuditService } from "@/features/audit/services/audit-service";

const auditService = new AuditService();

export class FeatureFlagService {
  private static flags: FeatureFlag[] = [
    {
      key: "ai_tutor",
      name: "AI Tutor & Live Explanations",
      category: "AI",
      description: "Enable Gemini AI tutor assistance for wrong quiz answers.",
      isEnabled: true,
      updatedAt: "2026-08-07",
    },
    {
      key: "gamification_xp",
      name: "Gamification & XP System",
      category: "Gamification",
      description: "Enable learner level progression, daily streaks, and daily mission XP rewards.",
      isEnabled: true,
      updatedAt: "2026-08-07",
    },
    {
      key: "adaptive_roadmap",
      name: "Adaptive Learning Roadmap Engine",
      category: "Core",
      description: "Dynamic study path adaptation based on diagnostic accuracy & response speed.",
      isEnabled: true,
      updatedAt: "2026-08-07",
    },
    {
      key: "review_queue",
      name: "Spaced Repetition Review Queue",
      category: "Core",
      description: "Automatically queue weak questions for review after 24h/7d intervals.",
      isEnabled: true,
      updatedAt: "2026-08-07",
    },
    {
      key: "community_leaderboard",
      name: "Learner Leaderboard & Community",
      category: "Experimental",
      description: "Public weekly competitive ranking table.",
      isEnabled: false,
      updatedAt: "2026-08-07",
    },
  ];

  async getFlags(): Promise<FeatureFlag[]> {
    return FeatureFlagService.flags;
  }

  async toggleFlag(key: string, isEnabled: boolean): Promise<boolean> {
    const flag = FeatureFlagService.flags.find((f) => f.key === key);
    if (!flag) return false;
    flag.isEnabled = isEnabled;
    flag.updatedAt = new Date().toISOString().split("T")[0];

    auditService.logEvent({
      actorName: "Super Admin",
      actorRole: "super_admin",
      action: "Role Change",
      target: `Feature Flag: ${flag.name}`,
      details: `Toggled feature flag '${flag.key}' to ${isEnabled ? "ON" : "OFF"}.`,
    });

    return true;
  }
}
