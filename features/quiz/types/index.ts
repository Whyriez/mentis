export interface Question {
  id: string;
  moduleId: string;
  lessonId?: string;
  category: string;
  difficulty: "Easy" | "Medium" | "Hard";
  question: string;
  options: string[];
  answer: string;
  explanation: string;
  estimatedSeconds: number;
}

export interface QuizConfig {
  moduleId: string;
  difficulty: "Easy" | "Medium" | "Hard";
  questionCount: number;
  secondsPerQuestion: number;
}

export interface QuizAttempt {
  id: string;
  userId: string;
  moduleId: string;
  startedAt: string;
  finishedAt?: string;
  totalQuestions: number;
  score: number;
}
