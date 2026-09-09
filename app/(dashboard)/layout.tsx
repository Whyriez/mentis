import React from "react";
import { Header } from "@/components/layout/header";
import { createClient } from "@/lib/supabase/server";
import { GamificationService } from "@/features/gamification/services/gamification-service";

const gamificationService = new GamificationService();

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let userName = "";
  let userEmail = "";
  let avatarUrl = "";
  let streakDays = 0;

  if (user) {
    userEmail = user.email || "";

    const { data: profile } = await supabase
      .from("profiles")
      .select("full_name, avatar_url")
      .eq("user_id", user.id)
      .single();

    userName =
      profile?.full_name ||
      user.user_metadata?.full_name ||
      user.email?.split("@")[0] ||
      "Learner";
    avatarUrl = profile?.avatar_url || user.user_metadata?.avatar_url || "";

    const gamificationProfile = await gamificationService.getUserGamificationProfile(
      user.id
    );
    streakDays = gamificationProfile.streak.currentStreak;
  }

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Header
        userName={userName}
        userEmail={userEmail}
        avatarUrl={avatarUrl}
        streakDays={streakDays}
      />
      <main className="flex-1 container mx-auto px-3 sm:px-6 py-4 sm:py-6 lg:py-8 max-w-7xl">
        {children}
      </main>
      <footer className="border-t border-border/60 py-5 text-center text-xs text-muted-foreground">
        <div className="container mx-auto px-3 sm:px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>&copy; {new Date().getFullYear()} Mentis — Adaptive Brain Training Platform</span>
          <div className="flex gap-4">
            <a href="#" className="hover:underline">Privacy</a>
            <a href="#" className="hover:underline">Terms</a>
            <a href="#" className="hover:underline">Support</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
