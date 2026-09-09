"use client";

import React from "react";
import Link from "next/link";
import { Percent, ArrowRight, Layers } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { percentageBenchmarks, percentageCompositions } from "../data/arithmetic-data";
import { useLanguage } from "@/components/providers/language-provider";

export function PercentagesTopicView() {
  const { language, t } = useLanguage();

  const getShortcutRule = (percentStr: string, defaultRule: string) => {
    if (language !== "id") return defaultRule;
    if (percentStr === "10%") return "Bagi 10 (geser koma 1 digit ke kiri).";
    if (percentStr === "5%") return "Ambil 10% lalu bagi 2.";
    if (percentStr === "1%") return "Bagi 100 (geser koma 2 digit ke kiri).";
    if (percentStr === "25%") return "Bagi 4 (bagi dua, lalu bagi dua lagi).";
    if (percentStr === "50%") return "Bagi 2 (ambil separuh).";
    if (percentStr === "75%") return "Ambil 50% + 25% (atau kali 25% dengan 3).";
    return defaultRule;
  };

  const getExampleStr = (percentStr: string, defaultExample: string) => {
    if (language !== "id") return defaultExample;
    if (percentStr === "10%") return "10% dari 80 = 80 ÷ 10 = 8";
    if (percentStr === "5%") return "5% dari 80 = (10% dari 80) ÷ 2 = 8 ÷ 2 = 4";
    if (percentStr === "1%") return "1% dari 500 = 500 ÷ 100 = 5";
    if (percentStr === "25%") return "25% dari 80 = 80 ÷ 4 = 20";
    if (percentStr === "50%") return "50% dari 80 = 80 ÷ 2 = 40";
    if (percentStr === "75%") return "75% dari 80 = 40 (50%) + 20 (25%) = 60";
    return defaultExample;
  };

  const getCompositionSteps = (target: string, defaultSteps: string) => {
    if (language !== "id") return defaultSteps;
    if (target.includes("15%")) return "10% dari 200 = 20. 5% dari 200 = 10. Gabungkan: 20 + 10 = 30";
    if (target.includes("35%")) return "10% dari 200 = 20 -> 30% = 60. 5% = 10. Gabungkan: 60 + 10 = 70";
    if (target.includes("12%")) return "10% dari 500 = 50. 1% dari 500 = 5. Gabungkan: 50 + 5 + 5 = 60";
    return defaultSteps;
  };

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <Card className="border-primary/50 bg-gradient-to-br from-card via-card to-primary/5 shadow-md">
        <CardHeader className="p-6 space-y-3">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <Badge variant="default" className="gap-1.5 font-bold text-xs">
              <Percent className="h-3.5 w-3.5" />{" "}
              {language === "id" ? `Topik 5 dari 5 — ${t.arithmetic.percentages}` : "Topic 5 of 5 — Mental Percentages"}
            </Badge>
            <span className="text-xs font-bold text-muted-foreground">
              {language === "id" ? "Komposisi Benchmark" : "Benchmark Composition"}
            </span>
          </div>

          <CardTitle className="text-2xl sm:text-3xl font-extrabold">
            {language === "id" ? "Kalkulasi Persentase Mental" : "Mental Percentage Calculation"}
          </CardTitle>
          <CardDescription className="text-sm leading-relaxed max-w-3xl">
            {language === "id"
              ? "Hafalkan 8 benchmark persentase inti (1%, 5%, 10%, 20%, 25%, 50%, 75%, 100%) dan pelajari cara membentuk persentase apa pun secara cepat dengan menggabungkan 10%, 5%, dan 1%."
              : "Memorize the 8 core percentage benchmarks (1%, 5%, 10%, 20%, 25%, 50%, 75%, 100%) and learn how to construct any percentage instantly by combining 10%, 5%, and 1%."}
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Core Percentage Benchmarks Grid */}
      <div className="space-y-4">
        <h3 className="text-xl font-extrabold">{t.arithmetic.coreBenchmarksTitle}</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {percentageBenchmarks.map((bm) => (
            <Card key={bm.percentStr} className="border-border/80 bg-card p-5 space-y-3 hover:border-primary/40 transition-all">
              <div className="flex justify-between items-start">
                <span className="text-2xl font-extrabold text-primary">{bm.percentStr}</span>
                <Badge variant="outline" className="font-bold text-[10px]">{bm.fractionStr}</Badge>
              </div>

              <div className="text-xs space-y-1">
                <div className="font-bold text-foreground">
                  {language === "id" ? "Aturan: " : "Rule: "}
                  {getShortcutRule(bm.percentStr, bm.shortcutRule)}
                </div>
                <div className="text-muted-foreground bg-muted/30 p-2 rounded border border-border/40 font-mono">
                  {getExampleStr(bm.percentStr, bm.example)}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Percentage Composition System */}
      <div className="space-y-4">
        <h3 className="text-xl font-extrabold flex items-center gap-2">
          <Layers className="h-5 w-5 text-primary" /> {t.arithmetic.percentageCompositionTitle}
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {percentageCompositions.map((comp) => (
            <Card key={comp.target} className="border-border/80 bg-card p-5 space-y-3">
              <div className="flex justify-between items-center">
                <Badge variant="accent" className="font-bold">{comp.target}</Badge>
                <span className="text-lg font-extrabold text-primary">{comp.answer}</span>
              </div>

              <div className="text-xs space-y-2">
                <div className="font-bold text-foreground">
                  {t.arithmetic.formulaBreakdown} {comp.formula}
                </div>
                <div className="p-2.5 rounded bg-primary/5 border border-primary/20 text-muted-foreground leading-relaxed">
                  💡 {getCompositionSteps(comp.target, comp.steps)}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Cheat Sheet Quick Reference */}
      <Card className="border-border/80 bg-muted/30 p-6 space-y-3">
        <h4 className="text-sm font-extrabold uppercase tracking-wider text-foreground">
          {language === "id" ? "Lembar Ringkasan Persentase" : "Percentage Cheat Sheet"}
        </h4>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs font-bold">
          <div className="p-2.5 rounded-lg border border-border bg-card">10% → ÷10</div>
          <div className="p-2.5 rounded-lg border border-border bg-card">5% → 10% ÷2</div>
          <div className="p-2.5 rounded-lg border border-border bg-card">1% → ÷100</div>
          <div className="p-2.5 rounded-lg border border-border bg-card">25% → ÷4</div>
          <div className="p-2.5 rounded-lg border border-border bg-card">50% → ÷2</div>
          <div className="p-2.5 rounded-lg border border-border bg-card">75% → 50% + 25%</div>
          <div className="p-2.5 rounded-lg border border-border bg-card">15% → 10% + 5%</div>
          <div className="p-2.5 rounded-lg border border-border bg-card">35% → 30% + 5%</div>
          <div className="p-2.5 rounded-lg border border-border bg-card">12% → 10% + 2%</div>
        </div>
      </Card>

      {/* Ready to Practice CTA */}
      <div className="p-6 rounded-2xl border border-primary/40 bg-gradient-to-r from-primary/10 via-card to-emerald-500/10 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="space-y-1">
          <h4 className="text-lg font-extrabold text-foreground">
            {language === "id" ? "Siap Melatih Kecepatan Persentase?" : "Ready to Test Percentage Speed?"}
          </h4>
          <p className="text-xs text-muted-foreground">
            {language === "id"
              ? "Terapkan trik kalkulasi persentase pada engine Penalaran Numerik."
              : "Apply percentage calculation shortcuts in the Numerical Reasoning engine."}
          </p>
        </div>
        <Link href="/quiz?module=numerical-reasoning">
          <Button size="lg" className="gap-2 font-bold shrink-0 shadow-md">
            {language === "id" ? "Buka Latihan Soal" : "Open Practice Drills"} <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </div>
    </div>
  );
}
