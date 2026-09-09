"use client";

import React, { useState, useEffect } from "react";
import { Save, Globe, Clock, Mail } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SettingsService } from "../services/settings-service";
import { PlatformGeneralSettings } from "../types";
import { updateGeneralSettingsAction } from "../actions/settings-actions";

const settingsService = new SettingsService();

export function GeneralSettingsTab() {
  const [form, setForm] = useState<PlatformGeneralSettings | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    settingsService.getGeneralSettings().then(setForm);
  }, []);

  if (!form) return null;

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSavedSuccess(false);
    try {
      await updateGeneralSettingsAction(form);
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
            <Globe className="h-4 w-4 text-primary" />
            General Branding & Localization
          </CardTitle>
          <CardDescription className="text-xs">Configure application title, support contacts, timezone, and regional defaults.</CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-xs font-bold">Platform Name</Label>
              <Input
                value={form.platformName}
                onChange={(e) => setForm({ ...form, platformName: e.target.value })}
                className="text-xs font-medium"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-bold flex items-center gap-1">
                <Mail className="h-3.5 w-3.5 text-muted-foreground" />
                Support Email
              </Label>
              <Input
                value={form.contactEmail}
                onChange={(e) => setForm({ ...form, contactEmail: e.target.value })}
                className="text-xs font-medium"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-xs font-bold flex items-center gap-1">
                <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                System Timezone
              </Label>
              <Input
                value={form.timezone}
                onChange={(e) => setForm({ ...form, timezone: e.target.value })}
                className="text-xs font-medium"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-bold">Default Language</Label>
              <select
                value={form.defaultLanguage}
                onChange={(e) => setForm({ ...form, defaultLanguage: e.target.value })}
                className="w-full p-2.5 rounded-lg border border-border bg-background text-xs font-semibold"
              >
                <option value="en">English (US)</option>
                <option value="id">Indonesian (Bahasa Indonesia)</option>
              </select>
            </div>
          </div>

          <div className="pt-4 border-t border-border flex items-center justify-between">
            {savedSuccess && <span className="text-xs font-bold text-emerald-500">Settings saved successfully!</span>}
            <div className="ml-auto">
              <Button type="submit" disabled={isSaving} size="sm" className="gap-2 font-bold shadow-xs">
                <Save className="h-4 w-4" />
                {isSaving ? "Saving Changes..." : "Save Branding Settings"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </form>
  );
}
