"use client";

import React, { useState } from "react";
import { Upload, FileText, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { QuestionImportReport } from "../types";
import { importQuestionsAction } from "../actions/question-actions";

export function BulkImportModal({
  isOpen,
  onClose,
  onImportSuccess,
}: {
  isOpen: boolean;
  onClose: () => void;
  onImportSuccess?: () => void;
}) {
  const [format, setFormat] = useState<"csv" | "json">("json");
  const [importText, setImportText] = useState("");
  const [report, setReport] = useState<QuestionImportReport | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleRunImport = async () => {
    setIsLoading(true);
    setReport(null);

    try {
      const res = await importQuestionsAction(importText, format);
      setReport(res);
      if (res.successCount > 0 && onImportSuccess) {
        onImportSuccess();
      }
    } finally {
      setIsLoading(false);
    }
  };

  const sampleJSON = `[
  {
    "question": "What is 43 × 11?",
    "options": ["473", "453", "483", "430"],
    "correctAnswer": "473",
    "explanation": "Sandwich 4+3=7 between 4 and 3.",
    "difficulty": "Easy"
  }
]`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-xs p-4">
      <div className="max-w-2xl w-full bg-card border border-border rounded-2xl shadow-2xl overflow-hidden space-y-4 p-6 relative">
        <div className="flex items-center justify-between border-b border-border pb-3">
          <div className="flex items-center gap-2">
            <Upload className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-bold">Bulk Question Import</h3>
          </div>
          <Button size="xs" variant="ghost" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Format Selector */}
        <div className="flex items-center gap-3">
          <span className="text-xs font-bold text-muted-foreground">Select Import Format:</span>
          <Button
            type="button"
            size="xs"
            variant={format === "json" ? "default" : "outline"}
            onClick={() => {
              setFormat("json");
              setImportText(sampleJSON);
            }}
            className="font-bold text-xs"
          >
            JSON Format
          </Button>
          <Button
            type="button"
            size="xs"
            variant={format === "csv" ? "default" : "outline"}
            onClick={() => {
              setFormat("csv");
              setImportText('Question,Option A,Option B,Option C,Option D,Correct Answer,Explanation\n"What is 43 × 11?","473","453","483","430","473","11-Sandwich method."');
            }}
            className="font-bold text-xs"
          >
            CSV Format
          </Button>
        </div>

        {/* Textarea Input */}
        <div className="space-y-1.5">
          <textarea
            value={importText}
            onChange={(e) => setImportText(e.target.value)}
            rows={8}
            className="w-full p-3 rounded-lg border border-border bg-background text-xs font-mono focus:outline-none focus:ring-1 focus:ring-primary"
            placeholder="Paste CSV or JSON payload string here..."
          />
        </div>

        {/* Report Output */}
        {report && (
          <Card className="border-border bg-muted/20 text-xs p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-foreground">Import Processing Summary:</span>
              <div className="flex gap-2">
                <Badge variant="accent">{report.successCount} Valid Rows</Badge>
                {report.failedCount > 0 && <Badge variant="destructive">{report.failedCount} Failed</Badge>}
              </div>
            </div>

            {report.errors.length > 0 && (
              <ul className="space-y-1 text-destructive list-disc list-inside">
                {report.errors.map((err, i) => (
                  <li key={i}>Row #{err.row}: {err.message}</li>
                ))}
              </ul>
            )}
          </Card>
        )}

        <div className="flex justify-end gap-2 pt-2 border-t border-border">
          <Button variant="outline" size="sm" onClick={onClose} className="text-xs">
            Close
          </Button>
          <Button
            onClick={handleRunImport}
            disabled={isLoading || importText.trim().length === 0}
            size="sm"
            className="gap-2 font-bold shadow-md"
          >
            <FileText className="h-3.5 w-3.5" />
            {isLoading ? "Validating & Importing..." : "Execute Bulk Import"}
          </Button>
        </div>
      </div>
    </div>
  );
}
