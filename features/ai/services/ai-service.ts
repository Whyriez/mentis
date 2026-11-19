import {
  AIGenerationJob,
  AIDraftItem,
  AILog,
  AIContentType,
  AIDraftReviewState,
} from "../types";
import { QuestionValidator } from "@/features/questions/validators/question-validator";
import { GeminiService } from "./gemini-service";
import { createClient } from "@/lib/supabase/client";
import { QuestionItem } from "@/features/questions/types";

const questionValidator = new QuestionValidator();
const geminiService = new GeminiService();

function isUuid(id: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(id);
}

export class AIService {
  private static jobs: AIGenerationJob[] = [];
  private static drafts: AIDraftItem[] = [];
  private static logs: AILog[] = [];

  /**
   * Fetch live dynamic overview stats combining Supabase DB tables and AI Pipeline metrics
   */
  async getOverviewStats(): Promise<{
    questionsCount: number;
    lessonsCount: number;
    draftQueueCount: number;
    publishedCount: number;
    failedCount: number;
    tokenUsage: string;
  }> {
    let questionsCount = 0;
    let lessonsCount = 0;

    try {
      const supabase = createClient();
      const [{ count: qCount }, { count: lCount }] = await Promise.all([
        supabase.from("questions").select("*", { count: "exact", head: true }),
        supabase.from("lessons").select("*", { count: "exact", head: true }),
      ]);
      questionsCount = qCount || 0;
      lessonsCount = lCount || 0;
    } catch {
      // Fallback
    }

    const publishedDrafts = AIService.drafts.filter(
      (d) => d.reviewState === "Published" && d.contentType === "Questions"
    ).length;
    questionsCount = Math.max(questionsCount, publishedDrafts);

    const draftQueueCount = AIService.drafts.filter((d) => d.reviewState === "Pending").length;
    const publishedCount = AIService.drafts.filter((d) => d.reviewState === "Published").length;
    const failedCount = AIService.logs.filter((l) => l.status === "Failed").length;

    const totalTokens = AIService.logs.reduce((sum, l) => sum + (l.tokenCount || 0), 0);
    const tokenUsage =
      totalTokens >= 1000000
        ? `${(totalTokens / 1000000).toFixed(1)}M`
        : totalTokens >= 1000
        ? `${(totalTokens / 1000).toFixed(1)}K`
        : `${totalTokens}`;

    return {
      questionsCount,
      lessonsCount,
      draftQueueCount,
      publishedCount,
      failedCount,
      tokenUsage,
    };
  }

  /**
   * Fetch all jobs
   */
  async getJobs(): Promise<AIGenerationJob[]> {
    return AIService.jobs;
  }

  /**
   * Fetch all drafts
   */
  async getDrafts(): Promise<AIDraftItem[]> {
    return AIService.drafts;
  }

  /**
   * Fetch published question drafts as QuestionItem objects
   */
  async getPublishedQuestions(): Promise<QuestionItem[]> {
    return AIService.drafts
      .filter((d) => d.reviewState === "Published" && d.contentType === "Questions")
      .map((d) => {
        const data = d.contentData;
        const options = Array.isArray(data?.options) ? data.options : ["A", "B", "C", "D"];
        return {
          id: d.id,
          moduleId: (data?.moduleId as string) || "a1b2c3d4-0000-0000-0000-000000000001",
          type: "multiple_choice",
          question: (data?.question as string) || d.title,
          options,
          correctAnswer: (data?.correctAnswer as string) || (data?.answer as string) || options[0],
          explanation: (data?.explanation as string) || "AI generated step-by-step solution.",
          difficulty: (data?.difficulty as QuestionItem["difficulty"]) || "Medium",
          difficultyScore: 50,
          estimatedSeconds: 10,
          tags: ["AI Generated", d.model],
          source: "AI",
          status: "Published",
          version: 1,
          createdBy: "Gemini AI Studio",
          updatedAt: "Just now",
        };
      });
  }

  /**
   * Fetch all logs
   */
  async getLogs(): Promise<AILog[]> {
    return AIService.logs;
  }

