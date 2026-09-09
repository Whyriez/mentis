import { createClient } from "@/lib/supabase/server";

export interface RawAttemptRecord {
  id: string;
  user_id: string;
  module_id: string;
  started_at: string;
  finished_at: string | null;
  total_questions: number;
  score: number;
  modules?: {
    title: string;
    slug: string;
  };
}

export interface RawProgressRecord {
  module_id: string;
  lesson_id: string;
  mastery_percent: number;
  completed: boolean;
}

export class AnalyticsRepository {
  /**
   * Fetch all quiz attempts for a user from Supabase
   */
  async getUserAttempts(userId: string): Promise<RawAttemptRecord[]> {
    try {
      if (!userId || userId === "guest") return [];

      const supabase = await createClient();
      const { data, error } = await supabase
        .from("quiz_attempts")
        .select("*, modules(title, slug)")
        .eq("user_id", userId)
        .order("started_at", { ascending: false });

      if (error || !data) return [];
      return data as RawAttemptRecord[];
    } catch {
      return [];
    }
  }

  /**
   * Fetch all learning progress records for a user from Supabase
   */
  async getUserProgress(userId: string): Promise<RawProgressRecord[]> {
    try {
      if (!userId || userId === "guest") return [];

      const supabase = await createClient();
      const { data, error } = await supabase
        .from("learning_progress")
        .select("*")
        .eq("user_id", userId);

      if (error || !data) return [];
      return data as RawProgressRecord[];
    } catch {
      return [];
    }
  }
}
