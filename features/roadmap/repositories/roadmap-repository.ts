import { createClient } from "@/lib/supabase/server";
import { AssessmentPreferences, ReviewQueueItem } from "../types";

export interface RawRoadmapRecord {
  id: string;
  user_id: string;
  title: string;
  target_timeline: string;
  prep_purpose: string;
  daily_minutes: number;
  created_at: string;
}

export class RoadmapRepository {
  /**
   * Fetch active roadmap for a user
   */
  async getUserRoadmap(userId: string): Promise<RawRoadmapRecord | null> {
    try {
      if (!userId || userId === "guest") return null;

      const supabase = await createClient();
      const { data, error } = await supabase
        .from("roadmaps")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(1)
        .single();

      if (error || !data) return null;
      return data as RawRoadmapRecord;
    } catch {
      return null;
    }
  }

  /**
   * Save or update roadmap preferences
   */
  async saveRoadmapPreferences(
    userId: string,
    prefs: AssessmentPreferences
  ): Promise<boolean> {
    try {
      if (!userId || userId === "guest") return true;

      const supabase = await createClient();
      const { error } = await supabase.from("roadmaps").upsert(
        {
          user_id: userId,
          title: `Personalized ${prefs.purpose} Roadmap`,
          target_timeline: prefs.timeline,
          prep_purpose: prefs.purpose,
          daily_minutes: prefs.dailyMinutes,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "user_id" }
      );

      return !error;
    } catch {
      return false;
    }
  }

  /**
   * Fetch user review queue items
   */
  async getReviewQueue(userId: string): Promise<ReviewQueueItem[]> {
    try {
      if (!userId || userId === "guest") return [];

      const supabase = await createClient();
      const { data, error } = await supabase
        .from("review_queue")
        .select("*, questions(question, category)")
        .eq("user_id", userId)
        .order("next_review_at", { ascending: true });

      if (error || !data) return [];

      return data.map((item) => ({
        id: item.id,
        questionId: item.question_id,
        questionText: item.questions?.question || "Mental Math Speed Practice",
        moduleTitle: item.questions?.category || "Multiplication",
        nextReviewAt: item.next_review_at,
        intervalDays: item.interval_days || 1,
        timesReviewed: item.times_reviewed || 0,
      }));
    } catch {
      return [];
    }
  }
}
