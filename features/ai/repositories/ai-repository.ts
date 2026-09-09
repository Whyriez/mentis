import { createClient } from "@/lib/supabase/server";
import { GenerationLogRecord, GeneratedQuestion } from "../types";

export class AIRepository {
  /**
   * Log an AI generation event
   */
  async logGeneration(log: Omit<GenerationLogRecord, "id" | "createdAt">): Promise<boolean> {
    try {
      const supabase = await createClient();
      const { error } = await supabase.from("ai_generation_logs").insert({
        model: log.model,
        prompt_version: log.promptVersion,
        content_type: log.contentType,
        tokens_used: log.tokensUsed,
        execution_time_ms: log.executionTimeMs,
        status: log.status,
        error_message: log.errorMessage || null,
      });

      return !error;
    } catch {
      return false;
    }
  }

  /**
   * Insert generated question into Supabase public.questions as pending draft
   */
  async saveDraftQuestion(q: GeneratedQuestion): Promise<boolean> {
    try {
      const supabase = await createClient();
      const { error } = await supabase.from("questions").insert({
        category: q.category,
        difficulty: q.difficulty,
        question: q.question,
        options: JSON.stringify(q.options),
        answer: q.answer,
        explanation: q.explanation,
        estimated_seconds: q.estimatedSeconds,
      });

      return !error;
    } catch {
      return false;
    }
  }

  /**
   * Fetch all existing questions to run duplicate checks against
   */
  async getExistingQuestionTexts(): Promise<string[]> {
    try {
      const supabase = await createClient();
      const { data, error } = await supabase.from("questions").select("question");
      if (error || !data) return [];
      return data.map((d) => d.question);
    } catch {
      return [];
    }
  }
}
