import { createClient } from "@/lib/supabase/client";
import { ModuleItem, ContentStatus } from "../types";

export class ModuleService {
  /**
   * Fetch all modules with optional search and filters
   */
  async getModules(query?: {
    search?: string;
    status?: ContentStatus;
    difficulty?: string;
  }): Promise<ModuleItem[]> {
    try {
      const supabase = createClient();
      let req = supabase.from("modules").select("*, lessons(count)").order("order_index", { ascending: true });

      if (query?.search) {
        req = req.ilike("title", `%${query.search}%`);
      }
      if (query?.difficulty) {
        req = req.eq("difficulty", query.difficulty);
      }

      const { data, error } = await req;

      if (error || !data || data.length === 0) {
        return this.getFallbackModules();
      }

      const moduleList = data as unknown as Array<{
        id: string;
        title: string;
        slug: string;
        description?: string;
        difficulty?: string;
        order_index?: number;
        lessons?: Array<{ count?: number }>;
        created_at?: string;
      }>;
      return moduleList.map((m) => ({
        id: m.id,
        title: m.title,
        slug: m.slug,
        description: m.description || "",
        difficulty: m.difficulty as ModuleItem["difficulty"],
        estimatedMinutes: 30,
        icon: "Brain",
        color: "primary",
        orderIndex: m.order_index || 1,
        status: "Published",
        isActive: true,
        lessonsCount: (Array.isArray(m.lessons) && m.lessons[0]?.count != null) ? m.lessons[0].count : 3,
        updatedAt: m.created_at ? new Date(m.created_at).toLocaleDateString() : "Today",
      }));
    } catch {
      return this.getFallbackModules();
    }
  }

  /**
   * Get single module by ID
   */
  async getModuleById(id: string): Promise<ModuleItem | null> {
    const modules = await this.getModules();
    return modules.find((m) => m.id === id) || null;
  }

  /**
   * Fallback default modules for development & initial setup
   */
  private getFallbackModules(): ModuleItem[] {
    return [
      {
        id: "mod-multiplication",
        title: "Mental Multiplication & Speed Drills",
        slug: "multiplication",
        description: "Master rapid double-digit and triple-digit multiplication using mental shortcuts.",
        difficulty: "Intermediate",
        estimatedMinutes: 45,
        icon: "Zap",
        color: "amber",
        orderIndex: 1,
        status: "Published",
        isActive: true,
        lessonsCount: 4,
        updatedAt: "Today",
      },
      {
        id: "mod-division",
        title: "Division & Fraction Estimation",
        slug: "division",
        description: "Fast division techniques and ratio conversions for time-bound tests.",
        difficulty: "Advanced",
        estimatedMinutes: 60,
        icon: "Calculator",
        color: "blue",
        orderIndex: 2,
        status: "Draft",
        isActive: true,
        lessonsCount: 2,
        updatedAt: "Yesterday",
      },
    ];
  }
}
