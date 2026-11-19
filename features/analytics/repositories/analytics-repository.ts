import { createClient } from "@/lib/supabase/server";
import { cache } from "react";

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

// Request-scoped cached queries so multiple services sharing the same data don't refetch
const fetchUserAttemptsCached = cache(async (userId: string): Promise<RawAttemptRecord[]> => {
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
});

const fetchUserProgressCached = cache(async (userId: string): Promise<RawProgressRecord[]> => {
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
});

export class AnalyticsRepository {
  /**
   * Fetch all quiz attempts for a user from Supabase (cached per request)
   */
  async getUserAttempts(userId: string): Promise<RawAttemptRecord[]> {
    return fetchUserAttemptsCached(userId);
  }

  /**
   * Fetch all learning progress records for a user from Supabase (cached per request)
   */
  async getUserProgress(userId: string): Promise<RawProgressRecord[]> {
    return fetchUserProgressCached(userId);
  }
}
