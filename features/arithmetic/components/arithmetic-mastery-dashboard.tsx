"use client";

import React from "react";
import Link from "next/link";
import {
  Calculator,
  Zap,
  Plus,
  Minus,
  Divide,
  Percent,
  BookmarkCheck,
  BookOpen,
  ArrowRight,
  Sparkles,
  Play,
  Activity,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ArithmeticTopicId } from "../types";
import { ArithmeticOperation, ArithmeticTier } from "../services/arithmetic-generator";
import { useLanguage } from "@/components/providers/language-provider";

export interface ArithmeticMasteryDashboardProps {
  onSelectTopic: (topicId: ArithmeticTopicId) => void;
  onOpenQuickRef: () => void;
  onOpenMemorize: () => void;
  onStartQuiz?: (op?: ArithmeticOperation, tier?: ArithmeticTier) => void;
}

export function ArithmeticMasteryDashboard({
  onSelectTopic,
  onOpenQuickRef,
  onOpenMemorize,
  onStartQuiz,
}: ArithmeticMasteryDashboardProps) {
  const { language, t } = useLanguage();

  const topicsData = [
    {
      id: "multiplication" as ArithmeticTopicId,
      title: t.arithmetic.multiplication,
      icon: Zap,
      badge: language === "id" ? "Prioritas #1" : "Priority #1",
      progressPercent: 80,
      description:
        language === "id"
          ? "Tabel 1x1 s/d 10x10, 7 trik mental visual, dan perkalian bertahap hingga 100."
          : "1x1 through 10x10 table, 7 visual mental shortcuts, and progressive drill up to 100.",
      techniquesCount: 7,
    },
    {
      id: "subtraction" as ArithmeticTopicId,
      title: t.arithmetic.subtraction,
      icon: Minus,
      badge: language === "id" ? "Tanpa Pinjam" : "No Borrowing",
      progressPercent: 60,
      description:
        language === "id"
          ? "Kompensasi (-9, -19, -99), komplemen 100/1000, dan metode jarak."
          : "Decomposition, compensation (-9, -19, -99), and counting upward.",
      techniquesCount: 3,
    },
    {
      id: "division" as ArithmeticTopicId,
      title: t.arithmetic.division,
      icon: Divide,
      badge: language === "id" ? "Refleks Invers" : "Inverse Math",
      progressPercent: 40,
      description:
        language === "id"
          ? "Pembagian sebagai kebalikan perkalian, shortcut ÷5 (kali 2 bagi 10), ÷25, dan faktorisasi."
          : "Division as inverse of multiplication, ÷2, ÷5 double & shift, and factoring.",
      techniquesCount: 3,
    },
    {
      id: "addition" as ArithmeticTopicId,
      title: t.arithmetic.addition,
      icon: Plus,
      badge: language === "id" ? "Fondasi" : "Foundation",
      progressPercent: 100,
      description:
        language === "id"
          ? "Pembuatan angka 10/100, pemecahan bilangan, kompensasi, dan grouping mental."
          : "Make 10/100, break apart, compensation, and mental grouping.",
      techniquesCount: 3,
    },
    {
      id: "percentages" as ArithmeticTopicId,
      title: t.arithmetic.percentages,
      icon: Percent,
      badge: language === "id" ? "Komposisi" : "Composition",
      progressPercent: 30,
      description:
        language === "id"
          ? "8 benchmark inti (1%, 5%, 10%, 25%, 50%, 75%) dan komposisi mental cepat."
          : "8 core benchmarks (1%, 5%, 10%, 25%, 50%, 75%) and percentage composition.",
      techniquesCount: 6,
    },
  ];

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="p-6 sm:p-8 rounded-2xl border border-primary/50 bg-gradient-to-br from-card via-card to-primary/10 shadow-md space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-1.5 text-xs font-extrabold text-primary">
              <Calculator className="h-4 w-4" />
              <span>{language === "id" ? "Program Pelatihan Terstruktur" : "Structured Training Program"}</span>
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight">{t.arithmetic.title}</h1>
            <p className="text-muted-foreground text-sm max-w-2xl leading-relaxed">
              {t.arithmetic.subtitle}
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0 flex-wrap">
            <Button
              variant="outline"
              size="sm"
              onClick={onOpenQuickRef}
              className="gap-1.5 font-bold text-xs"
            >
              <BookOpen className="h-4 w-4 text-primary" /> {t.arithmetic.cheatSheet}
            </Button>
            <Button
              size="sm"
              onClick={onOpenMemorize}
              className="gap-1.5 font-bold text-xs shadow-md"
            >
              <BookmarkCheck className="h-4 w-4" /> {t.arithmetic.memorize}
            </Button>
          </div>
        </div>
      </div>

      {/* TOPIC MASTERY OVERVIEW DASHBOARD */}
      <Card className="border-border/80 bg-card p-6 space-y-6">
        <div className="flex justify-between items-center flex-wrap gap-2">
          <div>
            <h3 className="text-lg font-extrabold">
              {language === "id" ? "Ringkasan Penguasaan Topik Aritmatika" : "Overall Topic Mastery Overview"}
            </h3>
            <p className="text-xs text-muted-foreground">
              {language === "id"
                ? "Dihitung berdasarkan status hafalan dan teknik hitung mental yang diselesaikan."
                : "Calculated based on memorization status and shortcut techniques completed."}
            </p>
          </div>
          <Badge variant="accent" className="font-bold text-xs">
            {language === "id" ? "Total: 62% Dikuasai" : "Overall: 62% Mastered"}
          </Badge>
        </div>

        <div className="space-y-4">
          {topicsData.map((tp) => (
            <div key={tp.id} className="space-y-1.5">
              <div className="flex justify-between items-center text-xs font-extrabold">
                <span className="flex items-center gap-2">
                  <tp.icon className="h-4 w-4 text-primary" />
                  {tp.title}
                </span>
                <span className="text-primary">{tp.progressPercent}%</span>
              </div>
              <Progress value={tp.progressPercent} className="h-2.5" />
            </div>
          ))}
        </div>
      </Card>

      {/* 5 TOPICS GRID */}
      <div className="space-y-4">
        <h3 className="text-xl font-extrabold tracking-tight">
          {language === "id" ? "Pilih Topik Pembelajaran & Drill" : "Choose Learning Topic"}
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {topicsData.map((tp) => {
            const Icon = tp.icon;

            return (
              <Card
                key={tp.id}
                className="border-border/80 bg-card hover:border-primary/50 transition-all flex flex-col justify-between group cursor-pointer"
                onClick={() => onSelectTopic(tp.id)}
              >
                <CardHeader className="p-5 pb-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className="text-[10px] font-bold">
                      {tp.badge}
                    </Badge>
                    <span className="text-xs font-bold text-primary">
                      {tp.progressPercent}% {language === "id" ? "Dikuasai" : "Mastered"}
                    </span>
                  </div>

                  <CardTitle className="text-lg font-extrabold flex items-center gap-2 group-hover:text-primary transition-colors">
                    <Icon className="h-5 w-5 text-primary" />
                    {tp.title}
                  </CardTitle>

                  <CardDescription className="text-xs line-clamp-2 leading-relaxed">
                    {tp.description}
                  </CardDescription>
                </CardHeader>

                <CardContent className="p-5 pt-0 space-y-4">
                  <div className="pt-3 border-t border-border/40 flex items-center justify-between">
                    <span className="text-xs text-muted-foreground font-semibold">
                      {tp.techniquesCount} {language === "id" ? "Teknik" : "Techniques"}
                    </span>
                    <Button size="xs" variant="default" className="gap-1 font-bold text-xs">
                      {language === "id" ? "Pelajari & Latih" : "Learn & Memorize"} <ArrowRight className="h-3 w-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* KRAEPELIN & PAULI TEST SPOTLIGHT BANNER */}
      <div className="p-6 sm:p-8 rounded-2xl border border-amber-500/40 bg-gradient-to-r from-amber-500/15 via-card to-primary/10 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-md">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500/20 text-amber-600 dark:text-amber-400">
            <Activity className="h-3.5 w-3.5" />
            <span>{language === "id" ? "Simulasi Standar Rekrutmen Kerja" : "Recruitment Psychometric Standard"}</span>
          </div>
          <h4 className="text-xl sm:text-2xl font-black text-foreground">
            {language === "id"
              ? "Tes Kraepelin & Pauli (Tes Koran Digital)"
              : "Kraepelin & Pauli Test (Digital Speed Test)"}
          </h4>
          <p className="text-xs sm:text-sm text-muted-foreground max-w-2xl leading-relaxed">
            {language === "id"
              ? "Uji kecepatan kerja (Panker), ketelitian (Tianker), kestabilan ritme (Stanker), dan ketahanan mental (Hankel) dengan grafik kurva kerja interaktif."
              : "Measure working speed (Panker), accuracy (Tianker), rhythm stability (Stanker), and mental endurance (Hankel) with interactive work curve charts."}
          </p>
        </div>

        <Link href="/kraepelin" className="shrink-0 w-full sm:w-auto">
          <Button
            size="lg"
            className="w-full sm:w-auto bg-amber-500 hover:bg-amber-600 text-white font-extrabold gap-2 shadow-lg shadow-amber-500/25"
          >
            <Play className="h-4 w-4 fill-current" />
            <span>{language === "id" ? "Buka Tes Koran" : "Launch Kraepelin"}</span>
            <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </div>

      {/* CONNECTION TO PRACTICE CTA */}
      <div className="p-6 sm:p-8 rounded-2xl border border-primary/40 bg-gradient-to-r from-primary/10 via-card to-amber-500/10 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-500">
            <Sparkles className="h-4 w-4" />
            <span>{language === "id" ? "Siap Melatih Kecepatan?" : "Ready to Practice?"}</span>
          </div>
          <h4 className="text-xl font-extrabold text-foreground">
            {language === "id"
              ? "Uji Refleks Aritmatika Mental Bertahap Sekarang"
              : "Launch Progressive Mental Math Drills Now"}
          </h4>
          <p className="text-xs text-muted-foreground max-w-xl leading-relaxed">
            {language === "id"
              ? "Latih perkalian 1–10, 1–20, 1–30, hingga 1–100, serta pengurangan & pembagian efektif secara bertahap."
              : "Train multiplication 1–10, 1–20, 1–30, up to 1–100, and effective subtraction & division step-by-step."}
          </p>
        </div>

        <Button
          size="lg"
          onClick={() => onStartQuiz ? onStartQuiz("multiplication", "1-10") : null}
          className="gap-2 font-bold shrink-0 shadow-md"
        >
          <Play className="h-4 w-4 fill-current" />
          {language === "id" ? "Mulai Kuis Bertahap" : "Launch Progressive Drills"}{" "}
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
