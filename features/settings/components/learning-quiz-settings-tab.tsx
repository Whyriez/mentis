"use client";

import React, { useState, useEffect } from "react";
import { Save, BookOpen } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SettingsService } from "../services/settings-service";
import { LearningQuizSettings } from "../types";
import { updateLearningQuizSettingsAction } from "../actions/settings-actions";

const settingsService = new SettingsService();

export function LearningQuizSettingsTab() {
  const [form, setForm] = useState<LearningQuizSettings | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    settingsService.getLearningQuizSettings().then(setForm);
  }, []);

  if (!form) return null;

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSavedSuccess(false);
    try {
      await updateLearningQuizSettingsAction(form);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSave} className="space-y-6">
      <Card className="border-border/80 bg-card shadow-xs">
        <CardHeader>
          <CardTitle className="text-base font-bold flex items-center gap-2">
            <BookOpen className="h-4 w-4 text-primary" />
            Curriculum & Quiz Engine Thresholds
          </CardTitle>
          <CardDescription className="text-xs">Configure passing scores, timers, daily targets, and question shuffle behaviors.</CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label className="text-xs font-bold">Passing Score (%)</Label>
              <Input
                type="number"
                value={form.passingScorePercentage}
                onChange={(e) => setForm({ ...form, passingScorePercentage: Number(e.target.value) })}
                className="text-xs font-medium"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-bold">Default Quiz Timer (Seconds)</Label>
              <Input
                type="number"
                value={form.defaultQuizTimerSeconds}
                onChange={(e) => setForm({ ...form, defaultQuizTimerSeconds: Number(e.target.value) })}
                className="text-xs font-medium"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-bold">Daily Study Goal (Minutes)</Label>
              <Input
                type="number"
                value={form.defaultDailyGoalMinutes}
                onChange={(e) => setForm({ ...form, defaultDailyGoalMinutes: Number(e.target.value) })}
                className="text-xs font-medium"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="flex items-center justify-between p-3 rounded-xl border border-border bg-muted/20">
              <Label className="text-xs font-bold">Shuffle Quiz Questions</Label>
              <input
                type="checkbox"
                checked={form.shuffleQuestions}
                onChange={(e) => setForm({ ...form, shuffleQuestions: e.target.checked })}
                className="w-4 h-4 rounded accent-primary cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl border border-border bg-muted/20">
              <Label className="text-xs font-bold">Shuffle Answer Options</Label>
              <input
                type="checkbox"
                checked={form.shuffleOptions}
                onChange={(e) => setForm({ ...form, shuffleOptions: e.target.checked })}
                className="w-4 h-4 rounded accent-primary cursor-pointer"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-border flex items-center justify-between">
            {savedSuccess && <span className="text-xs font-bold text-emerald-500">Quiz thresholds saved!</span>}
            <div className="ml-auto">
              <Button type="submit" disabled={isSaving} size="sm" className="gap-2 font-bold shadow-xs">
                <Save className="h-4 w-4" />
                {isSaving ? "Saving..." : "Save Quiz Settings"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </form>
  );
}
