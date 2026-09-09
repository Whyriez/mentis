"use server";

import { LessonService } from "../services/lesson-service";
import { LessonFormData, LessonItem, ValidationIssue } from "../types";

const lessonService = new LessonService();

export async function saveLessonAction(
  data: LessonFormData
): Promise<{ success: boolean; id?: string }> {
  if (!data.title || !data.moduleId) {
    return { success: false };
  }
  return { success: true, id: `lesson-${Date.now()}` };
}

export async function publishLessonAction(
  lessonData: Partial<LessonFormData>
): Promise<{ success: boolean; issues?: ValidationIssue[] }> {
  const validation = lessonService.validateForPublish(lessonData as Partial<LessonItem>);
  if (!validation.isValid) {
    return { success: false, issues: validation.issues };
  }
  return { success: true };
}

export async function deleteLessonAction(id: string): Promise<{ success: boolean }> {
  if (!id) return { success: false };
  return { success: true };
}
