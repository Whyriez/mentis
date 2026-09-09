"use server";

import { QuestionService } from "../services/question-service";
import { QuestionValidator } from "../validators/question-validator";
import { QuestionFormData, QuestionImportReport, QuestionItem } from "../types";
import { ValidationIssue } from "@/features/lessons/types";
import { GeminiService } from "@/features/ai/services/gemini-service";

const questionService = new QuestionService();
const validator = new QuestionValidator();

export async function getQuestionsAction(query?: {
  search?: string;
  moduleId?: string;
  difficulty?: string;
}): Promise<QuestionItem[]> {
  return await questionService.getQuestions(query);
}

export async function saveQuestionAction(
  data: QuestionFormData
): Promise<{ success: boolean; id?: string; issues?: ValidationIssue[] }> {
  if (data.status === "Published") {
    const validation = validator.validateForPublish(data);
    if (!validation.isValid) {
      return { success: false, issues: validation.issues };
    }
  }

  return { success: true, id: `q-${Date.now()}` };
}

export async function deleteQuestionAction(id: string): Promise<{ success: boolean }> {
  if (!id) return { success: false };
  return { success: true };
}

export async function importQuestionsAction(
  text: string,
  format: "csv" | "json"
): Promise<QuestionImportReport> {
  return questionService.parseBulkImport(text, format);
}

export async function exportQuestionsAction(
  query?: { moduleId?: string; difficulty?: string }
): Promise<{ csvData: string }> {
  const questions = await questionService.getQuestions(query);
  const csvData = questionService.exportToCSV(questions);
  return { csvData };
}

export async function enhanceQuestionAction(params: {
  question: string;
  options: string[];
  correctAnswer: string;
  currentDifficulty?: string;
}): Promise<{
  success: boolean;
  explanation?: string;
  suggestedDifficulty?: "Easy" | "Medium" | "Hard";
  suggestedScore?: number;
  tags?: string[];
  error?: string;
}> {
  if (!params.question || params.question.trim().length === 0) {
    return { success: false, error: "Please enter a question prompt first before enhancing with AI." };
  }

  try {
    const geminiService = new GeminiService();
    const result = await geminiService.generateContent({
      contentType: "Explanations",
      moduleTitle: "Mental Arithmetic Drill",
      difficulty: (params.currentDifficulty as "Easy" | "Medium" | "Hard") || "Medium",
      amount: 1,
      model: "gemini-3.5-flash",
      temperature: 0.3,
      customPromptTemplate: `You are an expert psychometric math tutor for Mentis App.
Analyze this math drill question:
Question: "${params.question}"
Options: ${JSON.stringify(params.options)}
Correct Answer: "${params.correctAnswer}"

Tasks:
1. Write a clear, step-by-step mental calculation shortcut explanation.
2. Evaluate its difficulty level ("Easy", "Medium", or "Hard") and difficulty score (0-100).
3. Generate 3-5 relevant skill tags.

Output strict JSON only with this schema:
{
  "explanation": "Detailed step-by-step mental math shortcut explanation...",
  "suggestedDifficulty": "Easy" | "Medium" | "Hard",
  "suggestedScore": 50,
  "tags": ["Mental Math", "Speed Drill", "Sub-Skill"]
}`,
    });

    if (result.contentJson && result.contentJson.length > 0) {
      const data = result.contentJson[0];
      return {
        success: true,
        explanation: (data.explanation as string) || "Use mental calculation shortcut.",
        suggestedDifficulty: (data.suggestedDifficulty as "Easy" | "Medium" | "Hard") || "Medium",
        suggestedScore: typeof data.suggestedScore === "number" ? data.suggestedScore : 50,
        tags: Array.isArray(data.tags) ? data.tags : ["Mental Math", "Psychometric"],
      };
    }
    return { success: false, error: "AI failed to generate explanation payload." };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return { success: false, error: msg };
  }
}
