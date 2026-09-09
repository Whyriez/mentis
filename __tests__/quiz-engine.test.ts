export function calculateQuizScore(correctCount: number, totalQuestions: number, avgTimeSeconds: number) {
  if (totalQuestions === 0) return { scorePercentage: 0, speedBonus: 0, finalXP: 0 };
  const scorePercentage = Math.round((correctCount / totalQuestions) * 100);
  const speedBonus = avgTimeSeconds < 15 ? 15 : avgTimeSeconds < 30 ? 5 : 0;
  const baseXP = scorePercentage * 0.5;
  const finalXP = Math.round(baseXP + speedBonus);
  return { scorePercentage, speedBonus, finalXP };
}

// Self-executing assertion check
export function runQuizEngineTests() {
  const t1 = calculateQuizScore(10, 10, 12);
  if (t1.scorePercentage !== 100 || t1.finalXP !== 65) throw new Error("Quiz test 1 failed");

  const t2 = calculateQuizScore(0, 0, 20);
  if (t2.scorePercentage !== 0 || t2.finalXP !== 0) throw new Error("Quiz test 2 failed");

  return true;
}
