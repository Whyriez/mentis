"use client";

import React, { useState } from "react";
import { Sparkles, Layers, Clock, FileCode, Cpu } from "lucide-react";
import { AIDashboardOverview } from "@/features/ai/components/ai-dashboard-overview";
import { AIGeneratorForm } from "@/features/ai/components/ai-generator-form";
import { AIJobTracker } from "@/features/ai/components/ai-job-tracker";
import { AIDraftQueue } from "@/features/ai/components/ai-draft-queue";
import { PromptManager } from "@/features/ai/components/prompt-manager";
import { AILogsTable } from "@/features/ai/components/ai-logs-table";
import { Button } from "@/components/ui/button";

export default function AdminAIPage() {
  const [activeTab, setActiveTab] = useState<
    "overview" | "drafts" | "jobs" | "prompts" | "logs"
  >("overview");
  const [refreshKey, setRefreshKey] = useState(0);

  const handleJobCreated = () => {
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary">
            <Sparkles className="h-4 w-4" />
            <span>AI Authoring Pipeline</span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight">AI Content Studio</h1>
          <p className="text-muted-foreground text-sm">Generate, validate, and review educational content with Gemini AI.</p>
        </div>

        {/* Tab Selector Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <Button
            size="xs"
            variant={activeTab === "overview" ? "default" : "outline"}
            onClick={() => setActiveTab("overview")}
            className="gap-1.5 font-bold text-xs"
          >
            <Sparkles className="h-3.5 w-3.5" />
            Studio & Generator
          </Button>

          <Button
            size="xs"
            variant={activeTab === "drafts" ? "default" : "outline"}
            onClick={() => setActiveTab("drafts")}
            className="gap-1.5 font-bold text-xs"
          >
            <Layers className="h-3.5 w-3.5" />
            Draft Queue
          </Button>

          <Button
            size="xs"
            variant={activeTab === "jobs" ? "default" : "outline"}
            onClick={() => setActiveTab("jobs")}
            className="gap-1.5 font-bold text-xs"
          >
            <Clock className="h-3.5 w-3.5" />
            Job Queue
          </Button>

          <Button
            size="xs"
            variant={activeTab === "prompts" ? "default" : "outline"}
            onClick={() => setActiveTab("prompts")}
            className="gap-1.5 font-bold text-xs"
          >
            <FileCode className="h-3.5 w-3.5" />
            Prompts
          </Button>

          <Button
            size="xs"
            variant={activeTab === "logs" ? "default" : "outline"}
            onClick={() => setActiveTab("logs")}
            className="gap-1.5 font-bold text-xs"
          >
            <Cpu className="h-3.5 w-3.5" />
            Audit Logs
          </Button>
        </div>
      </div>

      {/* Overview & Generator Tab */}
      {activeTab === "overview" && (
        <div className="space-y-8" key={refreshKey}>
          <AIDashboardOverview />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <AIGeneratorForm onJobCreated={handleJobCreated} />
            </div>
            <div className="lg:col-span-1">
              <AIJobTracker />
            </div>
          </div>
        </div>
      )}

      {/* Draft Queue Tab */}
      {activeTab === "drafts" && <AIDraftQueue key={refreshKey} />}

      {/* Job Queue Tab */}
      {activeTab === "jobs" && <AIJobTracker key={refreshKey} />}

      {/* Prompts Tab */}
      {activeTab === "prompts" && <PromptManager />}

      {/* Audit Logs Tab */}
      {activeTab === "logs" && <AILogsTable key={refreshKey} />}
    </div>
  );
}
