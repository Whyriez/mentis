export function calculateRecommendedPace(targetMonths: number, dailyMinutes: number) {
  const totalTargetHours = targetMonths * 30 * (dailyMinutes / 60);
  if (totalTargetHours >= 60) return "Accelerated Mastery";
  if (totalTargetHours >= 30) return "Balanced Study";
  return "Casual Practice";
}

// Self-executing assertion check
export function runRoadmapEngineTests() {
  const p1 = calculateRecommendedPace(3, 60);
  if (p1 !== "Accelerated Mastery") throw new Error("Roadmap test 1 failed");

  const p2 = calculateRecommendedPace(1, 15);
  if (p2 !== "Casual Practice") throw new Error("Roadmap test 2 failed");

  return true;
}
