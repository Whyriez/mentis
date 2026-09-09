"use client";

import React, { useState } from "react";
import Link from "next/link";
import { BookOpen, Play, ArrowRight, CheckCircle2, Sparkles, Filter, Clock, Award } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ModuleData } from "../types";

export function ModuleCatalogView({
  modules,
  initialActiveSlug = "multiplication",
}: {
  modules: ModuleData[];
  initialActiveSlug?: string;
}) {
  const [activeSlug, setActiveSlug] = useState(initialActiveSlug);
  const [difficultyFilter, setDifficultyFilter] = useState<string>("ALL");

  const activeModule = modules.find((m) => m.slug === activeSlug) || modules[0];

  const filteredModules = modules.filter((m) => {
    if (difficultyFilter === "ALL") return true;
    return m.difficulty.toUpperCase() === difficultyFilter.toUpperCase();
  });

  return (
    <div className="space-y-8 pb-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-primary">
            <BookOpen className="h-4 w-4" />
            <span>Curriculum Library ({modules.length} Modules Available)</span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight">Learning Modules</h1>
          <p className="text-muted-foreground text-sm max-w-2xl">
            Select and switch modules freely. Master mental shortcuts, speed division, fractions, and spatial logic.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <select
            value={difficultyFilter}
            onChange={(e) => setDifficultyFilter(e.target.value)}
            className="p-2 rounded-xl border border-border bg-background text-xs font-bold focus:outline-none focus:ring-1 focus:ring-primary"
          >
            <option value="ALL">All Difficulties</option>
            <option value="BEGINNER">Beginner</option>
            <option value="INTERMEDIATE">Intermediate</option>
            <option value="ADVANCED">Advanced</option>
          </select>
        </div>
      </div>

      {/* Featured Active Focus Module Banner */}
      {activeModule && (
        <Card className="border-primary/50 bg-gradient-to-br from-card via-card to-primary/5 shadow-md overflow-hidden relative">
          <div className="absolute top-0 right-0 p-6 opacity-10 pointer-events-none">
            <Sparkles className="h-32 w-32 text-primary" />
          </div>

          <CardHeader className="space-y-3">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <Badge variant="accent" className="gap-1 font-bold text-xs">
                <Sparkles className="h-3 w-3" />
                Active Selected Focus
              </Badge>
              <Badge variant="outline" className="font-bold">{activeModule.difficulty}</Badge>
            </div>

            <CardTitle className="text-2xl sm:text-3xl font-extrabold text-foreground">
              {activeModule.title}
            </CardTitle>
            <CardDescription className="text-sm leading-relaxed max-w-3xl">
              {activeModule.description}
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-muted-foreground flex items-center gap-1">
                  <Award className="h-3.5 w-3.5 text-primary" />
                  Module Completion Progress
                </span>
                <span className="text-primary">Ready to Learn</span>
              </div>
              <Progress value={25} className="h-2.5" />
            </div>

            {/* Lessons List in Active Module */}
            <div className="space-y-3 pt-2 border-t border-border/60">
              <h4 className="text-xs font-extrabold uppercase text-muted-foreground tracking-wider">
                Lessons in &quot;{activeModule.title}&quot; ({activeModule.lessons.length} Lessons)
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {activeModule.lessons.map((lesson) => (
                  <Link
                    key={lesson.id}
                    href={`/learn/${activeModule.slug}/${lesson.id}`}
                    className="p-4 rounded-xl border border-border/80 bg-card hover:border-primary hover:shadow-xs transition-all flex flex-col justify-between group"
                  >
                    <div className="space-y-1.5">
                      <div className="flex justify-between items-center text-[10px] text-muted-foreground font-bold">
                        <span>Lesson #{lesson.orderIndex}</span>
                        <span className="flex items-center gap-0.5">
                          <Clock className="h-3 w-3" />
                          {lesson.estimatedMinutes}m
                        </span>
                      </div>
                      <h5 className="text-xs font-extrabold group-hover:text-primary transition-colors line-clamp-2">
                        {lesson.title}
                      </h5>
                    </div>

                    <div className="mt-4 flex items-center justify-between text-[11px] font-bold text-primary border-t border-border/40 pt-2">
                      <span>Study Shortcut</span>
                      <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {activeModule.lessons.length > 0 && (
              <div className="pt-2 flex justify-end gap-3">
                <Link href={`/quiz?module=${activeModule.slug}`}>
                  <Button variant="outline" size="sm" className="gap-1.5 font-bold text-xs">
                    Start Speed Quiz
                  </Button>
                </Link>

                <Link href={`/learn/${activeModule.slug}/${activeModule.lessons[0].id}`}>
                  <Button size="sm" className="gap-2 font-bold shadow-md">
                    <Play className="h-4 w-4 fill-current" />
                    Start Lesson 1
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Module Grid Catalog */}
      <div className="space-y-4">
        <h3 className="text-xl font-extrabold tracking-tight">All Learning Modules</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredModules.map((mod) => {
            const isSelected = mod.slug === activeSlug;

            return (
              <Card
                key={mod.id}
                className={`transition-all border ${
                  isSelected
                    ? "border-primary bg-primary/5 shadow-sm ring-1 ring-primary"
                    : "border-border/80 bg-card hover:border-border hover:shadow-2xs"
                }`}
              >
                <CardHeader className="p-5 pb-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <Badge variant={isSelected ? "default" : "outline"} className="text-[10px] font-bold">
                      {mod.difficulty}
                    </Badge>
                    <span className="text-xs font-bold text-muted-foreground">
                      {mod.lessons.length} Lesson(s)
                    </span>
                  </div>

                  <CardTitle className="text-base font-extrabold text-foreground leading-snug">
                    {mod.title}
                  </CardTitle>

                  <CardDescription className="text-xs line-clamp-2 leading-relaxed">
                    {mod.description}
                  </CardDescription>
                </CardHeader>

                <CardContent className="p-5 pt-0 space-y-4">
                  <div className="pt-3 border-t border-border/40 flex items-center justify-between gap-2">
                    <Button
                      type="button"
                      variant={isSelected ? "default" : "secondary"}
                      size="xs"
                      onClick={() => setActiveSlug(mod.slug)}
                      className="gap-1.5 font-bold text-xs w-full"
                    >
                      {isSelected ? (
                        <>
                          <CheckCircle2 className="h-3.5 w-3.5 text-primary-foreground" />
                          Selected Focus
                        </>
                      ) : (
                        "Switch to Module"
                      )}
                    </Button>

                    <Link href={`/learn/${mod.slug}/${mod.lessons[0]?.id || "lesson-1"}`}>
                      <Button size="xs" variant="outline" className="gap-1 font-bold text-xs shrink-0">
                        Open <ArrowRight className="h-3 w-3" />
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