  /**
   * Create a new generation job using live Gemini API & key rotator
   */
  async createJob(params: {
    contentType: AIContentType;
    moduleId: string;
    difficulty: "Easy" | "Medium" | "Hard";
    amount: number;
    model: string;
    temperature: number;
  }): Promise<AIGenerationJob> {
    const newJob: AIGenerationJob = {
      id: `job-${Date.now()}`,
      contentType: params.contentType,
      moduleId: params.moduleId,
      difficulty: params.difficulty,
      amount: params.amount,
      completedCount: 0,
      status: "Running",
      model: params.model,
      temperature: params.temperature,
      promptVersion: 1,
      createdAt: "Just now",
      updatedAt: "Just now",
    };

    AIService.jobs.unshift(newJob);

    try {
      // If Hints or Explanations, fetch target questions from database first for strict context alignment
      let targetQuestions: Array<{ id: string; question: string; options?: string[]; answer?: string }> = [];

      if (params.contentType === "Explanations" || params.contentType === "Hints") {
        try {
          const supabase = createClient();
          const validModId = await this.getValidModuleId(params.moduleId);
          const { data } = await supabase
            .from("questions")
            .select("id, question, options, answer")
            .eq("module_id", validModId)
            .limit(params.amount);

          if (data && data.length > 0) {
            type QuestionContextRow = {
              id: string;
              question: string;
              options?: unknown;
              answer?: string;
            };
            targetQuestions = (data as unknown as QuestionContextRow[]).map((q) => ({
              id: q.id,
              question: q.question,
              options: Array.isArray(q.options) ? (q.options as string[]) : [],
              answer: q.answer,
            }));
          }
        } catch (err) {
          console.error("[AIService] Error fetching target questions for context:", err);
        }
      }

      let allGeneratedItems: any[] = [];
      let totalTokens = 0;
      let totalLatency = 0;
      let modelUsed = "gemini-3.5-flash";
      let keyIndex = 1;
      let maskedKey = "";

      let attempts = 0;
      while (allGeneratedItems.length < params.amount && attempts < 3) {
        const needed = params.amount - allGeneratedItems.length;
        const genResult = await geminiService.generateContent({
          contentType: params.contentType,
          moduleTitle: params.moduleId,
          difficulty: params.difficulty,
          amount: needed,
          model: params.model,
          temperature: params.temperature,
          targetQuestions,
        });

        if (genResult.contentJson && genResult.contentJson.length > 0) {
          allGeneratedItems.push(...genResult.contentJson);
          modelUsed = genResult.modelUsed;
          keyIndex = genResult.keyIndex;
          maskedKey = genResult.maskedKey;
          totalTokens += genResult.totalTokens;
          totalLatency += genResult.latencyMs;
        } else {
          break;
        }
        attempts++;
      }

      for (let i = 0; i < allGeneratedItems.length; i++) {
        const itemData = allGeneratedItems[i];
        let isValid = true;
        let title = `${params.contentType} item #${i + 1}`;

        if (params.contentType === "Questions") {
          title = (itemData.question as string) || title;
          const valRes = questionValidator.validateForPublish({
            moduleId: params.moduleId,
            question: (itemData.question as string) || "",
            options: (itemData.options as string[]) || [],
            correctAnswer: (itemData.correctAnswer as string) || (itemData.answer as string) || "",
            explanation: (itemData.explanation as string) || "",
            difficulty: params.difficulty,
          });
          isValid = valRes.isValid;
        } else if (params.contentType === "Lessons") {
          title = (itemData.title as string) || title;
        } else if (params.contentType === "Explanations" || params.contentType === "Hints") {
          title = itemData.question
            ? `Solution/Hint for: "${itemData.question}"`
            : itemData.stepTitle || itemData.hintTitle || title;
        }

        const isDuplicate = AIService.drafts.some((d) => d.title === title);

        AIService.drafts.unshift({
          id: `draft-${Date.now()}-${i}`,
          jobId: newJob.id,
          contentType: params.contentType,
          title,
          contentData: itemData,
          isValid,
          isPossibleDuplicate: isDuplicate,
          duplicateMatchTitle: isDuplicate ? title : undefined,
          reviewState: "Pending",
          model: modelUsed,
          tokenCount: Math.round(totalTokens / Math.max(1, allGeneratedItems.length)),
          createdAt: "Just now",
        });

        newJob.completedCount++;
      }

      newJob.amount = Math.max(newJob.amount, newJob.completedCount);
      newJob.status = "Completed";
      newJob.updatedAt = "Just now";

      AIService.logs.unshift({
        id: `log-${Date.now()}`,
        jobId: newJob.id,
        contentType: params.contentType,
        model: `${modelUsed} (Key #${keyIndex}: ${maskedKey})`,
        tokenCount: totalTokens,
        latencyMs: totalLatency,
        status: "Success",
        createdAt: "Just now",
      });
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      newJob.status = "Failed";

      AIService.logs.unshift({
        id: `log-${Date.now()}`,
        jobId: newJob.id,
        contentType: params.contentType,
        model: params.model,
        tokenCount: 0,
        latencyMs: 0,
        status: "Failed",
        errorMessage,
        createdAt: "Just now",
      });

      throw err;
    }

    return newJob;
  }

