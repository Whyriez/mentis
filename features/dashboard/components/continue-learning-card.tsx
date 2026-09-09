import React from "react";
import Link from "next/link";
import { BookOpen, Play, Clock, Sparkles } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

export interface ContinueLearningItem {
  title: string;
  currentLesson: string;
  progress: number;
  estimatedMinutes: number;
  difficulty: string;
  lessonHref?: string;
}

interface ContinueLearningCardProps {
  currentModule?: ContinueLearningItem | null;
}

export function ContinueLearningCard({ currentModule }: ContinueLearningCardProps) {
  if (!currentModule) {
    return (
      <Card className="border-border/80 bg-card hover:border-primary/40 transition-all duration-300 shadow-md flex flex-col justify-between">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2 text-primary font-semibold text-xs tracking-wider uppercase">
            <BookOpen className="h-4 w-4" />
            <span>Continue Learning</span>
          </div>
          <CardTitle className="text-lg font-bold mt-1 text-foreground">
            No Active Lesson
          </CardTitle>
          <CardDescription className="text-xs text-muted-foreground">
            Start your first learning module to begin building your mental math shortcuts.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-2">
          <Link href="/learn">
            <Button size="sm" className="w-full gap-2 font-semibold shadow-xs">
              <Sparkles className="h-3.5 w-3.5" />
              Explore Modules
            </Button>
          </Link>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-border/80 bg-gradient-to-br from-card via-card to-primary/5 hover:border-primary/40 transition-all duration-300 shadow-md">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-primary font-semibold text-xs tracking-wider uppercase">
            <BookOpen className="h-4 w-4" />
            <span>Continue Learning</span>
          </div>
          <Badge variant="outline" className="text-[11px]">
            {currentModule.difficulty}
          </Badge>
        </div>
        <CardTitle className="text-xl font-bold mt-1 text-foreground">
          {currentModule.title}
        </CardTitle>
        <CardDescription className="text-sm font-medium text-muted-foreground flex items-center gap-2">
          <span>{currentModule.currentLesson}</span>
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between text-xs font-semibold">
            <span className="text-muted-foreground">Module Mastery</span>
            <span className="text-primary">{currentModule.progress}%</span>
          </div>
          <Progress value={currentModule.progress} className="h-2" />
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-border/50">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Clock className="h-3.5 w-3.5" />
            <span>~{currentModule.estimatedMinutes} mins remaining</span>
          </div>

          <Link href={currentModule.lessonHref || "/learn"}>
            <Button size="sm" className="gap-2 font-semibold shadow-xs">
              <Play className="h-3.5 w-3.5 fill-current" />
              Resume Lesson
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
