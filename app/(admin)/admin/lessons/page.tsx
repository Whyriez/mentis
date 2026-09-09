import React from "react";
import { Metadata } from "next";
import { Plus, BookOpen, Edit } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LessonService } from "@/features/lessons/services/lesson-service";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Lesson Management | Mentis Admin",
  description: "Create, edit, validate, and publish lesson content.",
};

const lessonService = new LessonService();

export default async function AdminLessonsPage() {
  const lessons = await lessonService.getLessons();

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary">
            <BookOpen className="h-4 w-4" />
            <span>Content CMS</span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight">Lesson Management</h1>
          <p className="text-muted-foreground text-sm">Create and organize structured section-based lessons.</p>
        </div>

        <Link href="/admin/lessons/new">
          <Button className="gap-2 font-bold shadow-md">
            <Plus className="h-4 w-4" />
            Create New Lesson
          </Button>
        </Link>
      </div>

      {/* Lesson List */}
      <div className="space-y-4">
        {lessons.map((les) => (
          <Card key={les.id} className="border-border/80 bg-card shadow-xs">
            <CardContent className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-base text-foreground">{les.title}</span>
                  <Badge variant={les.status === "Published" ? "accent" : "amber"} className="text-[10px]">
                    {les.status.toUpperCase()}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground max-w-xl leading-relaxed">{les.description}</p>
                <div className="flex items-center gap-4 text-xs text-muted-foreground pt-1">
                  <span>{les.sections.length} Section Blocks</span>
                  <span>•</span>
                  <span>{les.estimatedMinutes} Mins</span>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <Link href={`/admin/lessons/${les.id}/edit`}>
                  <Button size="xs" variant="outline" className="gap-1 font-semibold text-xs">
                    <Edit className="h-3.5 w-3.5" />
                    Open Section Editor
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
