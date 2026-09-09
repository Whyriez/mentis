"use client";

import React from "react";
import { BookOpen, Lightbulb, AlertTriangle, HelpCircle, CheckCircle2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LessonSection } from "../types";

export function LessonPreview({
  title,
  description,
  sections,
}: {
  title: string;
  description: string;
  sections: LessonSection[];
}) {
  return (
    <div className="space-y-6 max-w-3xl mx-auto p-6 rounded-2xl border border-border bg-card shadow-md">
      {/* Lesson Header */}
      <div className="space-y-2 pb-4 border-b border-border">
        <Badge variant="outline" className="text-xs gap-1 font-bold">
          <BookOpen className="h-3.5 w-3.5" />
          Learner View Live Preview
        </Badge>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
          {title || "Untitled Lesson"}
        </h1>
        <p className="text-sm text-muted-foreground leading-relaxed">
          {description || "No description provided."}
        </p>
      </div>

      {/* Rendered Sections */}
      <div className="space-y-4">
        {sections.map((sec) => {
          switch (sec.type) {
            case "heading":
              return (
                <h3 key={sec.id} className="text-xl font-bold tracking-tight text-foreground pt-2">
                  {sec.content || "Heading Title"}
                </h3>
              );

            case "paragraph":
              return (
                <p key={sec.id} className="text-sm text-muted-foreground leading-relaxed">
                  {sec.content || "Paragraph content..."}
                </p>
              );

            case "formula":
              return (
                <div key={sec.id} className="p-4 rounded-xl bg-primary/10 border border-primary/30 text-center font-mono font-bold text-base text-primary">
                  {sec.content || "FORMULA_EXPRESSION"}
                </div>
              );

            case "example":
              return (
                <Card key={sec.id} className="border-emerald-500/30 bg-emerald-500/5 shadow-2xs">
                  <CardHeader className="py-2.5 px-4 flex flex-row items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                    <CardTitle className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase">Worked Example</CardTitle>
                  </CardHeader>
                  <CardContent className="px-4 pb-3 text-xs text-foreground font-medium leading-relaxed">
                    {sec.content || "Example problem and solution steps..."}
                  </CardContent>
                </Card>
              );

            case "tip":
              return (
                <div key={sec.id} className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-2.5 text-xs text-amber-700 dark:text-amber-300">
                  <Lightbulb className="h-4 w-4 shrink-0 text-amber-500 mt-0.5" />
                  <div className="space-y-0.5">
                    <span className="font-bold block">Quick Mental Tip</span>
                    <p>{sec.content || "Shortcut tip..."}</p>
                  </div>
                </div>
              );

            case "warning":
              return (
                <div key={sec.id} className="p-3.5 rounded-xl bg-destructive/10 border border-destructive/30 flex items-start gap-2.5 text-xs text-destructive">
                  <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
                  <div className="space-y-0.5">
                    <span className="font-bold block">Common Mistake to Avoid</span>
                    <p>{sec.content || "Warning notice..."}</p>
                  </div>
                </div>
              );

            case "practice_box":
              return (
                <div key={sec.id} className="p-4 rounded-xl border border-primary/40 bg-card space-y-2 text-xs">
                  <span className="font-bold text-primary flex items-center gap-1.5">
                    <HelpCircle className="h-4 w-4" />
                    Practice Question Box
                  </span>
                  <p className="font-medium text-foreground">{sec.content || "Try solving this mentally..."}</p>
                </div>
              );

            default:
              return (
                <div key={sec.id} className="p-3 rounded-lg border border-border text-xs">
                  {sec.content}
                </div>
              );
          }
        })}
      </div>
    </div>
  );
}
