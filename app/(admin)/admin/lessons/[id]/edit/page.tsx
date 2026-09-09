import React from "react";
import { Metadata } from "next";
import { LessonEditor } from "@/features/lessons/components/lesson-editor";
import { LessonService } from "@/features/lessons/services/lesson-service";

export const metadata: Metadata = {
  title: "Edit Lesson | Mentis Admin",
  description: "Edit structured section blocks for lesson.",
};

const lessonService = new LessonService();

export default async function EditLessonPage() {
  const fallback = lessonService.getFallbackLessons()[0];

  return (
    <div className="space-y-6">
      <LessonEditor initialData={fallback} />
    </div>
  );
}
