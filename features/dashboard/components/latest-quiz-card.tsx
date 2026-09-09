import React from "react";
import Link from "next/link";
import { HelpCircle, Award, Timer, RotateCcw, Play } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export interface LatestQuizData {
  title: string;
  score: number;
  correctCount: number;
  totalQuestions: number;
  avgResponseTime: string;
  finishedAt: string;
}

interface LatestQuizCardProps {
  quizData?: LatestQuizData | null;
}

export function LatestQuizCard({ quizData }: LatestQuizCardProps) {
  if (!quizData) {
    return (
      <Card className="border-border/80 bg-card hover:border-primary/40 transition-all duration-300 shadow-md flex flex-col justify-between">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2 text-indigo-500 font-semibold text-xs tracking-wider uppercase">
            <HelpCircle className="h-4 w-4" />
            <span>Latest Quiz Performance</span>
          </div>
          <CardTitle className="text-lg font-bold mt-1">
            No Quizzes Attempted Yet
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 pt-1">
          <p className="text-xs text-muted-foreground">
            Take a quick 1-minute mental drill to measure your speed and accuracy.
          </p>
          <Link href="/quiz">
            <Button className="w-full font-semibold gap-2 shadow-xs">
              <Play className="h-3.5 w-3.5 fill-current" />
              Start First Quiz
            </Button>
          </Link>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-border/80 bg-card hover:border-primary/40 transition-all duration-300 shadow-md">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-indigo-500 font-semibold text-xs tracking-wider uppercase">
            <HelpCircle className="h-4 w-4" />
            <span>Latest Quiz Performance</span>
          </div>
          <span className="text-[11px] text-muted-foreground">{quizData.finishedAt}</span>
        </div>
        <CardTitle className="text-xl font-bold mt-1">
          {quizData.title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 rounded-lg bg-muted/50 border border-border/40">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1">
              <Award className="h-3.5 w-3.5 text-primary" />
              <span>Score</span>
            </div>
            <div className="text-xl font-bold text-foreground">
              {quizData.score}% <span className="text-xs font-normal text-muted-foreground">({quizData.correctCount}/{quizData.totalQuestions})</span>
            </div>
          </div>

          <div className="p-3 rounded-lg bg-muted/50 border border-border/40">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1">
              <Timer className="h-3.5 w-3.5 text-emerald-500" />
              <span>Avg Speed</span>
            </div>
            <div className="text-xl font-bold text-foreground">
              {quizData.avgResponseTime} <span className="text-xs font-normal text-muted-foreground">/ question</span>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-border/50">
          <Badge variant="accent" className="text-[11px]">
            {quizData.score >= 80 ? "Exceeding Target" : "Practice Recommended"}
          </Badge>

          <Link href="/quiz">
            <Button variant="outline" size="sm" className="gap-2 font-semibold">
              <RotateCcw className="h-3.5 w-3.5" />
              Try New Quiz
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
