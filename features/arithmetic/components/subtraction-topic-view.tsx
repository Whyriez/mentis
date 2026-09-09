"use client";

import React from "react";
import { Minus, ArrowRight, Lightbulb, Brain, AlertTriangle, Play } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { subtractionShortcuts } from "../data/arithmetic-data";
import { ArithmeticTier } from "../services/arithmetic-generator";
import { useLanguage } from "@/components/providers/language-provider";

interface SubtractionTopicViewProps {
  onStartQuiz?: (tier: ArithmeticTier) => void;
}

export function SubtractionTopicView({ onStartQuiz }: SubtractionTopicViewProps) {
  const { language, t } = useLanguage();

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <Card className="border-primary/50 bg-gradient-to-br from-card via-card to-primary/5 shadow-md">
        <CardHeader className="p-6 space-y-3">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <Badge variant="default" className="gap-1.5 font-bold text-xs">
              <Minus className="h-3.5 w-3.5" /> {language === "id" ? `Topik 3 dari 5 — ${t.arithmetic.subtraction}` : `Topic 3 of 5 — ${t.arithmetic.subtraction}`}
            </Badge>
            <span className="text-xs font-bold text-muted-foreground">
              {language === "id" ? "Tanpa Pinjam Bersusun" : "No Column Borrowing"}
            </span>
          </div>

          <CardTitle className="text-2xl sm:text-3xl font-extrabold">
            {language === "id" ? "Pengurangan Mental Cepat" : "Fast Mental Subtraction"}
          </CardTitle>
          <CardDescription className="text-sm leading-relaxed max-w-3xl">
            {language === "id"
              ? "Hindari pengurangan bersusun yang lambat. Kuasai kompensasi (-9, -19, -29), komplemen 100/1000, dan metode jarak."
              : "Avoid slow column borrowing for simple mental calculations. Master compensation (-9, -19, -29, -99), subtracting from 100/1000, and counting upward."}
          </CardDescription>
        </CardHeader>
      </Card>

      {/* PROGRESSIVE SUBTRACTION DRILLS */}
      <Card className="border-rose-500/40 bg-card p-6 space-y-4 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border/60 pb-3">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-extrabold text-rose-500">
              <Minus className="h-4 w-4" />
              <span>{language === "id" ? "Latihan Kuis Pengurangan Bertahap" : "Progressive Subtraction Quizzes"}</span>
            </div>
            <h3 className="text-xl font-extrabold text-foreground mt-0.5">
              {language === "id" ? "Kuis Pengurangan Bertahap (1–20 s/d 1–1000)" : "Progressive Subtraction Quizzes (1–20 to 1–1000)"}
            </h3>
          </div>
          <Badge variant="outline" className="font-bold text-xs self-start sm:self-auto border-rose-500/40 text-rose-500">
            {language === "id" ? "4 Level Bertingkat" : "4 Tiered Levels"}
          </Badge>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {/* Tier 1 */}
          <div className="p-4 rounded-xl border border-border/80 bg-muted/20 hover:border-rose-500/60 transition-all flex flex-col justify-between gap-3">
            <div className="space-y-1">
              <Badge variant="outline" className="text-[10px] font-bold text-rose-600 dark:text-rose-400 border-rose-500/30">
                {language === "id" ? "Refleks Dasar" : "Basic Reflex"}
              </Badge>
              <h4 className="text-sm font-extrabold text-foreground">
                {language === "id" ? "1. Pengurangan 1–20" : "1. 1–20 Subtraction"}
              </h4>
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                {language === "id" ? "Kuasai pengurangan menembus 10 tanpa hitung jari manual." : "Bridge 10 reflex without counting on fingers."}
              </p>
            </div>
            <Button
              size="sm"
              onClick={() => onStartQuiz ? onStartQuiz("1-20") : null}
              className="w-full font-bold text-xs gap-1.5 shadow-2xs bg-rose-600 hover:bg-rose-700 text-white"
            >
              <Play className="h-3 w-3 fill-current" />
              {language === "id" ? "Kuis 1–20" : "Quiz 1–20"}
            </Button>
          </div>

          {/* Tier 2 */}
          <div className="p-4 rounded-xl border border-border/80 bg-muted/20 hover:border-rose-500/60 transition-all flex flex-col justify-between gap-3">
            <div className="space-y-1">
              <Badge variant="outline" className="text-[10px] font-bold text-amber-600 dark:text-amber-400 border-amber-500/30">
                {language === "id" ? "Kompensasi" : "Compensation"}
              </Badge>
              <h4 className="text-sm font-extrabold text-foreground">
                {language === "id" ? "2. Pengurangan 1–50" : "2. 1–50 Subtraction"}
              </h4>
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                {language === "id" ? "Trik kurangi puluhan lalu tambah selisih (-9, -19, -29)." : "Subtract nearby tens and add back difference."}
              </p>
            </div>
            <Button
              size="sm"
              onClick={() => onStartQuiz ? onStartQuiz("1-50") : null}
              className="w-full font-bold text-xs gap-1.5 shadow-2xs"
            >
              <Play className="h-3 w-3 fill-current" />
              {language === "id" ? "Kuis 1–50" : "Quiz 1–50"}
            </Button>
          </div>

          {/* Tier 3 */}
          <div className="p-4 rounded-xl border border-border/80 bg-muted/20 hover:border-rose-500/60 transition-all flex flex-col justify-between gap-3">
            <div className="space-y-1">
              <Badge variant="outline" className="text-[10px] font-bold text-blue-600 dark:text-blue-400 border-blue-500/30">
                {language === "id" ? "Komplemen 100" : "Base 100"}
              </Badge>
              <h4 className="text-sm font-extrabold text-foreground">
                {language === "id" ? "3. Pengurangan 1–100" : "3. 1–100 Subtraction"}
              </h4>
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                {language === "id" ? "Metode jarak dan komplemen 100 - x secara cepat." : "Distance method & 100 - x complements."}
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

          {/* Tier 4 */}
          <div className="p-4 rounded-xl border border-border/80 bg-muted/20 hover:border-rose-500/60 transition-all flex flex-col justify-between gap-3">
            <div className="space-y-1">
              <Badge variant="outline" className="text-[10px] font-bold text-violet-600 dark:text-violet-400 border-violet-500/30">
                {language === "id" ? "Tiga Angka Mental" : "3-Digit Mental"}
              </Badge>
              <h4 className="text-sm font-extrabold text-foreground">
                {language === "id" ? "4. Pengurangan 1–1000" : "4. 1–1000 Subtraction"}
              </h4>
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                {language === "id" ? "Aturan 1000 (All from 9, last from 10) & chunking ratusan." : "All from 9, last from 10 rule for base 1000."}
              </p>
            </div>
            <Button
              size="sm"
              onClick={() => onStartQuiz ? onStartQuiz("1-1000") : null}
              className="w-full font-bold text-xs gap-1.5 shadow-2xs"
            >
              <Play className="h-3 w-3 fill-current" />
              {language === "id" ? "Kuis 1–1000" : "Quiz 1–1000"}
            </Button>
          </div>
        </div>
      </Card>

      {/* Subtraction Shortcuts */}
      <div className="space-y-6">
        <h3 className="text-xl font-extrabold font-sans">
          {language === "id" ? "Teknik Utama Pengurangan Cepat" : "Core Subtraction Techniques"}
        </h3>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {subtractionShortcuts.map((sc) => (
            <Card key={sc.id} className="border-border/80 bg-card shadow-sm hover:border-primary/40 transition-all flex flex-col justify-between">
              <CardHeader className="p-5 pb-3 bg-muted/20 border-b border-border/40">
                <CardTitle className="text-base font-extrabold text-foreground">
                  {language === "id" ? (sc.titleId ?? sc.title) : sc.title}
                </CardTitle>
                <CardDescription className="text-xs text-primary font-semibold">
                  {language === "id" ? (sc.taglineId ?? sc.tagline) : sc.tagline}
                </CardDescription>
              </CardHeader>

              <CardContent className="p-5 space-y-4 flex-1">
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

                <div className="space-y-2 text-xs">
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

      {/* Worked Subtraction Examples */}
      <Card className="border-border/80 bg-card p-6 space-y-4">
        <h4 className="text-base font-extrabold">
          {language === "id" ? "Pembahasan Contoh Langkah Cepat" : "Detailed Worked Examples"}
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-xl border border-border bg-muted/20 space-y-2">
            <Badge variant="outline" className="font-bold">
              {language === "id" ? "Contoh: 83 - 29" : "Example: 83 - 29"}
            </Badge>
            <p className="text-muted-foreground">
              {language === "id"
                ? "Kurangi 30 terlebih dahulu: "
                : "Subtract 30 (removes 1 too much): "}
              <span className="font-bold text-foreground">83 - 30 = 53</span>.
            </p>
            <p className="text-muted-foreground">
              {language === "id" ? "Tambah kembali 1 untuk seimbang: " : "Add back 1 to balance: "}
              <span className="font-bold text-primary font-bold">53 + 1 = 54</span>.
            </p>
          </div>

          <div className="p-4 rounded-xl border border-border bg-muted/20 space-y-2">
            <Badge variant="outline" className="font-bold">
              {language === "id" ? "Contoh: 100 - 47" : "Example: 100 - 47"}
            </Badge>
            <p className="text-muted-foreground">
              {language === "id" ? "Pikirkan metode jarak: " : "Think distance: "}
              <span className="font-bold text-foreground">47 → 50 (+3) → 100 (+50)</span>.
            </p>
            <p className="text-muted-foreground">
              {language === "id" ? "Total jarak = " : "Total distance = "}
              <span className="font-bold text-primary font-bold">3 + 50 = 53</span>.
            </p>
          </div>
        </div>
      </Card>

      {/* Subtraction Quick Reference */}
      <Card className="border-border/80 bg-muted/30 p-6 space-y-3">
        <h4 className="text-sm font-extrabold uppercase tracking-wider text-foreground">
          {language === "id" ? "Lembar Ringkasan Pengurangan" : "Subtraction Cheat Sheet"}
        </h4>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-bold">
          <div className="p-2.5 rounded-lg border border-border bg-card">-9 → -10 +1</div>
          <div className="p-2.5 rounded-lg border border-border bg-card">-19 → -20 +1</div>
          <div className="p-2.5 rounded-lg border border-border bg-card">-29 → -30 +1</div>
          <div className="p-2.5 rounded-lg border border-border bg-card">-99 → -100 +1</div>
        </div>
      </Card>

      {/* Ready to Practice CTA */}
      <div className="p-6 rounded-2xl border border-primary/40 bg-gradient-to-r from-primary/10 via-card to-rose-500/10 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="space-y-1">
          <h4 className="text-lg font-extrabold text-foreground">
            {language === "id" ? "Siap Melatih Kecepatan Pengurangan?" : "Ready to Practice Subtraction?"}
          </h4>
          <p className="text-xs text-muted-foreground">
            {language === "id"
              ? "Uji kecepatan kalkulasi pengurangan mental Anda dalam drill bertahap."
              : "Test your calculation speed in our progressive mental subtraction drill engine."}
          </p>
        </div>
        <Button
          size="lg"
          onClick={() => (onStartQuiz ? onStartQuiz("1-20") : null)}
          className="gap-2 font-bold shrink-0 shadow-md bg-rose-600 hover:bg-rose-700 text-white"
        >
          <Minus className="h-4 w-4" />
          {language === "id" ? "Mulai Latihan Pengurangan 1–20" : "Start Progressive 1–20 Drill"}{" "}
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
