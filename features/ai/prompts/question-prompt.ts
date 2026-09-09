export function buildQuestionPrompt(
  moduleSlug: string,
  difficulty: "Easy" | "Medium" | "Hard",
  count: number
): string {
  return `
You are an expert psychometric test designer creating mental math drills for the module "${moduleSlug}".
Generate ${count} high-quality, speed-oriented multiple-choice questions for difficulty level "${difficulty}".

Return ONLY valid JSON matching this structure:
[
  {
    "category": "${moduleSlug}",
    "difficulty": "${difficulty}",
    "question": "Question text here",
    "options": ["Option 1", "Option 2", "Option 3", "Option 4"],
    "answer": "Option 1",
    "explanation": "Step-by-step mental shortcut solution explanation.",
    "estimatedSeconds": ${difficulty === "Easy" ? 10 : difficulty === "Medium" ? 7 : 4},
    "tags": ["mental-math", "${moduleSlug}", "speed-drill"]
  }
]

Rules:
1. Options must contain exactly 4 choices.
2. The "answer" field MUST exactly match one of the items in "options".
3. Provide step-by-step explanations focusing on mental math shortcuts.
4. Do not include markdown codeblock backticks outside JSON.
`;
}
