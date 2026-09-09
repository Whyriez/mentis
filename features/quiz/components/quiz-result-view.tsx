"use client";

import React from "react";
import Link from "next/link";
import {
  Award,
  CheckCircle2,
  XCircle,
  RotateCcw,
  BookOpen,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Question } from "../types";
import { useLanguage } from "@/components/providers/language-provider";

export interface UserAnswerRecord {
  question: Question;
  selectedOption: string | null;
  isCorrect: boolean;
  timeTakenMs: number;
}

interface QuizResultViewProps {
  records: UserAnswerRecord[];
  totalQuestions: number;
  onRestart: () => void;
}

export function QuizResultView({
  records,
  totalQuestions,
  onRestart,
}: QuizResultViewProps) {
  const { language, t } = useLanguage();
  const [expandedIdx, setExpandedIdx] = React.useState<number | null>(null);

  const correctCount = records.filter((r) => r.isCorrect).length;
  const wrongCount = totalQuestions - correctCount;
  const accuracy = Math.round((correctCount / totalQuestions) * 100);

  const totalTimeMs = records.reduce((acc, r) => acc + r.timeTakenMs, 0);
  const avgResponseTimeSec = (totalTimeMs / totalQuestions / 1000).toFixed(1);

  // Performance badge tier
  let performanceTier = language === "id" ? "Perlu Latihan Tambahan" : "Needs Improvement";
  let tierColor = "destructive";
  if (accuracy >= 90) {
    performanceTier = language === "id" ? "Tingkat Penguasaan Tinggi 🏆" : "Mastery Level 🏆";
    tierColor = "accent";
  } else if (accuracy >= 70) {
    performanceTier = language === "id" ? "Kompeten & Cukup Cepat 👍" : "Proficient 👍";
    tierColor = "amber";
  }

  return (
    <div className="space-y-8 pb-12 max-w-4xl mx-auto">
      {/* Top Banner */}
      <Card className="border-border/80 bg-gradient-to-br from-card via-card to-primary/5 p-6 shadow-md text-center">
        <div className="mx-auto w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-3">
          <Award className="h-6 w-6" />
        </div>

        <Badge variant={tierColor as "default" | "secondary" | "destructive" | "outline" | "accent" | "amber"} className="mb-2">
          {performanceTier}
        </Badge>

        <h1 className="text-3xl font-extrabold tracking-tight">{t.quiz.completeTitle}</h1>
        <p className="text-xs text-muted-foreground mt-1">
          {t.quiz.completeDesc}
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
          <div className="p-3 rounded-xl bg-card border border-border/50">
            <div className="text-xs font-semibold text-muted-foreground">{t.quiz.finalScore}</div>
            <div className="text-2xl font-bold text-primary mt-0.5">{accuracy}%</div>
          </div>

          <div className="p-3 rounded-xl bg-card border border-border/50">
            <div className="text-xs font-semibold text-muted-foreground">{t.quiz.accuracyLabel}</div>
            <div className="text-2xl font-bold text-foreground mt-0.5">
              {correctCount} / {totalQuestions}
            </div>
          </div>

          <div className="p-3 rounded-xl bg-card border border-border/50">
            <div className="text-xs font-semibold text-muted-foreground">{t.quiz.avgSpeedLabel}</div>
            <div className="text-2xl font-bold text-emerald-500 mt-0.5">{avgResponseTimeSec} {t.common.secondsShort}</div>
          </div>

          <div className="p-3 rounded-xl bg-card border border-border/50">
            <div className="text-xs font-semibold text-muted-foreground">{t.quiz.incorrectLabel}</div>
            <div className="text-2xl font-bold text-destructive mt-0.5">{wrongCount}</div>
          </div>
        </div>
      </Card>

      {/* Answer Breakdown & Explanations */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold">{t.quiz.detailedBreakdown}</h3>

        <div className="space-y-3">
          {records.map((rec, idx) => {
            const isExpanded = expandedIdx === idx;
            const timeSec = (rec.timeTakenMs / 1000).toFixed(1);

            return (
              <Card
                key={idx}
                className={`border-border/60 transition-all ${
                  rec.isCorrect ? "border-l-4 border-l-emerald-500" : "border-l-4 border-l-destructive"
                }`}
              >
                <div
                  className="p-4 flex items-center justify-between cursor-pointer"
                  onClick={() => setExpandedIdx(isExpanded ? null : idx)}
                >
                  <div className="flex items-center gap-3">
                    {rec.isCorrect ? (
                      <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0" />
                    ) : (
                      <XCircle className="h-5 w-5 text-destructive shrink-0" />
                    )}

                    <div>
                      <div className="text-xs font-bold text-muted-foreground">{t.quiz.questionCounter} {idx + 1}</div>
                      <h4 className="text-sm font-semibold text-foreground">{rec.question.question}</h4>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <span className="text-xs text-muted-foreground font-mono">{timeSec} {t.common.secondsShort}</span>
                    {isExpanded ? (
                      <ChevronUp className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <ChevronDown className="h-4 w-4 text-muted-foreground" />
                    )}
                  </div>
                </div>

                {isExpanded && (
                  <div className="px-4 pb-4 pt-2 border-t border-border/40 bg-muted/20 space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      <div>
                        <span className="text-muted-foreground">{t.quiz.yourAnswer}: </span>
                        <span className={`font-semibold ${rec.isCorrect ? "text-emerald-500" : "text-destructive"}`}>
                          {rec.selectedOption ?? t.quiz.timeExpired}
                        </span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">{t.quiz.correctAnswer}: </span>
                        <span className="font-semibold text-emerald-500">{rec.question.answer}</span>
                      </div>
                    </div>

                    <div className="p-3 rounded-lg bg-card border border-border/50 text-xs">
                      <div className="font-bold text-primary mb-1">{t.quiz.thinkingProcess}:</div>
                      <p className="text-muted-foreground leading-relaxed">{rec.question.explanation}</p>
                    </div>
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      </div>

      {/* Action Navigation */}
      <div className="pt-4 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-3">
        <Link href="/arithmetic" className="w-full sm:w-auto">
          <Button variant="outline" className="w-full sm:w-auto h-12 sm:h-10 gap-2 font-semibold touch-tap">
            <BookOpen className="h-4 w-4" />
            {t.quiz.backToArithmetic}
          </Button>
        </Link>

        <Button onClick={onRestart} size="lg" className="w-full sm:w-auto h-12 gap-2 font-bold shadow-md touch-tap">
          <RotateCcw className="h-4 w-4" />
          {t.quiz.restartBtn}
        </Button>
      </div>
    </div>
  );
}
