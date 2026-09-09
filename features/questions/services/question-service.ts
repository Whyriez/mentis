import { createClient } from "@/lib/supabase/client";
import { QuestionItem, QuestionVersion, QuestionImportReport } from "../types";
import { AIService } from "@/features/ai/services/ai-service";

const aiService = new AIService();

export class QuestionService {
  /**
   * Fetch all questions combining Supabase database and published AI Studio drafts
   */
  async getQuestions(query?: {
    search?: string;
    moduleId?: string;
    difficulty?: string;
    status?: string;
  }): Promise<QuestionItem[]> {
    let dbQuestions: QuestionItem[] = [];

    try {
      const supabase = createClient();
      let req = supabase.from("questions").select("*").order("created_at", { ascending: false });

      if (query?.search) {
        req = req.ilike("question", `%${query.search}%`);
      }
      if (query?.moduleId) {
        req = req.eq("module_id", query.moduleId);
      }
      if (query?.difficulty) {
        req = req.eq("difficulty", query.difficulty);
      }

      const { data, error } = await req;

      if (!error && data && data.length > 0) {
        dbQuestions = data.map((q) => ({
          id: q.id,
          moduleId: q.module_id || "a1b2c3d4-0000-0000-0000-000000000001",
          lessonId: q.lesson_id,
          type: "multiple_choice",
          question: q.question,
          options: Array.isArray(q.options) ? q.options : ["Option A", "Option B", "Option C", "Option D"],
          correctAnswer: q.answer || q.correct_answer || "A",
          explanation: q.explanation || "",
          difficulty: (q.difficulty as QuestionItem["difficulty"]) || "Medium",
          difficultyScore: 50,
          estimatedSeconds: q.estimated_seconds || 10,
          tags: [q.category || "Mental Math", q.difficulty || "Medium"],
          source: q.source === "ai" ? "AI" : "Manual",
          status: "Published",
          version: 1,
          createdBy: q.source === "ai" ? "Gemini AI" : "Super Admin",
          updatedAt: q.created_at ? new Date(q.created_at).toLocaleDateString("id-ID") : "Today",
        }));
      }
    } catch (err) {
      console.error("[QuestionService] Exception fetching questions from Supabase:", err);
    }

    // Also fetch any AI questions published during current session
    let aiQuestions: QuestionItem[] = [];
    try {
      aiQuestions = await aiService.getPublishedQuestions();
    } catch {
      // Fallback
    }

    // Merge and deduplicate by question text
    const allQuestionsMap = new Map<string, QuestionItem>();

    // AI Published questions first (newest)
    aiQuestions.forEach((q) => {
      allQuestionsMap.set(q.question.toLowerCase().trim(), q);
    });

    // Supabase DB questions
    dbQuestions.forEach((q) => {
      const key = q.question.toLowerCase().trim();
      if (!allQuestionsMap.has(key)) {
        allQuestionsMap.set(key, q);
      }
    });

    // If both empty, return default fallbacks
    if (allQuestionsMap.size === 0) {
      return this.getFallbackQuestions();
    }

    let result = Array.from(allQuestionsMap.values());

    if (query?.search) {
      const s = query.search.toLowerCase();
      result = result.filter(
        (q) =>
          q.question.toLowerCase().includes(s) ||
          q.tags.some((t) => t.toLowerCase().includes(s))
      );
    }

    if (query?.difficulty) {
      result = result.filter((q) => q.difficulty === query.difficulty);
    }

    return result;
  }

