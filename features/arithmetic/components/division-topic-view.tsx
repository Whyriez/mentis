"use client";

import React from "react";
import { Divide, ArrowRight, Lightbulb, Brain, AlertTriangle, RefreshCw, Play } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { divisionShortcuts } from "../data/arithmetic-data";
import { ArithmeticTier } from "../services/arithmetic-generator";
import { useLanguage } from "@/components/providers/language-provider";

interface DivisionTopicViewProps {
  onStartQuiz?: (tier: ArithmeticTier) => void;
}

export function DivisionTopicView({ onStartQuiz }: DivisionTopicViewProps) {
  const { language, t } = useLanguage();

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <Card className="border-primary/50 bg-gradient-to-br from-card via-card to-primary/5 shadow-md">
        <CardHeader className="p-6 space-y-3">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <Badge variant="default" className="gap-1.5 font-bold text-xs">
              <Divide className="h-3.5 w-3.5" /> {language === "id" ? `Topik 4 dari 5 — ${t.arithmetic.division}` : `Topic 4 of 5 — ${t.arithmetic.division}`}
            </Badge>
            <span className="text-xs font-bold text-muted-foreground">
              {language === "id" ? "Hubungan Kebalikan (Invers)" : "Inverse Relationship"}
            </span>
          </div>

          <CardTitle className="text-2xl sm:text-3xl font-extrabold">
            {language === "id" ? "Pembagian Mental & Refleks Invers" : "Division & Inverse Memory"}
          </CardTitle>
          <CardDescription className="text-sm leading-relaxed max-w-3xl">
            {language === "id"
              ? "Pahami pembagian sebagai kebalikan mutlak dari perkalian (misal: 12 ÷ 3 -> pikirkan '3 × ? = 12'). Kuasai shortcut bagi 2, 5, 10, dan 25."
              : "Understand division first as the exact inverse of multiplication (12 ÷ 3 ask '3 × ? = 12'), then master shortcuts for dividing by 2, 5, 10, and 25."}
          </CardDescription>
        </CardHeader>
      </Card>

      {/* PROGRESSIVE DIVISION DRILLS */}
      <Card className="border-blue-500/40 bg-card p-6 space-y-4 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border/60 pb-3">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-extrabold text-blue-500">
              <Divide className="h-4 w-4" />
              <span>{language === "id" ? "Latihan Kuis Pembagian Bertahap" : "Progressive Division Quizzes"}</span>
            </div>
            <h3 className="text-xl font-extrabold text-foreground mt-0.5">
              {language === "id" ? "Kuis Pembagian Bertahap (1–10 s/d 1–100)" : "Progressive Division Quizzes (1–10 to 1–100)"}
            </h3>
          </div>
          <Badge variant="outline" className="font-bold text-xs self-start sm:self-auto border-blue-500/40 text-blue-500">
            {language === "id" ? "4 Level Bertingkat" : "4 Tiered Levels"}
          </Badge>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {/* Tier 1 */}
          <div className="p-4 rounded-xl border border-border/80 bg-muted/20 hover:border-blue-500/60 transition-all flex flex-col justify-between gap-3">
            <div className="space-y-1">
              <Badge variant="outline" className="text-[10px] font-bold text-blue-600 dark:text-blue-400 border-blue-500/30">
                {language === "id" ? "Invers Tabel" : "Inverse Tables"}
              </Badge>
              <h4 className="text-sm font-extrabold text-foreground">
                {language === "id" ? "1. Pembagian 1–10" : "1. 1–10 Division"}
              </h4>
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                {language === "id" ? "Hubungkan kebalikan tabel perkalian (56 ÷ 8 -> 8 × ? = 56)." : "Direct inverse of fundamental 1–10 multiplication tables."}
              </p>
            </div>
            <Button
              size="sm"
              onClick={() => onStartQuiz ? onStartQuiz("1-10") : null}
              className="w-full font-bold text-xs gap-1.5 shadow-2xs bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Play className="h-3 w-3 fill-current" />
              {language === "id" ? "Kuis 1–10" : "Quiz 1–10"}
            </Button>
          </div>

          {/* Tier 2 */}
          <div className="p-4 rounded-xl border border-border/80 bg-muted/20 hover:border-blue-500/60 transition-all flex flex-col justify-between gap-3">
            <div className="space-y-1">
              <Badge variant="outline" className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 border-emerald-500/30">
                {language === "id" ? "Belasan & Puluhan" : "Teens & Tens"}
              </Badge>
              <h4 className="text-sm font-extrabold text-foreground">
                {language === "id" ? "2. Pembagian 1–20" : "2. 1–20 Division"}
              </h4>
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                {language === "id" ? "Pembagian angka belasan & puluhan (144 ÷ 12, 96 ÷ 6)." : "Divide by teens and tens with mental anchoring."}
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
          <div className="p-4 rounded-xl border border-border/80 bg-muted/20 hover:border-blue-500/60 transition-all flex flex-col justify-between gap-3">
            <div className="space-y-1">
              <Badge variant="outline" className="text-[10px] font-bold text-amber-600 dark:text-amber-400 border-amber-500/30">
                {language === "id" ? "Shortcut ÷5 & ÷25" : "÷5 & ÷25 Shortcuts"}
              </Badge>
              <h4 className="text-sm font-extrabold text-foreground">
                {language === "id" ? "3. Pembagian Shortcut" : "3. Division Shortcuts"}
              </h4>
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                {language === "id" ? "Trik bagi 5 (kali 2 bagi 10) & bagi 25 (kali 4 bagi 100)." : "Divide by 5 (double & shift) & by 25 (quadruple & shift)."}
              </p>
            </div>
            <Button
              size="sm"
              onClick={() => onStartQuiz ? onStartQuiz("1-50") : null}
              className="w-full font-bold text-xs gap-1.5 shadow-2xs"
            >
              <Play className="h-3 w-3 fill-current" />
              {language === "id" ? "Kuis Shortcut" : "Quiz Shortcuts"}
            </Button>
          </div>

          {/* Tier 4 */}
          <div className="p-4 rounded-xl border border-border/80 bg-muted/20 hover:border-blue-500/60 transition-all flex flex-col justify-between gap-3">
            <div className="space-y-1">
              <Badge variant="outline" className="text-[10px] font-bold text-violet-600 dark:text-violet-400 border-violet-500/30">
                {language === "id" ? "Faktorisasi & Paruh" : "Factoring & Halving"}
              </Badge>
              <h4 className="text-sm font-extrabold text-foreground">
                {language === "id" ? "4. Pembagian 1–100" : "4. 1–100 Division"}
              </h4>
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                {language === "id" ? "Pembagian bersih angka besar dengan memecah faktor (864 ÷ 8)." : "Clean larger division by factor splitting and successive halving."}
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

      {/* Core Division Shortcuts */}
      <div className="space-y-6">
        <h3 className="text-xl font-extrabold font-sans">
          {language === "id" ? "Teknik Pembagian Mental" : "Division Techniques"}
        </h3>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {divisionShortcuts.map((sc) => (
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

      {/* Multiplication <-> Division Family Map */}
      <Card className="border-border/80 bg-card p-6 space-y-4">
        <h4 className="text-base font-extrabold flex items-center gap-2">
          <RefreshCw className="h-4 w-4 text-primary" />
          {language === "id" ? "Segitiga Hubungan Perkalian & Pembagian" : "Multiplication & Division Family Triangles"}
        </h4>
        <p className="text-xs text-muted-foreground">
          {language === "id"
            ? "JANGAN hafalkan pembagian secara mandiri. Selalu kaitkan kembali dengan ingatan perkalian dasar."
            : "Do NOT memorize division facts independently. Always tie them back to multiplication recall."}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="p-3 rounded-xl border border-border bg-muted/20 space-y-1">
            <div className="font-bold text-primary">2 × 6 = 12</div>
            <div className="text-muted-foreground">12 ÷ 2 = 6</div>
            <div className="text-muted-foreground">12 ÷ 6 = 2</div>
          </div>

          <div className="p-3 rounded-xl border border-border bg-muted/20 space-y-1">
            <div className="font-bold text-primary">5 × 8 = 40</div>
            <div className="text-muted-foreground">40 ÷ 5 = 8</div>
            <div className="text-muted-foreground">40 ÷ 8 = 5</div>
          </div>

          <div className="p-3 rounded-xl border border-border bg-muted/20 space-y-1">
            <div className="font-bold text-primary">7 × 9 = 63</div>
            <div className="text-muted-foreground">63 ÷ 7 = 9</div>
            <div className="text-muted-foreground">63 ÷ 9 = 7</div>
          </div>
        </div>
      </Card>

      {/* Ready to Practice CTA */}
      <div className="p-6 rounded-2xl border border-primary/40 bg-gradient-to-r from-primary/10 via-card to-blue-500/10 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="space-y-1">
          <h4 className="text-lg font-extrabold text-foreground">
            {language === "id" ? "Siap Melatih Kecepatan Pembagian?" : "Ready to Practice Division?"}
          </h4>
          <p className="text-xs text-muted-foreground">
            {language === "id"
              ? "Uji kecepatan invers perkalian dan trik pembagian Anda dalam latihan bertahap."
              : "Test your speed and inverse recall in our progressive division training drills."}
          </p>
        </div>
        <Button
          size="lg"
          onClick={() => (onStartQuiz ? onStartQuiz("1-10") : null)}
          className="gap-2 font-bold shrink-0 shadow-md bg-blue-600 hover:bg-blue-700 text-white"
        >
          <Divide className="h-4 w-4" />
          {language === "id" ? "Mulai Latihan Pembagian 1–10" : "Start Progressive 1–10 Drill"}{" "}
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
