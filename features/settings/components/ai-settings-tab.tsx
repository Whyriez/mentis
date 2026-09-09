"use client";

import React, { useState, useEffect } from "react";
import { Save, Sparkles, ShieldCheck } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SettingsService } from "../services/settings-service";
import { AISettingsConfig } from "../types";
import { updateAISettingsAction } from "../actions/settings-actions";

const settingsService = new SettingsService();

export function AISettingsTab() {
  const [form, setForm] = useState<AISettingsConfig | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    settingsService.getAISettings().then(setForm);
  }, []);

  if (!form) return null;

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSavedSuccess(false);
    try {
      await updateAISettingsAction(form);
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
            <Sparkles className="h-4 w-4 text-purple-500" />
            Gemini AI Generation Engine Parameters
          </CardTitle>
          <CardDescription className="text-xs">
            Configure default model, temperature creativity, safety filters, and daily generation limits. API key is stored securely server-side.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-3 rounded-xl border border-border bg-muted/20">
            <div>
              <div className="text-xs font-bold text-foreground">Global AI Generation Switch</div>
              <div className="text-[11px] text-muted-foreground">Enable or disable background AI content generation across the studio.</div>
            </div>
            <input
              type="checkbox"
              checked={form.aiEnabled}
              onChange={(e) => setForm({ ...form, aiEnabled: e.target.checked })}
              className="w-5 h-5 rounded accent-primary cursor-pointer"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-xs font-bold">Default Gemini Model</Label>
              <select
                value={form.geminiModel}
                onChange={(e) => setForm({ ...form, geminiModel: e.target.value })}
                className="w-full p-2.5 rounded-lg border border-border bg-background text-xs font-semibold"
              >
                <option value="gemini-1.5-pro">Gemini 1.5 Pro (High Reasoning)</option>
                <option value="gemini-1.5-flash">Gemini 1.5 Flash (Fast Speed)</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-bold">Temperature (Creativity: 0.0 - 1.0)</Label>
              <Input
                type="number"
                step="0.1"
                min="0"
                max="1"
                value={form.temperature}
                onChange={(e) => setForm({ ...form, temperature: Number(e.target.value) })}
                className="text-xs font-medium"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-xs font-bold">Daily AI Quota (Items)</Label>
              <Input
                type="number"
                value={form.dailyAIQuota}
                onChange={(e) => setForm({ ...form, dailyAIQuota: Number(e.target.value) })}
                className="text-xs font-medium"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-bold flex items-center gap-1">
                <ShieldCheck className="h-3.5 w-3.5 text-muted-foreground" />
                Safety Filtering Level
              </Label>
              <select
                value={form.safetyLevel}
                onChange={(e) => setForm({ ...form, safetyLevel: e.target.value as "Block None" | "Block Medium" | "Block High" })}
                className="w-full p-2.5 rounded-lg border border-border bg-background text-xs font-semibold"
              >
                <option value="Block None">Block None</option>
                <option value="Block Medium">Block Medium (Recommended)</option>
                <option value="Block High">Block High</option>
              </select>
            </div>
          </div>

          <div className="pt-4 border-t border-border flex items-center justify-between">
            {savedSuccess && <span className="text-xs font-bold text-emerald-500">AI parameters saved!</span>}
            <div className="ml-auto">
              <Button type="submit" disabled={isSaving} size="sm" className="gap-2 font-bold shadow-xs">
                <Save className="h-4 w-4" />
                {isSaving ? "Saving..." : "Save AI Parameters"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </form>
  );
}
