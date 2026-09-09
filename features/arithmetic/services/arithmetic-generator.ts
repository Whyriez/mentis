import { Question } from "@/features/quiz/types";
import { Language } from "@/lib/i18n/languages";

export type ArithmeticOperation =
  | "multiplication"
  | "subtraction"
  | "division"
  | "addition"
  | "mixed";

export type ArithmeticTier =
  | "1-10"
  | "1-20"
  | "1-30"
  | "1-50"
  | "1-100"
  | "1-1000";

interface QuestionTemplate {
  problem: string;
  answer: number;
  categoryId: string;
  categoryEn: string;
  explanationId: string;
  explanationEn: string;
  difficulty: "Easy" | "Medium" | "Hard";
}

function randInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function generateDistractors(correctAnswer: number, operation: string): string[] {
  const optionsSet = new Set<number>();
  optionsSet.add(correctAnswer);

  const deltas = [1, -1, 10, -10, 2, -2, 5, -5, 3, -3, 20, -20];
  const shuffledDeltas = shuffleArray(deltas);

  for (const delta of shuffledDeltas) {
    if (optionsSet.size >= 4) break;
    const candidate = correctAnswer + delta;
    if (candidate > 0 && candidate !== correctAnswer) {
      optionsSet.add(candidate);
    }
  }

  // Fallback if not enough options
  let fallbackDelta = 4;
  while (optionsSet.size < 4) {
    const candidate = correctAnswer + fallbackDelta;
    if (candidate > 0 && !optionsSet.has(candidate)) {
      optionsSet.add(candidate);
    }
    fallbackDelta += 3;
  }

  const options = Array.from(optionsSet).map(String);
  return shuffleArray(options);
}

