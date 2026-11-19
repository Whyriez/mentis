"use client";

import React, { useState, useEffect } from "react";
import {
  Play,
  Sliders,
  Zap,
  Timer,
  CheckCircle2,
  Brain,
  HelpCircle,
  Sparkles,
  ArrowRight,
  ShieldAlert,
  ListOrdered,
  PenLine,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/components/providers/language-provider";
import { LanguageToggle } from "@/components/layout/language-toggle";
import {
  ArithmeticOperation,
  ArithmeticTier,
  generateArithmeticQuestions,
} from "../services/arithmetic-generator";
import { ActiveQuizEngine, QuizInputMode } from "@/features/quiz/components/active-quiz-engine";
import { startQuizAttemptAction } from "@/features/quiz/actions/quiz-actions";
import { Question } from "@/features/quiz/types";
import { createClient } from "@/lib/supabase/client";

export interface ArithmeticQuizViewProps {
  initialOperation?: ArithmeticOperation;
  initialTier?: ArithmeticTier;
  initialMode?: QuizInputMode;
  onBackToOverview?: () => void;
}

export function ArithmeticQuizView({
  initialOperation = "multiplication",
  initialTier = "1-10",
  initialMode = "mcq",
  onBackToOverview,
}: ArithmeticQuizViewProps) {
  const { language, t } = useLanguage();

  const [operation, setOperation] = useState<ArithmeticOperation>(initialOperation);
  const [tier, setTier] = useState<ArithmeticTier>(initialTier);
  const [inputMode, setInputMode] = useState<QuizInputMode>(initialMode);
  const [questionCount, setQuestionCount] = useState<number>(10);
  const [secondsPerQuestion, setSecondsPerQuestion] = useState<number>(10);
  const [isUntimed, setIsUntimed] = useState<boolean>(false);

  const [isQuizActive, setIsQuizActive] = useState<boolean>(false);
  const [activeQuestions, setActiveQuestions] = useState<Question[]>([]);
  const [attemptId, setAttemptId] = useState<string | null>(null);
  const [drillKey, setDrillKey] = useState<number>(Date.now());
  const [userId, setUserId] = useState<string>("guest");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then((res) => {
      const user = res.data?.user;
      if (user) setUserId(user.id);
    });
  }, []);

  // Sync props if changed from parent
  useEffect(() => {
    if (initialOperation) setOperation(initialOperation);
    if (initialTier) setTier(initialTier);
    if (initialMode) setInputMode(initialMode);
  }, [initialOperation, initialTier, initialMode]);

  // Adjust tier options based on selected operation
  const getTiersForOperation = (op: ArithmeticOperation): Array<{ id: ArithmeticTier; label: string; desc: string }> => {
    if (op === "multiplication") {
      return [
        { id: "1-10", label: t.arithmetic.tier1to10Title, desc: t.arithmetic.tier1to10Desc },
        { id: "1-20", label: t.arithmetic.tier1to20Title, desc: t.arithmetic.tier1to20Desc },
        { id: "1-30", label: t.arithmetic.tier1to30Title, desc: t.arithmetic.tier1to30Desc },
        { id: "1-100", label: t.arithmetic.tier1to100Title, desc: t.arithmetic.tier1to100Desc },
      ];
    }
    if (op === "subtraction") {
      return [
        { id: "1-20", label: t.arithmetic.subTier1Title, desc: t.arithmetic.subTier1Desc },
        { id: "1-50", label: t.arithmetic.subTier2Title, desc: t.arithmetic.subTier2Desc },
        { id: "1-100", label: t.arithmetic.subTier3Title, desc: t.arithmetic.subTier3Desc },
        { id: "1-1000", label: t.arithmetic.subTier4Title, desc: t.arithmetic.subTier4Desc },
      ];
    }
    if (op === "division") {
      return [
        { id: "1-10", label: t.arithmetic.divTier1Title, desc: t.arithmetic.divTier1Desc },
        { id: "1-20", label: t.arithmetic.divTier2Title, desc: t.arithmetic.divTier2Desc },
        { id: "1-50", label: t.arithmetic.divTier3Title, desc: t.arithmetic.divTier3Desc },
        { id: "1-100", label: t.arithmetic.divTier4Title, desc: t.arithmetic.divTier4Desc },
      ];
    }
    return [
      { id: "1-20", label: language === "id" ? "Tier 1: Penjumlahan 1–20" : "Tier 1: Addition 1–20", desc: language === "id" ? "Refleks dasar buat 10/20" : "Basic reflex make 10/20" },
      { id: "1-50", label: language === "id" ? "Tier 2: Penjumlahan Kompensasi" : "Tier 2: Compensation Addition", desc: language === "id" ? "Kompensasi +19, +29" : "Add nearby tens and subtract 1" },
      { id: "1-100", label: language === "id" ? "Tier 3: Penjumlahan Puluhan" : "Tier 3: Tens Addition", desc: language === "id" ? "Jumlahkan dari kiri ke kanan" : "Left-to-right addition" },
      { id: "1-1000", label: language === "id" ? "Tier 4: Penjumlahan Ratusan" : "Tier 4: Hundreds Addition", desc: language === "id" ? "Kalkulasi mental 3 digit" : "3-digit mental addition" },
    ];
  };

  // Ensure selected tier is valid for current operation
  const availableTiers = getTiersForOperation(operation);
  const isValidTier = availableTiers.some((tItem) => tItem.id === tier);
  const activeTier = isValidTier ? tier : availableTiers[0].id;

  const handleLaunchQuiz = async () => {
    setIsLoading(true);
    try {
      const generated = generateArithmeticQuestions({
        operation,
        tier: activeTier,
        count: questionCount,
        language,
      });

      const attemptResult = await startQuizAttemptAction(
        userId,
        `mod-arithmetic-${operation}`,
        generated.length
      );

      setAttemptId(attemptResult.attemptId);
      setActiveQuestions(generated);
      setDrillKey(Date.now());
      setIsQuizActive(true);
    } finally {
      setIsLoading(false);
    }
  };

  // Dynamically re-randomize questions when retrying the level
  const handleRestartDrill = async () => {
    setIsLoading(true);
    try {
      const freshQuestions = generateArithmeticQuestions({
        operation,
        tier: activeTier,
        count: questionCount,
        language,
      });

      const attemptResult = await startQuizAttemptAction(
        userId,
        `mod-arithmetic-${operation}`,
        freshQuestions.length
      );

      setAttemptId(attemptResult.attemptId);
      setActiveQuestions(freshQuestions);
      setDrillKey(Date.now());
    } finally {
      setIsLoading(false);
    }
  };

  if (isQuizActive) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-border/40">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsQuizActive(false)}
            className="text-xs font-bold gap-1 text-muted-foreground hover:text-foreground"
          >
            ← {t.common.back} ({t.arithmetic.quizDrills})
          </Button>

          <LanguageToggle size="xs" />
        </div>

        <ActiveQuizEngine
          key={`arithmetic-drill-${attemptId || drillKey}`}
          questions={activeQuestions}
          secondsPerQuestion={isUntimed ? 9999 : secondsPerQuestion}
          attemptId={attemptId}
          userId={userId}
          inputMode={inputMode}
          onRestart={handleRestartDrill}
          onExit={() => setIsQuizActive(false)}
        />
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Banner Card */}
      <Card className="border-primary/50 bg-gradient-to-br from-card via-card to-primary/10 shadow-md">
        <CardHeader className="p-6 sm:p-8 space-y-3">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <Badge variant="default" className="gap-1.5 font-bold text-xs">
              <Zap className="h-3.5 w-3.5 text-amber-500 fill-amber-500" />
              {t.arithmetic.quizDrills}
            </Badge>
            <div className="flex items-center gap-2">
              <LanguageToggle size="sm" />
            </div>
          </div>

          <CardTitle className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            {t.arithmetic.quizReadyTitle}
          </CardTitle>
          <CardDescription className="text-sm leading-relaxed max-w-2xl">
            {t.arithmetic.quizReadyDesc}
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Configuration Form */}
      <Card className="border-border/80 bg-card shadow-sm">
        <CardHeader className="p-6 pb-4">
          <CardTitle className="text-lg font-extrabold flex items-center gap-2">
            <Sliders className="h-5 w-5 text-primary" />
            {t.quiz.configureSession}
          </CardTitle>
          <CardDescription className="text-xs">
            {t.quiz.targetTopic}
          </CardDescription>
        </CardHeader>

        <CardContent className="p-6 pt-2 space-y-6">
          {/* 1. Operation Selector */}
          <div className="space-y-2.5">
            <Label className="text-xs font-extrabold uppercase tracking-wider text-muted-foreground">
              1. {t.arithmetic.selectOperation}
            </Label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {(
                [
                  { id: "multiplication", label: t.arithmetic.multiplication, icon: Zap, color: "text-amber-500" },
                  { id: "subtraction", label: t.arithmetic.subtraction, icon: Sliders, color: "text-rose-500" },
                  { id: "division", label: t.arithmetic.division, icon: Brain, color: "text-blue-500" },
                  { id: "addition", label: t.arithmetic.addition, icon: Sparkles, color: "text-emerald-500" },
                ] as const
              ).map((opItem) => {
                const Icon = opItem.icon;
                const isSelected = operation === opItem.id;
                return (
                  <Button
                    key={opItem.id}
                    type="button"
                    variant={isSelected ? "default" : "outline"}
                    onClick={() => {
                      setOperation(opItem.id);
                      const newAvailable = getTiersForOperation(opItem.id);
                      setTier(newAvailable[0].id);
                    }}
                    className="flex flex-col items-center justify-center h-auto py-3 gap-1.5 text-xs font-bold"
                  >
                    <Icon className={`h-4 w-4 ${isSelected ? "text-primary-foreground" : opItem.color}`} />
                    <span>{opItem.label}</span>
                  </Button>
                );
              })}
            </div>
          </div>

          {/* 2. Progressive Tier Selector */}
          <div className="space-y-2.5">
            <Label className="text-xs font-extrabold uppercase tracking-wider text-muted-foreground">
              2. {t.arithmetic.selectTier}
            </Label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {availableTiers.map((tItem) => {
                const isSelected = activeTier === tItem.id;
                return (
                  <button
                    key={tItem.id}
                    type="button"
                    onClick={() => setTier(tItem.id)}
                    className={`p-4 rounded-xl border text-left transition-all flex flex-col justify-between gap-2 cursor-pointer ${
                      isSelected
                        ? "border-primary bg-primary/10 shadow-xs ring-1 ring-primary/40"
                        : "border-border/80 bg-muted/20 hover:border-primary/50"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-xs font-extrabold text-foreground">{tItem.label}</span>
                      {isSelected && (
                        <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                      )}
                    </div>
                    <p className="text-[11px] text-muted-foreground leading-relaxed">
                      {tItem.desc}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 3. Answering Format Selector (MCQ vs Direct Active Recall / Essay) */}
          <div className="space-y-2.5 pt-2 border-t border-border/40">
            <Label className="text-xs font-extrabold uppercase tracking-wider text-muted-foreground">
              3. {t.quiz.inputModeLabel}
            </Label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setInputMode("mcq")}
                className={`p-4 rounded-xl border text-left transition-all flex flex-col justify-between gap-2.5 cursor-pointer ${
                  inputMode === "mcq"
                    ? "border-primary bg-primary/10 shadow-xs ring-1 ring-primary/40"
                    : "border-border/80 bg-muted/20 hover:border-primary/50"
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-primary/10 text-primary">
                      <ListOrdered className="h-4 w-4" />
                    </div>
                    <span className="text-xs font-extrabold text-foreground">{t.quiz.modeMCQ}</span>
                  </div>
                  {inputMode === "mcq" && (
                    <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                  )}
                </div>
                <p className="text-[11px] text-muted-foreground leading-relaxed">
                  {t.quiz.modeMCQDesc}
                </p>
              </button>

              <button
                type="button"
                onClick={() => setInputMode("direct")}
                className={`p-4 rounded-xl border text-left transition-all flex flex-col justify-between gap-2.5 cursor-pointer ${
                  inputMode === "direct"
                    ? "border-primary bg-primary/10 shadow-xs ring-1 ring-primary/40"
                    : "border-border/80 bg-muted/20 hover:border-primary/50"
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-primary/10 text-primary">
                      <PenLine className="h-4 w-4" />
                    </div>
                    <span className="text-xs font-extrabold text-foreground">{t.quiz.modeDirect}</span>
                  </div>
                  {inputMode === "direct" && (
                    <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                  )}
                </div>
                <p className="text-[11px] text-muted-foreground leading-relaxed">
                  {t.quiz.modeDirectDesc}
                </p>
              </button>
            </div>
          </div>

          {/* 4. Question Count & Timer Preset */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2 border-t border-border/40">
            {/* Question Count */}
            <div className="space-y-2">
              <Label className="text-xs font-extrabold uppercase tracking-wider text-muted-foreground">
                4. {t.arithmetic.questionCount}
              </Label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[5, 10, 15, 20].map((cnt) => (
                  <Button
                    key={cnt}
                    type="button"
                    variant={questionCount === cnt ? "default" : "outline"}
                    size="sm"
                    onClick={() => setQuestionCount(cnt)}
                    className="font-bold text-xs touch-tap"
                  >
                    {cnt} {t.common.questions}
                  </Button>
                ))}
              </div>
            </div>

            {/* Timer per question */}
            <div className="space-y-2">
              <Label className="text-xs font-extrabold uppercase tracking-wider text-muted-foreground">
                5. {t.arithmetic.timerPerQuestion}
              </Label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { sec: 5, label: language === "id" ? "5 dtk (Blitz)" : "5s (Blitz)" },
                  { sec: 10, label: language === "id" ? "10 dtk (Normal)" : "10s (Normal)" },
                  { sec: 15, label: language === "id" ? "15 dtk (Santai)" : "15s (Relaxed)" },
                  { sec: 0, label: language === "id" ? "Tanpa Waktu" : "Untimed" },
                ].map((item) => {
                  const isCurrent = (item.sec === 0 && isUntimed) || (!isUntimed && secondsPerQuestion === item.sec);
                  return (
                    <Button
                      key={item.sec}
                      type="button"
                      variant={isCurrent ? "default" : "outline"}
                      size="sm"
                      onClick={() => {
                        if (item.sec === 0) {
                          setIsUntimed(true);
                        } else {
                          setIsUntimed(false);
                          setSecondsPerQuestion(item.sec);
                        }
                      }}
                      className="font-bold text-xs touch-tap"
                    >
                      {item.label}
                    </Button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Start CTA */}
          <div className="pt-4 border-t border-border/40 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs text-muted-foreground flex items-center gap-1.5">
              <HelpCircle className="h-4 w-4 text-primary shrink-0" />
              <span>{t.quiz.keyboardTip}</span>
            </div>

            <Button
              size="lg"
              onClick={handleLaunchQuiz}
              disabled={isLoading}
              className="w-full sm:w-auto gap-2 font-extrabold shadow-md text-sm px-6 h-12 touch-tap"
            >
              <Play className="h-4 w-4 fill-current" />
              {isLoading ? t.common.loading : t.arithmetic.startQuiz}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
