"use client";

import React, { useState } from "react";
import { FileCode, Save, CheckCircle2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PromptLibrary } from "../prompts/prompt-library";
import { AIPrompt } from "../types";

const promptLib = new PromptLibrary();

export function PromptManager() {
  const [prompts, setPrompts] = useState<AIPrompt[]>(promptLib.getAllPrompts());
  const [selectedPrompt, setSelectedPrompt] = useState<AIPrompt>(prompts[0]);
  const [templateText, setTemplateText] = useState(prompts[0].template);
  const [statusMsg, setStatusMsg] = useState<string | null>(null);

  const handleSelectPrompt = (p: AIPrompt) => {
    setSelectedPrompt(p);
    setTemplateText(p.template);
    setStatusMsg(null);
  };

  const handleSavePrompt = () => {
    const updated = promptLib.updatePrompt(selectedPrompt.id, templateText);
    if (updated) {
      setPrompts([...promptLib.getAllPrompts()]);
      setSelectedPrompt({ ...updated });
      setStatusMsg(`Prompt template updated to version v${updated.version}!`);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Sidebar List */}
      <Card className="border-border/80 bg-card shadow-xs md:col-span-1">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-bold flex items-center gap-2">
            <FileCode className="h-4 w-4 text-primary" />
            Prompt Library
          </CardTitle>
          <CardDescription className="text-xs">Configurable prompt templates.</CardDescription>
        </CardHeader>

        <CardContent className="space-y-2">
          {prompts.map((p) => {
            const isSelected = selectedPrompt.id === p.id;
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => handleSelectPrompt(p)}
                className={`w-full p-3 rounded-xl border text-left transition-all space-y-1 ${
                  isSelected
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border/70 bg-muted/20 text-muted-foreground hover:bg-muted/50"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs">{p.name}</span>
                  <Badge variant="outline" className="text-[10px]">v{p.version}</Badge>
                </div>
                <div className="text-[11px] text-muted-foreground">{p.category}</div>
              </button>
            );
          })}
        </CardContent>
      </Card>

      {/* Template Editor */}
      <Card className="border-border/80 bg-card shadow-xs md:col-span-2">
        <CardHeader className="pb-3 flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-base font-bold">{selectedPrompt.name} (v{selectedPrompt.version})</CardTitle>
            <CardDescription className="text-xs">Edit system instructions for {selectedPrompt.category}.</CardDescription>
          </div>

          <Button size="xs" onClick={handleSavePrompt} className="gap-1.5 font-bold shadow-xs">
            <Save className="h-3.5 w-3.5" />
            Save New Version
          </Button>
        </CardHeader>

        <CardContent className="space-y-4">
          {statusMsg && (
            <div className="p-3 rounded-xl border border-emerald-500/40 bg-emerald-500/10 text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4" />
              <span>{statusMsg}</span>
            </div>
          )}

          <div className="space-y-1.5">
            <textarea
              value={templateText}
              onChange={(e) => setTemplateText(e.target.value)}
              rows={10}
              className="w-full p-3 rounded-lg border border-border bg-background text-xs font-mono focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