// -------------------------------------------------------------
// MULTIPLICATION GENERATORS
// -------------------------------------------------------------
function generateMultiplicationTier1_10(): QuestionTemplate {
  // Tricky tables heavily weighted (~75% probability for numbers people often hesitate on or forget)
  const highPriority = [
    [7, 8], [8, 7], [6, 7], [7, 6], [8, 9], [9, 8], [6, 8], [8, 6],
    [7, 9], [9, 7], [6, 9], [9, 6], [7, 7], [8, 8], [9, 9], [6, 6],
    [4, 7], [7, 4], [4, 8], [8, 4], [4, 9], [9, 4], [3, 7], [7, 3],
    [3, 8], [8, 3], [3, 9], [9, 3], [4, 6], [6, 4],
  ];

  let a: number;
  let b: number;

  if (Math.random() < 0.75) {
    const pair = highPriority[randInt(0, highPriority.length - 1)];
    a = pair[0];
    b = pair[1];
  } else {
    a = randInt(2, 10);
    b = randInt(2, 10);
  }

  const answer = a * b;
  let hookId = `Trik Hafalan: Hubungkan secara otomatis refleks ${a} × ${b} = ${answer}.`;
  let hookEn = `Memory Recall: Cement automatic neural reflex ${a} × ${b} = ${answer}.`;

  if ((a === 7 && b === 8) || (a === 8 && b === 7)) {
    hookId = "Trik Hafalan Emas: Urutan angka 5, 6, 7, 8 -> 56 = 7 × 8!";
    hookEn = "Golden Memory hook: Sequential numbers 5, 6, 7, 8 -> 56 = 7 × 8!";
  } else if ((a === 6 && b === 7) || (a === 7 && b === 6)) {
    hookId = "Trik Memori: 6 × 7 = 42. (6 × 6 = 36, lalu tambah 6 = 42).";
    hookEn = "Memory helper: 6 × 7 = 42. (6 × 6 = 36, plus 6 = 42).";
  } else if ((a === 6 && b === 8) || (a === 8 && b === 6)) {
    hookId = "Trik Memori: 6 × 8 = 48. Angka genap berakhiran 8! Atau (5 × 8 = 40) + 8 = 48.";
    hookEn = "Memory helper: 6 × 8 = 48. Ends in 8! Or (5 × 8 = 40) + 8 = 48.";
  } else if ((a === 9 && b === 6) || (a === 6 && b === 9)) {
    hookId = "Trik Kali 9: (10 × 6) - 6 = 60 - 6 = 54. Digit 5 + 4 = 9.";
    hookEn = "Times 9 rule: (10 × 6) - 6 = 60 - 6 = 54. Digits 5 + 4 = 9.";
  } else if ((a === 7 && b === 9) || (a === 9 && b === 7)) {
    hookId = "Trik Kali 9: (10 × 7) - 7 = 70 - 7 = 63. Digit 6 + 3 = 9.";
    hookEn = "Times 9 rule: (10 × 7) - 7 = 70 - 7 = 63. Digits 6 + 3 = 9.";
  } else if ((a === 8 && b === 9) || (a === 9 && b === 8)) {
    hookId = "Trik Kali 9: (10 × 8) - 8 = 80 - 8 = 72. Digit 7 + 2 = 9.";
    hookEn = "Times 9 rule: (10 × 8) - 8 = 80 - 8 = 72. Digits 7 + 2 = 9.";
  } else if ((a === 4 && b === 7) || (a === 7 && b === 4)) {
    hookId = "Trik Dobel 2x: 7 × 2 = 14, 14 × 2 = 28.";
    hookEn = "Double-double trick: 7 × 2 = 14, 14 × 2 = 28.";
  } else if ((a === 4 && b === 8) || (a === 8 && b === 4)) {
    hookId = "Trik Dobel 2x: 8 × 2 = 16, 16 × 2 = 32.";
    hookEn = "Double-double trick: 8 × 2 = 16, 16 × 2 = 32.";
  } else if ((a === 4 && b === 9) || (a === 9 && b === 4)) {
    hookId = "Trik Dobel 2x: 9 × 2 = 18, 18 × 2 = 36.";
    hookEn = "Double-double trick: 9 × 2 = 18, 18 × 2 = 36.";
  } else if ((a === 3 && b === 7) || (a === 7 && b === 3)) {
    hookId = "Trik Refleks: 3 × 7 = 21 (blackjack!).";
    hookEn = "Reflex recall: 3 × 7 = 21 (blackjack!).";
  } else if ((a === 3 && b === 8) || (a === 8 && b === 3)) {
    hookId = "Trik Refleks: 3 × 8 = 24 (jumlah jam dalam sehari).";
    hookEn = "Reflex recall: 3 × 8 = 24 (hours in a day).";
  } else if (a === 7 && b === 7) {
    hookId = "Trik Kuadrat: 7² = 49 (hampir 50).";
    hookEn = "Square recall: 7² = 49 (one away from 50).";
  } else if (a === 8 && b === 8) {
    hookId = "Trik Kuadrat: 8² = 64 (papan catur memiliki 8 × 8 = 64 petak).";
    hookEn = "Square recall: 8² = 64 (chessboard has 8 × 8 = 64 squares).";
  }

  return {
    problem: `${a} × ${b}`,
    answer,
    categoryId: "1–10 Fundamental",
    categoryEn: "1–10 Fundamental",
    explanationId: `${a} × ${b} = ${answer}. ${hookId}`,
    explanationEn: `${a} × ${b} = ${answer}. ${hookEn}`,
    difficulty: "Easy",
  };
}

function generateMultiplicationTier1_20(): QuestionTemplate {
  // Tricky double-digit and single-digit combinations (70% weight)
  const tricky20 = [
    [12, 7], [7, 12], [12, 8], [8, 12], [12, 6], [6, 12], [12, 9], [9, 12],
    [13, 6], [6, 13], [13, 7], [7, 13], [13, 8], [8, 13], [13, 9], [9, 13],
    [14, 6], [6, 14], [14, 7], [7, 14], [14, 8], [8, 14],
    [15, 6], [6, 15], [15, 7], [7, 15], [15, 8], [8, 15],
    [16, 4], [4, 16], [16, 6], [6, 16], [16, 7], [7, 16],
    [17, 3], [3, 17], [17, 4], [4, 17], [17, 5], [5, 17],
    [18, 3], [3, 18], [18, 4], [4, 18], [18, 6], [6, 18],
    [19, 3], [3, 19], [19, 4], [4, 19],
    [13, 13], [14, 14], [15, 15], [16, 16],
  ];

  let a: number;
  let b: number;

  if (Math.random() < 0.7) {
    const pair = tricky20[randInt(0, tricky20.length - 1)];
    a = pair[0];
    b = pair[1];
  } else {
    a = randInt(11, 20);
    b = randInt(3, 12);
  }

  const answer = a * b;
  const tensPart = 10 * b;
  const unitsPart = (a - 10) * b;

  return {
    problem: `${a} × ${b}`,
    answer,
    categoryId: "1–20 Dua Digit & Belasan",
    categoryEn: "1–20 Double-Digit",
    explanationId: `${a} × ${b} = ${answer}. Trik Distributif: Pecah (${a} = 10 + ${a - 10}). (10 × ${b}) + (${a - 10} × ${b}) = ${tensPart} + ${unitsPart} = ${answer}.`,
    explanationEn: `${a} × ${b} = ${answer}. Distributive shortcut: Split (${a} = 10 + ${a - 10}). (10 × ${b}) + (${a - 10} × ${b}) = ${tensPart} + ${unitsPart} = ${answer}.`,
    difficulty: "Medium",
  };
}