  /**
   * Parse CSV/JSON text for bulk import
   */
  parseBulkImport(text: string, format: "csv" | "json"): QuestionImportReport {
    const report: QuestionImportReport = {
      totalRows: 0,
      successCount: 0,
      failedCount: 0,
      errors: [],
      importedQuestions: [],
    };

    if (format === "json") {
      try {
        const parsed = JSON.parse(text);
        const rows = Array.isArray(parsed) ? parsed : [parsed];
        report.totalRows = rows.length;

        rows.forEach((row, idx) => {
          if (!row.question || !row.correctAnswer || !Array.isArray(row.options) || row.options.length < 2) {
            report.failedCount++;
            report.errors.push({ row: idx + 1, message: "Missing required fields (question, correctAnswer, options)" });
          } else {
            report.successCount++;
            report.importedQuestions.push({
              moduleId: row.moduleId || "a1b2c3d4-0000-0000-0000-000000000001",
              type: "multiple_choice",
              question: row.question,
              options: row.options,
              correctAnswer: row.correctAnswer,
              explanation: row.explanation || "Imported solution step.",
              difficulty: row.difficulty || "Medium",
              difficultyScore: 50,
              estimatedSeconds: 30,
              tags: row.tags || ["Imported"],
              status: "Published",
            });
          }
        });
      } catch {
        report.errors.push({ row: 0, message: "Invalid JSON format string." });
      }
    } else {
      const lines = text.split("\n").filter((l) => l.trim().length > 0);
      report.totalRows = lines.length - 1;

      for (let i = 1; i < lines.length; i++) {
        const cols = lines[i].split(",").map((c) => c.trim().replace(/^"|"$/g, ""));
        if (cols.length < 6) {
          report.failedCount++;
          report.errors.push({ row: i, message: "CSV row requires question, opt1, opt2, opt3, opt4, answer" });
        } else {
          report.successCount++;
          report.importedQuestions.push({
            moduleId: "a1b2c3d4-0000-0000-0000-000000000001",
            type: "multiple_choice",
            question: cols[0],
            options: [cols[1], cols[2], cols[3], cols[4]],
            correctAnswer: cols[5],
            explanation: cols[6] || "Detailed explanation",
            difficulty: "Medium",
            difficultyScore: 50,
            estimatedSeconds: 30,
            tags: ["CSV Import"],
            status: "Published",
          });
        }
      }
    }

    return report;
  }

  /**
   * Serialize questions to CSV for bulk export
   */
  exportToCSV(questions: QuestionItem[]): string {
    const header = "Question,Option A,Option B,Option C,Option D,Correct Answer,Explanation,Difficulty,Module\n";
    const rows = questions
      .map((q) =>
        [
          `"${q.question.replace(/"/g, '""')}"`,
          `"${q.options[0] || ""}"`,
          `"${q.options[1] || ""}"`,
          `"${q.options[2] || ""}"`,
          `"${q.options[3] || ""}"`,
          `"${q.correctAnswer}"`,
          `"${q.explanation.replace(/"/g, '""')}"`,
          q.difficulty,
          q.moduleId,
        ].join(",")
      )
      .join("\n");

    return header + rows;
  }

  /**
   * Version history mock snapshots
   */
  getVersionHistory(questionId: string): QuestionVersion[] {
    return [
      {
        id: `v2-${questionId}`,
        questionId,
        version: 2,
        question: "Calculate 43 × 11 using mental math shortcut.",
        options: ["473", "453", "483", "430"],
        correctAnswer: "473",
        explanation: "Sandwich 4 + 3 = 7 between 4 and 3 -> 473.",
        editedBy: "Super Admin",
        createdAt: "2 hours ago",
      },
      {
        id: `v1-${questionId}`,
        questionId,
        version: 1,
        question: "What is 43 multiplied by 11?",
        options: ["473", "453", "483", "430"],
        correctAnswer: "473",
        explanation: "Direct multiplication.",
        editedBy: "Content Editor",
        createdAt: "Yesterday",
      },
    ];
  }

  /**
   * Fallback question bank for development & demo
   */
  getFallbackQuestions(): QuestionItem[] {
    return [
      {
        id: "q-101",
        moduleId: "a1b2c3d4-0000-0000-0000-000000000001",
        lessonId: "lesson-1",
        type: "multiple_choice",
        question: "What is 43 × 11?",
        options: ["473", "453", "483", "430"],
        correctAnswer: "473",
        explanation: "Use 11-Sandwich method: 4 + 3 = 7 -> Sandwich 7 between 4 and 3 = 473.",
        difficulty: "Easy",
        difficultyScore: 25,
        estimatedSeconds: 15,
        tags: ["Multiplication", "Mental Math", "Speed"],
        source: "Manual",
        status: "Published",
        version: 2,
        createdBy: "Super Admin",
        updatedAt: "2 hours ago",
      },
      {
        id: "q-102",
        moduleId: "a1b2c3d4-0000-0000-0000-000000000001",
        lessonId: "lesson-1",
        type: "multiple_choice",
        question: "What is 75 × 11?",
        options: ["825", "7125", "725", "815"],
        correctAnswer: "825",
        explanation: "7 + 5 = 12. Carry over 1: (7+1)|2|5 = 825.",
        difficulty: "Medium",
        difficultyScore: 50,
        estimatedSeconds: 25,
        tags: ["Multiplication", "Carry Over"],
        source: "AI",
        status: "Published",
        version: 1,
        createdBy: "Gemini AI",
        updatedAt: "Yesterday",
      },
    ];
  }
}
