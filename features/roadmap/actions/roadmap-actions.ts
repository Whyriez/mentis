"use server";

import { RoadmapService } from "../services/roadmap-service";
import { AssessmentPreferences, UserRoadmapSummary } from "../types";

const roadmapService = new RoadmapService();

export async function updateAssessmentAction(
  userId: string,
  preferences: AssessmentPreferences
): Promise<{ success: boolean; summary: UserRoadmapSummary }> {
  const summary = await roadmapService.updateAssessmentPreferences(userId, preferences);
  return { success: true, summary };
}