function generateMultiplicationTier1_30(): QuestionTemplate {
  // Numbers 21-30 multiplied by 3-9, or special 25x
  if (Math.random() < 0.35) {
    // Multiply by 25
    const multi = randInt(4, 16);
    const answer = 25 * multi;
    return {
      problem: `25 × ${multi}`,
      answer,
      categoryId: "1–30 Spesial (×25)",
      categoryEn: "1–30 Special (×25)",
      explanationId: `25 × ${multi} = ${answer}. Trik Kali 25: Bagi 4 lalu kali 100. (${multi} ÷ 4) = ${multi / 4} -> ${multi / 4} × 100 = ${answer}.`,
      explanationEn: `25 × ${multi} = ${answer}. Times 25 trick: Divide by 4 then multiply by 100. (${multi} ÷ 4) × 100 = ${answer}.`,
      difficulty: "Medium",
    };
  }

  const tensBase = randInt(2, 3) * 10; // 20 or 30
  const offset = randInt(-2, 2);
  const a = Math.max(18, tensBase + offset);
  const b = randInt(4, 9);
  const answer = a * b;

  const baseProduct = tensBase * b;
  const diffProduct = Math.abs(offset) * b;
  const sign = offset >= 0 ? "+" : "-";

  return {
    problem: `${a} × ${b}`,
    answer,
    categoryId: "1–30 Menengah",
    categoryEn: "1–30 Intermediate",
    explanationId: `${a} × ${b} = ${answer}. Trik Pembulatan: (${tensBase} × ${b}) ${sign} ${diffProduct} = ${baseProduct} ${sign} ${diffProduct} = ${answer}.`,
    explanationEn: `${a} × ${b} = ${answer}. Rounding & compensation: (${tensBase} × ${b}) ${sign} ${diffProduct} = ${baseProduct} ${sign} ${diffProduct} = ${answer}.`,
    difficulty: "Medium",
  };
}

