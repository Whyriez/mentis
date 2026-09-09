"use server";

import { AIService } from "../services/ai-service";
import { GeminiKeyRotator } from "../services/gemini-rotator";
import { AIContentType, AIDraftReviewState, AIGenerationJob, AIDraftItem, AILog } from "../types";

const aiService = new AIService();
const rotator = GeminiKeyRotator.getInstance();

export async function createAIJobAction(params: {
  contentType: AIContentType;
  moduleId: string;
  difficulty: "Easy" | "Medium" | "Hard";
  amount: number;
  model: string;
  temperature: number;
}): Promise<{ success: boolean; jobId?: string; error?: string }> {
  try {
    const job = await aiService.createJob(params);
    return { success: true, jobId: job.id };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    return { success: false, error: errorMsg };
  }
}

export async function reviewDraftAction(
  draftId: string,
  state: AIDraftReviewState
): Promise<{ success: boolean }> {
  const ok = await aiService.updateDraftState(draftId, state);
  return { success: ok };
}

export async function bulkReviewDraftsAction(
  draftIds: string[],
  state: AIDraftReviewState
): Promise<{ success: boolean; updatedCount: number }> {
  let count = 0;
  for (const id of draftIds) {
    const ok = await aiService.updateDraftState(id, state);
    if (ok) count++;
  }
  return { success: true, updatedCount: count };
}

export async function getJobsAction(): Promise<AIGenerationJob[]> {
  return await aiService.getJobs();
}

export async function getDraftsAction(): Promise<AIDraftItem[]> {
  return await aiService.getDrafts();
}

export async function getLogsAction(): Promise<AILog[]> {
  return await aiService.getLogs();
}

export async function getOverviewStatsAction() {
  return await aiService.getOverviewStats();
}

export async function getKeyPoolStatusAction(): Promise<{
  totalKeys: number;
  keyStatuses: { index: number; maskedKey: string; failCount: number; isExhausted: boolean }[];
}> {
  return {
    totalKeys: rotator.getKeyCount(),
    keyStatuses: rotator.getKeyStatuses(),
  };
}

export async function addApiKeyAction(key: string): Promise<{ success: boolean; totalKeys: number }> {
  if (!key || key.trim().length === 0) {
    return { success: false, totalKeys: rotator.getKeyCount() };
  }
  rotator.addApiKey(key);
  return { success: true, totalKeys: rotator.getKeyCount() };
}
