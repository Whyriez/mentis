"use client";

import React from "react";
import { History, RotateCcw, X, Clock, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { QuestionService } from "../services/question-service";

const service = new QuestionService();

export function VersionHistoryDialog({
  isOpen,
  onClose,
  questionId,
}: {
  isOpen: boolean;
  onClose: () => void;
  questionId: string;
}) {
  if (!isOpen) return null;

  const versions = service.getVersionHistory(questionId);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-xs p-4">
      <div className="max-w-xl w-full bg-card border border-border rounded-2xl shadow-2xl overflow-hidden space-y-4 p-6 relative">
        <div className="flex items-center justify-between border-b border-border pb-3">
          <div className="flex items-center gap-2">
            <History className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-bold">Question Version History</h3>
          </div>
          <Button size="xs" variant="ghost" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
          {versions.map((ver) => (
            <div key={ver.id} className="p-4 rounded-xl border border-border/80 bg-muted/20 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Badge variant="accent" className="font-bold">v{ver.version}</Badge>
                  <span className="font-semibold text-muted-foreground flex items-center gap-1">
                    <User className="h-3 w-3" />
                    {ver.editedBy}
                  </span>
                </div>
                <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {ver.createdAt}
                </span>
              </div>

              <div className="font-medium text-foreground">
                &quot;{ver.question}&quot;
              </div>

              <div className="text-[11px] text-muted-foreground">
                Answer: <span className="font-bold text-foreground">{ver.correctAnswer}</span>
              </div>

              <div className="pt-2 flex justify-end">
                <Button size="xs" variant="outline" className="gap-1 font-semibold text-xs">
                  <RotateCcw className="h-3 w-3" />
                  Restore Version
                </Button>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-end pt-2 border-t border-border">
          <Button variant="outline" size="sm" onClick={onClose} className="text-xs">
            Close
          </Button>
        </div>
      </div>
    </div>
  );
}
