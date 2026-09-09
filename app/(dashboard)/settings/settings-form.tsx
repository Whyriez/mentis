"use client";

import React, { useState } from "react";
import { User, Target, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updateUserProfileSettingsAction } from "@/features/settings/actions/settings-actions";

interface SettingsFormProps {
  initialFullName: string;
  initialEmail: string;
  initialDailyGoalMinutes: number;
  initialRoadmapTargetMonths: number;
}

export function SettingsForm({
  initialFullName,
  initialEmail,
  initialDailyGoalMinutes,
  initialRoadmapTargetMonths,
}: SettingsFormProps) {
  const [fullName, setFullName] = useState(initialFullName);
  const [dailyGoalMinutes, setDailyGoalMinutes] = useState(initialDailyGoalMinutes);
  const [roadmapTargetMonths, setRoadmapTargetMonths] = useState(initialRoadmapTargetMonths);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    try {
      const res = await updateUserProfileSettingsAction({
        fullName,
        dailyGoalMinutes: Number(dailyGoalMinutes),
        roadmapTargetMonths: Number(roadmapTargetMonths),
      });

      if (res.success) {
        setMessage({ type: "success", text: "Settings updated successfully!" });
      } else {
        setMessage({ type: "error", text: res.error || "Failed to save settings." });
      }
    } catch {
      setMessage({ type: "error", text: "An unexpected error occurred." });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {message && (
        <div
          className={`p-3 rounded-xl flex items-center gap-2 text-xs font-semibold ${
            message.type === "success"
              ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/30"
              : "bg-destructive/10 text-destructive border border-destructive/30"
          }`}
        >
          {message.type === "success" ? (
            <CheckCircle2 className="h-4 w-4 shrink-0" />
          ) : (
            <AlertCircle className="h-4 w-4 shrink-0" />
          )}
          <span>{message.text}</span>
        </div>
      )}

      <Card className="border-border/80 bg-card shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-bold flex items-center gap-2">
            <User className="h-5 w-5 text-primary" />
            Profile Details
          </CardTitle>
          <CardDescription className="text-xs">Update your display name and email address.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Enter your full name"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input id="email" value={initialEmail} disabled />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-border/80 bg-card shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-bold flex items-center gap-2">
            <Target className="h-5 w-5 text-emerald-500" />
            Training Goals & Targets
          </CardTitle>
          <CardDescription className="text-xs">Set daily target minutes and target completion window.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="dailyGoal">Daily Target (Minutes)</Label>
              <Input
                id="dailyGoal"
                type="number"
                value={dailyGoalMinutes}
                onChange={(e) => setDailyGoalMinutes(Number(e.target.value))}
                min={5}
                max={120}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="roadmapTarget">Roadmap Target (Months)</Label>
              <Input
                id="roadmapTarget"
                type="number"
                value={roadmapTargetMonths}
                onChange={(e) => setRoadmapTargetMonths(Number(e.target.value))}
                min={1}
                max={12}
                required
              />
            </div>
          </div>
          <div className="pt-2 flex justify-end">
            <Button type="submit" disabled={isLoading} className="font-semibold shadow-xs gap-2">
              {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
              Save Settings
            </Button>
          </div>
        </CardContent>
      </Card>
    </form>
  );
}
