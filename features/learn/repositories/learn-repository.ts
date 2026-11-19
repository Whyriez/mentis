import { createClient } from "@/lib/supabase/server";
import { cache } from "react";
import { multiplicationModule } from "../data/multiplication-module";
import { LessonData, ModuleData } from "../types";

export const defaultModulesCatalog: ModuleData[] = [
  multiplicationModule,
  {
    id: "mod-division",
    title: "Speed Division & Halving Tricks",
    slug: "division",
    description: "Learn reciprocal tricks, double-and-halving rules, and fast psychometric division.",
    difficulty: "Intermediate",
    lessons: [
      {
        id: "div-lesson-1",
        moduleId: "mod-division",
        moduleTitle: "Speed Division & Halving Tricks",
        title: "Division by 5, 25, and 125 Shortcuts",
        description: "Multiply by 2 and shift decimal points to divide by 5 in under 2 seconds.",
        difficulty: "Intermediate",
        estimatedMinutes: 5,
        orderIndex: 1,
        objectives: ["Master N / 5 = (N x 2) / 10", "Apply to 25 and 125"],
        sections: {
          explanation: "To divide any number by 5, double the number and divide by 10 (move the decimal place 1 step left).",
          quickTips: [{ title: "Double & Shift Rule", description: "X / 5 = (X * 2) / 10", formula: "140 / 5 -> 280 / 10 = 28" }],
          examples: [{ problem: "165 / 5", solution: "33", steps: ["165 * 2 = 330", "330 / 10 = 33"] }],
          summary: ["Double the number.", "Shift decimal one place to the left."],
        },
      },
    ],
  },
  {
    id: "mod-percentages",
    title: "Fractions & Percentage Conversions",
    slug: "percentages",
    description: "Instant reciprocal memory mapping for fractions like 1/7, 1/8, 1/12, and 1/15.",
    difficulty: "Intermediate",
    lessons: [
      {
        id: "perc-lesson-1",
        moduleId: "mod-percentages",
        moduleTitle: "Fractions & Percentage Conversions",
        title: "Reciprocal Percentage Memory Tricks",
        description: "Memorize key benchmark fractions to calculate percentages instantly.",
        difficulty: "Intermediate",
        estimatedMinutes: 6,
        orderIndex: 1,
        objectives: ["Recognize 1/7 = 14.28%", "Recognize 1/8 = 12.5%"],
        sections: {
          explanation: "Memorize fractions up to 1/12 to immediately evaluate percentage change questions in psychometric speed tests.",
          quickTips: [{ title: "1/7 Rule", description: "Double 7 is 14, double 14 is 28 -> 14.28%", formula: "1/7 = 14.28%" }],
          examples: [{ problem: "What is 3/7 of 700?", solution: "300", steps: ["3 * (700 / 7) = 300"] }],
          summary: ["1/8 = 12.5%", "1/7 = 14.28%"],
        },
      },
    ],
  },
  {
    id: "mod-numerical-reasoning",
    title: "Number Series Pattern Recognition",
    slug: "numerical-reasoning",
    description: "Identify geometric, arithmetic, Fibonacci, and alternating sequence patterns.",
    difficulty: "Advanced",
    lessons: [
      {
        id: "num-lesson-1",
        moduleId: "mod-numerical-reasoning",
        moduleTitle: "Number Series Pattern Recognition",
        title: "Second-Difference Arithmetic Series",
        description: "Detect hidden progression patterns by analyzing differences of differences.",
        difficulty: "Advanced",
        estimatedMinutes: 7,
        orderIndex: 1,
        objectives: ["Calculate first differences", "Identify constant second differences"],
        sections: {
          explanation: "When a sequence looks irregular, calculate the differences between consecutive terms to find the underlying polynomial pattern.",
          quickTips: [{ title: "Delta Method", description: "Write d1, d2 between terms to expose rules.", formula: "2, 5, 10, 17 (+3, +5, +7)" }],
          examples: [{ problem: "2, 6, 12, 20, ?", solution: "30", steps: ["Diffs: 4, 6, 8 -> Next diff +10 -> 20 + 10 = 30"] }],
          summary: ["Check 1st diff, then 2nd diff."],
        },
      },
    ],
  },
  {
    id: "mod-spatial-reasoning",
    title: "Spatial & Logical Reasoning Blitz",
    slug: "spatial-reasoning",
    description: "Train mental 3D rotation, net folding, and syllogism logic elimination.",
    difficulty: "Advanced",
    lessons: [
      {
        id: "spat-lesson-1",
        moduleId: "mod-spatial-reasoning",
        moduleTitle: "Spatial & Logical Reasoning Blitz",
        title: "Syllogism Euler Diagram Shortcuts",
        description: "Evaluate All/Some/None logical premises without getting tricked.",
        difficulty: "Advanced",
        estimatedMinutes: 8,
        orderIndex: 1,
        objectives: ["Draw Euler circles in mind", "Eliminate invalid conclusions"],
        sections: {
          explanation: "Use Euler set diagrams to visually verify valid conclusions from logical premises.",
          quickTips: [{ title: "Overlap Check", description: "If A is inside B and B is inside C, A is always inside C.", formula: "A -> B -> C" }],
          examples: [{ problem: "All A are B. All B are C. Are all A in C?", solution: "Yes", steps: ["A is sub-set of C."] }],
          summary: ["Verify set inclusion."],
        },
      },
    ],
  },
];

