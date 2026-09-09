"use client";

import React from "react";
import { Plus, ArrowRight, Lightbulb, Brain, AlertTriangle, Play } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { additionShortcuts } from "../data/arithmetic-data";
import { ArithmeticTier } from "../services/arithmetic-generator";
import { useLanguage } from "@/components/providers/language-provider";

interface AdditionTopicViewProps {
  onStartQuiz?: (tier: ArithmeticTier) => void;
}

export function AdditionTopicView({ onStartQuiz }: AdditionTopicViewProps) {
  const { language, t } = useLanguage();

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <Card className="border-primary/50 bg-gradient-to-br from-card via-card to-primary/5 shadow-md">
        <CardHeader className="p-6 space-y-3">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <Badge variant="default" className="gap-1.5 font-bold text-xs">
              <Plus className="h-3.5 w-3.5" /> {language === "id" ? `Topik 2 dari 5 — ${t.arithmetic.addition}` : `Topic 2 of 5 — ${t.arithmetic.addition}`}
            </Badge>
            <span className="text-xs font-bold text-muted-foreground">
              {language === "id" ? "Teknik Kecepatan" : "Speed Techniques"}
            </span>
          </div>

          <CardTitle className="text-2xl sm:text-3xl font-extrabold">
            {language === "id" ? "Penjumlahan Mental Cepat" : "Fast Mental Addition"}
          </CardTitle>
          <CardDescription className="text-sm leading-relaxed max-w-3xl">
            {language === "id"
              ? "Hentikan penjumlahan bersusun dengan menyimpan angka secara lambat. Pelajari kompensasi, pembuatan angka 10/100, dan pemecahan bilangan."
              : "Stop doing column addition with carrying. Learn compensation, making round tens/hundreds, and breaking numbers apart to add instantly in your head."}
          </CardDescription>
        </CardHeader>
      </Card>

      {/* PROGRESSIVE ADDITION DRILLS */}
      <Card className="border-emerald-500/40 bg-card p-6 space-y-4 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border/60 pb-3">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-extrabold text-emerald-500">
              <Plus className="h-4 w-4" />
              <span>{language === "id" ? "Latihan Kuis Penjumlahan Bertahap" : "Progressive Addition Quizzes"}</span>
            </div>
            <h3 className="text-xl font-extrabold text-foreground mt-0.5">
              {language === "id" ? "Kuis Penjumlahan Bertahap (1–20 s/d 1–1000)" : "Progressive Addition Quizzes (1–20 to 1–1000)"}
            </h3>
          </div>
          <Badge variant="outline" className="font-bold text-xs self-start sm:self-auto border-emerald-500/40 text-emerald-500">
            {language === "id" ? "4 Level Bertingkat" : "4 Tiered Levels"}
          </Badge>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {/* Tier 1 */}
          <div className="p-4 rounded-xl border border-border/80 bg-muted/20 hover:border-emerald-500/60 transition-all flex flex-col justify-between gap-3">
            <div className="space-y-1">
              <Badge variant="outline" className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 border-emerald-500/30">
                {language === "id" ? "Refleks 10/20" : "Make 10/20"}
              </Badge>
              <h4 className="text-sm font-extrabold text-foreground">
                {language === "id" ? "1. Penjumlahan 1–20" : "1. 1–20 Addition"}
              </h4>
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                {language === "id" ? "Refleks dasar penjumlahan satuan dan belasan." : "Basic reflex for adding single digits and teens."}
              </p>
            </div>
            <Button
              size="sm"
              onClick={() => onStartQuiz ? onStartQuiz("1-20") : null}
              className="w-full font-bold text-xs gap-1.5 shadow-2xs bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              <Play className="h-3 w-3 fill-current" />
              {language === "id" ? "Kuis 1–20" : "Quiz 1–20"}
            </Button>
          </div>

          {/* Tier 2 */}
          <div className="p-4 rounded-xl border border-border/80 bg-muted/20 hover:border-emerald-500/60 transition-all flex flex-col justify-between gap-3">
            <div className="space-y-1">
              <Badge variant="outline" className="text-[10px] font-bold text-blue-600 dark:text-blue-400 border-blue-500/30">
                {language === "id" ? "Kompensasi" : "Compensation"}
              </Badge>
              <h4 className="text-sm font-extrabold text-foreground">
                {language === "id" ? "2. Penjumlahan 1–50" : "2. 1–50 Addition"}
              </h4>
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                {language === "id" ? "Trik tambah puluhan lalu kurangi 1 (+19, +29)." : "Add nearby tens and subtract 1 (+19, +29)."}
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
          <div className="p-4 rounded-xl border border-border/80 bg-muted/20 hover:border-emerald-500/60 transition-all flex flex-col justify-between gap-3">
            <div className="space-y-1">
              <Badge variant="outline" className="text-[10px] font-bold text-amber-600 dark:text-amber-400 border-amber-500/30">
                {language === "id" ? "Puluhan (Kiri ke Kanan)" : "Tens Addition"}
              </Badge>
              <h4 className="text-sm font-extrabold text-foreground">
                {language === "id" ? "3. Penjumlahan 1–100" : "3. 1–100 Addition"}
              </h4>
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                {language === "id" ? "Pecah puluhan dan satuan dari kiri ke kanan." : "Left-to-right addition of 2-digit numbers."}
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
          <div className="p-4 rounded-xl border border-border/80 bg-muted/20 hover:border-emerald-500/60 transition-all flex flex-col justify-between gap-3">
            <div className="space-y-1">
              <Badge variant="outline" className="text-[10px] font-bold text-violet-600 dark:text-violet-400 border-violet-500/30">
                {language === "id" ? "Ratusan Mental" : "3-Digit Mental"}
              </Badge>
              <h4 className="text-sm font-extrabold text-foreground">
                {language === "id" ? "4. Penjumlahan 1–1000" : "4. 1–1000 Addition"}
              </h4>
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                {language === "id" ? "Ratusan + Puluhan + Satuan tanpa kertas coret." : "3-digit rapid left-to-right calculation."}
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

      {/* Addition Shortcuts */}
      <div className="space-y-6">
        <h3 className="text-xl font-extrabold font-sans">
          {language === "id" ? "Teknik Utama Penjumlahan Cepat" : "Core Addition Techniques"}
        </h3>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {additionShortcuts.map((sc) => (
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

      {/* Ready to Practice CTA */}
      <div className="p-6 rounded-2xl border border-primary/40 bg-gradient-to-r from-primary/10 via-card to-emerald-500/10 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="space-y-1">
          <h4 className="text-lg font-extrabold text-foreground">
            {language === "id" ? "Siap Melatih Kecepatan Penjumlahan?" : "Ready to Test Addition Speed?"}
          </h4>
          <p className="text-xs text-muted-foreground">
            {language === "id"
              ? "Uji kecepatan refleks hitung penjumlahan mental Anda dalam latihan bertahap."
              : "Practice addition speed drills in our progressive training engine."}
          </p>
        </div>
        <Button
          size="lg"
          onClick={() => (onStartQuiz ? onStartQuiz("1-20") : null)}
          className="gap-2 font-bold shrink-0 shadow-md bg-emerald-600 hover:bg-emerald-700 text-white"
        >
          <Plus className="h-4 w-4" />
          {language === "id" ? "Mulai Latihan Penjumlahan 1–20" : "Start Progressive 1–20 Drill"}{" "}
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
