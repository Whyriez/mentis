import { AIPrompt, AIPromptCategory } from "../types";

export class PromptLibrary {
  private prompts: AIPrompt[] = [
    {
      id: "prompt-q-v1",
      name: "Standard Psychometric Question Generator",
      category: "Question Prompt",
      version: 1,
      template: `Generate {{amount}} multiple choice psychometric drill questions for module "{{moduleTitle}}" with difficulty "{{difficulty}}". Output strict JSON format containing question, options array, correctAnswer, and detailed explanation.`,
      isActive: true,
      updatedAt: "2026-08-01",
    },
    {
      id: "prompt-l-v1",
      name: "Structured Lesson Builder",
      category: "Lesson Prompt",
      version: 1,
      template: `Build a structured lesson for module "{{moduleTitle}}". Include Title, Summary, and Section Blocks (Heading, Paragraph, Formula, Worked Example, Quick Tip). Output strict JSON.`,
      isActive: true,
      updatedAt: "2026-08-01",
    },
    {
      id: "prompt-e-v1",
      name: "Step-by-Step Explanation Generator",
      category: "Explanation Prompt",
      version: 1,
      template: `Generate step-by-step mental calculation explanation for question "{{questionText}}". Explain shortcuts clearly for time-bound drills.`,
      isActive: true,
      updatedAt: "2026-08-01",
    },
    {
      id: "prompt-h-v1",
      name: "Progressive Drill Hint Generator",
      category: "Hint Prompt",
      version: 1,
      template: `Generate 2 progressive hints for question "{{questionText}}". Hint 1: General mental strategy. Hint 2: Immediate numerical step.`,
      isActive: true,
      updatedAt: "2026-08-01",
    },
  ];

  getActivePrompt(category: AIPromptCategory): AIPrompt {
    return (
      this.prompts.find((p) => p.category === category && p.isActive) ||
      this.prompts[0]
    );
  }

  getAllPrompts(): AIPrompt[] {
    return this.prompts;
  }

  updatePrompt(id: string, newTemplate: string): AIPrompt | null {
    const prompt = this.prompts.find((p) => p.id === id);
    if (!prompt) return null;
    prompt.version += 1;
    prompt.template = newTemplate;
    prompt.updatedAt = new Date().toISOString().split("T")[0];
    return prompt;
  }
}
