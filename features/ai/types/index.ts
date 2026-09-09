export type AIContentType = "Questions" | "Lessons" | "Explanations" | "Hints";
export type AIJobStatus = "Pending" | "Running" | "Completed" | "Failed" | "Cancelled";
export type AIDraftReviewState = "Pending" | "Approved" | "Rejected" | "Published";
export type AIPromptCategory = "Question Prompt" | "Lesson Prompt" | "Hint Prompt" | "Explanation Prompt";

export interface AIGenerationJob {
  id: string;
  contentType: AIContentType;
  moduleId: string;
  lessonId?: string;
  difficulty: "Easy" | "Medium" | "Hard";
  amount: number;
  completedCount: number;
  status: AIJobStatus;
  model: string;
  temperature: number;
  promptVersion: number;
  createdAt: string;
  updatedAt: string;
}

export interface AIDraftItem {
  id: string;
  jobId: string;
  contentType: AIContentType;
  title: string;
  contentData: Record<string, unknown>;
  isValid: boolean;
  validationIssues?: string[];
  isPossibleDuplicate: boolean;
  duplicateMatchTitle?: string;
  reviewState: AIDraftReviewState;
  model: string;
  tokenCount: number;
  createdAt: string;
}

export interface AIPrompt {
  id: string;
  name: string;
  category: AIPromptCategory;
  version: number;
  template: string;
  isActive: boolean;
  updatedAt: string;
}

export interface AILog {
  id: string;
  jobId: string;
  contentType: AIContentType;
  model: string;
  tokenCount: number;
  latencyMs: number;
  status: "Success" | "Failed";
  errorMessage?: string;
  createdAt: string;
}

export interface AISettings {
  defaultModel: string;
  temperature: number;
  maxTokens: number;
  retryCount: number;
  safetyLevel: "Block None" | "Block Medium" | "Block High";
}

/* Backward compatibility type aliases for legacy helpers */
export interface GenerationLogRecord {
  id: string;
  model: string;
  promptVersion: number;
  contentType: string;
  tokensUsed: number;
  executionTimeMs: number;
  status: string;
  errorMessage?: string;
  createdAt: string;
}

export interface GeneratedQuestion {
  id?: string;
  category: string;
  difficulty: "Easy" | "Medium" | "Hard";
  question: string;
  options: string[];
  answer: string;
  explanation: string;
  estimatedSeconds: number;
  tags: string[];
}

export interface GeneratedLessonDraft {
  id?: string;
  title: string;
  moduleSlug: string;
  introduction: string;
  explanation: string;
  mentalMathTrick: string;
  examples: { problem: string; solution: string; explanation: string }[];
  summary: string[];
  practiceTips: string[];
}

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

export interface AdminContentItem {
  id: string;
  type: "question" | "lesson";
  topic: string;
  titleOrQuestion: string;
  preview: string;
  difficulty: "Easy" | "Medium" | "Hard";
  status: "pending" | "approved" | "rejected";
  createdAt: string;
  rawPayload: Record<string, unknown>;
}
