export type DifficultyLevel = "Beginner" | "Intermediate" | "Advanced";

export interface QuickTip {
  title: string;
  description: string;
  formula?: string;
}

export interface ExampleCase {
  problem: string;
  solution: string;
  steps: string[];
}

export interface LessonSectionData {
  explanation: string;
  quickTips: QuickTip[];
  examples: ExampleCase[];
  summary: string[];
}

export interface LessonData {
  id: string;
  moduleId: string;
  moduleTitle: string;
  title: string;
  description: string;
  difficulty: DifficultyLevel;
  estimatedMinutes: number;
  objectives: string[];
  sections: LessonSectionData;
  orderIndex: number;
}

export interface ModuleData {
  id: string;
  title: string;
  slug: string;
  description: string;
  difficulty: DifficultyLevel;
  lessons: LessonData[];
}
