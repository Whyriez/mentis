"use server";

import { FeatureFlagService } from "../services/feature-flag-service";

const flagService = new FeatureFlagService();

export async function toggleFeatureFlagAction(
  key: string,
  isEnabled: boolean
): Promise<{ success: boolean }> {
  const ok = await flagService.toggleFlag(key, isEnabled);
  return { success: ok };
}
