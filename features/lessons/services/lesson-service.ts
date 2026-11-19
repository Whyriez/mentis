import { LessonItem, ValidationIssue } from "../types";
import { createClient } from "@/lib/supabase/client";

export class LessonService {
  /**
   * Validate a lesson before publishing
   */
  validateForPublish(lesson: Partial<LessonItem>): { isValid: boolean; issues: ValidationIssue[] } {
    const issues: ValidationIssue[] = [];

    if (!lesson.title || lesson.title.trim().length === 0) {
      issues.push({ field: "title", message: "Lesson title cannot be empty." });
    }

    if (!lesson.sections || lesson.sections.length === 0) {
      issues.push({ field: "sections", message: "Lesson must contain at least 1 content section." });
    } else {
      lesson.sections.forEach((sec, idx) => {
        if (!sec.content || sec.content.trim().length === 0) {
          issues.push({
            field: `section-${idx}`,
            message: `Section #${idx + 1} (${sec.type}) is empty.`,
          });
        }
      });
    }

    const hasExample = lesson.sections?.some((s) => s.type === "example");
    if (!hasExample) {
      issues.push({ field: "sections", message: "Recommended: Add at least 1 worked Example section." });
    }

    return {
      isValid: issues.filter((i) => i.field !== "sections" || i.message.startsWith("Lesson must")).length === 0,
      issues,
    };
  }

  /**
   * Fetch all lessons from Supabase with fallback
   */
  async getLessons(): Promise<LessonItem[]> {
    try {
      const supabase = createClient();
      const { data, error } = await supabase.from("lessons").select("*").order("order_index", { ascending: true });

      if (error || !data || data.length === 0) {
        return this.getFallbackLessons();
      }

      const lessonList = data as unknown as Array<{
        id: string;
        module_id?: string;
        title: string;
        content_md?: string;
        estimated_minutes?: number;
        order_index?: number;
        created_at?: string;
      }>;
      return lessonList.map((l) => ({
        id: l.id,
        moduleId: l.module_id || "mod-multiplication",
        title: l.title,
        slug: l.title.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
        description: l.content_md ? l.content_md.slice(0, 120) + "..." : "Lesson content block.",
        estimatedMinutes: l.estimated_minutes || 10,
        orderIndex: l.order_index || 1,
        status: "Published",
        updatedAt: l.created_at ? new Date(l.created_at).toLocaleDateString() : "Today",
        sections: [
          {
            id: `sec-${l.id}-1`,
            type: "heading",
            content: l.title,
            orderIndex: 1,
          },
          {
            id: `sec-${l.id}-2`,
            type: "paragraph",
            content: l.content_md || "",
            orderIndex: 2,
          },
        ],
      }));
    } catch {
      return this.getFallbackLessons();
    }
  }

  /**
   * Return default fallback lessons for admin preview & editor
   */
  getFallbackLessons(): LessonItem[] {
    return [
      {
        id: "lesson-1",
        moduleId: "mod-multiplication",
        title: "The 11-Sandwich Multiplication Shortcut",
        slug: "11-sandwich-shortcut",
        description: "Learn how to multiply any two-digit number by 11 in under 3 seconds.",
        estimatedMinutes: 10,
        orderIndex: 1,
        status: "Published",
        updatedAt: "Today",
        sections: [
          {
            id: "sec-1",
            type: "heading",
            content: "Concept: The Sandwich Method",
            orderIndex: 1,
          },
          {
            id: "sec-2",
            type: "paragraph",
            content: "Multiplying two-digit numbers by 11 doesn't require vertical scratch paper calculation. Simply add the two digits together and insert ('sandwich') the sum in between them.",
            orderIndex: 2,
          },
          {
            id: "sec-3",
            type: "formula",
            content: "AB × 11 = A | (A + B) | B",
            orderIndex: 3,
          },
          {
            id: "sec-4",
            type: "example",
            content: "Calculate 43 × 11. Digits are 4 and 3. Sum = 4 + 3 = 7. Sandwich 7 in between -> 473.",
            orderIndex: 4,
          },
          {
            id: "sec-5",
            type: "tip",
            content: "If A + B >= 10, carry over 1 to the hundreds place. Example: 75 × 11 -> 7+5=12 -> (7+1)|2|5 -> 825.",
            orderIndex: 5,
          },
        ],
      },
      {
        id: "lesson-2",
        moduleId: "mod-multiplication",
        title: "Base-100 Deviation Multiplication",
        slug: "base-100-deviation",
        description: "Speed calculation trick for multiplying numbers close to 100.",
        estimatedMinutes: 15,
        orderIndex: 2,
        status: "Draft",
        updatedAt: "Yesterday",
        sections: [
          {
            id: "sec-201",
            type: "heading",
            content: "Base 100 Multiplication Trick",
            orderIndex: 1,
          },
          {
            id: "sec-202",
            type: "paragraph",
            content: "When multiplying numbers in the 90s (like 96 × 97), use their distance (deviation) from 100 to quickly derive both halves of the product.",
            orderIndex: 2,
          },
        ],
      },
    ];
  }
}
