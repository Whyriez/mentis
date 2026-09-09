export function buildHintPrompt(
  questionText: string,
  solutionAnswer: string
): string {
  return `
Create progressive hints for the math problem "${questionText}" with answer "${solutionAnswer}".

Return ONLY valid JSON matching this structure:
{
  "level1": "Small clue pointing to the first calculation step without revealing numbers.",
  "level2": "Intermediate guidance breaking down the equation setup.",
  "level3": "Near-complete calculation steps guiding directly to the answer."
}
`;
}
