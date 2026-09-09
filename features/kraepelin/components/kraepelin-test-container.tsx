"use client";

import React, { useState } from "react";
import {
  KraepelinColumnData,
  KraepelinConfig,
  KraepelinMetrics,
} from "../types";
import { KraepelinConfigCard } from "./kraepelin-config-card";
import { KraepelinTestEngine } from "./kraepelin-test-engine";
import { KraepelinResultView } from "./kraepelin-result-view";
import { KraepelinEvaluator } from "../services/kraepelin-evaluator";
import { submitKraepelinAttemptAction } from "../actions/kraepelin-actions";

type TestState = "config" | "active" | "result";

export function KraepelinTestContainer() {
  const [testState, setTestState] = useState<TestState>("config");
  const [activeConfig, setActiveConfig] = useState<KraepelinConfig>({
    mode: "kraepelin",
    columnCount: 10,
    numbersPerColumn: 35,
    secondsPerColumn: 30,
    soundEnabled: true,
  });

  const [metrics, setMetrics] = useState<KraepelinMetrics | null>(null);
  const [earnedXP, setEarnedXP] = useState<number>(50);

  const handleStart = (config: KraepelinConfig) => {
    setActiveConfig(config);
    setTestState("active");
  };

  const handleComplete = async (completedColumns: KraepelinColumnData[]) => {
    const computedMetrics = KraepelinEvaluator.evaluate(
      completedColumns,
      activeConfig.mode
    );
    setMetrics(computedMetrics);
    setTestState("result");

    // Persist attempt and award XP via server action
    try {
      const res = await submitKraepelinAttemptAction({
        metrics: computedMetrics,
        columnCount: activeConfig.columnCount,
      });
      if (res?.earnedXP) {
        setEarnedXP(res.earnedXP);
      }
    } catch {
      // Graceful fallback
    }
  };

  const handleCancel = () => {
    setTestState("config");
  };

  const handleRetry = () => {
    setTestState("config");
  };

  return (
    <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-6">
      {testState === "config" && (
        <KraepelinConfigCard onStart={handleStart} />
      )}

      {testState === "active" && (
        <KraepelinTestEngine
          config={activeConfig}
          onComplete={handleComplete}
          onCancel={handleCancel}
        />
      )}

      {testState === "result" && metrics && (
        <KraepelinResultView
          metrics={metrics}
          earnedXP={earnedXP}
          onRetry={handleRetry}
        />
      )}
    </div>
  );
}
