"use client";

import React, { useState } from "react";
import { Sliders, Sparkles, Target, Clock, BookOpen, Check } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AssessmentPreferences, TargetTimeline, PrepPurpose, DailyStudyMinutes } from "../types";
import { updateAssessmentAction } from "../actions/roadmap-actions";

interface ModalProps {
  initialPreferences: AssessmentPreferences;
  onSaved?: () => void;
}

export function InitialAssessmentModal({ initialPreferences, onSaved }: ModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [timeline, setTimeline] = useState<TargetTimeline>(initialPreferences.timeline);
  const [purpose, setPurpose] = useState<PrepPurpose>(initialPreferences.purpose);
  const [dailyMinutes, setDailyMinutes] = useState<DailyStudyMinutes>(initialPreferences.dailyMinutes);
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async () => {
    setIsLoading(true);
    try {
      await updateAssessmentAction("guest", {
        timeline,
        purpose,
        dailyMinutes,
      });
      setIsOpen(false);
      if (onSaved) onSaved();
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        variant="outline"
        size="sm"
        className="gap-2 font-semibold text-xs"
      >
        <Sliders className="h-3.5 w-3.5 text-primary" />
        Configure Prep Goals
      </Button>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-xs flex items-center justify-center p-4">
      <Card className="max-w-xl w-full border-border bg-card shadow-2xl space-y-4">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <Badge variant="accent" className="gap-1">
              <Sparkles className="h-3 w-3" />
              Adaptive Roadmap Assessment
            </Badge>
            <Button variant="ghost" size="xs" onClick={() => setIsOpen(false)}>
              ✕
            </Button>
          </div>
          <CardTitle className="text-2xl font-bold pt-2">Customize Your Study Target</CardTitle>
          <CardDescription className="text-xs">
            Specify your psychometric exam goal, target timeframe, and daily study capacity to generate your personalized learning plan.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Target Timeline */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-foreground flex items-center gap-1.5">
              <Target className="h-3.5 w-3.5 text-primary" />
              Target Preparation Timeframe
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {(["1 Month", "3 Months", "6 Months", "12 Months"] as TargetTimeline[]).map((t) => (
                <Button
                  key={t}
                  type="button"
                  variant={timeline === t ? "default" : "outline"}
                  onClick={() => setTimeline(t)}
                  size="xs"
                  className="font-semibold"
                >
                  {t}
                </Button>
              ))}
            </div>
          </div>

          {/* Prep Purpose */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-foreground flex items-center gap-1.5">
              <BookOpen className="h-3.5 w-3.5 text-primary" />
              Primary Purpose
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {(["Job Interview", "Internship", "CPNS", "Scholarship", "General Learning"] as PrepPurpose[]).map((p) => (
                <Button
                  key={p}
                  type="button"
                  variant={purpose === p ? "default" : "outline"}
                  onClick={() => setPurpose(p)}
                  size="xs"
                  className="font-semibold text-[11px]"
                >
                  {p}
                </Button>
              ))}
            </div>
          </div>

          {/* Daily Study Commitment */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-foreground flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5 text-primary" />
              Daily Study Commitment
            </label>
            <div className="grid grid-cols-4 gap-2">
              {([15, 30, 45, 60] as DailyStudyMinutes[]).map((m) => (
                <Button
                  key={m}
                  type="button"
                  variant={dailyMinutes === m ? "default" : "outline"}
                  onClick={() => setDailyMinutes(m)}
                  size="xs"
                  className="font-semibold"
                >
                  {m} Min / Day
                </Button>
              ))}
            </div>
          </div>

          {/* Save trigger */}
          <div className="pt-4 border-t border-border flex items-center justify-end gap-3">
            <Button variant="outline" size="sm" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={isLoading} size="sm" className="gap-2 font-bold shadow-md">
              <Check className="h-4 w-4" />
              {isLoading ? "Generating..." : "Generate Roadmap"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
