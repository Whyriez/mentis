"use server";

import { QuizRepository } from "../repositories/quiz-repository";
import { UserAnswerRecord } from "../components/quiz-result-view";
import { Question } from "../types";
import { createClient } from "@/lib/supabase/server";

const repository = new QuizRepository();

export async function getDrillQuestionsAction(
  moduleSlug: string = "multiplication",
  difficulty: "Easy" | "Medium" | "Hard" = "Medium",
  count: number = 10
): Promise<Question[]> {
  return repository.getQuestions(moduleSlug, difficulty, count);
}

export async function startQuizAttemptAction(
  userIdInput: string,
  moduleId: string,
  totalQuestions: number
): Promise<{ success: boolean; attemptId: string | null }> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const userId = user?.id || (userIdInput !== "guest" ? userIdInput : null);

  if (!userId) {
    // If unauthenticated guest, return session ID for local tracking
    return { success: true, attemptId: `guest-session-${Date.now()}` };
  }

  const attemptId = await repository.createQuizAttempt(userId, moduleId, totalQuestions);
  return { success: !!attemptId, attemptId };
}

export async function submitQuizAttemptAction(payload: {
  userId?: string;
  attemptId?: string | null;
  moduleId?: string;
  lessonId?: string;
  records: UserAnswerRecord[];
}): Promise<{ success: boolean; score: number; accuracy: number }> {
  const { attemptId, records } = payload;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const userId = user?.id || payload.userId;

  const totalQuestions = records.length;
  if (totalQuestions === 0) {
    return { success: false, score: 0, accuracy: 0 };
  }

  const correctCount = records.filter((r) => r.isCorrect).length;
  const accuracy = Math.round((correctCount / totalQuestions) * 100);

  // If real attemptId exists or user is authenticated, update database
  if (attemptId && !attemptId.startsWith("guest-session")) {
    const formattedAnswers = records.map((r) => ({
      questionId: r.question.id,
      selectedAnswer: r.selectedOption,
      isCorrect: r.isCorrect,
      timeTakenMs: r.timeTakenMs,
    }));

    await repository.saveQuizAnswers(attemptId, formattedAnswers);
    await repository.finalizeQuizAttempt(attemptId, accuracy);

    if (userId && payload.moduleId && payload.lessonId) {
      await repository.updateLearningProgress(userId, payload.moduleId, payload.lessonId, accuracy);
    }
  }

  return {
    success: true,
    score: accuracy,
    accuracy,
  };
}
