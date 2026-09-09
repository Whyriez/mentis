import React from "react";
import { Metadata } from "next";
import { QuestionEditor } from "@/features/questions/components/question-editor";
import { QuestionService } from "@/features/questions/services/question-service";

export const metadata: Metadata = {
  title: "Edit Question | Mentis Admin",
  description: "Edit question prompt, choices, and solution explanation.",
};

const questionService = new QuestionService();

export default async function EditQuestionPage() {
  const fallback = questionService.getFallbackQuestions()[0];
  const allQuestions = questionService.getFallbackQuestions();

  return (
    <div className="space-y-6">
      <QuestionEditor initialData={fallback} existingQuestions={allQuestions} />
    </div>
  );
}
