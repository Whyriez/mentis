import { GeneratedQuestion, GeneratedLessonDraft, ValidationResult } from "../types";

export class AIContentValidator {
  /**
   * Validate a generated question object
   */
  static validateQuestion(q: GeneratedQuestion): ValidationResult {
    const errors: string[] = [];

    if (!q.question || q.question.trim().length === 0) {
      errors.push("Question text cannot be empty.");
    }

    if (!Array.isArray(q.options) || q.options.length !== 4) {
      errors.push("Question must contain exactly 4 options.");
    }

    if (!q.answer || !q.options.includes(q.answer)) {
      errors.push("Answer must be one of the 4 specified options.");
    }

    if (!q.explanation || q.explanation.trim().length === 0) {
      errors.push("Explanation cannot be empty.");
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Validate a generated lesson draft
   */
  static validateLesson(lesson: GeneratedLessonDraft): ValidationResult {
    const errors: string[] = [];

    if (!lesson.title || lesson.title.trim().length === 0) {
      errors.push("Lesson title cannot be empty.");
    }

    if (!lesson.explanation || lesson.explanation.trim().length === 0) {
      errors.push("Lesson explanation cannot be empty.");
    }

    if (!Array.isArray(lesson.examples) || lesson.examples.length === 0) {
      errors.push("Lesson must contain at least 1 worked example.");
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Check string similarity to prevent duplicate questions
   */
  static isDuplicate(newText: string, existingTexts: string[]): boolean {
    const cleanNew = newText.toLowerCase().replace(/[^a-z0-9]/g, "");
    return existingTexts.some((ex) => {
      const cleanEx = ex.toLowerCase().replace(/[^a-z0-9]/g, "");
      return cleanNew === cleanEx;
    });
  }
}
