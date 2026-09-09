export type ContentStatus = "Draft" | "Published" | "Archived";
export type ModuleDifficulty = "Beginner" | "Intermediate" | "Advanced";

export interface ModuleItem {
  id: string;
  title: string;
  slug: string;
  description: string;
  difficulty: ModuleDifficulty;
  estimatedMinutes: number;
  icon: string;
  color: string;
  orderIndex: number;
  status: ContentStatus;
  isActive: boolean;
  lessonsCount: number;
  updatedAt: string;
}

export interface ModuleFormData {
  title: string;
  slug: string;
  description: string;
  difficulty: ModuleDifficulty;
  estimatedMinutes: number;
  icon: string;
  color: string;
  orderIndex: number;
  status: ContentStatus;
}
