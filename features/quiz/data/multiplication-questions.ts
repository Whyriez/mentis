import { Question } from "../types";

export const staticMultiplicationQuestions: Question[] = [
  {
    id: "q-101",
    moduleId: "mod-multiplication",
    lessonId: "lesson-1",
    category: "Multiplication by 11",
    difficulty: "Easy",
    question: "What is 35 × 11?",
    options: ["375", "385", "395", "405"],
    answer: "385",
    explanation: "Using the 11-sandwich rule: 3 + 5 = 8. Insert 8 between 3 and 5 to get 385.",
    estimatedSeconds: 5,
  },
  {
    id: "q-102",
    moduleId: "mod-multiplication",
    lessonId: "lesson-1",
    category: "Multiplication by 11",
    difficulty: "Easy",
    question: "What is 52 × 11?",
    options: ["562", "572", "582", "592"],
    answer: "572",
    explanation: "5 + 2 = 7. Sandwich 7 between 5 and 2 to get 572.",
    estimatedSeconds: 5,
  },
  {
    id: "q-103",
    moduleId: "mod-multiplication",
    lessonId: "lesson-1",
    category: "Multiplication by 11",
    difficulty: "Medium",
    question: "What is 78 × 11?",
    options: ["848", "858", "868", "878"],
    answer: "858",
    explanation: "7 + 8 = 15. Keep 5 in the middle and carry 1 to 7 (7 + 1 = 8), giving 858.",
    estimatedSeconds: 8,
  },
  {
    id: "q-104",
    moduleId: "mod-multiplication",
    lessonId: "lesson-2",
    category: "Squaring Ending in 5",
    difficulty: "Easy",
    question: "What is 45² (45 × 45)?",
    options: ["1825", "1925", "2025", "2125"],
    answer: "2025",
    explanation: "N = 4. Calculate N × (N + 1) = 4 × 5 = 20. Append 25 to get 2025.",
    estimatedSeconds: 5,
  },
  {
    id: "q-105",
    moduleId: "mod-multiplication",
    lessonId: "lesson-2",
    category: "Squaring Ending in 5",
    difficulty: "Easy",
    question: "What is 65² (65 × 65)?",
    options: ["4125", "4225", "4325", "4425"],
    answer: "4225",
    explanation: "N = 6. Calculate 6 × 7 = 42. Append 25 to get 4225.",
    estimatedSeconds: 5,
  },
  {
    id: "q-106",
    moduleId: "mod-multiplication",
    lessonId: "lesson-2",
    category: "Squaring Ending in 5",
    difficulty: "Medium",
    question: "What is 85² (85 × 85)?",
    options: ["7125", "7225", "7325", "7425"],
    answer: "7225",
    explanation: "N = 8. Calculate 8 × 9 = 72. Append 25 to get 7225.",
    estimatedSeconds: 6,
  },
  {
    id: "q-107",
    moduleId: "mod-multiplication",
    lessonId: "lesson-3",
    category: "Near Base 100",
    difficulty: "Medium",
    question: "What is 96 × 97?",
    options: ["9212", "9312", "9412", "9512"],
    answer: "9312",
    explanation: "Deviations are -4 and -3. Left part: 96 - 3 = 93. Right part: (-4) × (-3) = 12. Combined: 9312.",
    estimatedSeconds: 8,
  },
  {
    id: "q-108",
    moduleId: "mod-multiplication",
    lessonId: "lesson-3",
    category: "Near Base 100",
    difficulty: "Hard",
    question: "What is 94 × 98?",
    options: ["9112", "9212", "9312", "9412"],
    answer: "9212",
    explanation: "Deviations are -6 and -2. Left part: 94 - 2 = 92. Right part: (-6) × (-2) = 12. Combined: 9212.",
    estimatedSeconds: 10,
  },
];

export function getMultiplicationQuestions(
  difficulty: "Easy" | "Medium" | "Hard" = "Medium",
  count: number = 10
): Question[] {
  // Filter by difficulty or return shuffled pool
  let pool = staticMultiplicationQuestions;
  if (difficulty === "Easy") {
    pool = staticMultiplicationQuestions.filter(
      (q) => q.difficulty === "Easy" || q.difficulty === "Medium"
    );
  } else if (difficulty === "Hard") {
    pool = staticMultiplicationQuestions.filter(
      (q) => q.difficulty === "Medium" || q.difficulty === "Hard"
    );
  }

  // Duplicate pool if count requested is larger than static pool
  let result: Question[] = [];
  while (result.length < count) {
    const shuffled = [...pool].sort(() => Math.random() - 0.5);
    result = [...result, ...shuffled];
  }

  return result.slice(0, count).map((q, idx) => ({
    ...q,
    id: `q-session-${idx + 1}-${Date.now()}`,
  }));
}
