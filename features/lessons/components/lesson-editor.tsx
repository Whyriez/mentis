"use client";

import React, { useState } from "react";
import {
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  Sparkles,
  Eye,
  CheckCircle2,
  AlertTriangle,
  FileText,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { LessonSection, SectionType, LessonFormData } from "../types";
import { publishLessonAction } from "../actions/lesson-actions";
import { LessonPreview } from "./lesson-preview";

export function LessonEditor({
  initialData,
  moduleId,
}: {
  initialData?: Partial<LessonFormData>;
  moduleId?: string;
}) {
  const [activeTab, setActiveTab] = useState<"editor" | "preview">("editor");
  const [title, setTitle] = useState(initialData?.title || "");
  const [slug, setSlug] = useState(initialData?.slug || "");
  const [description, setDescription] = useState(initialData?.description || "");
  const [sections, setSections] = useState<LessonSection[]>(
    initialData?.sections?.map((s, idx) => ({ ...s, id: `sec-${idx}` })) || [
      { id: "sec-1", type: "heading", content: "Introduction", orderIndex: 1 },
      { id: "sec-2", type: "paragraph", content: "Enter explanation text here.", orderIndex: 2 },
    ]
  );
  const [validationIssues, setValidationIssues] = useState<string[]>([]);
  const [statusMsg, setStatusMsg] = useState<string | null>(null);

  const addSection = (type: SectionType) => {
    setSections((prev) => [
      ...prev,
      {
        id: `sec-block-${prev.length + 1}`,
        type,
        content: "",
        orderIndex: prev.length + 1,
      },
    ]);
  };

  const updateSectionContent = (id: string, content: string) => {
    setSections((prev) =>
      prev.map((s) => (s.id === id ? { ...s, content } : s))
    );
  };

  const deleteSection = (id: string) => {
    setSections((prev) => prev.filter((s) => s.id !== id));
  };

  const moveSection = (index: number, direction: "up" | "down") => {
    const targetIdx = direction === "up" ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= sections.length) return;

    const newSections = [...sections];
    const temp = newSections[index];
    newSections[index] = newSections[targetIdx];
    newSections[targetIdx] = temp;
    setSections(newSections);
  };

  const handleValidateAndPublish = async () => {
    setValidationIssues([]);
    setStatusMsg(null);

    const payload = {
      moduleId: moduleId || "mod-multiplication",
      title,
      slug,
      description,
      estimatedMinutes: 10,
      orderIndex: 1,
      status: "Published" as const,
      sections,
    };

    const res = await publishLessonAction(payload);
    if (!res.success && res.issues) {
      setValidationIssues(res.issues.map((i) => i.message));
    } else {
      setStatusMsg("Lesson published successfully!");
    }
  };

  return (
    <div className="space-y-6">
      {/* Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold tracking-tight">Lesson Content Editor</h2>
          <p className="text-xs text-muted-foreground">Structured block-based lesson builder.</p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant={activeTab === "editor" ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveTab("editor")}
            className="gap-1.5 font-bold text-xs"
          >
            <FileText className="h-3.5 w-3.5" />
            Editor Mode
          </Button>

          <Button
            type="button"
            variant={activeTab === "preview" ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveTab("preview")}
            className="gap-1.5 font-bold text-xs"
          >
            <Eye className="h-3.5 w-3.5" />
            Learner Preview
          </Button>

          <Button
            type="button"
            onClick={handleValidateAndPublish}
            size="sm"
            className="gap-1.5 font-bold text-xs shadow-md"
          >
            <Sparkles className="h-3.5 w-3.5" />
            Publish Lesson
          </Button>
        </div>
      </div>

      {/* Validation Feedback */}
      {validationIssues.length > 0 && (
        <div className="p-4 rounded-xl border border-destructive/40 bg-destructive/10 space-y-1 text-xs text-destructive">
          <div className="font-bold flex items-center gap-1.5">
            <AlertTriangle className="h-4 w-4" />
            Validation Issues Prevented Publishing:
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
          {/* Metadata Card */}
          <Card className="border-border/80 bg-card shadow-xs">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-bold">Lesson Metadata</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs font-bold">Lesson Title</Label>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. The 11-Sandwich Multiplication Shortcut"
                  className="text-sm font-semibold"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-bold">URL Slug</Label>
                <Input
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="e.g. 11-sandwich-shortcut"
                  className="text-sm font-mono"
                />
              </div>

              <div className="md:col-span-2 space-y-1.5">
                <Label className="text-xs font-bold">Short Summary / Description</Label>
                <Input
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Brief overview for lesson card preview."
                  className="text-sm font-medium"
                />
              </div>
            </CardContent>
          </Card>

          {/* Section Blocks Editor */}
          <Card className="border-border/80 bg-card shadow-xs">
            <CardHeader className="pb-3 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-base font-bold">Content Blocks ({sections.length})</CardTitle>
                <CardDescription className="text-xs">Add structured sections for formula, tips, and examples.</CardDescription>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              {sections.map((sec, idx) => (
                <div
                  key={sec.id}
                  className="p-4 rounded-xl border border-border/80 bg-muted/20 space-y-3 relative group"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-[10px] font-bold uppercase">
                        #{idx + 1} {sec.type.replace("_", " ")}
                      </Badge>
                    </div>

                    <div className="flex items-center gap-1">
                      <Button
                        type="button"
                        size="xs"
                        variant="ghost"
                        onClick={() => moveSection(idx, "up")}
                        disabled={idx === 0}
                      >
                        <ArrowUp className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        type="button"
                        size="xs"
                        variant="ghost"
                        onClick={() => moveSection(idx, "down")}
                        disabled={idx === sections.length - 1}
                      >
                        <ArrowDown className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        type="button"
                        size="xs"
                        variant="ghost"
                        onClick={() => deleteSection(sec.id)}
                        className="text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>

                  {/* Input depending on section type */}
                  {sec.type === "paragraph" || sec.type === "example" || sec.type === "tip" || sec.type === "warning" ? (
                    <textarea
                      value={sec.content}
                      onChange={(e) => updateSectionContent(sec.id, e.target.value)}
                      rows={3}
                      className="w-full p-2.5 rounded-lg border border-border bg-background text-xs font-medium focus:outline-none focus:ring-1 focus:ring-primary"
                      placeholder={`Enter ${sec.type} text content...`}
                    />
                  ) : (
                    <Input
                      value={sec.content}
                      onChange={(e) => updateSectionContent(sec.id, e.target.value)}
                      className="text-xs font-medium"
                      placeholder={`Enter ${sec.type} text...`}
                    />
                  )}
                </div>
              ))}

              {/* Add Section Controls */}
              <div className="pt-2 border-t border-border/40">
                <Label className="text-xs font-bold text-muted-foreground block mb-2">Add Content Section Block:</Label>
                <div className="flex flex-wrap gap-2">
                  {(["heading", "paragraph", "formula", "example", "tip", "warning", "callout", "practice_box"] as const).map((st) => (
                    <Button
                      key={st}
                      type="button"
                      variant="outline"
                      size="xs"
                      onClick={() => addSection(st)}
                      className="gap-1 font-semibold text-xs capitalize"
                    >
                      <Plus className="h-3 w-3" />
                      {st.replace("_", " ")}
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      ) : (
        /* Preview Mode */
        <LessonPreview title={title} description={description} sections={sections} />
      )}
    </div>
  );
}
