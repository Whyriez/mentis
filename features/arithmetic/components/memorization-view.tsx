"use client";

import React, { useState } from "react";
import { BookmarkCheck, CheckCircle2, RefreshCw } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/components/providers/language-provider";

interface MemorizationItem {
  topicKey: "multiplication" | "percentages" | "division" | "addition" | "subtraction";
  question: string;
  answer: string;
  noteId: string;
  noteEn: string;
}

const memorizationItems: MemorizationItem[] = [
  { topicKey: "multiplication", question: "12 × 12", answer: "144", noteId: "Kuadrat Umum", noteEn: "Common Square" },
  { topicKey: "multiplication", question: "15 × 15", answer: "225", noteId: "Kuadrat Umum", noteEn: "Common Square" },
  { topicKey: "multiplication", question: "25 × 25", answer: "625", noteId: "Kuadrat Umum", noteEn: "Common Square" },
  { topicKey: "multiplication", question: "16 × 5", answer: "80", noteId: "Hasil Kali Patokan", noteEn: "Benchmark Product" },
  { topicKey: "multiplication", question: "25 × 4", answer: "100", noteId: "Hasil Kali Patokan", noteEn: "Benchmark Product" },

  { topicKey: "percentages", question: "10% dari 80", answer: "8", noteId: "Geser koma 1 digit ke kiri", noteEn: "Shift decimal 1 place left" },
  { topicKey: "percentages", question: "5% dari 80", answer: "4", noteId: "10% ÷ 2 = 8 ÷ 2", noteEn: "10% ÷ 2 = 8 ÷ 2" },
  { topicKey: "percentages", question: "25% dari 80", answer: "20", noteId: "Bagi dengan 4", noteEn: "Divide by 4" },
  { topicKey: "percentages", question: "75% dari 80", answer: "60", noteId: "50% + 25% = 40 + 20", noteEn: "50% + 25% = 40 + 20" },

  { topicKey: "division", question: "12 ÷ 3", answer: "4", noteId: "Invers: 3 × ? = 12", noteEn: "Inverse: 3 × ? = 12" },
  { topicKey: "division", question: "80 ÷ 5", answer: "16", noteId: "Kali 2 lalu Bagi 10: 80×2 ÷ 10", noteEn: "Double & Shift: 80×2 ÷ 10" },

  { topicKey: "addition", question: "49 + 36", answer: "85", noteId: "Kompensasi: 50 + 36 - 1", noteEn: "Compensation: 50 + 36 - 1" },
  { topicKey: "subtraction", question: "83 - 29", answer: "54", noteId: "Kompensasi: 83 - 30 + 1", noteEn: "Compensation: 83 - 30 + 1" },
  { topicKey: "subtraction", question: "100 - 47", answer: "53", noteId: "Metode Jarak: 47→50→100", noteEn: "Distance: 47→50→100" },
];

