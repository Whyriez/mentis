"use client";

import React, { useState } from "react";
import {
  Plus,
  Trash2,
  Sparkles,
  Eye,
  CheckCircle2,
  AlertTriangle,
  FileText,
  History,
  Tag,
  Wand2,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { QuestionFormData, QuestionItem, QuestionDifficulty } from "../types";
import { saveQuestionAction, enhanceQuestionAction } from "../actions/question-actions";
import { QuestionPreview } from "./question-preview";
import { VersionHistoryDialog } from "./version-history-dialog";
import { QuestionValidator } from "../validators/question-validator";

const validator = new QuestionValidator();

export function QuestionEditor({
  initialData,
  existingQuestions = [],
}: {
  initialData?: QuestionItem;
  existingQuestions?: QuestionItem[];
}) {
  const [activeTab, setActiveTab] = useState<"editor" | "preview">("editor");
  const [questionText, setQuestionText] = useState(initialData?.question || "");
  const [options, setOptions] = useState<string[]>(
    initialData?.options || ["", "", "", ""]
  );
  const [correctAnswer, setCorrectAnswer] = useState(
    initialData?.correctAnswer || ""
  );
  const [explanation, setExplanation] = useState(initialData?.explanation || "");
  const [difficulty, setDifficulty] = useState<QuestionDifficulty>(
    initialData?.difficulty || "Medium"
  );
  const [difficultyScore, setDifficultyScore] = useState(
    initialData?.difficultyScore || 50
  );
  const [tagsText, setTagsText] = useState(
    initialData?.tags?.join(", ") || "Multiplication, Speed Drill"
  );

  const [validationIssues, setValidationIssues] = useState<string[]>([]);
  const [statusMsg, setStatusMsg] = useState<string | null>(null);
  const [isVersionOpen, setIsVersionOpen] = useState(false);
  const [isEnhancing, setIsEnhancing] = useState(false);

  // Duplicate Check
  const duplicateMatch = validator.detectDuplicates(questionText, existingQuestions);

  const handleAddOption = () => {
    setOptions((prev) => [...prev, ""]);
  };

  const handleRemoveOption = (index: number) => {
    setOptions((prev) => prev.filter((_, idx) => idx !== index));
  };

  const handleUpdateOption = (index: number, val: string) => {
    const updated = [...options];
    updated[index] = val;
    setOptions(updated);
    if (correctAnswer === options[index]) {
      setCorrectAnswer(val);
    }
  };

  const handleEnhanceWithAI = async () => {
    if (!questionText.trim()) {
      setValidationIssues(["Please enter a question prompt first before enhancing with AI."]);
      return;
    }

    setIsEnhancing(true);
    setValidationIssues([]);
    setStatusMsg(null);

    try {
      const res = await enhanceQuestionAction({
        question: questionText,
        options,
        correctAnswer,
        currentDifficulty: difficulty,
      });

      if (res.success) {
        if (res.explanation) setExplanation(res.explanation);
        if (res.suggestedDifficulty) setDifficulty(res.suggestedDifficulty);
        if (res.suggestedScore !== undefined) setDifficultyScore(res.suggestedScore);
        if (res.tags && res.tags.length > 0) setTagsText(res.tags.join(", "));
        setStatusMsg("Explanation, Difficulty & Tags enriched using Gemini 3.5 Flash!");
      } else if (res.error) {
        setValidationIssues([res.error]);
      }
    } finally {
      setIsEnhancing(false);
    }
  };

  const handleSave = async (status: "Draft" | "Published") => {
    setValidationIssues([]);
    setStatusMsg(null);

    const tags = tagsText.split(",").map((t) => t.trim()).filter((t) => t.length > 0);

    const payload: QuestionFormData = {
      moduleId: initialData?.moduleId || "a1b2c3d4-0000-0000-0000-000000000001",
      type: "multiple_choice",
      question: questionText,
      options,
      correctAnswer,
      explanation,
      difficulty,
      difficultyScore,
      estimatedSeconds: 30,
      tags,
      status,
    };

    const res = await saveQuestionAction(payload);
    if (!res.success && res.issues) {
      setValidationIssues(res.issues.map((i) => i.message));
    } else {
      setStatusMsg(`Question saved as ${status} successfully!`);
    }
  };

  return (
    <div className="space-y-6">
      {/* Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold tracking-tight">Question Builder</h2>
          <p className="text-xs text-muted-foreground">Author psychometric drill questions with live feedback.</p>
        </div>

        <div className="flex items-center gap-2">
          {initialData?.id && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsVersionOpen(true)}
              className="gap-1.5 font-bold text-xs"
            >
              <History className="h-3.5 w-3.5" />
              Version History (v{initialData.version})
            </Button>
          )}

          <Button
            type="button"
            variant={activeTab === "editor" ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveTab("editor")}
            className="gap-1.5 font-bold text-xs"
          >
            <FileText className="h-3.5 w-3.5" />
            Editor
          </Button>

          <Button
            type="button"
            variant={activeTab === "preview" ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveTab("preview")}
            className="gap-1.5 font-bold text-xs"
          >
            <Eye className="h-3.5 w-3.5" />
            Preview
          </Button>

          <Button
            type="button"
            onClick={() => handleSave("Published")}
            size="sm"
            className="gap-1.5 font-bold text-xs shadow-md"
          >
            <Sparkles className="h-3.5 w-3.5" />
            Publish Question
          </Button>
        </div>
      </div>

      {/* Duplicate Alert */}
      {duplicateMatch && (
        <div className="p-4 rounded-xl border border-amber-500/40 bg-amber-500/10 space-y-1 text-xs text-amber-700 dark:text-amber-300">
          <div className="font-bold flex items-center gap-1.5">
            <AlertTriangle className="h-4 w-4 text-amber-500" />
            Potential Duplicate Question Detected:
          </div>
          <p className="font-medium">
            A similar question already exists in database: <span className="font-bold">&quot;{duplicateMatch.question}&quot;</span> ({duplicateMatch.difficulty}).
          </p>
        </div>
      )}

      {/* Validation Feedback */}
      {validationIssues.length > 0 && (
        <div className="p-4 rounded-xl border border-destructive/40 bg-destructive/10 space-y-1 text-xs text-destructive">
          <div className="font-bold flex items-center gap-1.5">
            <AlertTriangle className="h-4 w-4" />
            Validation Prevented Publishing:
          </div>
          <ul className="list-disc list-inside space-y-0.5 font-medium">
            {validationIssues.map((msg, i) => (
              <li key={i}>{msg}</li>
            ))}
          </ul>
        </div>
      )}

      {statusMsg && (
        <div className="p-3 rounded-xl border border-emerald-500/40 bg-emerald-500/10 text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4" />
          <span>{statusMsg}</span>
        </div>
      )}

      {activeTab === "editor" ? (
        <div className="space-y-6">
          {/* Question Text */}
          <Card className="border-border/80 bg-card shadow-xs">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-bold">Question Statement</CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="space-y-1.5">
                <Label className="text-xs font-bold">Question Prompt</Label>
                <textarea
                  value={questionText}
                  onChange={(e) => setQuestionText(e.target.value)}
                  rows={3}
                  className="w-full p-3 rounded-lg border border-border bg-background text-sm font-semibold focus:outline-none focus:ring-1 focus:ring-primary"
                  placeholder="e.g. What is 43 × 11?"
                />
              </div>
            </CardContent>
          </Card>

          {/* Options & Correct Answer */}
          <Card className="border-border/80 bg-card shadow-xs">
            <CardHeader className="pb-3 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-base font-bold">Answer Choices ({options.length})</CardTitle>
                <CardDescription className="text-xs">Select the radio button next to the correct answer.</CardDescription>
              </div>

              <Button
                type="button"
                variant="outline"
                size="xs"
                onClick={handleAddOption}
                className="gap-1 font-semibold text-xs"
              >
                <Plus className="h-3 w-3" />
                Add Choice
              </Button>
            </CardHeader>

            <CardContent className="space-y-3">
              {options.map((opt, idx) => (
                <div key={idx} className="flex items-center gap-3 p-2.5 rounded-lg border border-border/70 bg-muted/20">
                  <input
                    type="radio"
                    name="correctAnswer"
                    checked={correctAnswer === opt && opt.trim().length > 0}
                    onChange={() => setCorrectAnswer(opt)}
                    className="h-4 w-4 text-primary focus:ring-primary"
                  />

                  <Input
                    value={opt}
                    onChange={(e) => handleUpdateOption(idx, e.target.value)}
                    placeholder={`Option ${String.fromCharCode(65 + idx)}`}
                    className="text-xs font-medium"
                  />

                  {options.length > 2 && (
                    <Button
                      type="button"
                      size="xs"
                      variant="ghost"
                      onClick={() => handleRemoveOption(idx)}
                      className="text-destructive hover:bg-destructive/10 shrink-0"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Solution & Metadata */}
          <Card className="border-border/80 bg-card shadow-xs">
            <CardHeader className="pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <CardTitle className="text-base font-bold">Explanation & Classification</CardTitle>
                <CardDescription className="text-xs">
                  Auto-enrich explanation steps, difficulty rating, and tags using Gemini AI.
                </CardDescription>
              </div>

              <Button
                type="button"
                variant="outline"
                size="xs"
                disabled={isEnhancing}
                onClick={handleEnhanceWithAI}
                className="gap-1.5 font-bold text-xs text-primary border-primary/40 hover:bg-primary/10 shadow-2xs shrink-0"
              >
                <Wand2 className={`h-3.5 w-3.5 ${isEnhancing ? "animate-spin text-primary" : ""}`} />
                {isEnhancing ? "Enriching with AI..." : "Enhance with AI"}
              </Button>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="space-y-1.5">
                <Label className="text-xs font-bold">Step-by-Step Explanation</Label>
                <textarea
                  value={explanation}
                  onChange={(e) => setExplanation(e.target.value)}
                  rows={3}
                  className="w-full p-3 rounded-lg border border-border bg-background text-xs font-medium focus:outline-none focus:ring-1 focus:ring-primary"
                  placeholder="Explain mental math steps clearly for the learner..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold">Difficulty Level</Label>
                  <select
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value as QuestionDifficulty)}
                    className="w-full p-2.5 rounded-lg border border-border bg-background text-xs font-semibold"
                  >
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-bold">Adaptive Score (0 - 100): {difficultyScore}</Label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={difficultyScore}
                    onChange={(e) => setDifficultyScore(parseInt(e.target.value) || 50)}
                    className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer"
                  />
                </div>

                <div className="md:col-span-2 space-y-1.5">
                  <Label className="text-xs font-bold flex items-center gap-1">
                    <Tag className="h-3.5 w-3.5" />
                    Tags (Comma Separated)
                  </Label>
                  <Input
                    value={tagsText}
                    onChange={(e) => setTagsText(e.target.value)}
                    placeholder="Multiplication, Speed Drill, Carry Over"
                    className="text-xs font-medium"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      ) : (
        /* Preview Tab */
        <QuestionPreview
          question={questionText}
          options={options}
          correctAnswer={correctAnswer}
          explanation={explanation}
          difficulty={difficulty}
        />
      )}

      {/* Version History Dialog */}
      {initialData?.id && (
        <VersionHistoryDialog
          isOpen={isVersionOpen}
          onClose={() => setIsVersionOpen(false)}
          questionId={initialData.id}
        />
      )}
    </div>
  );
}