function generateMultiplicationTier1_100(): QuestionTemplate {
  const patternType = randInt(1, 4);

  if (patternType === 1) {
    // 11-sandwich
    const tens = randInt(2, 7);
    const units = randInt(1, 8);
    const num = tens * 10 + units;
    const answer = num * 11;
    const sum = tens + units;
    return {
      problem: `${num} × 11`,
      answer,
      categoryId: "1–100 (Trik Kali 11)",
      categoryEn: "1–100 (11-Sandwich)",
      explanationId: `${num} × 11 = ${answer}. Trik Sisipkan Jumlah: ${tens} + ${units} = ${sum}. Sisipkan ${sum} di antara ${tens} dan ${units} -> ${answer}.`,
      explanationEn: `${num} × 11 = ${answer}. 11-Sandwich trick: ${tens} + ${units} = ${sum}. Sandwich ${sum} between ${tens} and ${units} -> ${answer}.`,
      difficulty: "Medium",
    };
  }

  if (patternType === 2) {
    // Squaring ending in 5
    const firstDigit = randInt(2, 9);
    const num = firstDigit * 10 + 5;
    const answer = num * num;
    const prefix = firstDigit * (firstDigit + 1);
    return {
      problem: `${num}² (${num} × ${num})`,
      answer,
      categoryId: "1–100 (Kuadrat Berakhiran 5)",
      categoryEn: "1–100 (Squares Ending in 5)",
      explanationId: `${num}² = ${answer}. Trik Kuadrat Akhiran 5: Kali angka depan dengan angka berikutnya (${firstDigit} × ${firstDigit + 1} = ${prefix}), lalu tempelkan 25 -> ${answer}.`,
      explanationEn: `${num}² = ${answer}. Squaring ending in 5 trick: Multiply leading digit by (digit + 1) -> (${firstDigit} × ${firstDigit + 1} = ${prefix}), then append 25 -> ${answer}.`,
      difficulty: "Hard",
    };
  }

  if (patternType === 3) {
    // Near 100
    const devA = randInt(1, 6);
    const devB = randInt(1, 6);
    const a = 100 - devA;
    const b = 100 - devB;
    const answer = a * b;
    const left = a - devB;
    const right = devA * devB;
    const rightStr = right < 10 ? `0${right}` : `${right}`;
    return {
      problem: `${a} × ${b}`,
      answer,
      categoryId: "1–100 (Basis 100 Dekat)",
      categoryEn: "1–100 (Near Base 100)",
      explanationId: `${a} × ${b} = ${answer}. Trik Basis 100: Selisih dari 100 adalah -${devA} dan -${devB}. Bagian kiri: ${a} - ${devB} = ${left}. Bagian kanan: ${devA} × ${devB} = ${rightStr}. Gabungkan: ${answer}.`,
      explanationEn: `${a} × ${b} = ${answer}. Near base 100: Deviations -${devA} and -${devB}. Left: ${a} - ${devB} = ${left}. Right: ${devA} × ${devB} = ${rightStr}. Combined: ${answer}.`,
      difficulty: "Hard",
    };
  }

  // Multiply by 50 or 25 or factors
  const a = randInt(24, 76);
  const b = 50;
  const answer = a * b;
  return {
    problem: `${a} × 50`,
    answer,
    categoryId: "1–100 (Kali 50)",
    categoryEn: "1–100 (Times 50)",
    explanationId: `${a} × 50 = ${answer}. Trik Kali 50: Bagi 2 lalu kali 100. (${a} ÷ 2 = ${a / 2}) × 100 = ${answer}.`,
    explanationEn: `${a} × 50 = ${answer}. Times 50 shortcut: Halve then multiply by 100. (${a} ÷ 2 = ${a / 2}) × 100 = ${answer}.`,
    difficulty: "Medium",
  };
}

// -------------------------------------------------------------
// SUBTRACTION GENERATORS
// -------------------------------------------------------------
function generateSubtractionTier1_20(): QuestionTemplate {
  // Tricky bridging 10 combinations (where people stumble or hesitate)
  const trickyBridging = [
    [11, 7], [11, 8], [11, 9], [11, 6],
    [12, 5], [12, 7], [12, 8], [12, 9],
    [13, 6], [13, 7], [13, 8], [13, 9],
    [14, 6], [14, 7], [14, 8], [14, 9],
    [15, 6], [15, 7], [15, 8], [15, 9],
    [16, 7], [16, 8], [16, 9],
    [17, 8], [17, 9],
    [18, 9],
  ];

  let a: number;
  let b: number;

  if (Math.random() < 0.75) {
    const pair = trickyBridging[randInt(0, trickyBridging.length - 1)];
    a = pair[0];
    b = pair[1];
  } else {
    a = randInt(11, 18);
    b = randInt(Math.max(3, a - 9), 9);
  }

  const answer = a - b;
  const toTen = a - 10;
  const rem = b - toTen;

  return {
    problem: `${a} - ${b}`,
    answer,
    categoryId: "1–20 Refleks Dasar",
    categoryEn: "1–20 Basic Reflex",
    explanationId: `${a} - ${b} = ${answer}. Trik Menembus 10: Kurangi ${toTen} terlebih dahulu untuk mencapai 10, lalu kurangi sisa ${rem} -> 10 - ${rem} = ${answer}.`,
    explanationEn: `${a} - ${b} = ${answer}. Bridge 10 reflex: Subtract ${toTen} to reach 10, then subtract remaining ${rem} -> 10 - ${rem} = ${answer}.`,
    difficulty: "Easy",
  };
}

