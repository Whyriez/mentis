import { KraepelinColumnData, KraepelinConfig, KraepelinPair } from "../types";

export class KraepelinGenerator {
  /**
   * Generate an authentic set of test columns with realistic psychometric randomness
   */
  static generateTest(config: KraepelinConfig): KraepelinColumnData[] {
    const columns: KraepelinColumnData[] = [];
    const count = Math.max(1, config.columnCount);
    const numCount = Math.max(10, config.numbersPerColumn);

    for (let c = 0; c < count; c++) {
      const numbers = this.generateColumnNumbers(numCount);
      const pairs = this.buildPairs(numbers, config.mode);

      columns.push({
        columnIndex: c,
        numbers,
        pairs,
        answeredCount: 0,
        correctCount: 0,
        errorCount: 0,
        skippedCount: 0,
      });
    }

    return columns;
  }

  /**
   * Generate vertical single-digit numbers (1 to 9) avoiding identical trios
   */
  private static generateColumnNumbers(length: number): number[] {
    const nums: number[] = [];
    let last = 0;
    let secondLast = 0;

    for (let i = 0; i < length; i++) {
      let candidate: number;
      let attempts = 0;
      do {
        // Random 1 to 9
        candidate = Math.floor(Math.random() * 9) + 1;
        attempts++;
      } while (
        attempts < 10 &&
        ((candidate === last && candidate === secondLast) || // Avoid 3 consecutive identical digits
          (last !== 0 && candidate + last === 10 && Math.random() < 0.3)) // Balance out obvious complements of 10
      );

      nums.push(candidate);
      secondLast = last;
      last = candidate;
    }

    return nums;
  }

  /**
   * Build calculation pairs from column numbers
   */
  private static buildPairs(numbers: number[], mode: "kraepelin" | "pauli"): KraepelinPair[] {
    const pairs: KraepelinPair[] = [];
    const pairCount = numbers.length - 1;

    if (mode === "kraepelin") {
      // Kraepelin: calculated from BOTTOM to TOP
      // Bottom-most pair is pairIndex 0: between numbers[numbers.length - 2] and numbers[numbers.length - 1]
      for (let i = 0; i < pairCount; i++) {
        const bottomIndex = numbers.length - 1 - i;
        const topIndex = bottomIndex - 1;
        const numBottom = numbers[bottomIndex];
        const numTop = numbers[topIndex];
        const correctAnswer = (numTop + numBottom) % 10;

        pairs.push({
          pairIndex: i,
          num1: numTop,
          num2: numBottom,
          correctAnswer,
          userAnswer: null,
          isCorrect: null,
          timeTakenMs: 0,
        });
      }
    } else {
      // Pauli: calculated from TOP to BOTTOM
      // Top-most pair is pairIndex 0: between numbers[0] and numbers[1]
      for (let i = 0; i < pairCount; i++) {
        const topIndex = i;
        const bottomIndex = i + 1;
        const numTop = numbers[topIndex];
        const numBottom = numbers[bottomIndex];
        const correctAnswer = (numTop + numBottom) % 10;

        pairs.push({
          pairIndex: i,
          num1: numTop,
          num2: numBottom,
          correctAnswer,
          userAnswer: null,
          isCorrect: null,
          timeTakenMs: 0,
        });
      }
    }

    return pairs;
  }
}
