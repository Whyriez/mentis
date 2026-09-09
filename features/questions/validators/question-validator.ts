import { QuestionFormData, QuestionItem } from "../types";
import { ValidationIssue } from "@/features/lessons/types";

export class QuestionValidator {
  /**
   * Validate question structural integrity before publishing
   */
  validateForPublish(q: Partial<QuestionFormData>): { isValid: boolean; issues: ValidationIssue[] } {
    const issues: ValidationIssue[] = [];

    if (!q.question || q.question.trim().length === 0) {
      issues.push({ field: "question", message: "Question text cannot be empty." });
    }

    if (!q.moduleId || q.moduleId.trim().length === 0) {
      issues.push({ field: "moduleId", message: "Question must be assigned to a Learning Module." });
    }

    if (!q.options || q.options.length < 2) {
      issues.push({ field: "options", message: "Multiple choice question must have at least 2 options." });
    } else {
      const trimmedOpts = q.options.map((o) => o.trim().toLowerCase());
      const hasEmptyOpt = trimmedOpts.some((o) => o.length === 0);
      if (hasEmptyOpt) {
        issues.push({ field: "options", message: "Option choices cannot be empty." });
      }

      const uniqueOpts = new Set(trimmedOpts);
      if (uniqueOpts.size !== trimmedOpts.length) {
        issues.push({ field: "options", message: "Duplicate option choices detected." });
      }
    }

    if (!q.correctAnswer || q.correctAnswer.trim().length === 0) {
      issues.push({ field: "correctAnswer", message: "Select a valid correct answer." });
    } else if (q.options && !q.options.includes(q.correctAnswer)) {
      issues.push({ field: "correctAnswer", message: "Correct answer must match one of the options." });
    }

    if (!q.explanation || q.explanation.trim().length === 0) {
      issues.push({ field: "explanation", message: "Provide a detailed solution step explanation." });
    }

    return {
      isValid: issues.length === 0,
      issues,
    };
  }

  /**
   * Detect similarity with existing questions to prevent duplicates
   */
  detectDuplicates(targetText: string, existingQuestions: QuestionItem[]): QuestionItem | null {
    if (!targetText || targetText.trim().length < 5) return null;

    const normalizedTarget = targetText.toLowerCase().replace(/[^a-z0-9]/g, "");

    for (const q of existingQuestions) {
      const normalizedExisting = q.question.toLowerCase().replace(/[^a-z0-9]/g, "");
      if (normalizedTarget === normalizedExisting || normalizedExisting.includes(normalizedTarget)) {
        return q;
      }
    }
    return null;
  }
}
