import { AIContentType } from "../types";
import { GeminiKeyRotator } from "./gemini-rotator";

export interface GeminiGenerationResult {
  contentJson: any[];
  rawText: string;
  keyIndex: number;
  maskedKey: string;
  modelUsed: string;
  totalTokens: number;
  latencyMs: number;
}

export class GeminiService {
  private rotator = GeminiKeyRotator.getInstance();

  /**
   * Normalize user requested model name to valid Gemini API model identifier
   */
  private normalizeModelName(requestedModel: string): string {
    const lower = requestedModel.toLowerCase().trim();
    if (lower.includes("pro")) {
      return "gemini-3.5-pro";
    }
    return "gemini-3.5-flash";
  }

  /**
   * Construct prompt for Gemini based on content type, module info, difficulty, and amount
   */
  private buildPrompt(params: {
    contentType: AIContentType;
    moduleTitle: string;
    difficulty: "Easy" | "Medium" | "Hard";
    amount: number;
    customPromptTemplate?: string;
    targetQuestions?: Array<{ id: string; question: string; options?: string[]; answer?: string }>;
  }): string {
    const { contentType, moduleTitle, difficulty, amount, customPromptTemplate, targetQuestions } = params;

    if (customPromptTemplate) {
      return customPromptTemplate
        .replace(/{{amount}}/g, String(amount))
        .replace(/{{moduleTitle}}/g, moduleTitle)
        .replace(/{{difficulty}}/g, difficulty);
    }

    switch (contentType) {
      case "Questions":
        return `You are an expert psychometric test and mental math drill author for Mentis App.
Generate exactly ${amount} high-quality multiple choice question(s) for the module "${moduleTitle}" with difficulty "${difficulty}".
Output MUST be a JSON array of objects. Each object must strictly match this schema:
[
  {
    "question": "Clear, precise problem statement (e.g. What is 54 × 11?)",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correctAnswer": "Exact matching string from options array",
    "explanation": "Step-by-step mental calculation shortcut and reasoning",
    "difficulty": "${difficulty}",
    "category": "${moduleTitle}"
  }
]
Requirements:
1. Exactly 4 unique options per question.
2. The correctAnswer MUST be identical to one of the 4 items in options array.
3. Keep explanation concise, focusing on speed techniques and mental math shortcuts.
4. Format all math exponents, roots, and operators cleanly (e.g. 75² or 75^2, √144, 378 ÷ 6, 45 × 12). Avoid awkward text formatting like (7^92).
5. Output valid JSON only, without markdown formatting wrappers if possible.`;

      case "Lessons":
        return `You are an expert instructional designer for Mentis App.
Generate EXACTLY ${amount} unique structured lesson guide(s) for the module "${moduleTitle}" with target difficulty "${difficulty}".
Output MUST be a JSON array containing EXACTLY ${amount} object(s) matching this schema:
[
  {
    "title": "Engaging Lesson Title",
    "summary": "Brief summary of key mental shortcuts and core concepts",
    "estimatedMinutes": 5,
    "sections": [
      { "type": "heading", "content": "Core Mental Technique" },
      { "type": "paragraph", "content": "Step-by-step theoretical breakdown..." },
      { "type": "example", "content": "Worked example problem and fast solution..." }
    ]
  }
]
Requirements:
1. Return EXACTLY ${amount} unique lesson objects in the array.
2. Output valid JSON only.`;

      case "Explanations": {
        if (targetQuestions && targetQuestions.length > 0) {
          return `You are an expert psychometric math tutor for Mentis App.
Below are ${targetQuestions.length} existing question(s) from module "${moduleTitle}":
${JSON.stringify(targetQuestions, null, 2)}

Generate detailed, step-by-step mental calculation shortcut explanations tailored specifically to each of these exact questions.
Output MUST be a JSON array of objects matching this schema:
[
  {
    "questionId": "ID of target question from list above",
    "question": "Original question text",
    "explanation": "Detailed step-by-step mental calculation shortcut and reasoning tailored to this exact question",
    "stepTitle": "Mental Calculation Trick"
  }
]
Output valid JSON only.`;
        }
        return `You are a mental arithmetic tutor.
Generate ${amount} detailed step-by-step solution breakdown(s) for psychometric problems in module "${moduleTitle}" at "${difficulty}" difficulty.
Output MUST be a JSON array of objects:
[
  {
    "stepTitle": "Step Breakdown Title",
    "detail": "Detailed mental decomposition technique and trick",
    "difficulty": "${difficulty}"
  }
]
Output valid JSON only.`;
      }

      case "Hints": {
        if (targetQuestions && targetQuestions.length > 0) {
          return `You are an expert psychometric math tutor for Mentis App.
Below are ${targetQuestions.length} existing question(s) from module "${moduleTitle}":
${JSON.stringify(targetQuestions, null, 2)}

Generate progressive hint sets (Hint 1 and Hint 2) tailored specifically to help users solve each of these exact questions.
Output MUST be a JSON array of objects matching this schema:
[
  {
    "questionId": "ID of target question from list above",
    "question": "Original question text",
    "hintTitle": "Mental Strategy Direction",
    "hint1": "High-level mental strategy direction for this question",
    "hint2": "Immediate numerical shortcut step for this question"
  }
]
Output valid JSON only.`;
        }
        return `Generate ${amount} progressive hint set(s) for psychometric drill problems in module "${moduleTitle}".
Output MUST be a JSON array of objects:
[
  {
    "hintTitle": "Drill Strategy Hint",
    "hint1": "High-level mental strategy direction",
    "hint2": "Immediate numerical shortcut step"
  }
]
Output valid JSON only.`;
      }

      default:
        return `Generate ${amount} items for module "${moduleTitle}". Return JSON array.`;
    }
  }