function generateSubtractionTier1_50(): QuestionTemplate {
  // Tricky borrow pairs across tens, plus -9, -19, -29 compensation
  const trickyBorrows = [
    [43, 19], [52, 28], [45, 28], [50, 27], [41, 26],
    [34, 18], [32, 19], [44, 27], [33, 16], [51, 24],
    [42, 17], [35, 18], [46, 29], [38, 19], [47, 28],
  ];

  if (Math.random() < 0.5) {
    const pair = trickyBorrows[randInt(0, trickyBorrows.length - 1)];
    const a = pair[0];
    const b = pair[1];
    const answer = a - b;
    const roundedB = Math.ceil(b / 10) * 10;
    const diff = roundedB - b;
    return {
      problem: `${a} - ${b}`,
      answer,
      categoryId: "1–50 Pinjaman & Kompensasi",
      categoryEn: "1–50 Borrowing & Compensation",
      explanationId: `${a} - ${b} = ${answer}. Trik Kompensasi: Kurangi ${roundedB} (${a} - ${roundedB} = ${a - roundedB}), lalu tambah kembali ${diff} -> ${a - roundedB} + ${diff} = ${answer}.`,
      explanationEn: `${a} - ${b} = ${answer}. Compensation trick: Subtract ${roundedB} (${a} - ${roundedB} = ${a - roundedB}), then add back ${diff} -> ${a - roundedB} + ${diff} = ${answer}.`,
      difficulty: "Medium",
    };
  }

  // Subtraction by 9, 19, 28, 29 with compensation
  const subtrahendSub = [9, 19, 29, 18, 28][randInt(0, 4)];
  const a = randInt(subtrahendSub + 10, 50);
  const answer = a - subtrahendSub;

  const rounded = Math.round(subtrahendSub / 10) * 10;
  const adjustment = rounded - subtrahendSub;

  return {
    problem: `${a} - ${subtrahendSub}`,
    answer,
    categoryId: "1–50 Kompensasi Puluhan",
    categoryEn: "1–50 Tens Compensation",
    explanationId: `${a} - ${subtrahendSub} = ${answer}. Trik Kompensasi: Kurangi ${rounded} (${a} - ${rounded} = ${a - rounded}), lalu tambah kembali ${adjustment} -> ${a - rounded} + ${adjustment} = ${answer}.`,
    explanationEn: `${a} - ${subtrahendSub} = ${answer}. Compensation trick: Subtract ${rounded} (${a} - ${rounded} = ${a - rounded}), then add back ${adjustment} -> ${a - rounded} + ${adjustment} = ${answer}.`,
    difficulty: "Medium",
  };
}

function generateSubtractionTier1_100(): QuestionTemplate {
  if (Math.random() < 0.45) {
    // 100 minus double digits
    const b = randInt(15, 85);
    const answer = 100 - b;
    const bTens = Math.floor(b / 10);
    const bUnits = b % 10;
    const ansTens = 9 - bTens;
    const ansUnits = 10 - bUnits;
    return {
      problem: `100 - ${b}`,
      answer,
      categoryId: "1–100 Komplemen 100",
      categoryEn: "1–100 Base 100 Complement",
      explanationId: `100 - ${b} = ${answer}. Aturan Komplemen 100: Puluhan jumlahnya 9 (${ansTens}), Satuan jumlahnya 10 (${ansUnits}) -> ${ansTens}${ansUnits} = ${answer}.`,
      explanationEn: `100 - ${b} = ${answer}. 100 Complement rule: Tens add to 9 (${ansTens}), units add to 10 (${ansUnits}) -> ${ansTens}${ansUnits} = ${answer}.`,
      difficulty: "Medium",
    };
  }

  // 2-digit distance method
  const a = randInt(51, 98);
  const b = randInt(18, a - 12);
  const answer = a - b;
  const nextTen = Math.ceil(b / 10) * 10;
  const step1 = nextTen - b;
  const step2 = a - nextTen;

  return {
    problem: `${a} - ${b}`,
    answer,
    categoryId: "1–100 Metode Jarak",
    categoryEn: "1–100 Distance Method",
    explanationId: `${a} - ${b} = ${answer}. Metode Jarak: Dari ${b} ke ${nextTen} (+${step1}), lalu dari ${nextTen} ke ${a} (+${step2}). Total = ${step1} + ${step2} = ${answer}.`,
    explanationEn: `${a} - ${b} = ${answer}. Distance method: From ${b} to ${nextTen} (+${step1}), then from ${nextTen} to ${a} (+${step2}). Total = ${step1} + ${step2} = ${answer}.`,
    difficulty: "Medium",
  };
}

