import {
  ColumnWorkCurvePoint,
  KraepelinColumnData,
  KraepelinMetrics,
  KraepelinMode,
} from "../types";

export class KraepelinEvaluator {
  /**
   * Evaluate complete Kraepelin / Pauli test columns and return psychometric metrics
   */
  static evaluate(columns: KraepelinColumnData[], mode: KraepelinMode): KraepelinMetrics {
    let totalQuestions = 0;
    let totalAnswered = 0;
    let totalCorrect = 0;
    let totalErrors = 0;
    let totalSkipped = 0;

    const columnWorkCurve: ColumnWorkCurvePoint[] = [];
    const answeredPerCol: number[] = [];

    columns.forEach((col, idx) => {
      totalQuestions += col.pairs.length;
      let colCorrect = 0;
      let colErrors = 0;
      let colAnswered = 0;

      col.pairs.forEach((p) => {
        if (p.userAnswer !== null) {
          colAnswered++;
          if (p.isCorrect) {
            colCorrect++;
          } else {
            colErrors++;
          }
        }
      });

      totalAnswered += colAnswered;
      totalCorrect += colCorrect;
      totalErrors += colErrors;
      totalSkipped += col.pairs.length - colAnswered;

      answeredPerCol.push(colAnswered);

      const colAccuracy = colAnswered > 0 ? Math.round((colCorrect / colAnswered) * 100) : 0;
      columnWorkCurve.push({
        column: idx + 1,
        answeredCount: colAnswered,
        correctCount: colCorrect,
        errorCount: colErrors,
        accuracy: colAccuracy,
      });
    });

    const accuracyPercent = totalAnswered > 0 ? Math.round((totalCorrect / totalAnswered) * 100) : 0;
    const errorRate = totalAnswered > 0 ? Number(((totalErrors / totalAnswered) * 100).toFixed(1)) : 0;

    // 1. Panker (Kecepatan Kerja)
    const columnCount = Math.max(1, columns.length);
    const averagePerColumn = Number((totalAnswered / columnCount).toFixed(1));
    const highestPerColumn = answeredPerCol.length > 0 ? Math.max(...answeredPerCol) : 0;
    const lowestPerColumn = answeredPerCol.length > 0 ? Math.min(...answeredPerCol) : 0;

    let pankerGrade: KraepelinMetrics["panker"]["grade"] = "Average";
    let pankerGradeId: KraepelinMetrics["panker"]["gradeId"] = "Cukup";

    if (averagePerColumn >= 20) {
      pankerGrade = "Very High";
      pankerGradeId = "Sangat Tinggi";
    } else if (averagePerColumn >= 14) {
      pankerGrade = "High";
      pankerGradeId = "Tinggi";
    } else if (averagePerColumn >= 8) {
      pankerGrade = "Average";
      pankerGradeId = "Cukup";
    } else {
      pankerGrade = "Low";
      pankerGradeId = "Kurang";
    }

    // 2. Tianker (Ketelitian Kerja)
    let tiankerGrade: KraepelinMetrics["tianker"]["grade"] = "Good";
    let tiankerGradeId: KraepelinMetrics["tianker"]["gradeId"] = "Baik";

    if (accuracyPercent >= 95) {
      tiankerGrade = "Excellent";
      tiankerGradeId = "Sangat Teliti";
    } else if (accuracyPercent >= 85) {
      tiankerGrade = "Good";
      tiankerGradeId = "Baik";
    } else if (accuracyPercent >= 75) {
      tiankerGrade = "Needs Attention";
      tiankerGradeId = "Perlu Perhatian";
    } else {
      tiankerGrade = "High Error Risk";
      tiankerGradeId = "Beresiko Tinggi";
    }

    // 3. Stanker (Kestabilan Ritme)
    const variance =
      answeredPerCol.reduce((acc, val) => acc + Math.pow(val - averagePerColumn, 2), 0) /
      columnCount;
    const standardDeviation = Number(Math.sqrt(variance).toFixed(2));
    const stabilityIndex = Math.max(0, Math.min(100, Math.round(100 - standardDeviation * 15)));

    let stankerGrade: KraepelinMetrics["stanker"]["grade"] = "Stable";
    let stankerGradeId: KraepelinMetrics["stanker"]["gradeId"] = "Stabil";

    if (standardDeviation <= 1.5) {
      stankerGrade = "Very Stable";
      stankerGradeId = "Sangat Stabil";
    } else if (standardDeviation <= 3.0) {
      stankerGrade = "Stable";
      stankerGradeId = "Stabil";
    } else if (standardDeviation <= 4.5) {
      stankerGrade = "Fluctuating";
      stankerGradeId = "Fluktuatif";
    } else {
      stankerGrade = "Unstable";
      stankerGradeId = "Tidak Stabil";
    }

    // 4. Hankel (Ketahanan Kerja / Work Curve Slope)
    // Linear regression on answered counts
    let sumX = 0;
    let sumY = 0;
    let sumXY = 0;
    let sumX2 = 0;
    const n = answeredPerCol.length;

    for (let i = 0; i < n; i++) {
      const x = i + 1;
      const y = answeredPerCol[i];
      sumX += x;
      sumY += y;
      sumXY += x * y;
      sumX2 += x * x;
    }

    const denominator = n * sumX2 - sumX * sumX;
    const trendSlope = denominator !== 0 ? Number(((n * sumXY - sumX * sumY) / denominator).toFixed(2)) : 0;

    let trendType: KraepelinMetrics["hankel"]["trendType"] = "Steady";
    let trendTypeId: KraepelinMetrics["hankel"]["trendTypeId"] = "Mendatar (Konsisten)";

    if (trendSlope > 0.15) {
      trendType = "Ascending";
      trendTypeId = "Menaik (Daya Tahan Tinggi)";
    } else if (trendSlope < -0.15) {
      trendType = "Descending";
      trendTypeId = "Menurun (Mengalami Kelelahan)";
    } else {
      trendType = "Steady";
      trendTypeId = "Mendatar (Konsisten)";
    }

    // Detect noticeable drop column (fatigue point)
    let fatiguePointColumn: number | null = null;
    for (let i = 1; i < answeredPerCol.length; i++) {
      if (answeredPerCol[i] < averagePerColumn - standardDeviation && answeredPerCol[i] < answeredPerCol[i - 1] - 3) {
        fatiguePointColumn = i + 1;
        break;
      }
    }

    // Qualitative interpretations
    const interpretation = this.generateInterpretation({
      mode,
      pankerGradeId,
      tiankerGradeId,
      stankerGradeId,
      trendTypeId,
      averagePerColumn,
      accuracyPercent,
      errorCount: totalErrors,
    });

    return {
      mode,
      totalQuestions,
      totalAnswered,
      totalCorrect,
      totalErrors,
      totalSkipped,
      accuracyPercent,
      panker: {
        totalAnswered,
        averagePerColumn,
        highestPerColumn,
        lowestPerColumn,
        grade: pankerGrade,
        gradeId: pankerGradeId,
      },
      tianker: {
        accuracyPercent,
        errorRate,
        grade: tiankerGrade,
        gradeId: tiankerGradeId,
      },
      stanker: {
        standardDeviation,
        stabilityIndex,
        grade: stankerGrade,
        gradeId: stankerGradeId,
      },
      hankel: {
        trendSlope,
        trendType,
        trendTypeId,
        fatiguePointColumn,
      },
      columnWorkCurve,
      interpretation,
    };
  }

