import { createClient } from "@/lib/supabase/server";
import { getMultiplicationQuestions } from "../data/multiplication-questions";
import { Question } from "../types";

export class QuizRepository {
  /**
   * Fetch questions from Supabase public.questions table
   */
  async getQuestions(
    moduleSlug: string = "multiplication",
    difficulty: "Easy" | "Medium" | "Hard" = "Medium",
    limit: number = 10
  ): Promise<Question[]> {
    try {
      const supabase = await createClient();

      // Find module_id from slug
      const { data: mod } = await supabase
        .from("modules")
        .select("id")
        .eq("slug", moduleSlug)
        .single();

      let query = supabase.from("questions").select("*");
      if (mod?.id) {
        query = query.eq("module_id", mod.id);
      }
      if (difficulty) {
        query = query.eq("difficulty", difficulty);
      }

      const { data: questions, error } = await query.limit(limit);

      if (error || !questions || questions.length === 0) {
        return getMultiplicationQuestions(difficulty, limit);
      }

      return questions.map((q) => ({
        id: q.id,
        moduleId: q.module_id,
        lessonId: q.lesson_id,
        category: q.category,
        difficulty: q.difficulty as "Easy" | "Medium" | "Hard",
        question: q.question,
        options: Array.isArray(q.options) ? q.options : JSON.parse(q.options || "[]"),
        answer: q.answer,
        explanation: q.explanation || "",
        estimatedSeconds: q.estimated_seconds || 10,
      }));
    } catch {
      return getMultiplicationQuestions(difficulty, limit);
    }
  }

  /**
   * Helper to resolve module slug or string ID to a valid database UUID
   */
  private async resolveModuleId(
    supabase: Awaited<ReturnType<typeof createClient>>,
    moduleId: string
  ): Promise<string | null> {
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(moduleId);
    if (isUuid) return moduleId;

    const cleanSlug = moduleId.replace(/^mod-arithmetic-/, "").replace(/^mod-/, "");
    const { data: mod } = await supabase
      .from("modules")
      .select("id")
      .or(`slug.ilike.%${cleanSlug}%,slug.eq.mental-math-speed`)
      .limit(1)
      .single();

    if (mod?.id) return mod.id;

    const { data: anyMod } = await supabase
      .from("modules")
      .select("id")
      .limit(1)
      .single();

    return anyMod?.id || null;
  }

  /**
   * Create a new quiz attempt record in public.quiz_attempts
   */
  async createQuizAttempt(
    userId: string,
    moduleId: string,
    totalQuestions: number
  ): Promise<string | null> {
    try {
      const supabase = await createClient();
      const validModuleId = await this.resolveModuleId(supabase, moduleId);

      if (!validModuleId) return null;

      const { data, error } = await supabase
        .from("quiz_attempts")
        .insert({
          user_id: userId,
          module_id: validModuleId,
          total_questions: totalQuestions,
          score: 0,
        })
        .select("id")
        .single();

      if (error || !data) return null;
      return data.id;
    } catch {
      return null;
    }
  }

  /**
   * Batch insert quiz answers into public.quiz_answers
   */
  async saveQuizAnswers(
    attemptId: string,
    answers: Array<{
      questionId: string;
      selectedAnswer: string | null;
      isCorrect: boolean;
      timeTakenMs: number;
    }>
  ): Promise<boolean> {
    try {
      const supabase = await createClient();
      const records = answers.map((ans) => ({
        attempt_id: attemptId,
        question_id: ans.questionId,
        selected_answer: ans.selectedAnswer || "TIMEOUT",
        is_correct: ans.isCorrect,
        time_taken_ms: ans.timeTakenMs,
      }));

      const { error } = await supabase.from("quiz_answers").insert(records);
      return !error;
    } catch {
      return false;
    }
  }

  /**
   * Finalize quiz attempt with score and finished_at timestamp
   */
  async finalizeQuizAttempt(
    attemptId: string,
    score: number
  ): Promise<boolean> {
    try {
      const supabase = await createClient();
      const { error } = await supabase
        .from("quiz_attempts")
        .update({
          score,
          finished_at: new Date().toISOString(),
        })
        .eq("id", attemptId);

      return !error;
    } catch {
      return false;
    }
  }

  /**
   * Upsert learning progress into public.learning_progress
   */
  async updateLearningProgress(
    userId: string,
    moduleId: string,
    lessonId: string,
    masteryPercent: number
  ): Promise<boolean> {
    try {
      const supabase = await createClient();
      const validModuleId = await this.resolveModuleId(supabase, moduleId);
      if (!validModuleId) return false;

      const completed = masteryPercent >= 80;

      const { error } = await supabase.from("learning_progress").upsert(
        {
          user_id: userId,
          module_id: validModuleId,
          lesson_id: lessonId,
          mastery_percent: masteryPercent,
          completed,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "user_id,lesson_id" }
      );

      return !error;
    } catch {
      return false;
    }
  }
}