function generateSubtractionTier1_1000(): QuestionTemplate {
  if (Math.random() < 0.5) {
    // 1000 minus 3-digit
    const b = randInt(112, 888);
    const answer = 1000 - b;
    const d1 = Math.floor(b / 100);
    const d2 = Math.floor((b % 100) / 10);
    const d3 = b % 10;
    return {
      problem: `1000 - ${b}`,
      answer,
      categoryId: "1–1000 (Semua dari 9, Akhir dari 10)",
      categoryEn: "1–1000 (All from 9, Last from 10)",
      explanationId: `1000 - ${b} = ${answer}. Aturan 'All from 9, last from 10': (9 - ${d1} = ${9 - d1}), (9 - ${d2} = ${9 - d2}), (10 - ${d3} = ${10 - d3}) -> ${answer}.`,
      explanationEn: `1000 - ${b} = ${answer}. 'All from 9, last from 10' rule: (9 - ${d1} = ${9 - d1}), (9 - ${d2} = ${9 - d2}), (10 - ${d3} = ${10 - d3}) -> ${answer}.`,
      difficulty: "Hard",
    };
  }

  // 3-digit subtraction chunking
  const a = randInt(400, 950);
  const b = randInt(150, a - 100);
  const answer = a - b;

  return {
    problem: `${a} - ${b}`,
    answer,
    categoryId: "1–1000 Chunking",
    categoryEn: "1–1000 Chunking",
    explanationId: `${a} - ${b} = ${answer}. Hitung Kiri ke Kanan: Kurangi ratusan dulu, lalu puluhan, dan satuan tanpa pinjam bersusun manual.`,
    explanationEn: `${a} - ${b} = ${answer}. Left-to-right chunking: Subtract hundreds first, then tens, then units to avoid paper borrowing.`,
    difficulty: "Hard",
  };
}

// -------------------------------------------------------------
// DIVISION GENERATORS
// -------------------------------------------------------------
function generateDivisionTier1_10(): QuestionTemplate {
  // Tricky division facts heavily weighted (~75% probability for tables people often forget)
  const trickyDivisions = [
    [56, 8, 7], [56, 7, 8], [54, 6, 9], [54, 9, 6],
    [42, 6, 7], [42, 7, 6], [48, 6, 8], [48, 8, 6],
    [63, 7, 9], [63, 9, 7], [72, 8, 9], [72, 9, 8],
    [49, 7, 7], [64, 8, 8], [81, 9, 9], [32, 4, 8],
    [32, 8, 4], [28, 4, 7], [28, 7, 4], [24, 3, 8],
    [24, 8, 3], [24, 4, 6], [24, 6, 4], [27, 3, 9],
    [27, 9, 3], [36, 4, 9], [36, 9, 4], [36, 6, 6],
    [45, 5, 9], [45, 9, 5],
  ];

  let dividend: number;
  let divisor: number;
  let quotient: number;

  if (Math.random() < 0.75) {
    const item = trickyDivisions[randInt(0, trickyDivisions.length - 1)];
    dividend = item[0];
    divisor = item[1];
    quotient = item[2];
  } else {
    divisor = randInt(2, 10);
    quotient = randInt(2, 10);
    dividend = divisor * quotient;
  }

  let hookId = `Trik Invers: Jangan hafalkan pembagian secara terpisah. Pikirkan kebalikannya: "${divisor} × ? = ${dividend}" -> ${quotient}.`;
  let hookEn = `Inverse trick: Never memorize division separately. Think multiplication recall: "${divisor} × ? = ${dividend}" -> ${quotient}.`;

  if (dividend === 56 && (divisor === 7 || divisor === 8)) {
    hookId = `Trik Emas 5, 6, 7, 8: 56 = 7 × 8, maka 56 ÷ ${divisor} = ${quotient}!`;
    hookEn = `Golden 5, 6, 7, 8 sequence: 56 = 7 × 8, so 56 ÷ ${divisor} = ${quotient}!`;
  }

  return {
    problem: `${dividend} ÷ ${divisor}`,
    answer: quotient,
    categoryId: "1–10 Invers Tabel",
    categoryEn: "1–10 Inverse Tables",
    explanationId: `${dividend} ÷ ${divisor} = ${quotient}. ${hookId}`,
    explanationEn: `${dividend} ÷ ${divisor} = ${quotient}. ${hookEn}`,
    difficulty: "Easy",
  };
}

