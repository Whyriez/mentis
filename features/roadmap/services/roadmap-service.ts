import { RoadmapRepository } from "../repositories/roadmap-repository";
import { RoadmapEngine } from "../engine/roadmap-engine";
import { AssessmentPreferences, UserRoadmapSummary } from "../types";
import { AnalyticsRepository } from "@/features/analytics/repositories/analytics-repository";

export class RoadmapService {
  private repository: RoadmapRepository;
  private engine: RoadmapEngine;
  private analyticsRepository: AnalyticsRepository;

  constructor() {
    this.repository = new RoadmapRepository();
    this.engine = new RoadmapEngine();
    this.analyticsRepository = new AnalyticsRepository();
  }

  async getUserRoadmap(userId: string = "guest"): Promise<UserRoadmapSummary> {
    const rawRecord = await this.repository.getUserRoadmap(userId);
    const reviewQueue = await this.repository.getReviewQueue(userId);

    const attempts = await this.analyticsRepository.getUserAttempts(userId);
    const progress = await this.analyticsRepository.getUserProgress(userId);

    const completedLessonsCount = progress.filter((p) => p.completed).length;
    const totalQuestionsAnswered = attempts.reduce((acc, a) => acc + (a.total_questions || 0), 0);
    const totalStudyMinutes = Math.round(completedLessonsCount * 5 + totalQuestionsAnswered * 0.5);

    const preferences: AssessmentPreferences = {
      timeline: (rawRecord?.target_timeline as AssessmentPreferences["timeline"]) || "3 Months",
      purpose: (rawRecord?.prep_purpose as AssessmentPreferences["purpose"]) || "Job Interview",
      dailyMinutes: (rawRecord?.daily_minutes as AssessmentPreferences["dailyMinutes"]) || 30,
    };

    return this.engine.generatePersonalizedRoadmap(preferences, reviewQueue, {
      completedMinutes: totalStudyMinutes,
      completedQuestions: totalQuestionsAnswered,
    });
  }

  async updateAssessmentPreferences(
    userId: string = "guest",
    preferences: AssessmentPreferences
  ): Promise<UserRoadmapSummary> {
    await this.repository.saveRoadmapPreferences(userId, preferences);
    return this.getUserRoadmap(userId);
  }
}
