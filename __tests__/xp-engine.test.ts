export function calculateLevelFromXP(totalXP: number): number {
  if (totalXP <= 0) return 1;
  return Math.floor(Math.sqrt(totalXP / 50)) + 1;
}

// Self-executing assertion check
export function runXPEngineTests() {
  const l1 = calculateLevelFromXP(0);
  if (l1 !== 1) throw new Error("XP test 1 failed");

  const l2 = calculateLevelFromXP(200);
  if (l2 !== 3) throw new Error("XP test 2 failed");

  return true;
}