  /**
   * Perform live generation call to Gemini REST API with automatic key rotation
   */
  public async generateContent(params: {
    contentType: AIContentType;
    moduleTitle: string;
    difficulty: "Easy" | "Medium" | "Hard";
    amount: number;
    model: string;
    temperature: number;
    customPromptTemplate?: string;
    targetQuestions?: Array<{ id: string; question: string; options?: string[]; answer?: string }>;
  }): Promise<GeminiGenerationResult> {
    const targetModel = this.normalizeModelName(params.model);
    const prompt = this.buildPrompt({
      contentType: params.contentType,
      moduleTitle: params.moduleTitle,
      difficulty: params.difficulty,
      amount: params.amount,
      customPromptTemplate: params.customPromptTemplate,
      targetQuestions: params.targetQuestions,
    });

    const startTime = Date.now();

    // Execute through Key Rotator
    const { result, keyIndex, maskedKey } = await this.rotator.executeWithRotation(
      async (apiKey: string, _kIdx: number, _mKey: string) => {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${targetModel}:generateContent?key=${apiKey}`;

        const payload = {
          contents: [
            {
              parts: [{ text: prompt }],
            },
          ],
          generationConfig: {
            temperature: params.temperature,
            responseMimeType: "application/json",
          },
        };

        const res = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (!res.ok) {
          const errBody = await res.text();
          if (res.status === 429 || res.status === 403 || res.status === 503) {
            throw new Error(`Gemini API HTTP ${res.status}: ${errBody}`);
          }

          const fallbackUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent?key=${apiKey}`;
          const fallbackRes = await fetch(fallbackUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          });

          if (!fallbackRes.ok) {
            const fallbackErr = await fallbackRes.text();
            throw new Error(`Gemini API Fallback Failed HTTP ${fallbackRes.status}: ${fallbackErr}`);
          }
          return await fallbackRes.json();
        }

        return await res.json();
      }
    );

    const latencyMs = Date.now() - startTime;

    // Parse JSON output from Gemini response
    let rawText = "";
    try {
      const candidates = result.candidates;
      if (candidates && candidates.length > 0 && candidates[0].content?.parts?.length > 0) {
        rawText = candidates[0].content.parts[0].text || "";
      }
    } catch (e) {
      console.error("[GeminiService] Failed to extract text from candidates:", e);
    }

    let contentJson: any[] = [];
    try {
      const cleanedText = rawText.replace(/```json/g, "").replace(/```/g, "").trim();
      const parsed = JSON.parse(cleanedText);
      contentJson = Array.isArray(parsed) ? parsed : [parsed];
    } catch {
      console.warn("[GeminiService] Failed to parse JSON, returning wrapped raw output");
      contentJson = [
        {
          title: `${params.contentType} Output`,
          question: rawText,
          rawOutput: rawText,
        },
      ];
    }

    const totalTokens = result.usageMetadata?.totalTokenCount || Math.round(prompt.length / 4) + 200;

    return {
      contentJson,
      rawText,
      keyIndex,
      maskedKey,
      modelUsed: "gemini-3.5-flash",
      totalTokens,
      latencyMs,
    };
  }

  /**
   * Get active status of all API keys in the rotation pool
   */
  public getKeyStatuses() {
    return this.rotator.getKeyStatuses();
  }
}
