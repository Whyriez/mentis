import React from "react";
import { Metadata } from "next";
import { LessonEditor } from "@/features/lessons/components/lesson-editor";

export const metadata: Metadata = {
  title: "Create Lesson | Mentis Admin",
  description: "Section-based structured lesson content builder.",
};

export default function CreateLessonPage() {
  return (
    <div className="space-y-6">
      <LessonEditor />
    </div>
  );
}