function generateDivisionTier1_20(): QuestionTemplate {
  const divisor = randInt(4, 15);
  const quotient = randInt(4, 18);
  const dividend = divisor * quotient;

  return {
    problem: `${dividend} ÷ ${divisor}`,
    answer: quotient,
    categoryId: "1–20 Belasan & Puluhan",
    categoryEn: "1–20 Teens & Tens",
    explanationId: `${dividend} ÷ ${divisor} = ${quotient}. Trik Pembagian Cepat: Pikirkan (${divisor} × 10 = ${divisor * 10}). Sisa ${dividend - divisor * 10} adalah ${divisor} × ${quotient - 10}. Maka hasil = 10 + ${quotient - 10} = ${quotient}.`,
    explanationEn: `${dividend} ÷ ${divisor} = ${quotient}. Fast teen division: Anchor at 10 (${divisor} × 10 = ${divisor * 10}). Remainder ${dividend - divisor * 10} is ${divisor} × ${quotient - 10}. Total = 10 + ${quotient - 10} = ${quotient}.`,
    difficulty: "Medium",
  };
}

function generateDivisionTier1_50(): QuestionTemplate {
  if (Math.random() < 0.5) {
    // Division by 5 (double and shift)
    const quotient = randInt(12, 85);
    const dividend = quotient * 5;
    return {
      problem: `${dividend} ÷ 5`,
      answer: quotient,
      categoryId: "1–50 Trik Cepat (÷5)",
      categoryEn: "1–50 Shortcut (÷5)",
      explanationId: `${dividend} ÷ 5 = ${quotient}. Trik Bagi 5: Kalikan dua lalu geser desimal 1 angka ke kiri. (${dividend} × 2 = ${dividend * 2}) ÷ 10 = ${quotient}.`,
      explanationEn: `${dividend} ÷ 5 = ${quotient}. Divide by 5 trick: Double and shift left 1 place. (${dividend} × 2 = ${dividend * 2}) ÷ 10 = ${quotient}.`,
      difficulty: "Medium",
    };
  }

  // Division by 25 (quadruple and divide by 100)
  const quotient = randInt(4, 36);
  const dividend = quotient * 25;
  return {
    problem: `${dividend} ÷ 25`,
    answer: quotient,
    categoryId: "1–50 Trik Cepat (÷25)",
    categoryEn: "1–50 Shortcut (÷25)",
    explanationId: `${dividend} ÷ 25 = ${quotient}. Trik Bagi 25: Kalikan 4 lalu bagi 100. (${dividend} × 4 = ${dividend * 4}) ÷ 100 = ${quotient}.`,
    explanationEn: `${dividend} ÷ 25 = ${quotient}. Divide by 25 shortcut: Multiply by 4 then divide by 100. (${dividend} × 4 = ${dividend * 4}) ÷ 100 = ${quotient}.`,
    difficulty: "Medium",
  };
}

function generateDivisionTier1_100(): QuestionTemplate {
  // Splitting factors / halving
  const divisor = [4, 6, 8, 12, 16][randInt(0, 4)];
  const quotient = randInt(25, 95);
  const dividend = divisor * quotient;

  return {
    problem: `${dividend} ÷ ${divisor}`,
    answer: quotient,
    categoryId: "1–100 Faktorisasi & Paruh",
    categoryEn: "1–100 Factoring & Halving",
    explanationId: `${dividend} ÷ ${divisor} = ${quotient}. Trik Faktorisasi: Bagi dua berturut-turut untuk pembagi kelipatan genap tanpa cara bersusun panjang.`,
    explanationEn: `${dividend} ÷ ${divisor} = ${quotient}. Factoring trick: Halve sequentially for even divisors instead of doing long paper division.`,
    difficulty: "Hard",
  };
}

