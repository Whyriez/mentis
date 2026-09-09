"use client";

import React, { useState } from "react";
import { Settings, Globe, BookOpen, Sparkles, ToggleLeft, AlertOctagon, Activity, HardDrive, Lock, FileCode } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GeneralSettingsTab } from "@/features/settings/components/general-settings-tab";
import { LearningQuizSettingsTab } from "@/features/settings/components/learning-quiz-settings-tab";
import { AISettingsTab } from "@/features/settings/components/ai-settings-tab";
import { MaintenanceModeTab } from "@/features/settings/components/maintenance-mode-tab";
import { FeatureFlagsTab } from "@/features/feature-flags/components/feature-flags-tab";
import { PromptManager } from "@/features/ai/components/prompt-manager";
import { SystemHealthTab } from "@/features/system-health/components/system-health-tab";
import { BackupStatusTab } from "@/features/system-health/components/backup-status-tab";
import { SecurityDashboardTab } from "@/features/security/components/security-dashboard-tab";

export default function AdminSettingsPage() {
  const [activeTab, setActiveTab] = useState<
    "general" | "quiz" | "ai" | "flags" | "prompts" | "maintenance" | "health" | "backup" | "security"
  >("general");

  return (
    <div className="space-y-8 pb-12">
      {/* Page Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary">
          <Settings className="h-4 w-4" />
          <span>Super Admin Control Center</span>
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight">Platform Settings & System Administration</h1>
        <p className="text-muted-foreground text-sm max-w-2xl">
          Configure application defaults, runtime feature flags, Gemini AI prompts, system health, and security controls.
        </p>
      </div>

      {/* Settings Navigation Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-border pb-3">
        <Button
          variant={activeTab === "general" ? "default" : "outline"}
          onClick={() => setActiveTab("general")}
          size="sm"
          className="gap-2 font-semibold text-xs"
        >
          <Globe className="h-3.5 w-3.5" />
          General
        </Button>

        <Button
          variant={activeTab === "quiz" ? "default" : "outline"}
          onClick={() => setActiveTab("quiz")}
          size="sm"
          className="gap-2 font-semibold text-xs"
        >
          <BookOpen className="h-3.5 w-3.5" />
          Learning & Quiz
        </Button>

        <Button
          variant={activeTab === "ai" ? "default" : "outline"}
          onClick={() => setActiveTab("ai")}
          size="sm"
          className="gap-2 font-semibold text-xs"
        >
          <Sparkles className="h-3.5 w-3.5" />
          AI Engine
        </Button>

        <Button
          variant={activeTab === "flags" ? "default" : "outline"}
          onClick={() => setActiveTab("flags")}
          size="sm"
          className="gap-2 font-semibold text-xs"
        >
          <ToggleLeft className="h-3.5 w-3.5" />
          Feature Flags
        </Button>

        <Button
          variant={activeTab === "prompts" ? "default" : "outline"}
          onClick={() => setActiveTab("prompts")}
          size="sm"
          className="gap-2 font-semibold text-xs"
        >
          <FileCode className="h-3.5 w-3.5" />
          Prompt Library
        </Button>

        <Button
          variant={activeTab === "maintenance" ? "default" : "outline"}
          onClick={() => setActiveTab("maintenance")}
          size="sm"
          className="gap-2 font-semibold text-xs"
        >
          <AlertOctagon className="h-3.5 w-3.5" />
          Maintenance Mode
        </Button>

        <Button
          variant={activeTab === "health" ? "default" : "outline"}
          onClick={() => setActiveTab("health")}
          size="sm"
          className="gap-2 font-semibold text-xs"
        >
          <Activity className="h-3.5 w-3.5" />
          System Health
        </Button>

        <Button
          variant={activeTab === "backup" ? "default" : "outline"}
          onClick={() => setActiveTab("backup")}
          size="sm"
          className="gap-2 font-semibold text-xs"
        >
          <HardDrive className="h-3.5 w-3.5" />
          Backups
        </Button>

        <Button
          variant={activeTab === "security" ? "default" : "outline"}
          onClick={() => setActiveTab("security")}
          size="sm"
          className="gap-2 font-semibold text-xs"
        >
          <Lock className="h-3.5 w-3.5" />
          Security Center
        </Button>
      </div>

      {/* Tab Content Display */}
      {activeTab === "general" && <GeneralSettingsTab />}
      {activeTab === "quiz" && <LearningQuizSettingsTab />}
      {activeTab === "ai" && <AISettingsTab />}
      {activeTab === "flags" && <FeatureFlagsTab />}
      {activeTab === "prompts" && <PromptManager />}
      {activeTab === "maintenance" && <MaintenanceModeTab />}
      {activeTab === "health" && <SystemHealthTab />}
      {activeTab === "backup" && <BackupStatusTab />}
      {activeTab === "security" && <SecurityDashboardTab />}
    </div>
  );
}
