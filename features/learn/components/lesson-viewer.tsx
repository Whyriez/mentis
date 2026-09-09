"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  BookOpen,
  Clock,
  CheckCircle2,
  Lightbulb,
  FileText,
  Play,
  ArrowLeft,
  ArrowRight,
  Sparkles,
  ChevronRight,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LessonData } from "../types";

interface LessonViewerProps {
  lesson: LessonData;
  totalLessons: number;
  prevLessonId?: string;
  nextLessonId?: string;
}

export function LessonViewer({
  lesson,
  totalLessons,
  prevLessonId,
  nextLessonId,
}: LessonViewerProps) {
  const [activeTab, setActiveTab] = useState<"explanation" | "tips" | "examples" | "summary">("explanation");

  return (
    <div className="space-y-8 pb-12 max-w-4xl mx-auto">
      {/* Top Breadcrumb & Return Link */}
      <div className="flex items-center justify-between">
        <Link
          href="/learn"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Return to Learn Library
        </Link>

        <Badge variant="outline" className="text-xs font-medium">
          Lesson {lesson.orderIndex} of {totalLessons}
        </Badge>
      </div>

      {/* Lesson Header Card */}
      <Card className="border-border/80 bg-gradient-to-br from-card via-card to-primary/5 shadow-md">
        <CardHeader className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-primary/20 bg-primary/10 text-primary text-xs font-bold">
              <BookOpen className="h-3.5 w-3.5" />
              {lesson.moduleTitle}
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary">{lesson.difficulty}</Badge>
              <div className="flex items-center gap-1 text-xs text-muted-foreground font-medium">
                <Clock className="h-3.5 w-3.5" />
                <span>{lesson.estimatedMinutes} mins</span>
              </div>
            </div>
          </div>

          <CardTitle className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            {lesson.title}
          </CardTitle>

          <CardDescription className="text-sm sm:text-base leading-relaxed text-muted-foreground">
            {lesson.description}
          </CardDescription>
        </CardHeader>

        <CardContent className="pt-0 space-y-4">
          <div className="p-4 rounded-xl bg-muted/40 border border-border/50">
            <h4 className="text-xs font-bold uppercase text-primary tracking-wider mb-2 flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5" />
              Learning Objectives
            </h4>
            <ul className="space-y-1.5">
              {lesson.objectives.map((obj, idx) => (
                <li key={idx} className="text-xs text-foreground flex items-start gap-2 font-medium">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0 mt-0.5" />
                  <span>{obj}</span>
                </li>
              ))}
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Interactive Content Section Tabs */}
      <div className="space-y-6">
        <div className="flex border-b border-border/80 overflow-x-auto gap-2">
          <button
            onClick={() => setActiveTab("explanation")}
            className={`pb-3 px-4 text-xs font-bold border-b-2 transition-all whitespace-nowrap cursor-pointer ${
              activeTab === "explanation"
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            <span className="flex items-center gap-1.5">
              <FileText className="h-4 w-4" />
              Explanation
            </span>
          </button>

          <button
            onClick={() => setActiveTab("tips")}
            className={`pb-3 px-4 text-xs font-bold border-b-2 transition-all whitespace-nowrap cursor-pointer ${
              activeTab === "tips"
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            <span className="flex items-center gap-1.5">
              <Lightbulb className="h-4 w-4" />
              Quick Tips
            </span>
          </button>

          <button
            onClick={() => setActiveTab("examples")}
            className={`pb-3 px-4 text-xs font-bold border-b-2 transition-all whitespace-nowrap cursor-pointer ${
              activeTab === "examples"
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            <span className="flex items-center gap-1.5">
              <BookOpen className="h-4 w-4" />
              Worked Examples
            </span>
          </button>

          <button
            onClick={() => setActiveTab("summary")}
            className={`pb-3 px-4 text-xs font-bold border-b-2 transition-all whitespace-nowrap cursor-pointer ${
              activeTab === "summary"
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4" />
              Summary
            </span>
          </button>
        </div>

        {/* Tab 1: Explanation */}
        {activeTab === "explanation" && (
          <Card className="border-border/80 bg-card p-6 shadow-sm">
            <h3 className="text-lg font-bold mb-3">Core Concept</h3>
            <p className="text-sm text-foreground leading-relaxed whitespace-pre-line">
              {lesson.sections.explanation}
            </p>
          </Card>
        )}

        {/* Tab 2: Quick Tips */}
        {activeTab === "tips" && (
          <div className="space-y-4">
            {lesson.sections.quickTips.map((tip, idx) => (
              <Card key={idx} className="border-amber-500/30 bg-amber-500/5 p-5 shadow-xs">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 shrink-0">
                    <Lightbulb className="h-5 w-5" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-bold text-base text-foreground">{tip.title}</h4>
                    <p className="text-xs text-muted-foreground leading-relaxed">{tip.description}</p>
                    {tip.formula && (
                      <div className="mt-3 p-3 rounded-md bg-card border border-amber-500/20 font-mono text-xs font-bold text-amber-600 dark:text-amber-400">
                        {tip.formula}
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Tab 3: Worked Examples */}
        {activeTab === "examples" && (
          <div className="space-y-4">
            {lesson.sections.examples.map((ex, idx) => (
              <Card key={idx} className="border-border/80 bg-card p-5 shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase text-primary tracking-wider">
                    Example #{idx + 1}
                  </span>
                  <Badge variant="accent">Solution: {ex.solution}</Badge>
                </div>
                <h4 className="text-base font-bold text-foreground">{ex.problem}</h4>
                <div className="space-y-2 pt-2 border-t border-border/50">
                  {ex.steps.map((step, sIdx) => (
                    <div key={sIdx} className="text-xs text-muted-foreground flex items-start gap-2 font-medium">
                      <ChevronRight className="h-3.5 w-3.5 text-primary shrink-0 mt-0.5" />
                      <span>{step}</span>
                    </div>
                  ))}
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Tab 4: Summary */}
        {activeTab === "summary" && (
          <Card className="border-emerald-500/30 bg-emerald-500/5 p-6 shadow-sm">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="h-5 w-5" />
              Key Takeaways
            </h3>
            <ul className="space-y-2">
              {lesson.sections.summary.map((sum, idx) => (
                <li key={idx} className="text-xs text-foreground font-medium flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 shrink-0" />
                  <span>{sum}</span>
                </li>
              ))}
            </ul>
          </Card>
        )}
      </div>

      {/* Navigation Footer */}
      <div className="pt-6 border-t border-border/80 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          {prevLessonId ? (
            <Link href={`/learn/multiplication/${prevLessonId}`} className="w-full sm:w-auto">
              <Button variant="outline" className="w-full sm:w-auto gap-2 font-semibold">
                <ArrowLeft className="h-4 w-4" />
                Previous Lesson
              </Button>
            </Link>
          ) : (
            <Link href="/learn" className="w-full sm:w-auto">
              <Button variant="outline" className="w-full sm:w-auto gap-2 font-semibold">
                <ArrowLeft className="h-4 w-4" />
                Return to Learn
              </Button>
            </Link>
          )}
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Link href={`/quiz?module=multiplication&lesson=${lesson.id}`} className="w-full sm:w-auto">
            <Button size="lg" className="w-full sm:w-auto gap-2 font-bold shadow-md bg-accent hover:bg-accent/90 text-accent-foreground">
              <Play className="h-4 w-4 fill-current" />
              Start Practice Quiz
            </Button>
          </Link>

          {nextLessonId && (
            <Link href={`/learn/multiplication/${nextLessonId}`} className="w-full sm:w-auto">
              <Button variant="secondary" size="lg" className="w-full sm:w-auto gap-2 font-semibold">
                Next Lesson
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
