import { Metadata } from "next";
import { Compass, Calendar } from "lucide-react";
import { RoadmapService } from "@/features/roadmap/services/roadmap-service";
import { InitialAssessmentModal } from "@/features/roadmap/components/initial-assessment-modal";
import { DailyMissionWidget } from "@/features/roadmap/components/daily-mission-widget";
import { ReviewQueueWidget } from "@/features/roadmap/components/review-queue-widget";
import { RoadmapTimelineView } from "@/features/roadmap/components/roadmap-timeline-view";
import { EmptyState } from "@/components/ui/ui-states";
import { getCurrentUser } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Roadmap | Mentis",
  description: "Personalized psychometric learning roadmap and daily mission.",
};

const roadmapService = new RoadmapService();

export default async function RoadmapPage() {
  const user = await getCurrentUser();
  const userId = user?.id || "guest";

  const summary = await roadmapService.getUserRoadmap(userId);

  if (!summary) {
    return (
      <EmptyState
        title="No Roadmap Generated"
        description="Configure your learning goals to generate a personalized study roadmap."
      />
    );
  }

  return (
    <div className="space-y-8 pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary">
            <Compass className="h-4 w-4" />
            <span>Adaptive Curriculum Engine</span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight">Personalized Study Roadmap</h1>
          <p className="text-muted-foreground text-sm max-w-xl">
            Targeting {summary.preferences.purpose} within {summary.preferences.timeline} ({summary.preferences.dailyMinutes} mins/day).
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <div className="text-right hidden sm:block">
            <div className="text-xs text-muted-foreground font-semibold flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5 text-primary" />
              Est. Finish Date
            </div>
            <div className="text-sm font-bold text-foreground">{summary.estimatedFinishDate}</div>
          </div>
          <InitialAssessmentModal initialPreferences={summary.preferences} />
        </div>
      </div>

      {/* Top Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DailyMissionWidget mission={summary.dailyMission} />
        <ReviewQueueWidget queue={summary.reviewQueue} />
      </div>

      {/* Step-by-Step Roadmap Timeline */}
      <RoadmapTimelineView phases={summary.phases} />
    </div>
  );
}
