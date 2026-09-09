import { ContentStatus } from "@/features/modules/types";

export type SectionType =
  | "heading"
  | "paragraph"
  | "formula"
  | "example"
  | "tip"
  | "warning"
  | "callout"
  | "practice_box";

export interface LessonSection {
  id: string;
  type: SectionType;
  content: string;
  orderIndex: number;
  metadata?: Record<string, unknown>;
}

export interface LessonItem {
  id: string;
  moduleId: string;
  title: string;
  slug: string;
  description: string;
  estimatedMinutes: number;
  orderIndex: number;
  status: ContentStatus;
  sections: LessonSection[];
  updatedAt: string;
}

export interface LessonFormData {
  moduleId: string;
  title: string;
  slug: string;
  description: string;
  estimatedMinutes: number;
  orderIndex: number;
  status: ContentStatus;
  sections: Omit<LessonSection, "id">[];
}

export interface ValidationIssue {
  field: string;
  message: string;
}
