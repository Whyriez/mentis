"use client";

import React from "react";
import {
  Trophy,
  Activity,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  LayoutDashboard,
  Calculator,
  Flame,
  Clock,
  Award,
  Zap,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { KraepelinMetrics } from "../types";
import { KraepelinWorkCurveChart } from "./kraepelin-work-curve-chart";
import { useLanguage } from "@/components/providers/language-provider";
import Link from "next/link";

interface KraepelinResultViewProps {
  metrics: KraepelinMetrics;
  earnedXP?: number;
  onRetry: () => void;
}

export function KraepelinResultView({
  metrics,
  earnedXP = 50,
  onRetry,
}: KraepelinResultViewProps) {
  const { t } = useLanguage();
  const k = t.kraepelin;

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12 animate-in fade-in-50 duration-300">
      {/* Header Banner */}
      <div className="rounded-2xl border border-primary/20 bg-gradient-to-r from-primary/15 via-primary/5 to-card p-6 sm:p-8 text-center space-y-3 shadow-md relative overflow-hidden">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold bg-primary/20 text-primary">
          <Trophy className="h-4 w-4" />
          <span>{metrics.mode === "kraepelin" ? "Tes Kraepelin Selesai!" : "Tes Pauli Selesai!"}</span>
        </div>

        <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-foreground">
          {k.resultTitle}
        </h1>
        <p className="text-sm text-muted-foreground max-w-xl mx-auto">
          {k.resultSubtitle}
        </p>

        {earnedXP > 0 && (
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-400 font-bold text-xs mt-2">
            <Flame className="h-4 w-4 fill-amber-500 text-amber-500 animate-pulse" />
            <span>+{earnedXP} XP Diperoleh & Streak Diperbarui!</span>
          </div>
        )}
      </div>

      {/* 4 Core Pillars of Psychometrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* 1. Panker (Kecepatan) */}
        <Card className="border-border/80 bg-card hover:border-primary/40 transition-all shadow-xs">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between text-xs text-muted-foreground font-semibold">
              <span className="flex items-center gap-1.5">
                <Zap className="h-4 w-4 text-amber-500" />
                Panker (Kecepatan)
              </span>
              <Badge variant="outline" className="text-[10px] border-amber-500/40 text-amber-600 dark:text-amber-400">
                {metrics.panker.gradeId}
              </Badge>
            </div>
            <CardTitle className="text-2xl font-black text-foreground mt-1">
              {metrics.panker.averagePerColumn}{" "}
              <span className="text-xs font-normal text-muted-foreground">{k.pankerUnit}</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0 text-xs text-muted-foreground space-y-1">
            <div className="flex justify-between">
              <span>Total Terjawab:</span>
              <strong className="text-foreground">{metrics.totalAnswered}</strong>
            </div>
            <div className="flex justify-between">
              <span>Output Tertinggi:</span>
              <strong className="text-foreground">{metrics.panker.highestPerColumn}</strong>
            </div>
          </CardContent>
        </Card>

        {/* 2. Tianker (Ketelitian) */}
        <Card className="border-border/80 bg-card hover:border-primary/40 transition-all shadow-xs">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between text-xs text-muted-foreground font-semibold">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                Tianker (Ketelitian)
              </span>
              <Badge variant="outline" className="text-[10px] border-emerald-500/40 text-emerald-600 dark:text-emerald-400">
                {metrics.tianker.gradeId}
              </Badge>
            </div>
            <CardTitle className="text-2xl font-black text-foreground mt-1">
              {metrics.accuracyPercent}%
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0 text-xs text-muted-foreground space-y-1">
            <div className="flex justify-between">
              <span>Jawaban Benar:</span>
              <strong className="text-emerald-600 dark:text-emerald-400">{metrics.totalCorrect}</strong>
            </div>
            <div className="flex justify-between">
              <span>Jumlah Salah:</span>
              <strong className={metrics.totalErrors > 0 ? "text-rose-500 font-bold" : "text-foreground"}>
                {metrics.totalErrors}
              </strong>
            </div>
          </CardContent>
        </Card>

        {/* 3. Stanker (Kestabilan Ritme) */}
        <Card className="border-border/80 bg-card hover:border-primary/40 transition-all shadow-xs">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between text-xs text-muted-foreground font-semibold">
              <span className="flex items-center gap-1.5">
                <Activity className="h-4 w-4 text-blue-500" />
                Stanker (Kestabilan)
              </span>
              <Badge variant="outline" className="text-[10px] border-blue-500/40 text-blue-600 dark:text-blue-400">
                {metrics.stanker.gradeId}
              </Badge>
            </div>
            <CardTitle className="text-2xl font-black text-foreground mt-1">
              ±{metrics.stanker.standardDeviation}{" "}
              <span className="text-xs font-normal text-muted-foreground">deviasi</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0 text-xs text-muted-foreground space-y-1">
            <div className="flex justify-between">
              <span>Indeks Ritme:</span>
              <strong className="text-foreground">{metrics.stanker.stabilityIndex} / 100</strong>
            </div>
            <div className="flex justify-between">
              <span>Karakter:</span>
              <strong className="text-foreground">{metrics.stanker.gradeId}</strong>
            </div>
          </CardContent>
        </Card>

        {/* 4. Hankel (Ketahanan Kerja) */}
        <Card className="border-border/80 bg-card hover:border-primary/40 transition-all shadow-xs">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between text-xs text-muted-foreground font-semibold">
              <span className="flex items-center gap-1.5">
                <Clock className="h-4 w-4 text-purple-500" />
                Hankel (Ketahanan)
              </span>
              <Badge variant="outline" className="text-[10px] border-purple-500/40 text-purple-600 dark:text-purple-400">
                {metrics.hankel.trendType}
              </Badge>
            </div>
            <CardTitle className="text-lg font-black text-foreground mt-1 line-clamp-1">
              {metrics.hankel.trendTypeId}
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0 text-xs text-muted-foreground space-y-1">
            <div className="flex justify-between">
              <span>Kemiringan:</span>
              <strong className="text-foreground">
                {metrics.hankel.trendSlope > 0 ? `+${metrics.hankel.trendSlope}` : metrics.hankel.trendSlope}
              </strong>
            </div>
            <div className="flex justify-between">
              <span>Titik Lelah:</span>
              <strong className="text-foreground">
                {metrics.hankel.fatiguePointColumn ? `Kolom ${metrics.hankel.fatiguePointColumn}` : "Tidak Ada"}
              </strong>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Interactive Work Curve Chart */}
      <KraepelinWorkCurveChart
        data={metrics.columnWorkCurve}
        averagePerColumn={metrics.panker.averagePerColumn}
        trendSlope={metrics.hankel.trendSlope}
        trendType={metrics.hankel.trendType}
        trendTypeId={metrics.hankel.trendTypeId}
      />

      {/* Psychological Interpretation & Practical Advice */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="border-border/80">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-bold flex items-center gap-2">
              <Award className="h-4 w-4 text-primary" />
              <span>{k.interpretationTitle}</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-xs text-muted-foreground leading-relaxed">
            <p>• {metrics.interpretation.speedSummary}</p>
            <p>• {metrics.interpretation.accuracySummary}</p>
            <p>• {metrics.interpretation.rhythmSummary}</p>
            <p>• {metrics.interpretation.staminaSummary}</p>
          </CardContent>
        </Card>

        <Card className="border-primary/30 bg-primary/5">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-bold flex items-center gap-2 text-primary">
              <AlertTriangle className="h-4 w-4" />
              <span>{k.recommendationsTitle}</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-xs text-foreground/90 leading-relaxed">
            <p className="font-semibold text-primary">
              {metrics.interpretation.overallRecommendation}
            </p>
            <p>
              💡 <strong>Tips Tes Asli:</strong> Pada ujian tes koran kertas, gunakan pensil 2B yang tidak terlalu runcing agar tidak mudah patah saat menggores cepat.
            </p>
            <p>
              ⚡ <strong>Trik Satuan:</strong> Jangan menghitung belasannya; latih refleks pasangan satuan (misal 9+8 ingat 7, 8+7 ingat 5, 6+7 ingat 3).
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-border/80">
        <Button
          size="lg"
          onClick={onRetry}
          className="w-full sm:w-auto font-bold gap-2 shadow-md"
        >
          <RotateCcw className="h-4 w-4" />
          <span>{k.retryTest}</span>
        </Button>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Link href="/arithmetic" className="flex-1 sm:flex-initial">
            <Button variant="outline" size="lg" className="w-full font-semibold gap-2">
              <Calculator className="h-4 w-4" />
              <span>Pusat Aritmatika</span>
            </Button>
          </Link>

          <Link href="/dashboard" className="flex-1 sm:flex-initial">
            <Button variant="secondary" size="lg" className="w-full font-semibold gap-2">
              <LayoutDashboard className="h-4 w-4" />
              <span>{k.backToDashboard}</span>
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
