import { Metadata } from "next";
import { Settings } from "lucide-react";
import { createClient, getCurrentUser } from "@/lib/supabase/server";
import { SettingsForm } from "./settings-form";

export const metadata: Metadata = {
  title: "Settings | Mentis",
  description: "Manage your Mentis account profile, study targets, and preferences.",
};

export default async function SettingsPage() {
  const user = await getCurrentUser();

  let fullName = user?.user_metadata?.full_name || "";
  const email = user?.email || "";
  let dailyGoalMinutes = 20;
  let roadmapTargetMonths = 2;

  if (user) {
    const supabase = await createClient();
    const { data: profile } = await supabase
      .from("profiles")
      .select("full_name, daily_goal_minutes, roadmap_target_months")
      .eq("user_id", user.id)
      .single();

    if (profile) {
      if (profile.full_name) fullName = profile.full_name;
      if (profile.daily_goal_minutes)
        dailyGoalMinutes = profile.daily_goal_minutes;
      if (profile.roadmap_target_months)
        roadmapTargetMonths = profile.roadmap_target_months;
    }
  }

  return (
    <div className="space-y-8 pb-10 max-w-4xl mx-auto">
      <div className="space-y-2">
        <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary">
          <Settings className="h-4 w-4" />
          <span>Account & Preferences</span>
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight">Settings</h1>
        <p className="text-muted-foreground text-sm">
          Customize your profile, daily training minutes, and target exam timeline.
        </p>
      </div>

      <SettingsForm
        initialFullName={fullName}
        initialEmail={email}
        initialDailyGoalMinutes={dailyGoalMinutes}
        initialRoadmapTargetMonths={roadmapTargetMonths}
      />
    </div>
  );
}