const fetchModulesCached = cache(async (): Promise<ModuleData[]> => {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("modules")
      .select("*")
      .order("order_index", { ascending: true });

    if (error || !data || data.length === 0) {
      return defaultModulesCatalog;
    }

    // Merge DB modules with default catalog details and lessons
    return data.map((mod) => {
      const catalogMatch = defaultModulesCatalog.find(
        (c) => c.slug === mod.slug || c.title.toLowerCase().includes(mod.title.toLowerCase())
      );

      return {
        id: mod.id,
        title: mod.title,
        slug: mod.slug,
        description: mod.description || catalogMatch?.description || "Master psychometric skills.",
        difficulty: (mod.difficulty as "Beginner" | "Intermediate" | "Advanced") || catalogMatch?.difficulty || "Beginner",
        lessons: catalogMatch?.lessons || [
          {
            id: `db-lesson-${mod.id}-1`,
            moduleId: mod.id,
            moduleTitle: mod.title,
            title: `${mod.title} Foundational Drill`,
            description: `Core concepts and mental shortcuts for ${mod.title}.`,
            difficulty: (mod.difficulty as "Beginner" | "Intermediate" | "Advanced") || "Beginner",
            estimatedMinutes: 5,
            orderIndex: 1,
            objectives: ["Master core concept", "Apply speed shortcut"],
            sections: {
              explanation: `Detailed lesson breakdown for ${mod.title}.`,
              quickTips: [],
              examples: [],
              summary: [],
            },
          },
        ],
      };
    });
  } catch {
    return defaultModulesCatalog;
  }
});

export class LearnRepository {
  /**
   * Fetch all active modules from Supabase table public.modules (cached per request)
   */
  async getModules(): Promise<ModuleData[]> {
    return fetchModulesCached();
  }

  /**
   * Fetch a single module by slug with all associated lessons
   */
  async getModuleBySlug(slug: string): Promise<ModuleData | null> {
    const catalogMatch = defaultModulesCatalog.find((m) => m.slug === slug);
    try {
      const supabase = await createClient();
      const { data: mod, error } = await supabase
        .from("modules")
        .select("*")
        .eq("slug", slug)
        .single();

      if (error || !mod) {
        return catalogMatch || multiplicationModule;
      }

      const { data: lessons } = await supabase
        .from("lessons")
        .select("*")
        .eq("module_id", mod.id)
        .order("order_index", { ascending: true });

      const mappedLessons: LessonData[] = (lessons || []).map((l) => ({
        id: l.id,
        moduleId: l.module_id,
        moduleTitle: mod.title,
        title: l.title,
        description: l.content_md ? l.content_md.slice(0, 100) + "..." : "",
        difficulty: mod.difficulty,
        estimatedMinutes: l.estimated_minutes || 5,
        orderIndex: l.order_index || 1,
        objectives: ["Master core concept", "Apply speed shortcut"],
        sections: {
          explanation: l.content_md || "",
          quickTips: [],
          examples: [],
          summary: [],
        },
      }));

      return {
        id: mod.id,
        title: mod.title,
        slug: mod.slug,
        description: mod.description || catalogMatch?.description || "",
        difficulty: mod.difficulty,
        lessons: mappedLessons.length > 0 ? mappedLessons : catalogMatch?.lessons || multiplicationModule.lessons,
      };
    } catch {
      return catalogMatch || multiplicationModule;
    }
  }

  /**
   * Fetch a specific lesson by ID
   */
  async getLessonById(lessonId: string): Promise<LessonData | null> {
    // Search in catalog first for instant fallback
    for (const mod of defaultModulesCatalog) {
      const foundInCat = mod.lessons.find((l) => l.id === lessonId);
      if (foundInCat) return foundInCat;
    }

    try {
      const supabase = await createClient();
      const { data: lesson, error } = await supabase
        .from("lessons")
        .select("*, modules(*)")
        .eq("id", lessonId)
        .single();

      if (error || !lesson) {
        return multiplicationModule.lessons[0];
      }

      return {
        id: lesson.id,
        moduleId: lesson.module_id,
        moduleTitle: lesson.modules?.title || "Mental Math",
        title: lesson.title,
        description: lesson.content_md?.slice(0, 100) || "",
        difficulty: lesson.modules?.difficulty || "Beginner",
        estimatedMinutes: lesson.estimated_minutes || 5,
        orderIndex: lesson.order_index || 1,
        objectives: ["Understand key formula", "Apply in speed drills"],
        sections: {
          explanation: lesson.content_md || "",
          quickTips: [],
          examples: [],
          summary: [],
        },
      };
    } catch {
      return multiplicationModule.lessons[0];
    }
  }

  /**
   * Fetch user completion progress for a module
   */
  async getUserModuleProgress(userId: string, moduleId: string): Promise<number> {
    if (!userId || userId === "guest") return 0;
    try {
      const supabase = await createClient();
      const { data } = await supabase
        .from("learning_progress")
        .select("completed")
        .eq("user_id", userId)
        .eq("module_id", moduleId);

      if (!data || data.length === 0) return 0;
      const completedCount = data.filter((d) => d.completed).length;
      return Math.round((completedCount / data.length) * 100);
    } catch {
      return 0;
    }
  }
}