  /**
   * Resolve a valid UUID module ID from Supabase
   */
  private async getValidModuleId(rawModuleId?: string): Promise<string> {
    if (rawModuleId && isUuid(rawModuleId)) {
      return rawModuleId;
    }

    try {
      const supabase = createClient();
      const { data } = await supabase.from("modules").select("id").limit(1).single();
      if (data?.id) return data.id;
    } catch {
      // Fallback
    }

    return "a1b2c3d4-0000-0000-0000-000000000001";
  }

  /**
   * Review draft (Approve, Reject, Publish) and persist to Supabase if Published
   */
  async updateDraftState(draftId: string, state: AIDraftReviewState): Promise<boolean> {
    const item = AIService.drafts.find((d) => d.id === draftId);
    if (!item) return false;

    if (state === "Published") {
      try {
        const supabase = createClient();
        const data = item.contentData;

        const targetModuleId = await this.getValidModuleId(data?.moduleId as string);

        if (item.contentType === "Questions" && data) {
          const rawOptions = data.options;
          const optionsArray = Array.isArray(rawOptions)
            ? rawOptions
            : ["Option A", "Option B", "Option C", "Option D"];

          const insertPayload = {
            module_id: targetModuleId,
            category: (data.category as string) || "Mental Arithmetic",
            difficulty: (data.difficulty as string) || "Medium",
            question: (data.question as string) || item.title,
            options: optionsArray,
            answer: (data.correctAnswer as string) || (data.answer as string) || optionsArray[0],
            explanation: (data.explanation as string) || "AI generated step-by-step solution.",
            estimated_seconds: 10,
            source: "ai" as const,
          };

          const { error } = await supabase.from("questions").insert(insertPayload);
          if (error) {
            console.error("[AIService] Supabase Questions Insert Error:", error.message, error.details);
          }
        } else if (item.contentType === "Lessons" && data) {
          const insertPayload = {
            module_id: targetModuleId,
            title: (data.title as string) || item.title,
            content_md: (data.summary as string) || (data.description as string) || item.title,
            estimated_minutes: (data.estimatedMinutes as number) || 5,
            order_index: 1,
          };

          const { error } = await supabase.from("lessons").insert(insertPayload);
          if (error) {
            console.error("[AIService] Supabase Lessons Insert Error:", error.message, error.details);
          }
        } else if ((item.contentType === "Explanations" || item.contentType === "Hints") && data?.questionId) {
          const newExp = (data.explanation as string) || (data.hint1 ? `${data.hint1}. ${data.hint2 || ""}` : "");
          if (newExp) {
            const { error } = await supabase
              .from("questions")
              .update({ explanation: newExp })
              .eq("id", data.questionId as string);
            if (error) {
              console.error("[AIService] Supabase Question Explanation Update Error:", error.message);
            }
          }
        }
      } catch (err) {
        console.error("[AIService] Failed to persist published AI draft to Supabase database:", err);
      }

      item.reviewState = "Published";
      return true;
    } else {
      item.reviewState = state;
      return true;
    }
  }
}
