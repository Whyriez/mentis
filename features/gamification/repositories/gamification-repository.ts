import { createClient } from "@/lib/supabase/server";
import { cache } from "react";

export interface RawGamificationRecord {
  total_xp: number;
  current_streak: number;
  longest_streak: number;
  last_active_at: string;
}

const fetchUserGamificationDataCached = cache(async (userId: string): Promise<RawGamificationRecord | null> => {
  try {
    if (!userId || userId === "guest") return null;
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("profiles")
      .select("total_xp, current_streak, longest_streak, last_active_at")
      .eq("user_id", userId)
      .single();

    if (error || !data) return null;
    return {
      total_xp: data.total_xp ?? 0,
      current_streak: data.current_streak ?? 0,
      longest_streak: data.longest_streak ?? 0,
      last_active_at: data.last_active_at || new Date().toISOString(),
    };
  } catch {
    return null;
  }
});

export class GamificationRepository {
  /**
   * Fetch gamification profile for a user (cached per request)
   */
  async getUserGamificationData(userId: string): Promise<RawGamificationRecord | null> {
    return fetchUserGamificationDataCached(userId);
  }

  /**
   * Sync calculated streak back to user profile in Supabase
   */
  async syncUserStreak(userId: string, currentStreak: number, longestStreak: number): Promise<void> {
    try {
      if (!userId || userId === "guest") return;
      const supabase = await createClient();
      await supabase
        .from("profiles")
        .update({
          current_streak: currentStreak,
          longest_streak: longestStreak,
          last_active_at: new Date().toISOString(),
        })
        .eq("user_id", userId);
    } catch {
      // Graceful fallback if column or RLS is restricted
    }
  }

  /**
   * Award XP to user profile
   */
  async addXP(userId: string, amount: number): Promise<boolean> {
    try {
      const supabase = await createClient();
      const { error } = await supabase.rpc("increment_user_xp", {
        user_id: userId,
        xp_amount: amount,
      });

      return !error;
    } catch {
      return false;
    }
  }
}
