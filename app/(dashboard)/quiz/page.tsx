"use client";

import React, { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { ArithmeticQuizView } from "@/features/arithmetic/components/arithmetic-quiz-view";
import { ArithmeticOperation, ArithmeticTier } from "@/features/arithmetic/services/arithmetic-generator";

function QuizPageContent() {
  const searchParams = useSearchParams();
  const opParam = searchParams.get("module") || searchParams.get("operation");
  const tierParam = searchParams.get("tier");

  let initialOperation: ArithmeticOperation = "multiplication";
  if (opParam === "subtraction") initialOperation = "subtraction";
  else if (opParam === "division") initialOperation = "division";
  else if (opParam === "addition") initialOperation = "addition";
  else if (opParam === "mixed") initialOperation = "mixed";

  let initialTier: ArithmeticTier = "1-10";
  if (tierParam && ["1-10", "1-20", "1-30", "1-50", "1-100", "1-1000"].includes(tierParam)) {
    initialTier = tierParam as ArithmeticTier;
  } else if (initialOperation === "subtraction") {
    initialTier = "1-20";
  }
  const modeParam = searchParams.get("mode");
  let initialMode: "mcq" | "direct" = "mcq";
  if (modeParam === "direct" || modeParam === "essay") {
    initialMode = "direct";
  }

  return (
    <div className="py-2">
      <ArithmeticQuizView
        initialOperation={initialOperation}
        initialTier={initialTier}
        initialMode={initialMode}
      />
    </div>
  );
}

export default function QuizPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs text-muted-foreground">Loading Quiz Engine...</div>}>
      <QuizPageContent />
    </Suspense>
  );
}
