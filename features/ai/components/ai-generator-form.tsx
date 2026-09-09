"use client";

import React, { useState, useEffect } from "react";
import { Sparkles, Layers, Sliders, Cpu, Key, Plus, RefreshCw, AlertCircle, CheckCircle2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AIContentType } from "../types";
import { createAIJobAction, getKeyPoolStatusAction, addApiKeyAction } from "../actions/ai-actions";

export function AIGeneratorForm({ onJobCreated }: { onJobCreated?: () => void }) {
  const [contentType, setContentType] = useState<AIContentType>("Questions");
  const [moduleId, setModuleId] = useState("a1b2c3d4-0000-0000-0000-000000000001");
  const [difficulty, setDifficulty] = useState<"Easy" | "Medium" | "Hard">("Medium");
  const [amount, setAmount] = useState(5);
  const [model, setModel] = useState("gemini-3.5-flash");
  const [temperature, setTemperature] = useState(0.7);
  const [isLoading, setIsLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Rotating API Key state
  const [keyCount, setKeyCount] = useState<number>(0);
  const [keyStatuses, setKeyStatuses] = useState<
    { index: number; maskedKey: string; failCount: number; isExhausted: boolean }[]
  >([]);
  const [newKeyInput, setNewKeyInput] = useState("");
  const [showKeyManager, setShowKeyManager] = useState(false);

  const loadKeyStatus = async () => {
    try {
      const res = await getKeyPoolStatusAction();
      setKeyCount(res.totalKeys);
      setKeyStatuses(res.keyStatuses);
    } catch {
      // Ignore fallback
    }
  };

  useEffect(() => {
    loadKeyStatus();
  }, []);

  const handleAddKey = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKeyInput.trim()) return;
    const res = await addApiKeyAction(newKeyInput);
    if (res.success) {
      setNewKeyInput("");
      setStatusMsg({ type: "success", text: `API Key added! Total keys in active rotation: ${res.totalKeys}` });
      loadKeyStatus();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setStatusMsg(null);

    try {
      const res = await createAIJobAction({
        contentType,
        moduleId,
        difficulty,
        amount,
        model,
        temperature,
      });

      if (res.success) {
        setStatusMsg({
          type: "success",
          text: `Success! Generated ${amount} ${contentType} using Gemini model "${model}" with rotating API key.`,
        });
        if (onJobCreated) onJobCreated();
      } else {
        setStatusMsg({
          type: "error",
          text: res.error || "Failed to generate content. Please verify your Gemini API Key.",
        });
        if (!keyCount) setShowKeyManager(true);
      }
    } catch (err: unknown) {
      const errText = err instanceof Error ? err.message : String(err);
      setStatusMsg({
        type: "error",
        text: errText || "Generation job failed.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="border-border/80 bg-card shadow-md">
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            <div>
              <CardTitle className="text-lg font-bold">AI Generation Studio</CardTitle>
              <CardDescription className="text-xs">
                Batch generate educational content using Gemini 3.5 / 2.5 Flash with rotating API key failover.
              </CardDescription>
            </div>
          </div>

          <Button
            type="button"
            variant="outline"
            size="xs"
            onClick={() => setShowKeyManager(!showKeyManager)}
            className="gap-1.5 font-semibold text-xs shrink-0"
          >
            <Key className="h-3.5 w-3.5 text-amber-500" />
            Key Pool ({keyCount} Active)
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Rotating Key Pool Status Manager Panel */}
        {showKeyManager && (
          <div className="p-4 rounded-xl border border-amber-500/30 bg-amber-500/5 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold text-amber-700 dark:text-amber-400">
                <Key className="h-4 w-4" />
                Gemini Rotating API Key Pool
              </div>
              <Button size="xs" variant="ghost" onClick={loadKeyStatus} className="h-6 px-2 gap-1 text-[11px]">
                <RefreshCw className="h-3 w-3" /> Refresh
              </Button>
            </div>

            <p className="text-[11px] text-muted-foreground">
              Requests automatically rotate round-robin across configured keys. If a key hits rate limits or quota (429/403), it instantly fails over to the next key.
            </p>

            {keyStatuses.length > 0 ? (
              <div className="flex flex-wrap gap-2 pt-1">
                {keyStatuses.map((k) => (
                  <div
                    key={k.index}
                    className={`px-2.5 py-1 rounded-lg border text-xs font-mono flex items-center gap-1.5 ${
                      k.isExhausted
                        ? "border-destructive bg-destructive/10 text-destructive"
                        : "border-emerald-500/40 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                    }`}
                  >
                    <span className="font-bold">Key #{k.index}:</span> {k.maskedKey}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-xs text-amber-600 font-medium">
                No Gemini API keys detected in environment variables. Add an API key below to enable live generation.
              </div>
            )}

            <form onSubmit={handleAddKey} className="flex gap-2 pt-1">
              <Input
                type="password"
                placeholder="Paste Gemini API Key (e.g. AIzaSy...)"
                value={newKeyInput}
                onChange={(e) => setNewKeyInput(e.target.value)}
                className="text-xs font-mono h-8"
              />
              <Button type="submit" size="xs" className="h-8 gap-1 font-bold shrink-0">
                <Plus className="h-3.5 w-3.5" />
                Add Key
              </Button>
            </form>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Content Type Selector */}
          <div className="space-y-2">
            <Label className="text-xs font-bold text-muted-foreground flex items-center gap-1">
              <Layers className="h-3.5 w-3.5" />
              Content Type
            </Label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {(["Questions", "Lessons", "Explanations", "Hints"] as const).map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setContentType(type)}
                  className={`p-3 rounded-xl border text-xs font-bold transition-all text-center ${
                    contentType === type
                      ? "border-primary bg-primary/10 text-primary shadow-xs"
                      : "border-border/80 bg-muted/20 text-muted-foreground hover:bg-muted/50"
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Learning Module */}
            <div className="space-y-1.5">
              <Label className="text-xs font-bold">Target Learning Module</Label>
              <select
                value={moduleId}
                onChange={(e) => setModuleId(e.target.value)}
                className="w-full p-2.5 rounded-lg border border-border bg-background text-xs font-semibold"
              >
                <option value="a1b2c3d4-0000-0000-0000-000000000001">Mental Math & Speed Calculation</option>
                <option value="a1b2c3d4-0000-0000-0000-000000000002">Numerical Reasoning & Series</option>
                <option value="a1b2c3d4-0000-0000-0000-000000000003">Logical Deductions & Syllogisms</option>
              </select>
            </div>

            {/* Difficulty Tier */}
            <div className="space-y-1.5">
              <Label className="text-xs font-bold">Target Difficulty</Label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value as "Easy" | "Medium" | "Hard")}
                className="w-full p-2.5 rounded-lg border border-border bg-background text-xs font-semibold"
              >
                <option value="Easy">Easy (Speed Focus)</option>
                <option value="Medium">Medium (Standard Psychometric)</option>
                <option value="Hard">Hard (Complex Shortcuts)</option>
              </select>
            </div>

            {/* Quantity */}
            <div className="space-y-1.5">
              <Label className="text-xs font-bold">Batch Generation Quantity</Label>
              <Input
                type="number"
                min={1}
                max={50}
                value={amount}
                onChange={(e) => setAmount(parseInt(e.target.value) || 1)}
                className="text-xs font-semibold"
              />
            </div>

            {/* Model Selector */}
            <div className="space-y-1.5">
              <Label className="text-xs font-bold flex items-center gap-1">
                <Cpu className="h-3.5 w-3.5 text-primary" />
                Gemini Model Target
              </Label>
              <select
                value={model}
                onChange={(e) => setModel(e.target.value)}
                className="w-full p-2.5 rounded-lg border border-border bg-background text-xs font-semibold"
              >
                <option value="gemini-3.5-flash">Gemini 3.5 Flash (Ultra Fast - Recommended)</option>
                <option value="gemini-3.5-pro">Gemini 3.5 Pro (Deep Reasoning)</option>
              </select>
            </div>
          </div>

          {/* Temperature Slider */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-xs font-bold">
              <Label className="text-xs font-bold flex items-center gap-1">
                <Sliders className="h-3.5 w-3.5" />
                Temperature (Creativity): {temperature}
              </Label>
              <span className="text-[11px] text-muted-foreground">0.0 (Strict) - 1.0 (Creative)</span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={temperature}
              onChange={(e) => setTemperature(parseFloat(e.target.value))}
              className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer"
            />
          </div>

          {statusMsg && (
            <div
              className={`p-3 rounded-xl border text-xs font-bold flex items-start gap-2 ${
                statusMsg.type === "success"
                  ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                  : "border-destructive/40 bg-destructive/10 text-destructive"
              }`}
            >
              {statusMsg.type === "success" ? (
                <CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
              )}
              <div>{statusMsg.text}</div>
            </div>
          )}

          <div className="pt-2 flex justify-between items-center">
            <div className="text-[11px] text-muted-foreground font-semibold flex items-center gap-1">
              <Key className="h-3.5 w-3.5 text-amber-500" />
              Rotator Active ({keyCount} Keys Configured)
            </div>

            <Button type="submit" disabled={isLoading} className="gap-2 font-bold shadow-md">
              <Sparkles className="h-4 w-4" />
              {isLoading ? "Generating with Gemini..." : `Generate ${amount} ${contentType}`}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
