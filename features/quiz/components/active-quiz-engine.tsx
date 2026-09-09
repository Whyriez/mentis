"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  Timer,
  Pause,
  Play,
  AlertCircle,
  Keyboard,
  HelpCircle,
  PenLine,
  Send,
  Delete,
  CornerDownLeft,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Question } from "../types";
import { QuizResultView, UserAnswerRecord } from "./quiz-result-view";
import { submitQuizAttemptAction } from "../actions/quiz-actions";
import { useLanguage } from "@/components/providers/language-provider";

export type QuizInputMode = "mcq" | "direct";

interface ActiveQuizEngineProps {
  questions: Question[];
  secondsPerQuestion: number;
  attemptId?: string | null;
  userId?: string;
  inputMode?: QuizInputMode;
  onExit?: () => void;
  onRestart?: () => void;
}

export function ActiveQuizEngine({
  questions,
  secondsPerQuestion,
  attemptId,
  userId,
  inputMode = "mcq",
  onRestart,
}: ActiveQuizEngineProps) {
  const { language, t } = useLanguage();
  const [currentIndex, setCurrentIndex] = useState(0);
  const isUntimed = secondsPerQuestion >= 9999;
  const [timeLeft, setTimeLeft] = useState(isUntimed ? 0 : secondsPerQuestion);
  const [isPaused, setIsPaused] = useState(false);
  const [records, setRecords] = useState<UserAnswerRecord[]>([]);
  const [isFinished, setIsFinished] = useState(false);

  // Direct typing state
  const [typedAnswer, setTypedAnswer] = useState<string>("");
  const inputRef = useRef<HTMLInputElement>(null);
  const startTimeRef = useRef<number>(0);

  useEffect(() => {
    startTimeRef.current = Date.now();
    setTypedAnswer("");
    if (inputMode === "direct") {
      // Auto-focus input on next question
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [currentIndex, inputMode]);

  const currentQuestion = questions[currentIndex];

  // Handle answer selection / submission
  const handleSelectAnswer = useCallback(
    async (option: string | null) => {
      const timeTakenMs = Date.now() - (startTimeRef.current || Date.now());
      const isCorrect = option !== null && option.trim() === currentQuestion.answer.trim();

      const record: UserAnswerRecord = {
        question: currentQuestion,
        selectedOption: option,
        isCorrect,
        timeTakenMs,
      };

      const updatedRecords = [...records, record];
      setRecords(updatedRecords);

      if (currentIndex + 1 < questions.length) {
        setCurrentIndex((prev) => prev + 1);
        setTimeLeft(isUntimed ? 0 : secondsPerQuestion);
        startTimeRef.current = Date.now();
      } else {
        setIsFinished(true);
        // Persist quiz results to Supabase backend asynchronously
        await submitQuizAttemptAction({
          userId,
          attemptId,
          moduleId: currentQuestion.moduleId,
          lessonId: currentQuestion.lessonId,
          records: updatedRecords,
        });
      }
    },
    [currentQuestion, currentIndex, questions.length, records, secondsPerQuestion, isUntimed, userId, attemptId]
  );

  // Submit direct typed answer
  const handleSubmitDirectAnswer = useCallback(() => {
    const trimmed = typedAnswer.trim();
    if (!trimmed) return;
    handleSelectAnswer(trimmed);
  }, [typedAnswer, handleSelectAnswer]);

  // Timer effect (countdown or stopwatch for untimed)
  useEffect(() => {
    if (isPaused || isFinished) return;

    if (isUntimed) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => prev + 1);
      }, 1000);
      return () => clearInterval(timer);
    }

    if (timeLeft <= 0) {
      handleSelectAnswer(null); // Time expired
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, isPaused, isFinished, isUntimed, handleSelectAnswer]);

  // Keyboard shortcuts: 1-4 for MCQ only
  useEffect(() => {
    if (isPaused || isFinished || inputMode === "direct") return;

    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toUpperCase();
      let selectedIdx = -1;

      if (["1", "A"].includes(key)) selectedIdx = 0;
      if (["2", "B"].includes(key)) selectedIdx = 1;
      if (["3", "C"].includes(key)) selectedIdx = 2;
      if (["4", "D"].includes(key)) selectedIdx = 3;

      if (selectedIdx >= 0 && selectedIdx < currentQuestion.options.length) {
        handleSelectAnswer(currentQuestion.options[selectedIdx]);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isPaused, isFinished, inputMode, currentQuestion, handleSelectAnswer]);

  const handleRestart = () => {
    setCurrentIndex(0);
    setRecords([]);
    setIsFinished(false);
    setIsPaused(false);
    setTypedAnswer("");
    setTimeLeft(isUntimed ? 0 : secondsPerQuestion);
    startTimeRef.current = Date.now();
    if (onRestart) {
      onRestart();
    }
  };

  if (isFinished) {
    return (
      <QuizResultView
        records={records}
        totalQuestions={questions.length}
        onRestart={handleRestart}
      />
    );
  }

  const progressPercent = Math.round(
    ((currentIndex + 1) / questions.length) * 100
  );

  let timerColorClass = "text-emerald-500 border-emerald-500/30 bg-emerald-500/10";
  if (!isUntimed) {
    const timerRatio = timeLeft / secondsPerQuestion;
    if (timerRatio <= 0.3) {
      timerColorClass = "text-destructive border-destructive/30 bg-destructive/10 animate-pulse";
    } else if (timerRatio <= 0.6) {
      timerColorClass = "text-amber-500 border-amber-500/30 bg-amber-500/10";
    }
  }

  return (
    <div className="space-y-6 max-w-3xl mx-auto pb-12">
      {/* Top Header Bar: Question Counter & Timer */}
      <div className="flex flex-wrap sm:flex-nowrap items-center justify-between gap-3 p-3.5 sm:p-4 rounded-xl border border-border bg-card shadow-xs">
        <div className="space-y-1">
          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant="outline" className="text-xs font-semibold">
              {t.quiz.questionCounter} {currentIndex + 1} / {questions.length}
            </Badge>
            <Badge variant="secondary" className="text-[10px]">
              {currentQuestion.category}
            </Badge>
          </div>
          <Progress value={progressPercent} className="h-1.5 w-28 sm:w-48 mt-1.5" />
        </div>

        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <div
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-bold font-mono transition-colors ${timerColorClass}`}
          >
            <Timer className="h-4 w-4" />
            <span>{isUntimed ? `${timeLeft} ${t.common.secondsShort} (${t.common.practicing})` : `${timeLeft} ${t.common.secondsShort}`}</span>
          </div>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsPaused(!isPaused)}
            title={isPaused ? t.common.resume : t.common.pause}
            className="touch-tap"
          >
            {isPaused ? <Play className="h-4 w-4 fill-current" /> : <Pause className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      {/* Paused Overlay State */}
      {isPaused ? (
        <Card className="border-amber-500/40 bg-card p-12 text-center shadow-lg space-y-4">
          <AlertCircle className="h-10 w-10 text-amber-500 mx-auto" />
          <h2 className="text-2xl font-bold">{t.quiz.pausedTitle}</h2>
          <p className="text-sm text-muted-foreground max-w-sm mx-auto">
            {t.quiz.pausedDesc}
          </p>
          <Button onClick={() => setIsPaused(false)} size="lg" className="gap-2 font-bold shadow-md">
            <Play className="h-4 w-4 fill-current" />
            {t.quiz.resumeBtn}
          </Button>
        </Card>
      ) : (
        /* Active Question Card */
        <Card className="border-border/80 bg-card shadow-md">
          <CardHeader className="space-y-2 pb-4">
            <div className="flex justify-between items-center text-xs text-muted-foreground font-medium">
              <span>
                {t.common.difficulty}:{" "}
                {currentQuestion.difficulty === "Easy"
                  ? t.common.easy
                  : currentQuestion.difficulty === "Medium"
                  ? t.common.medium
                  : t.common.hard}
              </span>
              {inputMode === "direct" ? (
                <span className="flex items-center gap-1 text-primary font-semibold">
                  <PenLine className="h-3.5 w-3.5" />
                  {t.quiz.essayModeBadge}
                </span>
              ) : (
                <span className="flex items-center gap-1">
                  <Keyboard className="h-3.5 w-3.5" />
                  {t.quiz.keysShortcuts}
                </span>
              )}
            </div>
            <CardTitle className="text-2xl sm:text-3xl font-extrabold text-foreground pt-2">
              {currentQuestion.question}
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-6">
            {inputMode === "direct" ? (
              /* Direct Typing / Active Recall (Essay) Interface */
              <div className="space-y-5 pt-2">
                <div className="flex flex-col sm:flex-row gap-3 items-stretch">
                  <div className="relative flex-1">
                    <input
                      ref={inputRef}
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      value={typedAnswer}
                      onChange={(e) => setTypedAnswer(e.target.value.replace(/[^0-9-]/g, ""))}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleSubmitDirectAnswer();
                        }
                      }}
                      placeholder={t.quiz.typeAnswerPlaceholder}
                      className="w-full h-14 px-4 text-2xl sm:text-3xl font-mono font-bold tracking-wider rounded-xl border-2 border-border focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none bg-background text-foreground transition-all shadow-inner"
                      autoFocus
                    />
                    {typedAnswer && (
                      <button
                        type="button"
                        onClick={() => {
                          setTypedAnswer("");
                          inputRef.current?.focus();
                        }}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-muted-foreground hover:text-foreground px-2 py-1 rounded bg-muted/60"
                        title={t.quiz.clear}
                      >
                        ✕
                      </button>
                    )}
                  </div>

                  <Button
                    type="button"
                    size="lg"
                    onClick={handleSubmitDirectAnswer}
                    disabled={!typedAnswer.trim()}
                    className="h-14 px-7 gap-2 text-base font-bold shadow-md cursor-pointer shrink-0 touch-tap"
                  >
                    <Send className="h-4 w-4" />
                    {t.quiz.submitAnswer}
                  </Button>
                </div>

                {/* Tactile Virtual Numpad */}
                <div className="max-w-xs mx-auto pt-2 space-y-2">
                  <div className="grid grid-cols-3 gap-2">
                    {["1", "2", "3", "4", "5", "6", "7", "8", "9"].map((digit) => (
                      <button
                        key={digit}
                        type="button"
                        onClick={() => {
                          setTypedAnswer((prev) => prev + digit);
                          inputRef.current?.focus();
                        }}
                        className="h-12 rounded-xl border border-border/80 bg-card hover:bg-primary/10 hover:border-primary/50 text-xl font-bold font-mono text-foreground transition-all active:scale-90 shadow-2xs cursor-pointer touch-tap"
                      >
                        {digit}
                      </button>
                    ))}
                    <button
                      type="button"
                      onClick={() => {
                        setTypedAnswer("");
                        inputRef.current?.focus();
                      }}
                      className="h-12 rounded-xl border border-border/80 bg-muted/40 hover:bg-muted text-xs font-bold text-muted-foreground hover:text-foreground transition-all active:scale-90 cursor-pointer touch-tap"
                    >
                      {t.quiz.clear}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setTypedAnswer((prev) => prev + "0");
                        inputRef.current?.focus();
                      }}
                      className="h-12 rounded-xl border border-border/80 bg-card hover:bg-primary/10 hover:border-primary/50 text-xl font-bold font-mono text-foreground transition-all active:scale-90 shadow-2xs cursor-pointer touch-tap"
                    >
                      0
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setTypedAnswer((prev) => prev.slice(0, -1));
                        inputRef.current?.focus();
                      }}
                      className="h-12 rounded-xl border border-border/80 bg-muted/40 hover:bg-muted text-xs font-bold text-muted-foreground hover:text-foreground transition-all active:scale-90 flex items-center justify-center cursor-pointer touch-tap"
                      title={t.quiz.backspace}
                    >
                      <Delete className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <div className="pt-2 text-center text-xs text-muted-foreground flex items-center justify-center gap-1.5">
                  <CornerDownLeft className="h-3.5 w-3.5 text-primary" />
                  <span>{t.quiz.pressEnterTip}</span>
                </div>
              </div>
            ) : (
              /* Multiple Choice Options */
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  {currentQuestion.options.map((opt, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSelectAnswer(opt)}
                      className="p-4 rounded-xl border border-border/80 bg-card hover:border-primary hover:bg-primary/5 transition-all text-left flex items-center justify-between group cursor-pointer shadow-2xs touch-tap active:scale-[0.98]"
                    >
                      <div className="flex items-center gap-3">
                        <div className="h-7 w-7 rounded-lg bg-muted text-muted-foreground font-bold text-xs flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-colors shrink-0">
                          {idx + 1}
                        </div>
                        <span className="text-base font-bold text-foreground">{opt}</span>
                      </div>
                    </button>
                  ))}
                </div>

                <div className="pt-4 text-center text-xs text-muted-foreground flex items-center justify-center gap-1">
                  <HelpCircle className="h-3.5 w-3.5" />
                  {t.quiz.shortcutsTip}
                </div>
              </>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
