"use client";

import React, { useState } from "react";
import {
  Activity,
  ArrowDownUp,
  ArrowUp,
  ArrowDown,
  Clock,
  Sparkles,
  Volume2,
  VolumeX,
  Play,
  HelpCircle,
  Zap,
  CheckCircle2,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { KraepelinConfig, KraepelinMode } from "../types";
import { useLanguage } from "@/components/providers/language-provider";

interface KraepelinConfigCardProps {
  onStart: (config: KraepelinConfig) => void;
}

export function KraepelinConfigCard({ onStart }: KraepelinConfigCardProps) {
  const { t } = useLanguage();
  const k = t.kraepelin;

  const [mode, setMode] = useState<KraepelinMode>("kraepelin");
  const [columnCount, setColumnCount] = useState<number>(10);
  const [secondsPerColumn, setSecondsPerColumn] = useState<number>(30);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [showInstructions, setShowInstructions] = useState<boolean>(false);

  // Quick preset helper
  const handleApplyPreset = (preset: "quick" | "standard" | "full") => {
    if (preset === "quick") {
      setColumnCount(5);
      setSecondsPerColumn(15);
    } else if (preset === "standard") {
      setColumnCount(10);
      setSecondsPerColumn(30);
    } else {
      setColumnCount(20);
      setSecondsPerColumn(30);
    }
  };

  const handleStart = () => {
    onStart({
      mode,
      columnCount,
      numbersPerColumn: secondsPerColumn >= 30 ? 40 : 25,
      secondsPerColumn,
      soundEnabled,
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Banner Header */}
      <div className="relative overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-primary/10 text-primary">
              <Sparkles className="h-3.5 w-3.5" />
              <span>{k.badge}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
              {k.title}
            </h1>
            <p className="text-sm text-muted-foreground max-w-2xl">
              {k.subtitle}
            </p>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowInstructions(!showInstructions)}
            className="self-start md:self-center gap-1.5 font-semibold text-xs shrink-0"
          >
            <HelpCircle className="h-4 w-4" />
            <span>{k.instructionsTitle}</span>
          </Button>
        </div>
      </div>

      {/* Accordion / Instructions Box */}
      {showInstructions && (
        <Card className="border-primary/30 bg-primary/5 animate-in fade-in-50 duration-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-bold flex items-center gap-2 text-primary">
              <HelpCircle className="h-4 w-4" />
              <span>{k.instructionsTitle}</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-xs sm:text-sm text-foreground/90">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3 rounded-lg bg-background/80 border border-border/80 flex items-start gap-2.5">
                <div className="h-6 w-6 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                  1
                </div>
                <div>
                  <div className="font-semibold">{k.instruction1}</div>
                  <div className="text-[11px] text-muted-foreground mt-0.5">
                    {mode === "kraepelin" ? "Hitung vertikal dari bawah ke atas" : "Hitung vertikal dari atas ke bawah"}
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-background/80 border border-border/80 flex items-start gap-2.5">
                <div className="h-6 w-6 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                  2
                </div>
                <div>
                  <div className="font-semibold">{k.instruction2}</div>
                  <div className="text-[11px] text-muted-foreground mt-0.5">
                    {k.exampleText}
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-background/80 border border-border/80 flex items-start gap-2.5">
                <div className="h-6 w-6 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                  3
                </div>
                <div>
                  <div className="font-semibold">{k.instruction3}</div>
                  <div className="text-[11px] text-muted-foreground mt-0.5">
                    Otomatis berpindah kolom saat sinyal PINDAH muncul!
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Main Configuration Card */}
      <Card className="border-border/80 shadow-md">
        <CardHeader>
          <CardTitle className="text-lg font-bold flex items-center gap-2">
            <Activity className="h-5 w-5 text-primary" />
            <span>Konfigurasi Sesi Tes</span>
          </CardTitle>
          <CardDescription>
            Pilih metode tes koran dan sesuaikan durasi dengan target latihan Anda.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* 1. Mode Selector (Kraepelin vs Pauli) */}
          <div className="space-y-2.5">
            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <ArrowDownUp className="h-3.5 w-3.5 text-primary" />
              <span>{k.modeLabel}</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setMode("kraepelin")}
                className={`p-4 rounded-xl border text-left transition-all relative ${
                  mode === "kraepelin"
                    ? "border-primary bg-primary/10 shadow-sm"
                    : "border-border hover:border-primary/40 bg-card"
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-sm flex items-center gap-1.5 text-foreground">
                    <ArrowUp className="h-4 w-4 text-emerald-500" />
                    {k.modeKraepelin}
                  </span>
                  {mode === "kraepelin" && <CheckCircle2 className="h-4 w-4 text-primary" />}
                </div>
                <p className="text-xs text-muted-foreground">{k.modeKraepelinDesc}</p>
              </button>

              <button
                type="button"
                onClick={() => setMode("pauli")}
                className={`p-4 rounded-xl border text-left transition-all relative ${
                  mode === "pauli"
                    ? "border-primary bg-primary/10 shadow-sm"
                    : "border-border hover:border-primary/40 bg-card"
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-sm flex items-center gap-1.5 text-foreground">
                    <ArrowDown className="h-4 w-4 text-blue-500" />
                    {k.modePauli}
                  </span>
                  {mode === "pauli" && <CheckCircle2 className="h-4 w-4 text-primary" />}
                </div>
                <p className="text-xs text-muted-foreground">{k.modePauliDesc}</p>
              </button>
            </div>
          </div>

          {/* 2. Presets Quick Access */}
          <div className="space-y-2.5">
            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <Zap className="h-3.5 w-3.5 text-amber-500" />
              <span>Preset Standar Psikotes</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => handleApplyPreset("quick")}
                className={`p-3 rounded-lg border text-left transition-all ${
                  columnCount === 5 && secondsPerColumn === 15
                    ? "border-amber-500/50 bg-amber-500/10 text-amber-600 dark:text-amber-400 font-bold"
                    : "border-border/80 hover:border-amber-500/30 bg-muted/20 text-muted-foreground"
                }`}
              >
                <div className="text-xs font-bold">{k.presetQuick}</div>
                <div className="text-[11px] opacity-80 mt-0.5">{k.presetQuickDesc}</div>
              </button>

              <button
                type="button"
                onClick={() => handleApplyPreset("standard")}
                className={`p-3 rounded-lg border text-left transition-all ${
                  columnCount === 10 && secondsPerColumn === 30
                    ? "border-primary/50 bg-primary/10 text-primary font-bold shadow-xs"
                    : "border-border/80 hover:border-primary/30 bg-muted/20 text-muted-foreground"
                }`}
              >
                <div className="text-xs font-bold flex items-center justify-between">
                  <span>{k.presetStandard}</span>
                  <Badge variant="outline" className="text-[9px] px-1 py-0 border-primary/40 text-primary">
                    Populer
                  </Badge>
                </div>
                <div className="text-[11px] opacity-80 mt-0.5">{k.presetStandardDesc}</div>
              </button>

              <button
                type="button"
                onClick={() => handleApplyPreset("full")}
                className={`p-3 rounded-lg border text-left transition-all ${
                  columnCount === 20 && secondsPerColumn === 30
                    ? "border-purple-500/50 bg-purple-500/10 text-purple-600 dark:text-purple-400 font-bold"
                    : "border-border/80 hover:border-purple-500/30 bg-muted/20 text-muted-foreground"
                }`}
              >
                <div className="text-xs font-bold">{k.presetFull}</div>
                <div className="text-[11px] opacity-80 mt-0.5">{k.presetFullDesc}</div>
              </button>
            </div>
          </div>

          {/* 3. Detail Customization: Column Count & Seconds */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            {/* Column Count */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-foreground flex items-center justify-between">
                <span>{k.columnsLabel}</span>
                <span className="text-primary font-extrabold">{columnCount} Kolom</span>
              </label>
              <div className="grid grid-cols-4 gap-2">
                {[5, 10, 15, 20].map((count) => (
                  <button
                    key={count}
                    type="button"
                    onClick={() => setColumnCount(count)}
                    className={`py-2 text-xs font-bold rounded-lg border transition-all ${
                      columnCount === count
                        ? "bg-primary text-primary-foreground border-primary shadow-xs"
                        : "bg-muted/40 text-muted-foreground hover:bg-muted border-border"
                    }`}
                  >
                    {count}
                  </button>
                ))}
              </div>
            </div>

            {/* Seconds per column */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-foreground flex items-center justify-between">
                <span>{k.durationLabel}</span>
                <span className="text-primary font-extrabold">{secondsPerColumn} Detik / Kolom</span>
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[15, 30, 45].map((sec) => (
                  <button
                    key={sec}
                    type="button"
                    onClick={() => setSecondsPerColumn(sec)}
                    className={`py-2 text-xs font-bold rounded-lg border transition-all ${
                      secondsPerColumn === sec
                        ? "bg-primary text-primary-foreground border-primary shadow-xs"
                        : "bg-muted/40 text-muted-foreground hover:bg-muted border-border"
                    }`}
                  >
                    {sec} dtk
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* 4. Sound Cue Toggle */}
          <div className="flex items-center justify-between p-3 rounded-xl border border-border/80 bg-muted/20">
            <div className="space-y-0.5">
              <div className="text-xs font-bold text-foreground flex items-center gap-1.5">
                {soundEnabled ? (
                  <Volume2 className="h-4 w-4 text-primary" />
                ) : (
                  <VolumeX className="h-4 w-4 text-muted-foreground" />
                )}
                <span>{k.soundCue}</span>
              </div>
              <p className="text-[11px] text-muted-foreground">{k.soundCueDesc}</p>
            </div>
            <Button
              type="button"
              variant={soundEnabled ? "secondary" : "outline"}
              size="xs"
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="text-xs font-semibold"
            >
              {soundEnabled ? "Aktif" : "Mati"}
            </Button>
          </div>

          {/* 5. Start Action Button */}
          <div className="pt-3">
            <Button
              type="button"
              size="lg"
              onClick={handleStart}
              className="w-full h-13 text-base font-extrabold gap-2 shadow-lg shadow-primary/20 hover:scale-[1.01] transition-transform"
            >
              <Play className="h-5 w-5 fill-current" />
              <span>{k.startTest}</span>
            </Button>
            <p className="text-center text-[11px] text-muted-foreground mt-2 flex items-center justify-center gap-1">
              <Clock className="h-3 w-3" />
              <span>
                Total estimasi waktu tes:{" "}
                <strong className="text-foreground">
                  {Math.round((columnCount * secondsPerColumn) / 60 * 10) / 10} Menit
                </strong>
              </span>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