// -------------------------------------------------------------
// ADDITION GENERATORS
// -------------------------------------------------------------
function generateAdditionTier(tier: ArithmeticTier): QuestionTemplate {
  if (tier === "1-10" || tier === "1-20") {
    const a = randInt(5, 16);
    const b = randInt(6, 15);
    const answer = a + b;
    return {
      problem: `${a} + ${b}`,
      answer,
      categoryId: "Penjumlahan Dasar 1–20",
      categoryEn: "Basic Addition 1–20",
      explanationId: `${a} + ${b} = ${answer}. Trik Lengkapi ke 10: Ambil ${10 - (a % 10)} untuk membuat puluhan genap.`,
      explanationEn: `${a} + ${b} = ${answer}. Make-10 shortcut: Take ${10 - (a % 10)} to reach the nearest 10.`,
      difficulty: "Easy",
    };
  }

  if (tier === "1-30" || tier === "1-50") {
    // Compensation +19, +29
    const addComp = [9, 19, 29, 39][randInt(0, 3)];
    const a = randInt(15, 45);
    const answer = a + addComp;
    const rounded = addComp + 1;
    return {
      problem: `${a} + ${addComp}`,
      answer,
      categoryId: "Penjumlahan Kompensasi",
      categoryEn: "Compensation Addition",
      explanationId: `${a} + ${addComp} = ${answer}. Tambah ${rounded} lalu kurangi 1: (${a} + ${rounded} = ${a + rounded}) - 1 = ${answer}.`,
      explanationEn: `${a} + ${addComp} = ${answer}. Add ${rounded} then subtract 1: (${a} + ${rounded} = ${a + rounded}) - 1 = ${answer}.`,
      difficulty: "Medium",
    };
  }

  const a = randInt(125, 680);
  const b = randInt(85, 450);
  const answer = a + b;
  return {
    problem: `${a} + ${b}`,
    answer,
    categoryId: "Penjumlahan Ratusan",
    categoryEn: "Hundreds Addition",
    explanationId: `${a} + ${b} = ${answer}. Jumlahkan dari Kiri ke Kanan: Ratusan + Puluhan + Satuan.`,
    explanationEn: `${a} + ${b} = ${answer}. Left-to-right addition: Hundreds + Tens + Units.`,
    difficulty: "Medium",
  };
}

// -------------------------------------------------------------
// MAIN GENERATOR EXPORT
// -------------------------------------------------------------
export function generateArithmeticQuestions(params: {
  operation: ArithmeticOperation;
  tier: ArithmeticTier;
  count: number;
  language?: Language;
}): Question[] {
  const { operation, tier, count, language = "id" } = params;
  const questions: Question[] = [];
  const seenProblems = new Set<string>();

  for (let i = 0; i < count; i++) {
    let currentOp = operation;
    if (operation === "mixed") {
      const ops: ArithmeticOperation[] = ["multiplication", "subtraction", "division", "addition"];
      currentOp = ops[randInt(0, ops.length - 1)];
    }

    let template: QuestionTemplate | null = null;

    // Retry loop to ensure distinct varied questions without repetitive duplicates
    for (let attempt = 0; attempt < 25; attempt++) {
      let candidate: QuestionTemplate;

      if (currentOp === "multiplication") {
        if (tier === "1-10") candidate = generateMultiplicationTier1_10();
        else if (tier === "1-20") candidate = generateMultiplicationTier1_20();
        else if (tier === "1-30" || tier === "1-50") candidate = generateMultiplicationTier1_30();
        else candidate = generateMultiplicationTier1_100();
      } else if (currentOp === "subtraction") {
        if (tier === "1-10" || tier === "1-20") candidate = generateSubtractionTier1_20();
        else if (tier === "1-30" || tier === "1-50") candidate = generateSubtractionTier1_50();
        else if (tier === "1-100") candidate = generateSubtractionTier1_100();
        else candidate = generateSubtractionTier1_1000();
      } else if (currentOp === "division") {
        if (tier === "1-10") candidate = generateDivisionTier1_10();
        else if (tier === "1-20") candidate = generateDivisionTier1_20();
        else if (tier === "1-30" || tier === "1-50") candidate = generateDivisionTier1_50();
        else candidate = generateDivisionTier1_100();
      } else {
        candidate = generateAdditionTier(tier);
      }

      if (!seenProblems.has(candidate.problem)) {
        seenProblems.add(candidate.problem);
        template = candidate;
        break;
      }
      if (attempt === 24) {
        template = candidate;
      }
    }

    if (!template) {
      template = generateMultiplicationTier1_10();
    }

    const options = generateDistractors(template.answer, currentOp);
    const questionText = language === "id"
      ? `Berapakah hasil dari ${template.problem}?`
      : `What is ${template.problem}?`;

    const explanation = language === "id" ? template.explanationId : template.explanationEn;
    const category = language === "id" ? template.categoryId : template.categoryEn;
    const randomEntropy = Math.random().toString(36).substring(2, 7);

    questions.push({
      id: `gen-${operation}-${tier}-${Date.now()}-${randomEntropy}-${i}`,
      moduleId: `mod-arithmetic-${currentOp}`,
      lessonId: `tier-${tier}`,
      category,
      difficulty: template.difficulty,
      question: questionText,
      options,
      answer: String(template.answer),
      explanation,
      estimatedSeconds: template.difficulty === "Easy" ? 5 : template.difficulty === "Medium" ? 10 : 15,
    });
  }

  return shuffleArray(questions);
}
