"use client";

import React, { useState } from "react";
import { ColumnWorkCurvePoint } from "../types";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Minus, Info } from "lucide-react";

interface KraepelinWorkCurveChartProps {
  data: ColumnWorkCurvePoint[];
  averagePerColumn: number;
  trendSlope: number;
  trendType: "Ascending" | "Steady" | "Descending";
  trendTypeId: string;
}

export function KraepelinWorkCurveChart({
  data,
  averagePerColumn,
  trendSlope,
  trendType,
  trendTypeId,
}: KraepelinWorkCurveChartProps) {
  const [hoveredCol, setHoveredCol] = useState<ColumnWorkCurvePoint | null>(null);

  if (!data || data.length === 0) return null;

  // Find maximum output for scaling
  const maxAnswered = Math.max(15, ...data.map((d) => d.answeredCount));
  const chartHeight = 180; // px

  return (
    <Card className="border-border/80 shadow-md">
      <CardHeader className="pb-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <CardTitle className="text-base font-bold flex items-center gap-2">
              <span>Grafik Kurva Kerja Interaktif (Work Curve)</span>
              <Badge
                variant="outline"
                className={`text-[10px] gap-1 ${
                  trendType === "Ascending"
                    ? "border-emerald-500/50 text-emerald-600 dark:text-emerald-400 bg-emerald-500/10"
                    : trendType === "Descending"
                    ? "border-rose-500/50 text-rose-600 dark:text-rose-400 bg-rose-500/10"
                    : "border-primary/50 text-primary bg-primary/10"
                }`}
              >
                {trendType === "Ascending" ? (
                  <TrendingUp className="h-3 w-3" />
                ) : trendType === "Descending" ? (
                  <TrendingDown className="h-3 w-3" />
                ) : (
                  <Minus className="h-3 w-3" />
                )}
                <span>{trendTypeId}</span>
              </Badge>
            </CardTitle>
            <CardDescription className="text-xs">
              Visualisasi jumlah penjumlahan yang diselesaikan per kolom sepanjang durasi tes.
            </CardDescription>
          </div>

          <div className="flex items-center gap-3 text-xs text-muted-foreground self-start sm:self-auto">
            <div className="flex items-center gap-1.5">
              <span className="h-3 w-3 rounded-xs bg-primary inline-block" />
              <span>Benar</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="h-3 w-3 rounded-xs bg-rose-500 inline-block" />
              <span>Salah</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="h-0.5 w-4 bg-amber-500 border-dashed inline-block" />
              <span>Rata-rata ({averagePerColumn})</span>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        {/* Tooltip detail on hover */}
        <div className="h-7 px-2 py-1 rounded-md bg-muted/40 text-xs flex items-center justify-between">
          {hoveredCol ? (
            <div className="flex items-center gap-4 text-xs">
              <span className="font-bold text-foreground">
                Kolom {hoveredCol.column}:
              </span>
              <span className="text-primary font-semibold">
                {hoveredCol.answeredCount} Terjawab
              </span>
              <span className="text-emerald-600 dark:text-emerald-400">
                {hoveredCol.correctCount} Benar
              </span>
              {hoveredCol.errorCount > 0 && (
                <span className="text-rose-500 font-semibold">
                  {hoveredCol.errorCount} Salah
                </span>
              )}
              <span className="text-muted-foreground">
                Akurasi: {hoveredCol.accuracy}%
              </span>
            </div>
          ) : (
            <div className="text-[11px] text-muted-foreground flex items-center gap-1">
              <Info className="h-3 w-3" />
              <span>Arahkan kursor atau sentuh batang kolom untuk melihat rincian angka tiap kolom.</span>
            </div>
          )}
        </div>

        {/* Visual Bar & Line Chart */}
        <div className="relative overflow-x-auto no-scrollbar pt-6 pb-2">
          {/* Average Line */}
          <div
            className="absolute left-0 right-0 border-b-2 border-dashed border-amber-500/70 z-10 pointer-events-none transition-all"
            style={{
              bottom: `${(averagePerColumn / maxAnswered) * chartHeight + 28}px`,
            }}
          >
            <span className="absolute right-2 -top-4 text-[9px] font-bold text-amber-600 dark:text-amber-400 bg-background/80 px-1 rounded">
              Avg: {averagePerColumn}
            </span>
          </div>

          {/* Columns Container */}
          <div
            className="flex items-end justify-between gap-1.5 sm:gap-2 min-w-[320px] px-2"
            style={{ height: `${chartHeight}px` }}
          >
            {data.map((pt) => {
              const totalHeightPercent = (pt.answeredCount / maxAnswered) * 100;
              const errorHeightPercent = pt.answeredCount > 0 ? (pt.errorCount / pt.answeredCount) * 100 : 0;
              const correctHeightPercent = 100 - errorHeightPercent;

              return (
                <div
                  key={pt.column}
                  className="flex-1 flex flex-col items-center h-full justify-end group cursor-pointer"
                  onMouseEnter={() => setHoveredCol(pt)}
                  onMouseLeave={() => setHoveredCol(null)}
                  onTouchStart={() => setHoveredCol(pt)}
                >
                  {/* Top value indicator */}
                  <span className="text-[10px] font-bold text-muted-foreground group-hover:text-primary mb-1 transition-colors">
                    {pt.answeredCount}
                  </span>

                  {/* Stacked Bar Container */}
                  <div
                    className="w-full max-w-[28px] rounded-t-md overflow-hidden flex flex-col justify-end transition-all duration-300 group-hover:brightness-110 group-hover:scale-y-105 origin-bottom shadow-2xs"
                    style={{ height: `${totalHeightPercent}%` }}
                  >
                    {/* Error part (top of bar) */}
                    {pt.errorCount > 0 && (
                      <div
                        className="w-full bg-rose-500 transition-all"
                        style={{ height: `${errorHeightPercent}%` }}
                      />
                    )}

                    {/* Correct part */}
                    <div
                      className="w-full bg-primary transition-all flex-1"
                      style={{ height: `${correctHeightPercent}%` }}
                    />
                  </div>

                  {/* Column Label at bottom */}
                  <span className="text-[10px] font-semibold text-muted-foreground mt-2 border-t border-border/60 w-full text-center pt-1">
                    C{pt.column}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Legend note */}
        <p className="text-[11px] text-muted-foreground text-center">
          Kemiringan tren kurva: <strong className="text-foreground">{trendSlope > 0 ? `+${trendSlope}` : trendSlope}</strong>.{" "}
          {trendType === "Ascending"
            ? "Peningkatan grafik mengindikasikan ketahanan mental dan adaptasi kecepatan yang semakin cepat."
            : trendType === "Descending"
            ? "Penurunan grafik mengindikasikan munculnya kelelahan kognitif. Latihlah pernapasan dan konsistensi ritme."
            : "Grafik mendatar mengindikasikan ritme kerja yang stabil dan konsisten sepanjang ujian."}
        </p>
      </CardContent>
    </Card>
  );
}
