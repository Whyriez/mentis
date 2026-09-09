export type Language = "id" | "en";

export interface TranslationDictionary {
  // Navigation & Common
  nav: {
    dashboard: string;
    learn: string;
    arithmetic: string;
    quiz: string;
    analytics: string;
    roadmap: string;
    streak: string;
    dayStreak: string;
    accountSettings: string;
    signOut: string;
    kraepelin: string;
  };
  common: {
    loading: string;
    start: string;
    cancel: string;
    back: string;
    next: string;
    finish: string;
    pause: string;
    resume: string;
    restart: string;
    exit: string;
    score: string;
    accuracy: string;
    time: string;
    avgSpeed: string;
    seconds: string;
    secondsShort: string;
    difficulty: string;
    easy: string;
    medium: string;
    hard: string;
    questions: string;
    explanation: string;
    correct: string;
    incorrect: string;
    mastered: string;
    practicing: string;
    learning: string;
    switchLang: string;
  };
  // Arithmetic Center
  arithmetic: {
    title: string;
    subtitle: string;
    breadcrumb: string;
    overview: string;
    multiplication: string;
    addition: string;
    subtraction: string;
    division: string;
    percentages: string;
    memorize: string;
    cheatSheet: string;
    quizDrills: string;
    // Drill configurations
    selectOperation: string;
    selectTier: string;
    questionCount: string;
    timerPerQuestion: string;
    startQuiz: string;
    quizReadyTitle: string;
    quizReadyDesc: string;
    // Tiers
    tier1to10Title: string;
    tier1to10Desc: string;
    tier1to20Title: string;
    tier1to20Desc: string;
    tier1to30Title: string;
    tier1to30Desc: string;
    tier1to100Title: string;
    tier1to100Desc: string;
    subTier1Title: string;
    subTier1Desc: string;
    subTier2Title: string;
    subTier2Desc: string;
    subTier3Title: string;
    subTier3Desc: string;
    subTier4Title: string;
    subTier4Desc: string;
    divTier1Title: string;
    divTier1Desc: string;
    divTier2Title: string;
    divTier2Desc: string;
    divTier3Title: string;
    divTier3Desc: string;
    divTier4Title: string;
    divTier4Desc: string;
    // Sections & Topic UI
    interactiveTable: string;
    fastShortcuts: string;
    mustMemorizeSystem: string;
    workedExample: string;
    whenToUse: string;
    whyItWorks: string;
    fasterAlternative: string;
    commonMistake: string;
    familyFilter: string;
    allTables: string;
    setStatus: string;
    familyProgress: string;
    percentMemorized: string;
    markedMemorized: string;
    clickToMark: string;
    frequentlyUsedSquares: string;
    speedBenchmarkProducts: string;
    decompositionFormula: string;
    revealAnswer: string;
    markAsMemorized: string;
    coreBenchmarksTitle: string;
    percentageCompositionTitle: string;
    formulaBreakdown: string;
    cheatSheetTitle: string;
  };
  // Quiz Engine
  quiz: {
    configureSession: string;
    targetTopic: string;
    modeEasy: string;
    modeMedium: string;
    modeHard: string;
    modeUntimed: string;
    keyboardTip: string;
    keysShortcuts: string;
    timeExpired: string;
    pausedTitle: string;
    pausedDesc: string;
    resumeBtn: string;
    questionCounter: string;
    shortcutsTip: string;
    // Input Mode
    inputModeLabel: string;
    modeMCQ: string;
    modeMCQDesc: string;
    modeDirect: string;
    modeDirectDesc: string;
    essayModeBadge: string;
    mcqModeBadge: string;
    activeRecallTip: string;
    typeAnswerPlaceholder: string;
    submitAnswer: string;
    pressEnterTip: string;
    clear: string;
    backspace: string;
    // Results
    completeTitle: string;
    completeDesc: string;
    finalScore: string;
    accuracyLabel: string;
    avgSpeedLabel: string;
    incorrectLabel: string;
    detailedBreakdown: string;
    yourAnswer: string;
    correctAnswer: string;
    thinkingProcess: string;
    restartBtn: string;
    backToArithmetic: string;
  };
  kraepelin: {
    title: string;
    subtitle: string;
    badge: string;
    modeLabel: string;
    modeKraepelin: string;
    modeKraepelinDesc: string;
    modePauli: string;
    modePauliDesc: string;
    durationLabel: string;
    durationDesc: string;
    columnsLabel: string;
    presetQuick: string;
    presetQuickDesc: string;
    presetStandard: string;
    presetStandardDesc: string;
    presetFull: string;
    presetFullDesc: string;
    soundCue: string;
    soundCueDesc: string;
    startTest: string;
    instructionsTitle: string;
    instruction1: string;
    instruction2: string;
    instruction3: string;
    exampleLabel: string;
    exampleText: string;
    columnIndicator: string;
    switchSignal: string;
    nextColumnDesc: string;
    pause: string;
    resume: string;
    quit: string;
    timeRemaining: string;
    autoAdvanceTip: string;
    skipPair: string;
    resultTitle: string;
    resultSubtitle: string;
    pankerTitle: string;
    pankerDesc: string;
    pankerUnit: string;
    tiankerTitle: string;
    tiankerDesc: string;
    stankerTitle: string;
    stankerDesc: string;
    hankelTitle: string;
    hankelDesc: string;
    workCurveTitle: string;
    workCurveDesc: string;
    columnNumber: string;
    correctAnswers: string;
    wrongAnswers: string;
    totalAnswers: string;
    interpretationTitle: string;
    recommendationsTitle: string;
    retryTest: string;
    backToDashboard: string;
  };
}

