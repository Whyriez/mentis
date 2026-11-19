"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Plus, Search, Filter, HelpCircle, Edit, Upload, Download, Inbox } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { QuestionService } from "@/features/questions/services/question-service";
import { QuestionItem } from "@/features/questions/types";
import { BulkImportModal } from "@/features/questions/components/bulk-import-modal";
import { getQuestionsAction } from "@/features/questions/actions/question-actions";
import Link from "next/link";

const questionService = new QuestionService();

export default function AdminQuestionsPage() {
  const [questions, setQuestions] = useState<QuestionItem[]>([]);
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchQuestions = useCallback(() => {
    getQuestionsAction()
      .then(setQuestions)
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetchQuestions();
  }, [fetchQuestions]);

  const handleExportCSV = () => {
    const csvContent = questionService.exportToCSV(questions);
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `mentis-questions-export-${Date.now()}.csv`;
    a.click();
  };

  const filteredQuestions = questions.filter(
    (q) =>
      q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary">
            <HelpCircle className="h-4 w-4" />
            <span>Psychometric Assessment Engine</span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight">Question Bank</h1>
          <p className="text-muted-foreground text-sm">
            Centralized drill bank for quizzes, AI generator, and adaptive exams. Total: {questions.length} Question(s).
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsImportOpen(true)}
            className="gap-1.5 font-semibold text-xs"
          >
            <Upload className="h-3.5 w-3.5" />
            Bulk Import
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={handleExportCSV}
            className="gap-1.5 font-semibold text-xs"
          >
            <Download className="h-3.5 w-3.5" />
            Export CSV
          </Button>

          <Link href="/admin/questions/new">
            <Button size="sm" className="gap-2 font-bold shadow-md">
              <Plus className="h-4 w-4" />
              Create Question
            </Button>
          </Link>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <Card className="border-border/80 bg-card shadow-xs">
        <CardContent className="p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-80">
            <Search className="h-4 w-4 absolute left-3 top-3 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search question text or tags..."
              className="pl-9 text-xs font-medium"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Badge variant="outline" className="text-xs gap-1 py-1.5 px-3">
              <Filter className="h-3 w-3" />
              All Difficulties ({questions.length})
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Question Table / List */}
      <div className="space-y-4">
        {loading ? (
          <div className="p-8 rounded-xl border border-dashed border-border/80 text-center text-xs font-bold text-muted-foreground animate-pulse">
            Loading live question bank from Supabase...
          </div>
        ) : filteredQuestions.length === 0 ? (
          <div className="p-12 rounded-2xl border border-dashed border-border/80 text-center space-y-3">
            <Inbox className="h-10 w-10 text-muted-foreground/50 mx-auto" />
            <div className="text-sm font-bold text-foreground">No Questions Found</div>
            <p className="text-xs text-muted-foreground max-w-sm mx-auto">
              No questions match your current search criteria. Generate questions using AI Studio or create a new question manually.
            </p>
          </div>
        ) : (
          filteredQuestions.map((q) => (
            <Card key={q.id} className="border-border/80 bg-card shadow-xs hover:border-primary/40 transition-all">
              <CardContent className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-extrabold text-base text-foreground">&quot;{q.question}&quot;</span>
                    <Badge
                      variant={
                        q.difficulty === "Easy"
                          ? "accent"
                          : q.difficulty === "Medium"
                          ? "amber"
                          : "destructive"
                      }
                      className="text-[10px]"
                    >
                      {q.difficulty.toUpperCase()}
                    </Badge>
                    <Badge variant="outline" className="text-[10px]">
                      v{q.version}
                    </Badge>
                  </div>

                  <div className="text-xs text-muted-foreground space-x-2">
                    <span>Answer: <strong className="text-foreground font-bold">{q.correctAnswer}</strong></span>
                    <span>•</span>
                    <span>Source: <strong className="text-foreground">{q.source}</strong></span>
                    <span>•</span>
                    <span>Created: <strong>{q.updatedAt}</strong></span>
                  </div>

                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {q.tags.map((t, idx) => (
                      <Badge key={idx} variant="secondary" className="text-[9px] px-2 py-0">
                        #{t}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <Link href={`/admin/questions/${q.id}/edit`}>
                    <Button size="xs" variant="outline" className="gap-1 font-semibold text-xs">
                      <Edit className="h-3.5 w-3.5" />
                      Edit Question
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Bulk Import Dialog */}
      <BulkImportModal
        isOpen={isImportOpen}
        onClose={() => setIsImportOpen(false)}
        onImportSuccess={fetchQuestions}
      />
    </div>
  );
}
