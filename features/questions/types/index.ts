import { ContentStatus } from "@/features/modules/types";

export type QuestionDifficulty = "Easy" | "Medium" | "Hard";
export type QuestionType = "multiple_choice" | "true_false" | "short_answer" | "fill_in_blank";
export type QuestionSource = "Manual" | "AI" | "Import";

export interface QuestionItem {
  id: string;
  moduleId: string;
  lessonId?: string;
  type: QuestionType;
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
  difficulty: QuestionDifficulty;
  difficultyScore: number; // 0 - 100
  estimatedSeconds: number;
  tags: string[];
  source: QuestionSource;
  status: ContentStatus | "Rejected";
  version: number;
  createdBy: string;
  updatedAt: string;
}

export interface QuestionVersion {
  id: string;
  questionId: string;
  version: number;
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
  editedBy: string;
  createdAt: string;
}

export interface QuestionFormData {
  moduleId: string;
  lessonId?: string;
  type: QuestionType;
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
  difficulty: QuestionDifficulty;
  difficultyScore: number;
  estimatedSeconds: number;
  tags: string[];
  status: ContentStatus | "Rejected";
}

export interface QuestionImportReport {
  totalRows: number;
  successCount: number;
  failedCount: number;
  errors: { row: number; message: string }[];
  importedQuestions: QuestionFormData[];
}
