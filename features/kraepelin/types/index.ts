export type KraepelinMode = "kraepelin" | "pauli";

export interface KraepelinConfig {
  mode: KraepelinMode;
  columnCount: number;
  numbersPerColumn: number;
  secondsPerColumn: number;
  soundEnabled: boolean;
}

export interface KraepelinPair {
  pairIndex: number;
  num1: number; // Top number in vertical pair
  num2: number; // Bottom number in vertical pair
  correctAnswer: number; // (num1 + num2) % 10
  userAnswer: number | null;
  isCorrect: boolean | null;
  timeTakenMs: number;
}

export interface KraepelinColumnData {
  columnIndex: number;
  numbers: number[]; // Array of single digits (e.g. 25-35 numbers)
  pairs: KraepelinPair[]; // (numbers.length - 1) calculation pairs
  answeredCount: number;
  correctCount: number;
  errorCount: number;
  skippedCount: number;
}

export interface ColumnWorkCurvePoint {
  column: number;
  answeredCount: number;
  correctCount: number;
  errorCount: number;
  accuracy: number;
}

export interface KraepelinMetrics {
  mode: KraepelinMode;
  totalQuestions: number;
  totalAnswered: number;
  totalCorrect: number;
  totalErrors: number;
  totalSkipped: number;
  accuracyPercent: number;
  
  // 4 Core Psychometric Pillars
  panker: {
    totalAnswered: number;
    averagePerColumn: number;
    highestPerColumn: number;
    lowestPerColumn: number;
    grade: "Very High" | "High" | "Average" | "Low";
    gradeId: "Sangat Tinggi" | "Tinggi" | "Cukup" | "Kurang";
  };
  tianker: {
    accuracyPercent: number;
    errorRate: number;
    grade: "Excellent" | "Good" | "Needs Attention" | "High Error Risk";
    gradeId: "Sangat Teliti" | "Baik" | "Perlu Perhatian" | "Beresiko Tinggi";
  };
  stanker: {
    standardDeviation: number;
    stabilityIndex: number; // 0 - 100
    grade: "Very Stable" | "Stable" | "Fluctuating" | "Unstable";
    gradeId: "Sangat Stabil" | "Stabil" | "Fluktuatif" | "Tidak Stabil";
  };
  hankel: {
    trendSlope: number; // Positive = endurance climbing, flat = steady, negative = fatigue
    trendType: "Ascending" | "Steady" | "Descending";
    trendTypeId: "Menaik (Daya Tahan Tinggi)" | "Mendatar (Konsisten)" | "Menurun (Mengalami Kelelahan)";
    fatiguePointColumn: number | null;
  };

  columnWorkCurve: ColumnWorkCurvePoint[];
  interpretation: {
    speedSummary: string;
    accuracySummary: string;
    rhythmSummary: string;
    staminaSummary: string;
    overallRecommendation: string;
  };
}
