"use client";

import React, { useState, useEffect } from "react";
import { QuestionEditor } from "@/features/questions/components/question-editor";
import { QuestionService } from "@/features/questions/services/question-service";
import { QuestionItem } from "@/features/questions/types";

const questionService = new QuestionService();

export default function CreateQuestionPage() {
  const [existingQuestions, setExistingQuestions] = useState<QuestionItem[]>([]);

  useEffect(() => {
    questionService.getQuestions().then(setExistingQuestions);
  }, []);

  return (
    <div className="space-y-6">
      <QuestionEditor existingQuestions={existingQuestions} />
    </div>
  );
}