export function MemorizationView() {
  const { language, t } = useLanguage();
  const isId = language === "id";

  const [revealedIds, setRevealedIds] = useState<Record<number, boolean>>({});
  const [memorizedIds, setMemorizedIds] = useState<Record<number, boolean>>({});
  const [categoryFilter, setCategoryFilter] = useState<string>("ALL");

  const toggleReveal = (idx: number) => {
    setRevealedIds((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  const toggleMemorized = (idx: number) => {
    setMemorizedIds((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  const filterOptions = [
    { key: "ALL", label: isId ? "Semua" : "All" },
    { key: "multiplication", label: t.arithmetic.multiplication },
    { key: "percentages", label: t.arithmetic.percentages },
    { key: "division", label: t.arithmetic.division },
    { key: "addition", label: t.arithmetic.addition },
    { key: "subtraction", label: t.arithmetic.subtraction },
  ];

  const getTopicName = (key: MemorizationItem["topicKey"]) => {
    switch (key) {
      case "multiplication":
        return t.arithmetic.multiplication;
      case "percentages":
        return t.arithmetic.percentages;
      case "division":
        return t.arithmetic.division;
      case "addition":
        return t.arithmetic.addition;
      case "subtraction":
        return t.arithmetic.subtraction;
    }
  };

  const filteredItems = memorizationItems.filter((i) => {
    if (categoryFilter === "ALL") return true;
    return i.topicKey === categoryFilter;
  });

  const totalMemorized = Object.values(memorizedIds).filter(Boolean).length;
  const progressPercent = Math.round((totalMemorized / memorizationItems.length) * 100);

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="p-6 rounded-2xl border border-primary/50 bg-gradient-to-r from-primary/10 via-card to-emerald-500/10 space-y-3">
        <div className="flex justify-between items-center flex-wrap gap-2">
          <div className="inline-flex items-center gap-1.5 text-xs font-extrabold text-primary">
            <BookmarkCheck className="h-4 w-4" />
            <span>{isId ? "Sistem Refleks Otomatis" : "Automatic Recall System"}</span>
          </div>
          <Badge variant="accent" className="font-bold">
            {progressPercent}% {isId ? "Dihafal" : "Memorized"}
          </Badge>
        </div>

        <h2 className="text-2xl font-extrabold tracking-tight">
          {isId ? "Kartu Flashcard Hafalan Inti" : "Must Memorize Flashcards"}
        </h2>
        <p className="text-xs text-muted-foreground max-w-2xl">
          {isId
            ? "Latih daya ingat otomatis untuk tabel perkalian inti, patokan persentase, dan trik kompensasi tanpa perlu menghitung ulang dari nol."
            : "Achieve instant automatic recall for core multiplication tables, percentage benchmarks, and compensation patterns without recalculating from scratch."}
        </p>

        {/* Filter bar */}
        <div className="flex items-center gap-1.5 pt-2 overflow-x-auto no-scrollbar py-1">
          <span className="text-xs font-bold text-muted-foreground shrink-0">
            {isId ? "Filter Kategori:" : "Filter Category:"}
          </span>
          {filterOptions.map((opt) => (
            <Button
              key={opt.key}
              size="xs"
              variant={categoryFilter === opt.key ? "default" : "outline"}
              onClick={() => setCategoryFilter(opt.key)}
              className="text-xs font-bold shrink-0 touch-tap"
            >
              {opt.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Grid of Flashcards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {filteredItems.map((item, idx) => {
          const isRevealed = !!revealedIds[idx];
          const isMemorized = !!memorizedIds[idx];

          return (
            <Card
              key={idx}
              className={`transition-all p-4 sm:p-5 flex flex-col justify-between gap-4 ${
                isMemorized
                  ? "border-emerald-500/40 bg-emerald-500/5 shadow-2xs"
                  : "border-border/80 bg-card hover:border-primary/40"
              }`}
            >
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Badge variant="outline" className="text-[10px] font-bold">
                    {getTopicName(item.topicKey)}
                  </Badge>
                  {isMemorized && (
                    <span className="text-xs font-bold text-emerald-500 flex items-center gap-1">
                      <CheckCircle2 className="h-3.5 w-3.5" /> {isId ? "Sudah Hafal" : "Memorized"}
                    </span>
                  )}
                </div>

                <div className="text-lg font-extrabold text-foreground pt-1">{item.question}</div>
                <p className="text-xs text-muted-foreground italic">
                  {isId ? item.noteId : item.noteEn}
                </p>
              </div>

              {/* Reveal Box */}
              <div className="space-y-2.5 border-t border-border/40 pt-3">
                {isRevealed ? (
                  <div className="p-3 rounded-lg bg-primary/10 text-primary font-extrabold text-xl text-center border border-primary/20 animate-in fade-in zoom-in-95 duration-150">
                    {item.answer}
                  </div>
                ) : (
                  <Button
                    type="button"
                    variant="secondary"
                    size="xs"
                    onClick={() => toggleReveal(idx)}
                    className="w-full font-bold text-xs gap-1.5 h-9 touch-tap"
                  >
                    <RefreshCw className="h-3.5 w-3.5" /> {isId ? "Buka Jawaban" : "Reveal Answer"}
                  </Button>
                )}

                <Button
                  type="button"
                  variant={isMemorized ? "default" : "outline"}
                  size="xs"
                  onClick={() => toggleMemorized(idx)}
                  className="w-full font-bold text-xs gap-1.5 h-9 touch-tap"
                >
                  {isMemorized
                    ? (isId ? "✓ Sudah Dihafal" : "✓ Marked as Memorized")
                    : (isId ? "Tandai Sudah Hafal" : "Mark as Memorized")}
                </Button>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
