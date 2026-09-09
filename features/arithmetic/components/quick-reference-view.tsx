"use client";

import React from "react";
import { BookOpen, Zap, Plus, Minus, Divide, Percent } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/components/providers/language-provider";

export function QuickReferenceView() {
  const { language } = useLanguage();
  const isId = language === "id";

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="p-6 rounded-2xl border border-primary/50 bg-gradient-to-r from-primary/10 via-card to-emerald-500/10 space-y-2">
        <div className="inline-flex items-center gap-1.5 text-xs font-extrabold text-primary">
          <BookOpen className="h-4 w-4" />
          <span>{isId ? "Lembar Ringkasan Fokus" : "Distraction-Free Cheat Sheet"}</span>
        </div>
        <h2 className="text-2xl font-extrabold tracking-tight">
          {isId ? "Ringkasan Cepat Trik Aritmatika" : "Arithmetic Quick Reference"}
        </h2>
        <p className="text-xs text-muted-foreground">
          {isId
            ? "Gunakan ringkasan ini selama sesi belajar hitung mental untuk contekan rumus instan pada seluruh 5 topik."
            : "Keep this reference open during mental study sessions for instant formula lookups across all 5 topics."}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Multiplication */}
        <Card className="border-border/80 bg-card p-5 space-y-4">
          <CardHeader className="p-0 pb-3 border-b border-border/40 flex flex-row items-center justify-between">
            <CardTitle className="text-base font-extrabold flex items-center gap-2">
              <Zap className="h-4 w-4 text-amber-500" /> {isId ? "PERKALIAN" : "MULTIPLICATION"}
            </CardTitle>
            <Badge variant="outline" className="text-[10px]">{isId ? "Trik Cepat" : "Shortcuts"}</Badge>
          </CardHeader>
          <CardContent className="p-0 space-y-2 text-xs font-mono">
            <div className="p-2 rounded bg-muted/30 border border-border/40 flex justify-between">
              <span>×2</span> <span className="font-bold text-primary">{isId ? "Gandakan" : "Double"}</span>
            </div>
            <div className="p-2 rounded bg-muted/30 border border-border/40 flex justify-between">
              <span>×5</span> <span className="font-bold text-primary">×10 ÷ 2</span>
            </div>
            <div className="p-2 rounded bg-muted/30 border border-border/40 flex justify-between">
              <span>×9</span> <span className="font-bold text-primary">{isId ? "×10 - angka asli" : "×10 - original"}</span>
            </div>
            <div className="p-2 rounded bg-muted/30 border border-border/40 flex justify-between">
              <span>×11</span> <span className="font-bold text-primary">{isId ? "Jumlahkan di tengah" : "Sandwich sum"}</span>
            </div>
            <div className="p-2 rounded bg-muted/30 border border-border/40 flex justify-between">
              <span>×25</span> <span className="font-bold text-primary">÷4 × 100</span>
            </div>
            <div className="p-2 rounded bg-muted/30 border border-border/40 flex justify-between">
              <span>×50</span> <span className="font-bold text-primary">÷2 × 100</span>
            </div>
            <div className="p-2 rounded bg-muted/30 border border-border/40 flex justify-between">
              <span>×100</span> <span className="font-bold text-primary">{isId ? "Tambah 2 nol" : "Add 2 zeros"}</span>
            </div>
            <div className="p-2 rounded bg-muted/30 border border-border/40 flex justify-between">
              <span>19 × 7</span> <span className="font-bold text-primary">20×7 - 7 = 133</span>
            </div>
          </CardContent>
        </Card>

        {/* Addition */}
        <Card className="border-border/80 bg-card p-5 space-y-4">
          <CardHeader className="p-0 pb-3 border-b border-border/40 flex flex-row items-center justify-between">
            <CardTitle className="text-base font-extrabold flex items-center gap-2">
              <Plus className="h-4 w-4 text-emerald-500" /> {isId ? "PENJUMLAHAN" : "ADDITION"}
            </CardTitle>
            <Badge variant="outline" className="text-[10px]">{isId ? "Trik Cepat" : "Shortcuts"}</Badge>
          </CardHeader>
          <CardContent className="p-0 space-y-2 text-xs font-mono">
            <div className="p-2 rounded bg-muted/30 border border-border/40 flex justify-between">
              <span>{isId ? "Genapkan 10" : "Make 10"}</span> <span className="font-bold text-primary">49+36 → 50+35</span>
            </div>
            <div className="p-2 rounded bg-muted/30 border border-border/40 flex justify-between">
              <span>{isId ? "Pecah Nilai" : "Break Apart"}</span> <span className="font-bold text-primary">48+27 → 48+20+7</span>
            </div>
            <div className="p-2 rounded bg-muted/30 border border-border/40 flex justify-between">
              <span>{isId ? "Kompensasi" : "Compensation"}</span> <span className="font-bold text-primary">57+29 → 57+30 - 1</span>
            </div>
            <div className="p-2 rounded bg-muted/30 border border-border/40 flex justify-between">
              <span>{isId ? "Genapkan 100" : "Make 100"}</span> <span className="font-bold text-primary">98+45 → 100+43</span>
            </div>
          </CardContent>
        </Card>

        {/* Subtraction */}
        <Card className="border-border/80 bg-card p-5 space-y-4">
          <CardHeader className="p-0 pb-3 border-b border-border/40 flex flex-row items-center justify-between">
            <CardTitle className="text-base font-extrabold flex items-center gap-2">
              <Minus className="h-4 w-4 text-rose-500" /> {isId ? "PENGURANGAN" : "SUBTRACTION"}
            </CardTitle>
            <Badge variant="outline" className="text-[10px]">{isId ? "Trik Cepat" : "Shortcuts"}</Badge>
          </CardHeader>
          <CardContent className="p-0 space-y-2 text-xs font-mono">
            <div className="p-2 rounded bg-muted/30 border border-border/40 flex justify-between">
              <span>-9</span> <span className="font-bold text-primary">-10 + 1</span>
            </div>
            <div className="p-2 rounded bg-muted/30 border border-border/40 flex justify-between">
              <span>-19</span> <span className="font-bold text-primary">-20 + 1</span>
            </div>
            <div className="p-2 rounded bg-muted/30 border border-border/40 flex justify-between">
              <span>-29</span> <span className="font-bold text-primary">-30 + 1</span>
            </div>
            <div className="p-2 rounded bg-muted/30 border border-border/40 flex justify-between">
              <span>-99</span> <span className="font-bold text-primary">-100 + 1</span>
            </div>
            <div className="p-2 rounded bg-muted/30 border border-border/40 flex justify-between">
              <span>100 - 47</span> <span className="font-bold text-primary">{isId ? "Jarak: 47→50→100 = 53" : "47→50→100 = 53"}</span>
            </div>
          </CardContent>
        </Card>

        {/* Division */}
        <Card className="border-border/80 bg-card p-5 space-y-4">
          <CardHeader className="p-0 pb-3 border-b border-border/40 flex flex-row items-center justify-between">
            <CardTitle className="text-base font-extrabold flex items-center gap-2">
              <Divide className="h-4 w-4 text-blue-500" /> {isId ? "PEMBAGIAN" : "DIVISION"}
            </CardTitle>
            <Badge variant="outline" className="text-[10px]">{isId ? "Trik Cepat" : "Shortcuts"}</Badge>
          </CardHeader>
          <CardContent className="p-0 space-y-2 text-xs font-mono">
            <div className="p-2 rounded bg-muted/30 border border-border/40 flex justify-between">
              <span>12 ÷ 3</span> <span className="font-bold text-primary">3 × ? = 12 → 4</span>
            </div>
            <div className="p-2 rounded bg-muted/30 border border-border/40 flex justify-between">
              <span>÷ 5</span> <span className="font-bold text-primary">{isId ? "×2 lalu ÷10" : "×2 ÷ 10"}</span>
            </div>
            <div className="p-2 rounded bg-muted/30 border border-border/40 flex justify-between">
              <span>÷ 10</span> <span className="font-bold text-primary">{isId ? "Geser 1 angka ke kiri" : "Shift 1 place left"}</span>
            </div>
            <div className="p-2 rounded bg-muted/30 border border-border/40 flex justify-between">
              <span>÷ 100</span> <span className="font-bold text-primary">{isId ? "Geser 2 angka ke kiri" : "Shift 2 places left"}</span>
            </div>
          </CardContent>
        </Card>

        {/* Percentages */}
        <Card className="border-border/80 bg-card p-5 space-y-4 md:col-span-2 lg:col-span-2">
          <CardHeader className="p-0 pb-3 border-b border-border/40 flex flex-row items-center justify-between">
            <CardTitle className="text-base font-extrabold flex items-center gap-2">
              <Percent className="h-4 w-4 text-violet-500" /> {isId ? "PERSENTASE" : "PERCENTAGES"}
            </CardTitle>
            <Badge variant="outline" className="text-[10px]">{isId ? "Trik Cepat" : "Shortcuts"}</Badge>
          </CardHeader>
          <CardContent className="p-0 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono">
            <div className="p-2 rounded bg-muted/30 border border-border/40 flex justify-between">
              <span>10%</span> <span className="font-bold text-primary">÷10</span>
            </div>
            <div className="p-2 rounded bg-muted/30 border border-border/40 flex justify-between">
              <span>5%</span> <span className="font-bold text-primary">10% ÷ 2</span>
            </div>
            <div className="p-2 rounded bg-muted/30 border border-border/40 flex justify-between">
              <span>1%</span> <span className="font-bold text-primary">÷100</span>
            </div>
            <div className="p-2 rounded bg-muted/30 border border-border/40 flex justify-between">
              <span>25%</span> <span className="font-bold text-primary">÷4</span>
            </div>
            <div className="p-2 rounded bg-muted/30 border border-border/40 flex justify-between">
              <span>50%</span> <span className="font-bold text-primary">÷2</span>
            </div>
            <div className="p-2 rounded bg-muted/30 border border-border/40 flex justify-between">
              <span>75%</span> <span className="font-bold text-primary">50% + 25%</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
