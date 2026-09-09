"use server";

import { SettingsService } from "../services/settings-service";
import {
  PlatformGeneralSettings,
  LearningQuizSettings,
  AISettingsConfig,
} from "../types";

const settingsService = new SettingsService();

import { createClient } from "@/lib/supabase/server";

export async function updateGeneralSettingsAction(
  data: Partial<PlatformGeneralSettings>
) {
  const updated = await settingsService.updateGeneralSettings(data);
  return { success: true, settings: updated };
}

export async function updateLearningQuizSettingsAction(
  data: Partial<LearningQuizSettings>
) {
  const updated = await settingsService.updateLearningQuizSettings(data);
  return { success: true, settings: updated };
}

export async function updateAISettingsAction(data: Partial<AISettingsConfig>) {
  const updated = await settingsService.updateAISettings(data);
  return { success: true, settings: updated };
}

export async function toggleMaintenanceModeAction(
  enabled: boolean,
  message?: string
) {
  const updated = await settingsService.toggleMaintenanceMode(enabled, message);
  return { success: true, config: updated };
}

export async function updateUserProfileSettingsAction(payload: {
  fullName: string;
  dailyGoalMinutes: number;
  roadmapTargetMonths: number;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Unauthorized" };
  }

  const { error } = await supabase.from("profiles").upsert(
    {
      user_id: user.id,
      full_name: payload.fullName,
      daily_goal_minutes: payload.dailyGoalMinutes,
      roadmap_target_months: payload.roadmapTargetMonths,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "user_id" }
  );

  return { success: !error, error: error?.message };
}