  private static generateInterpretation(params: {
    mode: KraepelinMode;
    pankerGradeId: string;
    tiankerGradeId: string;
    stankerGradeId: string;
    trendTypeId: string;
    averagePerColumn: number;
    accuracyPercent: number;
    errorCount: number;
  }) {
    const { pankerGradeId, tiankerGradeId, stankerGradeId, trendTypeId, averagePerColumn, accuracyPercent } = params;

    let speedSummary = `Rata-rata output kerja mencapai ${averagePerColumn} pasangan per kolom (${pankerGradeId}). `;
    if (averagePerColumn >= 16) {
      speedSummary += "Kecepatan kalkulasi Anda sangat kompetitif dan berada di atas rata-rata standar seleksi kerja.";
    } else {
      speedSummary += "Kecepatan cukup baik dan masih dapat ditingkatkan dengan melatih refleks penjumlahan satuan (1-9).";
    }

    let accuracySummary = `Akurasi kalkulasi sebesar ${accuracyPercent}% (${tiankerGradeId}). `;
    if (accuracyPercent >= 90) {
      accuracySummary += "Tingkat ketelitian tinggi menunjukkan konsentrasi yang fokus dan disiplin mental yang kuat.";
    } else {
      accuracySummary += "Terdapat beberapa kesalahan acak. Disarankan menjaga ketelitian sebelum menambah kecepatan.";
    }

    let rhythmSummary = `Ritme kerja dinilai ${stankerGradeId}. `;
    if (stankerGradeId.includes("Stabil")) {
      rhythmSummary += "Anda mampu mempertahankan tempo kerja yang seragam tanpa mudah panik oleh batas waktu.";
    } else {
      rhythmSummary += "Terdapat fluktuasi output antar kolom. Latihlah pernapasan agar ritme kerja tidak terburu-buru.";
    }

    let staminaSummary = `Kurva performa menunjukkan tren ${trendTypeId}. `;
    if (trendTypeId.includes("Menaik")) {
      staminaSummary += "Daya adaptasi mental Anda tinggi; semakin lama tes berjalan, fokus dan output Anda justru semakin meningkat.";
    } else if (trendTypeId.includes("Menurun")) {
      staminaSummary += "Terlihat adanya efek kelelahan (fatigue) pada kolom-kolom akhir. Jagalah stamina fisik dan fokus rileks.";
    } else {
      staminaSummary += "Stamina kerja Anda konsisten dari kolom awal hingga kolom akhir.";
    }

    const overallRecommendation =
      accuracyPercent >= 85 && averagePerColumn >= 14
        ? "Profil psikotes Anda sangat prima! Pertahankan pola konsentrasi ini dengan latihan harian 1 sesi (5–10 menit)."
        : "Fokuskan latihan berikutnya pada ketelitian digit satuan (0–9) agar tidak ada pengurangan poin ketelitian.";

    return {
      speedSummary,
      accuracySummary,
      rhythmSummary,
      staminaSummary,
      overallRecommendation,
    };
  }
}
