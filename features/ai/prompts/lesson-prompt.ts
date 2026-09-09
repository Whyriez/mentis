export function buildLessonPrompt(
  moduleSlug: string,
  topicTitle: string
): string {
  return `
You are an expert psychometric instructor drafting a mental math lesson on "${topicTitle}" for module "${moduleSlug}".

Return ONLY valid JSON matching this structure:
{
  "title": "${topicTitle}",
  "moduleSlug": "${moduleSlug}",
  "introduction": "Concise overview of why this speed trick is important for psychometric exams.",
  "explanation": "Clear breakdown of the underlying mathematical logic.",
  "mentalMathTrick": "The exact step-by-step formula for fast mental computation.",
  "examples": [
    {
      "problem": "Example math problem",
      "solution": "Final answer",
      "explanation": "Step-by-step mental calculation steps."
    }
  ],
  "summary": [
    "Key takeaway point 1",
    "Key takeaway point 2"
  ],
  "practiceTips": [
    "Tip for increasing calculation speed"
  ]
}
`;
}