export const translations: Record<Language, TranslationDictionary> = {
  id: {
    nav: {
      dashboard: "Dasbor",
      learn: "Belajar",
      arithmetic: "Aritmatika",
      quiz: "Kuis",
      analytics: "Analitik",
      roadmap: "Peta Belajar",
      streak: "Runtutan",
      dayStreak: "Hari Beruntun",
      accountSettings: "Pengaturan Akun",
      signOut: "Keluar",
      kraepelin: "Tes Koran",
    },
    common: {
      loading: "Memuat...",
      start: "Mulai",
      cancel: "Batal",
      back: "Kembali",
      next: "Lanjut",
      finish: "Selesai",
      pause: "Jeda",
      resume: "Lanjutkan",
      restart: "Ulangi Latihan",
      exit: "Keluar",
      score: "Skor",
      accuracy: "Akurasi",
      time: "Waktu",
      avgSpeed: "Kecepatan Rata-rata",
      seconds: "detik",
      secondsShort: "dtk",
      difficulty: "Tingkat Kesulitan",
      easy: "Mudah",
      medium: "Sedang",
      hard: "Sulit",
      questions: "Soal",
      explanation: "Penjelasan Langkah",
      correct: "Benar",
      incorrect: "Salah",
      mastered: "Dikuasai",
      practicing: "Latihan",
      learning: "Mempelajari",
      switchLang: "Ganti Bahasa (English)",
    },
    arithmetic: {
      title: "Penguasaan Aritmatika Mental Dasar",
      subtitle: "Kuasai kecepatan hitung mental untuk tes psikotes numerik secara bertahap.",
      breadcrumb: "Penguasaan Aritmatika",
      overview: "Ringkasan",
      multiplication: "Perkalian",
      addition: "Penjumlahan",
      subtraction: "Pengurangan",
      division: "Pembagian",
      percentages: "Persentase",
      memorize: "Hafalan Inti",
      cheatSheet: "Lembar Ringkasan",
      quizDrills: "Kuis & Latihan Bertahap",
      selectOperation: "Pilih Operasi Aritmatika",
      selectTier: "Pilih Tingkat / Jangkauan (Bertahap)",
      questionCount: "Jumlah Pertanyaan",
      timerPerQuestion: "Waktu per Pertanyaan",
      startQuiz: "Mulai Kuis Kecepatan",
      quizReadyTitle: "Siap Melatih Refleks Hitung Cepat?",
      quizReadyDesc: "Pilih level bertahap untuk memperkuat hafalan dan trik hitung tanpa coretan kertas.",
      tier1to10Title: "Tier 1: Perkalian 1–10 Fundamental (Acak)",
      tier1to10Desc: "Latihan acak tabel 1–10 untuk memperkuat hafalan refleks dasar perkalian secara otomatis.",
      tier1to20Title: "Tier 2: Perkalian 1–20 (Dua Digit & Belasan)",
      tier1to20Desc: "Latihan perkalian angka 11–20 menggunakan trik distributif dan penggandaan cepat.",
      tier1to30Title: "Tier 3: Perkalian 1–30 (Menengah)",
      tier1to30Desc: "Kalkulasi mental 20-an dan 30-an dengan teknik pembulatan & kompensasi.",
      tier1to100Title: "Tier 4: Perkalian 1–100 (Tingkat Lanjut)",
      tier1to100Desc: "Perkalian hingga 100 dengan trik basis 100, kuadrat akhiran 5, dan kali 11.",
      subTier1Title: "Tier 1: Pengurangan 1–20 (Refleks Menembus 10)",
      subTier1Desc: "Refleks cepat tanpa hitung jari (misal: 15-8, 17-9, 13-6).",
      subTier2Title: "Tier 2: Pengurangan 1–50 (Kompensasi Puluhan)",
      subTier2Desc: "Trik kurangi puluhan lalu tambah selisih (-9, -19, -29, misal: 43 - 19 = 43 - 20 + 1).",
      subTier3Title: "Tier 3: Pengurangan 1–100 (Komplemen 100 & Jarak)",
      subTier3Desc: "Metode jarak dan komplemen ratusan (misal: 100 - 47, 84 - 47).",
      subTier4Title: "Tier 4: Pengurangan 1–1000 (Tiga Angka Mental)",
      subTier4Desc: "Aturan 'All from 9, last from 10' untuk basis 1000 dan chunking kiri-ke-kanan.",
      divTier1Title: "Tier 1: Pembagian 1–10 (Invers Tabel Perkalian)",
      divTier1Desc: "Menghubungkan kebalikan tabel perkalian (56 ÷ 8 -> 8 × ? = 56).",
      divTier2Title: "Tier 2: Pembagian 1–20 (Belasan & Puluhan)",
      divTier2Desc: "Pembagian bilangan dua digit (144 ÷ 12, 96 ÷ 6, 180 ÷ 15).",
      divTier3Title: "Tier 3: Pembagian Cepat Shortcut (÷5 & ÷25)",
      divTier3Desc: "Bagi 5 = kali 2 bagi 10; bagi 25 = kali 4 bagi 100 (misal: 350 ÷ 25).",
      divTier4Title: "Tier 4: Pembagian 1–100 (Faktorisasi & Paruh)",
      divTier4Desc: "Pembagian bersih 2-3 digit dengan memecah faktor (864 ÷ 8, 625 ÷ 25).",
      // Sections & Topic UI
      interactiveTable: "Tabel Interaktif 10×10",
      fastShortcuts: "Trik Cepat Mental",
      mustMemorizeSystem: "Sistem Wajib Hafal",
      workedExample: "Contoh Soal & Pengerjaan",
      whenToUse: "Kapan Digunakan:",
      whyItWorks: "Alasan Logika:",
      fasterAlternative: "Alternatif Lebih Cepat:",
      commonMistake: "Kesalahan Umum:",
      familyFilter: "Filter Angka:",
      allTables: "Semua 1–10",
      setStatus: "Ubah Status:",
      familyProgress: "Progres Hafalan Angka Ini",
      percentMemorized: "Dihapal",
      markedMemorized: "✓ Dihapal",
      clickToMark: "Klik utk Tandai",
      frequentlyUsedSquares: "Kuadrat Sering Muncul",
      speedBenchmarkProducts: "Produk Patokan Kecepatan",
      decompositionFormula: "Rumus Pemecahan Mental",
      revealAnswer: "Buka Jawaban",
      markAsMemorized: "Tandai Sudah Hafal",
      coreBenchmarksTitle: "8 Benchmark Persentase Inti",
      percentageCompositionTitle: "Komposisi Persentase (Membentuk % Tidak Umum)",
      formulaBreakdown: "Rincian Formula:",
      cheatSheetTitle: "Lembar Ringkasan Trik",
    },
    quiz: {
      configureSession: "Konfigurasi Sesi Latihan",
      targetTopic: "Topik Target: Latihan Aritmatika Mental Bertahap",
      modeEasy: "Santai (15 detik)",
      modeMedium: "Standar (10 detik)",
      modeHard: "Blitz Cepat (5 detik)",
      modeUntimed: "Tanpa Waktu (Santai)",
      keyboardTip: "Shortcut Keyboard: Tekan tombol 1-4 untuk memilih jawaban secara instan.",
      keysShortcuts: "Tombol 1 - 4",
      timeExpired: "Waktu Habis",
      pausedTitle: "Latihan Dijeda",
      pausedDesc: "Tarik napas sejenak. Waktu telah dihentikan. Tekan lanjutkan saat siap.",
      resumeBtn: "Lanjutkan Latihan",
      questionCounter: "Pertanyaan",
      shortcutsTip: "Klik pilihan atau tekan angka 1-4 di keyboard.",
      // Input Mode
      inputModeLabel: "Format Menjawab",
      modeMCQ: "Pilihan Ganda (4 Opsi)",
      modeMCQDesc: "Tersedia 4 pilihan jawaban & shortcut keyboard (1–4)",
      modeDirect: "Ketik Langsung (Active Recall / Essay)",
      modeDirectDesc: "Ketik jawaban angka manual tanpa bocoran pilihan untuk menguji daya ingat murni",
      essayModeBadge: "Mode Ketik Langsung",
      mcqModeBadge: "Mode Pilihan Ganda",
      activeRecallTip: "Tanpa bantuan opsi: latih daya ingat dan refleks mental murni.",
      typeAnswerPlaceholder: "Ketik angka jawaban di sini...",
      submitAnswer: "Kirim Jawaban",
      pressEnterTip: "Tekan Enter ↵ untuk mengirim jawaban instan",
      clear: "Bersihkan",
      backspace: "Hapus",
      completeTitle: "Kuis Selesai!",
      completeDesc: "Berikut rincian performa dan evaluasi kecepatan latihan Anda.",
      finalScore: "Skor Akhir",
      accuracyLabel: "Akurasi",
      avgSpeedLabel: "Kecepatan Rata-rata",
      incorrectLabel: "Jumlah Salah",
      detailedBreakdown: "Pembahasan & Trik Cepat Mental",
      yourAnswer: "Jawaban Anda",
      correctAnswer: "Jawaban Benar",
      thinkingProcess: "💡 Langkah Cepat Mental",
      restartBtn: "Coba Lagi Level Ini",
      backToArithmetic: "Kembali ke Pusat Aritmatika",
    },
    kraepelin: {
      title: "Tes Kraepelin & Pauli (Tes Koran)",
      subtitle: "Simulasi psikotes kecepatan, ketelitian, kestabilan, dan ketahanan mental di bawah tekanan waktu.",
      badge: "Standar Psikotes Rekrutmen",
      modeLabel: "Pilih Metode Tes",
      modeKraepelin: "Metode Kraepelin (Bawah ke Atas)",
      modeKraepelinDesc: "Perhitungan angka bergerak vertikal dari bawah ke atas dengan aba-aba kolom PINDAH.",
      modePauli: "Metode Pauli (Atas ke Bawah)",
      modePauliDesc: "Perhitungan angka bergerak vertikal dari atas ke bawah dengan ritme berlanjut.",
      durationLabel: "Durasi Waktu per Kolom",
      durationDesc: "Batas waktu pengerjaan sebelum aba-aba pindah ke kolom berikutnya.",
      columnsLabel: "Jumlah Kolom",
      presetQuick: "Latihan Kilat (5 Kolom)",
      presetQuickDesc: "5 kolom × 15 detik (~1.25 menit). Cocok untuk pemanasan refleks & kecepatan awal.",
      presetStandard: "Simulasi Standar (10 Kolom)",
      presetStandardDesc: "10 kolom × 30 detik (5 menit). Standar simulasi psikotes BUMN, CPNS, & Korporat.",
      presetFull: "Ujian Ketahanan Penuh (20 Kolom)",
      presetFullDesc: "20 kolom × 30 detik (10 menit). Menguji fokus ekstrem, konsistensi ritme, dan kurva kelelahan.",
      soundCue: "Sinyal Audio Pindah Kolom",
      soundCueDesc: "Memutar bunyi bip lembut saat waktu kolom habis agar refleks berpindah kolom terlatih.",
      startTest: "Mulai Tes Koran Sekarang",
      instructionsTitle: "Panduan Cara Mengerjakan Tes Koran",
      instruction1: "Jumlahkan 2 angka yang berdampingan secara vertikal.",
      instruction2: "Ketik HANYA digit satuan (angka terakhir). Jika hasilnya 7 + 8 = 15, cukup ketik 5.",
      instruction3: "Gunakan angka 0–9 pada keyboard fisik atau keypad virtual di layar. Jawaban otomatis tersimpan tanpa perlu tekan Enter.",
      exampleLabel: "Contoh Penjumlahan:",
      exampleText: "Angka atas: 8 | Angka bawah: 6 -> 8 + 6 = 14 (Ketik: 4)",
      columnIndicator: "Kolom",
      switchSignal: "PINDAH!",
      nextColumnDesc: "Waktu kolom habis! Langsung lanjut ke kolom berikutnya.",
      pause: "Jeda",
      resume: "Lanjutkan",
      quit: "Keluar Tes",
      timeRemaining: "Sisa Waktu Kolom",
      autoAdvanceTip: "Ketik angka 0-9 langsung: kursor otomatis naik/turun ke pasangan berikutnya.",
      skipPair: "Lewati Pasangan",
      resultTitle: "Hasil Evaluasi Psikotes Tes Koran",
      resultSubtitle: "Analisis performa komprehensif berdasarkan 4 pilar psikodiagnostik kerja.",
      pankerTitle: "Kecepatan Kerja (Panker)",
      pankerDesc: "Total penjumlahan yang berhasil diselesaikan dan rata-rata per kolom.",
      pankerUnit: "soal / kolom",
      tiankerTitle: "Ketelitian Kerja (Tianker)",
      tiankerDesc: "Persentase akurasi hitungan serta perbandingan jumlah benar vs salah.",
      stankerTitle: "Kestabilan Ritme (Stanker)",
      stankerDesc: "Konsistensi ritme kerja antar kolom. Semakin rendah deviasi, kerja semakin stabil.",
      hankelTitle: "Ketahanan Kerja (Hankel)",
      hankelDesc: "Arah kurva daya tahan kerja mendeteksi adaptasi mental dan efek kelelahan.",
      workCurveTitle: "Grafik Kurva Kerja Interaktif (Work Curve)",
      workCurveDesc: "Visualisasi output jawaban per kolom dari awal hingga akhir tes.",
      columnNumber: "Kolom",
      correctAnswers: "Benar",
      wrongAnswers: "Salah",
      totalAnswers: "Total Terjawab",
      interpretationTitle: "Interpretasi Kepribadian Kerja",
      recommendationsTitle: "Saran Peningkatan Taktis",
      retryTest: "Ulangi Tes Ini",
      backToDashboard: "Kembali ke Dasbor",
    },
  },
  en: {
    nav: {
      dashboard: "Dashboard",
      learn: "Learn",
      arithmetic: "Arithmetic",
      quiz: "Quiz",
      analytics: "Analytics",
      roadmap: "Roadmap",
      streak: "Streak",
      dayStreak: "Day Streak",
      accountSettings: "Account Settings",
      signOut: "Sign Out",
      kraepelin: "Kraepelin Test",
    },
    common: {
      loading: "Loading...",
      start: "Start",
      cancel: "Cancel",
      back: "Back",
      next: "Next",
      finish: "Finish",
      pause: "Pause",
      resume: "Resume",
      restart: "Restart Drill",
      exit: "Exit",
      score: "Score",
      accuracy: "Accuracy",
      time: "Time",
      avgSpeed: "Avg Speed",
      seconds: "seconds",
      secondsShort: "s",
      difficulty: "Difficulty",
      easy: "Easy",
      medium: "Medium",
      hard: "Hard",
      questions: "Questions",
      explanation: "Step Explanation",
      correct: "Correct",
      incorrect: "Incorrect",
      mastered: "Mastered",
      practicing: "Practicing",
      learning: "Learning",
      switchLang: "Switch Language (Bahasa Indonesia)",
    },
    arithmetic: {
      title: "Basic Mental Arithmetic Mastery",
      subtitle: "Master rapid mental calculation for psychometric numerical tests progressively.",
      breadcrumb: "Arithmetic Mastery",
      overview: "Overview",
      multiplication: "Multiplication",
      addition: "Addition",
      subtraction: "Subtraction",
      division: "Division",
      percentages: "Percentages",
      memorize: "Core Memory",
      cheatSheet: "Cheat Sheet",
      quizDrills: "Progressive Quizzes & Drills",
      selectOperation: "Select Arithmetic Operation",
      selectTier: "Select Tier / Range (Progressive)",
      questionCount: "Question Count",
      timerPerQuestion: "Seconds per Question",
      startQuiz: "Launch Speed Drill",
      quizReadyTitle: "Ready to Train Instant Recall?",
      quizReadyDesc: "Choose a progressive tier to cement muscle memory and fast shortcuts without scratch paper.",
      tier1to10Title: "Tier 1: 1–10 Multiplication Fundamental (Random)",
      tier1to10Desc: "Randomized drill across 1–10 tables to build permanent automatic recall.",
      tier1to20Title: "Tier 2: 1–20 Multiplication (Teens & Double-Digit)",
      tier1to20Desc: "Multiply numbers 11–20 utilizing distributive properties and rapid doubling.",
      tier1to30Title: "Tier 3: 1–30 Multiplication (Intermediate)",
      tier1to30Desc: "Mental calculations in the 20s and 30s using rounding and compensation.",
      tier1to100Title: "Tier 4: 1–100 Multiplication (Advanced Mental Math)",
      tier1to100Desc: "Up to 100 using base 100 rules, squaring ending in 5, and 11-sandwich tricks.",
      subTier1Title: "Tier 1: Subtraction 1–20 (Bridging 10 Reflex)",
      subTier1Desc: "Instant recall without finger counting (e.g., 15-8, 17-9, 13-6).",
      subTier2Title: "Tier 2: Subtraction 1–50 (Tens Compensation)",
      subTier2Desc: "Subtract nearby tens and add back the difference (-9, -19, -29, e.g. 43 - 19 = 43 - 20 + 1).",
      subTier3Title: "Tier 3: Subtraction 1–100 (Complement to 100 & Distance)",
      subTier3Desc: "Distance method and base 100 complements (e.g. 100 - 47, 84 - 47).",
      subTier4Title: "Tier 4: Subtraction 1–1000 (Three-Digit Mental)",
      subTier4Desc: "'All from 9, last from 10' rule for base 1000 and left-to-right chunking.",
      divTier1Title: "Tier 1: Division 1–10 (Inverse Tables)",
      divTier1Desc: "Connect division directly to multiplication recall (56 ÷ 8 -> 8 × ? = 56).",
      divTier2Title: "Tier 2: Division 1–20 (Teens & Tens)",
      divTier2Desc: "Two-digit division (144 ÷ 12, 96 ÷ 6, 180 ÷ 15).",
      divTier3Title: "Tier 3: Speed Division Shortcuts (÷5 & ÷25)",
      divTier3Desc: "Divide by 5 = double & shift; divide by 25 = quadruple & shift (e.g. 350 ÷ 25).",
      divTier4Title: "Tier 4: Division 1–100 (Factoring & Halving)",
      divTier4Desc: "Clean 2-3 digit division by splitting factors (864 ÷ 8, 625 ÷ 25).",
      // Sections & Topic UI
      interactiveTable: "Interactive 10x10 Table",
      fastShortcuts: "Fast Mental Shortcuts",
      mustMemorizeSystem: "Must Memorize System",
      workedExample: "Worked Example",
      whenToUse: "When to use:",
      whyItWorks: "Why it works:",
      fasterAlternative: "Faster alternative:",
      commonMistake: "Common mistake:",
      familyFilter: "Family Filter:",
      allTables: "All 1-10",
      setStatus: "Set Status:",
      familyProgress: "Family Recall Progress",
      percentMemorized: "Memorized",
      markedMemorized: "✓ Memorized",
      clickToMark: "Click to Mark",
      frequentlyUsedSquares: "Frequently Used Squares",
      speedBenchmarkProducts: "Speed Benchmark Products",
      decompositionFormula: "Decomposition Formula",
      revealAnswer: "Reveal Answer",
      markAsMemorized: "Mark as Memorized",
      coreBenchmarksTitle: "The 8 Core Percentage Benchmarks",
      percentageCompositionTitle: "Percentage Composition (Constructing Uncommon %)",
      formulaBreakdown: "Formula Breakdown:",
      cheatSheetTitle: "Cheat Sheet Quick Reference",
    },
    quiz: {
      configureSession: "Configure Practice Session",
      targetTopic: "Target Topic: Progressive Mental Math Drills",
      modeEasy: "Relaxed (15 seconds)",
      modeMedium: "Standard (10 seconds)",
      modeHard: "Blitz (5 seconds)",
      modeUntimed: "Untimed (Practice)",
      keyboardTip: "Keyboard Shortcuts: Press keys 1-4 to select options instantly.",
      keysShortcuts: "Keys 1 - 4",
      timeExpired: "Time Expired",
      pausedTitle: "Drill Paused",
      pausedDesc: "Take a short breath. The timer has stopped. Click resume whenever you are ready.",
      resumeBtn: "Resume Drill",
      questionCounter: "Question",
      shortcutsTip: "Click an option or press keys 1-4 on your keyboard.",
      // Input Mode
      inputModeLabel: "Answering Format",
      modeMCQ: "Multiple Choice (4 Options)",
      modeMCQDesc: "4 candidate answers displayed with keys 1–4 shortcuts",
      modeDirect: "Direct Typing (Active Recall / Essay)",
      modeDirectDesc: "Type numeric answer manually without visual clues to force true mental recall",
      essayModeBadge: "Direct Typing Mode",
      mcqModeBadge: "Multiple Choice Mode",
      activeRecallTip: "No option clues: trains pure mental recall and fast calculation reflex.",
      typeAnswerPlaceholder: "Type your number answer...",
      submitAnswer: "Submit Answer",
      pressEnterTip: "Press Enter ↵ to submit answer instantly",
      clear: "Clear",
      backspace: "Del",
      completeTitle: "Quiz Completed!",
      completeDesc: "Here is your detailed performance breakdown and speed analytics.",
      finalScore: "Final Score",
      accuracyLabel: "Accuracy",
      avgSpeedLabel: "Average Speed",
      incorrectLabel: "Incorrect Count",
      detailedBreakdown: "Mental Shortcuts & Step Breakdown",
      yourAnswer: "Your Answer",
      correctAnswer: "Correct Answer",
      thinkingProcess: "💡 Rapid Mental Process",
      restartBtn: "Retry This Level",
      backToArithmetic: "Back to Arithmetic Center",
    },
    kraepelin: {
      title: "Kraepelin & Pauli Test (Speed Arithmetic)",
      subtitle: "Psychometric simulation measuring speed, accuracy, rhythm stability, and mental stamina under time pressure.",
      badge: "Standard Recruitment Psychometrics",
      modeLabel: "Select Test Method",
      modeKraepelin: "Kraepelin Method (Bottom to Top)",
      modeKraepelinDesc: "Calculations move vertically from bottom to top with periodic SWITCH column signals.",
      modePauli: "Pauli Method (Top to Bottom)",
      modePauliDesc: "Calculations move vertically from top to bottom with continuous rhythm.",
      durationLabel: "Duration per Column",
      durationDesc: "Time limit before signal prompts you to jump to the next column.",
      columnsLabel: "Number of Columns",
      presetQuick: "Quick Drill (5 Columns)",
      presetQuickDesc: "5 columns × 15 seconds (~1.25 mins). Ideal for warming up arithmetic reflexes.",
      presetStandard: "Standard Simulation (10 Columns)",
      presetStandardDesc: "10 columns × 30 seconds (5 mins). Standard exam simulation for hiring assessments.",
      presetFull: "Full Endurance Exam (20 Columns)",
      presetFullDesc: "20 columns × 30 seconds (10 mins). Tests extreme stamina, focus, and fatigue resistance.",
      soundCue: "Audio Column Switch Cue",
      soundCueDesc: "Plays a soft chime when column time expires to train rapid column-switching reflexes.",
      startTest: "Start Kraepelin Test Now",
      instructionsTitle: "How to Take the Test",
      instruction1: "Add the two adjacent vertical numbers.",
      instruction2: "Type ONLY the units digit (last digit). If 7 + 8 = 15, simply type 5.",
      instruction3: "Use 0–9 on physical keyboard or on-screen keypad. Focus auto-advances instantly without pressing Enter.",
      exampleLabel: "Calculation Example:",
      exampleText: "Top number: 8 | Bottom number: 6 -> 8 + 6 = 14 (Type: 4)",
      columnIndicator: "Column",
      switchSignal: "NEXT COLUMN!",
      nextColumnDesc: "Time expired! Immediately jump to the next column.",
      pause: "Pause",
      resume: "Resume",
      quit: "Quit Test",
      timeRemaining: "Column Time Left",
      autoAdvanceTip: "Press 0-9 directly: cursor auto-advances to the next pair instantly.",
      skipPair: "Skip Pair",
      resultTitle: "Kraepelin Psychometric Evaluation",
      resultSubtitle: "Comprehensive performance analysis based on 4 professional psychodiagnostic pillars.",
      pankerTitle: "Working Speed (Panker)",
      pankerDesc: "Total additions solved and average output per column.",
      pankerUnit: "items / col",
      tiankerTitle: "Working Accuracy (Tianker)",
      tiankerDesc: "Calculation accuracy percentage and ratio of correct vs incorrect answers.",
      stankerTitle: "Rhythm Stability (Stanker)",
      stankerDesc: "Consistency across columns. Lower deviation indicates stable, reliable performance.",
      hankelTitle: "Working Stamina (Hankel)",
      hankelDesc: "Work curve slope detecting mental adaptation and fatigue resistance over time.",
      workCurveTitle: "Interactive Work Curve Chart",
      workCurveDesc: "Visualizing calculated items across columns from start to finish.",
      columnNumber: "Column",
      correctAnswers: "Correct",
      wrongAnswers: "Wrong",
      totalAnswers: "Total Solved",
      interpretationTitle: "Work Profile Interpretation",
      recommendationsTitle: "Tactical Recommendations",
      retryTest: "Retry This Test",
      backToDashboard: "Back to Dashboard",
    },
  },
};
