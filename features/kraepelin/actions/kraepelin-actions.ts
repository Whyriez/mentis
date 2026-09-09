"use server";

import { createClient } from "@/lib/supabase/server";
import { KraepelinMetrics } from "../types";
import { GamificationRepository } from "@/features/gamification/repositories/gamification-repository";

const gamificationRepo = new GamificationRepository();

export async function submitKraepelinAttemptAction(payload: {
  metrics: KraepelinMetrics;
  columnCount: number;
}): Promise<{ success: boolean; earnedXP: number }> {
  try {
    const { metrics, columnCount } = payload;
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: true, earnedXP: 30 };
    }

    // Find any module id for psychometrics/arithmetic
    const { data: moduleData } = await supabase
      .from("modules")
      .select("id")
      .limit(1)
      .single();

    const moduleId = moduleData?.id;

    if (moduleId && metrics.totalAnswered > 0) {
      await supabase.from("quiz_attempts").insert({
        user_id: user.id,
        module_id: moduleId,
        total_questions: metrics.totalAnswered,
        score: metrics.accuracyPercent,
        started_at: new Date(Date.now() - columnCount * 30 * 1000).toISOString(),
        finished_at: new Date().toISOString(),
      });
    }

    // Calculate XP reward: base 50 XP + bonus for high accuracy and columns completed
    const earnedXP = Math.min(
      150,
      Math.round(40 + columnCount * 5 + (metrics.accuracyPercent >= 90 ? 25 : 10))
    );

    await gamificationRepo.addXP(user.id, earnedXP);

    return { success: true, earnedXP };
  } catch {
    return { success: false, earnedXP: 0 };
  }
}
