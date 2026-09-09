"use client";

import React, { useState } from "react";
import { HelpCircle, Clock, CheckCircle2, XCircle, Lightbulb } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FormattedMath } from "@/components/ui/formatted-math";

export function QuestionPreview({
  question,
  options,
  correctAnswer,
  explanation,
  difficulty = "Medium",
}: {
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
  difficulty?: string;
}) {
  const [selectedOpt, setSelectedOpt] = useState<string | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <Badge variant="outline" className="text-xs font-bold gap-1">
        <HelpCircle className="h-3.5 w-3.5" />
        Learner Quiz Drill Preview ({difficulty})
      </Badge>

      <Card className="border-border/80 bg-card shadow-md">
        <CardHeader className="flex flex-row items-center justify-between pb-3 border-b border-border/60">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-muted-foreground uppercase">Question #1</span>
          </div>

          <div className="flex items-center gap-1 text-xs text-amber-500 font-mono font-bold">
            <Clock className="h-3.5 w-3.5" />
            <span>00:15s</span>
          </div>
        </CardHeader>

        <CardContent className="pt-4 space-y-6">
          {/* Question Text */}
          <h3 className="text-lg sm:text-xl font-bold tracking-tight text-foreground">
            <FormattedMath text={question || "Question prompt text..."} />
          </h3>

          {/* Option Choices */}
          <div className="space-y-2.5">
            {options.map((opt, idx) => {
              const isSelected = selectedOpt === opt;
              const isCorrect = opt === correctAnswer;
              let btnClass = "border-border/80 bg-muted/20 hover:bg-muted/50 text-foreground";

              if (selectedOpt !== null) {
                if (isCorrect) {
                  btnClass = "border-emerald-500/80 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold";
                } else if (isSelected && !isCorrect) {
                  btnClass = "border-destructive/80 bg-destructive/10 text-destructive font-bold";
                }
              }

              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setSelectedOpt(opt);
                    setShowExplanation(true);
                  }}
                  className={`w-full p-3.5 rounded-xl border text-left flex items-center justify-between text-xs sm:text-sm font-semibold transition-all ${btnClass}`}
                >
                  <div className="flex items-center gap-3">
                    <span className="h-6 w-6 rounded-md bg-background border border-border flex items-center justify-center font-bold text-xs shrink-0">
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span>
                      <FormattedMath text={opt || `Choice ${idx + 1}`} />
                    </span>
                  </div>

                  {selectedOpt !== null && (
                    <>
                      {isCorrect && <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />}
                      {isSelected && !isCorrect && <XCircle className="h-4 w-4 text-destructive shrink-0" />}
                    </>
                  )}
                </button>
              );
            })}
          </div>

          {/* Solution Explanation */}
          {(showExplanation || selectedOpt !== null) && (
            <div className="p-4 rounded-xl border border-primary/30 bg-primary/5 space-y-2 text-xs">
              <div className="font-bold text-primary flex items-center gap-1.5">
                <Lightbulb className="h-4 w-4" />
                Solution Breakdown:
              </div>
              <p className="text-muted-foreground leading-relaxed">
                <FormattedMath text={explanation || "Solution step explanation..."} />
              </p>
            </div>
          )}

          <div className="flex justify-end">
            <Button
              type="button"
              variant="outline"
              size="xs"
              onClick={() => {
                setSelectedOpt(null);
                setShowExplanation(false);
              }}
              className="text-xs"
            >
              Reset Choice
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
