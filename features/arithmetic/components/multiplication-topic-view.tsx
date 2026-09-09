"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Grid,
  CheckCircle2,
  Sparkles,
  Zap,
  BookOpen,
  ArrowRight,
  BookmarkCheck,
  Brain,
  AlertTriangle,
  Lightbulb,
  Play,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { initialMultiplicationFamilies, multiplicationShortcuts } from "../data/arithmetic-data";
import { FamilyStatus } from "../types";
import { ArithmeticTier } from "../services/arithmetic-generator";
import { useLanguage } from "@/components/providers/language-provider";

interface MultiplicationTopicViewProps {
  onStartQuiz?: (tier: ArithmeticTier) => void;
}

export function MultiplicationTopicView({ onStartQuiz }: MultiplicationTopicViewProps) {
  const { language, t } = useLanguage();
  const [families, setFamilies] = useState(initialMultiplicationFamilies);
  const [selectedFamilyNum, setSelectedFamilyNum] = useState<number | "ALL">("ALL");
  const [viewMode, setViewMode] = useState<"GRID" | "SHORTCUTS" | "MEMORIZE">("GRID");


  const toggleItemMemorized = (famNum: number, a: number, b: number) => {
    setFamilies((prev) =>
      prev.map((fam) => {
        if (fam.number !== famNum) return fam;
        const updatedItems = fam.items.map((item) =>
          item.a === a && item.b === b ? { ...item, isMemorized: !item.isMemorized } : item
        );
        const memorizedCount = updatedItems.filter((i) => i.isMemorized).length;
        const progressPercent = Math.round((memorizedCount / updatedItems.length) * 100);
        let status: FamilyStatus = "Learning";
        if (progressPercent >= 100) status = "Mastered";
        else if (progressPercent >= 50) status = "Practicing";

        return { ...fam, items: updatedItems, progressPercent, status };
      })
    );
  };

  const updateFamilyStatus = (famNum: number, newStatus: FamilyStatus) => {
    setFamilies((prev) =>
      prev.map((fam) => {
        if (fam.number !== famNum) return fam;
        let progressPercent = fam.progressPercent;
        if (newStatus === "Mastered") progressPercent = 100;
        else if (newStatus === "Practicing" && progressPercent === 100) progressPercent = 70;
        else if (newStatus === "Learning" && progressPercent > 40) progressPercent = 30;

        return {
          ...fam,
          status: newStatus,
          progressPercent,
          items: fam.items.map((i) => ({
            ...i,
            isMemorized: newStatus === "Mastered" ? true : i.isMemorized,
          })),
        };
      })
    );
  };

  const currentFamily =
    selectedFamilyNum !== "ALL" ? families.find((f) => f.number === selectedFamilyNum) : null;

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <Card className="border-primary/50 bg-gradient-to-br from-card via-card to-primary/5 shadow-md">
        <CardHeader className="p-6 space-y-3">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <Badge variant="default" className="gap-1.5 font-bold text-xs">
              <Zap className="h-3.5 w-3.5" /> {language === "id" ? "Topik 1 dari 5 — Prioritas Utama" : "Topic 1 of 5 — Priority Mastery"}
            </Badge>
            <div className="flex items-center gap-1 text-xs font-bold text-muted-foreground">
              <span>{language === "id" ? "1 × 1 hingga 10 × 10" : "1 × 1 through 10 × 10"}</span>
            </div>
          </div>

          <CardTitle className="text-2xl sm:text-3xl font-extrabold">
            {language === "id" ? "Perkalian Mental & Trik Cepat" : "Mental Multiplication & Shortcuts"}
          </CardTitle>
          <CardDescription className="text-sm leading-relaxed max-w-3xl">
            {language === "id"
              ? "Bangun refleks otomatis tabel perkalian 1–10 dan kuasai trik visual untuk hitungan cepat tes psikotes tanpa coretan kertas."
              : "Develop automatic recall for 1–10 multiplication tables and learn visual shortcuts for fast psychometric computation without scratch paper."}
          </CardDescription>

          <div className="flex flex-wrap gap-2 pt-2">
            <Button
              size="xs"
              variant={viewMode === "GRID" ? "default" : "outline"}
              onClick={() => setViewMode("GRID")}
              className="gap-1.5 font-bold"
            >
              <Grid className="h-3.5 w-3.5" /> {t.arithmetic.interactiveTable}
            </Button>
            <Button
              size="xs"
              variant={viewMode === "SHORTCUTS" ? "default" : "outline"}
              onClick={() => setViewMode("SHORTCUTS")}
              className="gap-1.5 font-bold"
            >
              <Sparkles className="h-3.5 w-3.5" /> {language === "id" ? "7 Trik Cepat Mental" : "7 Fast Mental Shortcuts"}
            </Button>
            <Button
              size="xs"
              variant={viewMode === "MEMORIZE" ? "default" : "outline"}
              onClick={() => setViewMode("MEMORIZE")}
              className="gap-1.5 font-bold"
            >
              <BookmarkCheck className="h-3.5 w-3.5" /> {t.arithmetic.mustMemorizeSystem}
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* PROGRESSIVE MULTIPLICATION DRILLS */}
      <Card className="border-primary/40 bg-card p-6 space-y-4 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border/60 pb-3">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-extrabold text-amber-500">
              <Zap className="h-4 w-4 fill-amber-500" />
              <span>{language === "id" ? "Latihan Kuis Bertahap" : "Progressive Practice Quizzes"}</span>
            </div>
            <h3 className="text-xl font-extrabold text-foreground mt-0.5">
              {language === "id" ? "Kuis Perkalian Bertahap (1–10 s/d 1–100)" : "Progressive Multiplication Quizzes (1–10 to 1–100)"}
            </h3>
          </div>
          <Badge variant="accent" className="font-bold text-xs self-start sm:self-auto">
            {language === "id" ? "4 Level Bertingkat" : "4 Tiered Levels"}
          </Badge>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {/* Tier 1 */}
          <div className="p-4 rounded-xl border border-border/80 bg-muted/20 hover:border-amber-500/60 transition-all flex flex-col justify-between gap-3">
            <div className="space-y-1">
              <Badge variant="outline" className="text-[10px] font-bold text-amber-600 dark:text-amber-400 border-amber-500/30">
                {language === "id" ? "Fundamental" : "Fundamental"}
              </Badge>
              <h4 className="text-sm font-extrabold text-foreground">
                {language === "id" ? "1. Perkalian 1–10 (Acak)" : "1. 1–10 Tables (Random)"}
              </h4>
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                {language === "id" ? "Hafalkan tabel dasar 1-10 secara acak hingga refleks tanpa berpikir." : "Cement automatic muscle memory for 1-10 tables."}
              </p>
            </div>
            <Button
              size="sm"
              onClick={() => onStartQuiz ? onStartQuiz("1-10") : null}
              className="w-full font-bold text-xs gap-1.5 shadow-2xs"
            >
              <Play className="h-3 w-3 fill-current" />
              {language === "id" ? "Kuis 1–10" : "Quiz 1–10"}
            </Button>
          </div>

          {/* Tier 2 */}
          <div className="p-4 rounded-xl border border-border/80 bg-muted/20 hover:border-amber-500/60 transition-all flex flex-col justify-between gap-3">
            <div className="space-y-1">
              <Badge variant="outline" className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 border-emerald-500/30">
                {language === "id" ? "Dua Digit / Belasan" : "Teens & Double-Digit"}
              </Badge>
              <h4 className="text-sm font-extrabold text-foreground">
                {language === "id" ? "2. Perkalian 1–20" : "2. 1–20 Multiplication"}
              </h4>
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                {language === "id" ? "Asah trik distributif (10+a)×b dan penggandaan cepat." : "Practice distributive properties and rapid doubling."}
              </p>
            </div>
            <Button
              size="sm"
              onClick={() => onStartQuiz ? onStartQuiz("1-20") : null}
              className="w-full font-bold text-xs gap-1.5 shadow-2xs"
            >
              <Play className="h-3 w-3 fill-current" />
              {language === "id" ? "Kuis 1–20" : "Quiz 1–20"}
            </Button>
          </div>

          {/* Tier 3 */}
          <div className="p-4 rounded-xl border border-border/80 bg-muted/20 hover:border-amber-500/60 transition-all flex flex-col justify-between gap-3">
            <div className="space-y-1">
              <Badge variant="outline" className="text-[10px] font-bold text-blue-600 dark:text-blue-400 border-blue-500/30">
                {language === "id" ? "Menengah" : "Intermediate"}
              </Badge>
              <h4 className="text-sm font-extrabold text-foreground">
                {language === "id" ? "3. Perkalian 1–30" : "3. 1–30 Multiplication"}
              </h4>
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                {language === "id" ? "Kalkulasi angka 20-an & 30-an dengan pembulatan dan trik ×25." : "Numbers in 20s/30s with rounding and ×25 tricks."}
              </p>
            </div>
            <Button
              size="sm"
              onClick={() => onStartQuiz ? onStartQuiz("1-30") : null}
              className="w-full font-bold text-xs gap-1.5 shadow-2xs"
            >
              <Play className="h-3 w-3 fill-current" />
              {language === "id" ? "Kuis 1–30" : "Quiz 1–30"}
            </Button>
          </div>

          {/* Tier 4 */}
          <div className="p-4 rounded-xl border border-border/80 bg-muted/20 hover:border-amber-500/60 transition-all flex flex-col justify-between gap-3">
            <div className="space-y-1">
              <Badge variant="outline" className="text-[10px] font-bold text-violet-600 dark:text-violet-400 border-violet-500/30">
                {language === "id" ? "Lanjutan (Hingga 100)" : "Advanced (Up to 100)"}
              </Badge>
              <h4 className="text-sm font-extrabold text-foreground">
                {language === "id" ? "4. Perkalian 1–100" : "4. 1–100 Multiplication"}
              </h4>
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                {language === "id" ? "Trik basis 100, kuadrat akhiran 5, dan kali 11 tanpa coret." : "Near base 100, squaring ending in 5, and 11-sandwich."}
              </p>
            </div>
            <Button
              size="sm"
              onClick={() => onStartQuiz ? onStartQuiz("1-100") : null}
              className="w-full font-bold text-xs gap-1.5 shadow-2xs"
            >
              <Play className="h-3 w-3 fill-current" />
              {language === "id" ? "Kuis 1–100" : "Quiz 1–100"}
            </Button>
          </div>
        </div>
      </Card>

      {/* 1. INTERACTIVE MULTIPLICATION TABLE SECTION */}
      {viewMode === "GRID" && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-xl font-extrabold">
                {language === "id" ? "Tabel Perkalian Interaktif (1×1 s/d 10×10)" : "Interactive Multiplication Table (1x1 to 10x10)"}
              </h3>
              <p className="text-xs text-muted-foreground">
                {language === "id"
                  ? "Klik sel mana saja untuk menandai status hafalan atau filter berdasarkan angka."
                  : "Click any cell to toggle memorization status or filter by number family."}
              </p>
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1 max-w-full">
              <span className="text-xs font-bold text-muted-foreground mr-1 shrink-0">{t.arithmetic.familyFilter}</span>
              <Button
                size="xs"
                variant={selectedFamilyNum === "ALL" ? "default" : "outline"}
                onClick={() => setSelectedFamilyNum("ALL")}
                className="text-xs font-bold shrink-0"
              >
                {t.arithmetic.allTables}
              </Button>
              {families.map((fam) => (
                <Button
                  key={fam.number}
                  size="xs"
                  variant={selectedFamilyNum === fam.number ? "default" : "outline"}
                  onClick={() => setSelectedFamilyNum(fam.number)}
                  className="text-xs font-bold px-2.5 shrink-0"
                >
                  {fam.number}s
                </Button>
              ))}
            </div>
          </div>

          {/* Single Family Focus View */}
          {currentFamily ? (
            <Card className="border-primary/40 bg-card p-4 sm:p-6 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/60 pb-4">
                <div className="space-y-1">
                  <Badge variant="outline" className="font-bold">
                    {currentFamily.status === "Mastered"
                      ? t.common.mastered
                      : currentFamily.status === "Practicing"
                      ? t.common.practicing
                      : t.common.learning}
                  </Badge>
                  <h4 className="text-xl font-extrabold">{currentFamily.label}</h4>
                </div>
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-xs font-bold text-muted-foreground">{t.arithmetic.setStatus}</span>
                  {(["Learning", "Practicing", "Mastered"] as FamilyStatus[]).map((st) => (
                    <Button
                      key={st}
                      size="xs"
                      variant={currentFamily.status === st ? "default" : "outline"}
                      onClick={() => updateFamilyStatus(currentFamily.number, st)}
                      className="text-xs font-bold"
                    >
                      {st === "Mastered"
                        ? t.common.mastered
                        : st === "Practicing"
                        ? t.common.practicing
                        : t.common.learning}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-muted-foreground">{t.arithmetic.familyProgress}</span>
                  <span className="text-primary">{currentFamily.progressPercent}% {t.arithmetic.percentMemorized}</span>
                </div>
                <Progress value={currentFamily.progressPercent} className="h-2.5" />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 sm:gap-3">
                {currentFamily.items.map((item) => (
                  <button
                    key={`${item.a}-${item.b}`}
                    type="button"
                    onClick={() => toggleItemMemorized(currentFamily.number, item.a, item.b)}
                    className={`p-3 sm:p-4 rounded-xl border transition-all text-center flex flex-col items-center justify-center gap-1 touch-tap active:scale-95 ${
                      item.isMemorized
                        ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 font-bold"
                        : "border-border/80 bg-muted/20 hover:border-primary text-foreground"
                    }`}
                  >
                    <span className="text-xs text-muted-foreground">{item.a} × {item.b}</span>
                    <span className="text-base sm:text-lg font-extrabold">{item.product}</span>
                    <span className="text-[10px] opacity-75">
                      {item.isMemorized ? t.arithmetic.markedMemorized : t.arithmetic.clickToMark}
                    </span>
                  </button>
                ))}
              </div>
            </Card>
          ) : (
            /* Full 10x10 Matrix View */
            <div className="space-y-2">
              <div className="sm:hidden text-[11px] text-muted-foreground italic text-center">
                {language === "id" ? "↔ Geser tabel ke samping untuk melihat seluruh angka" : "↔ Scroll horizontally to view full table"}
              </div>
              <div className="overflow-x-auto rounded-xl border border-border/80 bg-card p-3 sm:p-4 shadow-xs no-scrollbar">
                <table className="w-full min-w-[500px] text-center border-collapse">
                <thead>
                  <tr className="border-b border-border/60">
                    <th className="p-2 text-xs font-extrabold text-primary">×</th>
                    {Array.from({ length: 10 }, (_, i) => (
                      <th key={i + 1} className="p-2 text-xs font-extrabold text-muted-foreground">
                        {i + 1}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {families.map((fam) => (
                    <tr key={fam.number} className="border-b border-border/40 hover:bg-muted/30 transition-colors">
                      <td className="p-2 text-xs font-extrabold text-primary bg-muted/20">
                        {fam.number}s
                      </td>
                      {fam.items.map((item) => (
                        <td
                          key={`${item.a}-${item.b}`}
                          onClick={() => toggleItemMemorized(fam.number, item.a, item.b)}
                          className={`p-2.5 text-xs font-bold cursor-pointer transition-all ${
                            item.isMemorized
                              ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-500/25"
                              : "hover:bg-primary/10 hover:text-primary"
                          }`}
                          title={`${item.a} × ${item.b} = ${item.product} (${language === "id" ? "Klik utk ubah status hafal" : "Click to toggle memorized"})`}
                        >
                          {item.product}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

          {/* Family Mastery Dashboard Status */}
          <div className="space-y-4 pt-4 border-t border-border/60">
            <h4 className="text-sm font-extrabold uppercase tracking-wider text-muted-foreground">
              {language === "id" ? "Rincian Penguasaan Tabel Perkalian" : "Multiplication Family Mastery Breakdown"}
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3">
              {families.map((fam) => (
                <Card
                  key={fam.number}
                  className="p-3 border-border/60 bg-card hover:border-primary/50 transition-all cursor-pointer"
                  onClick={() => setSelectedFamilyNum(fam.number)}
                >
                  <div className="flex justify-between items-center text-xs font-extrabold mb-1">
                    <span>{fam.number}s {language === "id" ? "Tabel" : "Table"}</span>
                    <span className="text-primary">{fam.progressPercent}%</span>
                  </div>
                  <Progress value={fam.progressPercent} className="h-2 mb-2" />
                  <div className="flex justify-between items-center text-[10px]">
                    <Badge variant={fam.status === "Mastered" ? "accent" : "outline"} className="text-[9px]">
                      {fam.status === "Mastered"
                        ? t.common.mastered
                        : fam.status === "Practicing"
                        ? t.common.practicing
                        : t.common.learning}
                    </Badge>
                    <span className="text-muted-foreground">10 {t.common.questions}</span>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 2. MULTIPLICATION SHORTCUTS SECTION */}
      {viewMode === "SHORTCUTS" && (
        <div className="space-y-6">
          <div>
            <h3 className="text-xl font-extrabold">
              {language === "id" ? "Trik Cepat Perkalian Mental" : "Fast Mental Multiplication Shortcuts"}
            </h3>
            <p className="text-xs text-muted-foreground">
              {language === "id"
                ? "Jangan gunakan perkalian bersusun panjang saat tes psikotes berbatas waktu. Gunakan aturan visual ini."
                : "Never use long paper multiplication on timed psychometric tests. Use these visual rules instead."}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {multiplicationShortcuts.map((sc) => (
              <Card key={sc.id} className="border-border/80 bg-card shadow-sm hover:border-primary/40 transition-all">
                <CardHeader className="p-5 pb-3 bg-muted/20 border-b border-border/40">
                  <div className="flex justify-between items-start gap-2">
                    <Badge variant="default" className="text-[10px] font-bold">
                      {language === "id" ? "Teknik" : "Technique"}
                    </Badge>
                  </div>
                  <CardTitle className="text-lg font-extrabold text-foreground">
                    {language === "id" ? (sc.titleId ?? sc.title) : sc.title}
                  </CardTitle>
                  <CardDescription className="text-xs text-primary font-semibold">
                    {language === "id" ? (sc.taglineId ?? sc.tagline) : sc.tagline}
                  </CardDescription>
                </CardHeader>

                <CardContent className="p-5 space-y-4">
                  {/* Worked Example */}
                  <div className="p-3 rounded-xl bg-primary/5 border border-primary/20 space-y-1">
                    <div className="text-[10px] font-extrabold uppercase text-primary tracking-wider">
                      {t.arithmetic.workedExample}
                    </div>
                    <div className="text-sm font-extrabold text-foreground">
                      {sc.example.problem} = <span className="text-primary">{sc.example.answer}</span>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      💡 {language === "id" ? (sc.example.thinkingProcessId ?? sc.example.thinkingProcess) : sc.example.thinkingProcess}
                    </p>
                  </div>

                  {/* 5 Core Principles */}
                  <div className="space-y-2.5 text-xs">
                    <div className="flex items-start gap-2">
                      <Lightbulb className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold text-foreground">{t.arithmetic.whenToUse} </span>
                        <span className="text-muted-foreground">
                          {language === "id" ? (sc.whenToUseId ?? sc.whenToUse) : sc.whenToUse}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-start gap-2">
                      <Brain className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold text-foreground">{t.arithmetic.whyItWorks} </span>
                        <span className="text-muted-foreground">
                          {language === "id" ? (sc.whyItWorksId ?? sc.whyItWorks) : sc.whyItWorks}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-start gap-2">
                      <Zap className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold text-foreground">{t.arithmetic.fasterAlternative} </span>
                        <span className="text-muted-foreground">
                          {language === "id" ? (sc.fasterAlternativeId ?? sc.fasterAlternative) : sc.fasterAlternative}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-start gap-2">
                      <AlertTriangle className="h-4 w-4 text-destructive shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold text-destructive">{t.arithmetic.commonMistake} </span>
                        <span className="text-muted-foreground">
                          {language === "id" ? (sc.commonMistakeId ?? sc.commonMistake) : sc.commonMistake}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* 3. MUST MEMORIZE SYSTEM */}
      {viewMode === "MEMORIZE" && (
        <div className="space-y-6">
          <div>
            <h3 className="text-xl font-extrabold">
              {language === "id" ? "Kombinasi Angka Wajib Dihapal" : "Must Memorize Core Products"}
            </h3>
            <p className="text-xs text-muted-foreground">
              {language === "id"
                ? "Kombinasi ini muncul berulang kali dalam penalaran numerik psikotes. Hafalan refleks membebaskan kapasitas otak untuk soal rumit."
                : "These combinations appear repeatedly in numerical reasoning. Instant recall here frees up brain power for complex questions."}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="border-border/80 bg-card p-5 space-y-3">
              <h4 className="text-sm font-extrabold flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                {t.arithmetic.frequentlyUsedSquares}
              </h4>
              <ul className="text-xs space-y-2 text-muted-foreground">
                <li className="flex justify-between border-b border-border/40 pb-1"><span>11 × 11</span><span className="font-bold text-foreground">121</span></li>
                <li className="flex justify-between border-b border-border/40 pb-1"><span>12 × 12</span><span className="font-bold text-foreground">144</span></li>
                <li className="flex justify-between border-b border-border/40 pb-1"><span>15 × 15</span><span className="font-bold text-foreground">225</span></li>
                <li className="flex justify-between border-b border-border/40 pb-1"><span>25 × 25</span><span className="font-bold text-foreground">625</span></li>
              </ul>
            </Card>

            <Card className="border-border/80 bg-card p-5 space-y-3">
              <h4 className="text-sm font-extrabold flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                {t.arithmetic.speedBenchmarkProducts}
              </h4>
              <ul className="text-xs space-y-2 text-muted-foreground">
                <li className="flex justify-between border-b border-border/40 pb-1"><span>12 × 5</span><span className="font-bold text-foreground">60</span></li>
                <li className="flex justify-between border-b border-border/40 pb-1"><span>15 × 4</span><span className="font-bold text-foreground">60</span></li>
                <li className="flex justify-between border-b border-border/40 pb-1"><span>16 × 5</span><span className="font-bold text-foreground">80</span></li>
                <li className="flex justify-between border-b border-border/40 pb-1"><span>25 × 4</span><span className="font-bold text-foreground">100</span></li>
              </ul>
            </Card>

            <Card className="border-border/80 bg-card p-5 space-y-3">
              <h4 className="text-sm font-extrabold flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                {t.arithmetic.decompositionFormula}
              </h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                <span className="font-bold text-foreground">a × b = (a + c) × b - c × b</span>
              </p>
              <div className="p-2 rounded bg-muted text-xs font-mono">
                19 × 7 = (20 × 7) - 7 = 140 - 7 = 133
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* Quick Reference Cheat Sheet Section */}
      <Card className="border-border/80 bg-muted/30 p-6 space-y-4">
        <h4 className="text-sm font-extrabold uppercase tracking-wider flex items-center gap-2 text-foreground">
          <BookOpen className="h-4 w-4 text-primary" />
          {language === "id" ? "Lembar Ringkasan Trik Perkalian Cepat" : "Multiplication Cheat Sheet Quick Reference"}
        </h4>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-bold">
          <div className="p-2.5 rounded-lg border border-border bg-card">×2 → {language === "id" ? "Dobelkan" : "Double"}</div>
          <div className="p-2.5 rounded-lg border border-border bg-card">×5 → ×10 {language === "id" ? "lalu ÷2" : "÷2"}</div>
          <div className="p-2.5 rounded-lg border border-border bg-card">×9 → ×10 {language === "id" ? "- angka awal" : "- original"}</div>
          <div className="p-2.5 rounded-lg border border-border bg-card">×11 → {language === "id" ? "Sisipkan jumlah digit" : "Sandwich sum"}</div>
          <div className="p-2.5 rounded-lg border border-border bg-card">×25 → ÷4 {language === "id" ? "lalu ×100" : "×100"}</div>
          <div className="p-2.5 rounded-lg border border-border bg-card">×50 → ÷2 {language === "id" ? "lalu ×100" : "×100"}</div>
          <div className="p-2.5 rounded-lg border border-border bg-card">×100 → {language === "id" ? "Tambah 2 nol" : "Add 2 zeros"}</div>
          <div className="p-2.5 rounded-lg border border-border bg-card">19×7 → 20×7 - 7</div>
        </div>
      </Card>

      {/* Ready to Practice CTA */}
      <div className="p-6 rounded-2xl border border-primary/40 bg-gradient-to-r from-primary/10 via-card to-amber-500/10 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="space-y-1">
          <h4 className="text-lg font-extrabold text-foreground">
            {language === "id" ? "Siap Melatih Kecepatan Perkalian Mental?" : "Ready to Practice Multiplication Speed?"}
          </h4>
          <p className="text-xs text-muted-foreground">
            {language === "id"
              ? "Uji kecepatan refleks dan hafalan Anda dalam drill interaktif bertahap."
              : "Test your automatic recall in our interactive progressive drill engine."}
          </p>
        </div>
        <Button
          size="lg"
          onClick={() => (onStartQuiz ? onStartQuiz("1-10") : null)}
          className="gap-2 font-bold shrink-0 shadow-md"
        >
          <Zap className="h-4 w-4 fill-current" />
          {language === "id" ? "Mulai Latihan Bertahap 1–10" : "Start Progressive 1–10 Drill"}{" "}
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
