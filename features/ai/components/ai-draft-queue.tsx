"use client";

import React, { useState, useEffect } from "react";
import { CheckCircle2, XCircle, AlertTriangle, Eye, Sparkles, Filter, CheckSquare, Square } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AIDraftItem, AIDraftReviewState } from "../types";
import { reviewDraftAction, bulkReviewDraftsAction, getDraftsAction } from "../actions/ai-actions";
import { FormattedMath } from "@/components/ui/formatted-math";

export function AIDraftQueue() {
  const [drafts, setDrafts] = useState<AIDraftItem[]>([]);
  const [filter, setFilter] = useState<AIDraftReviewState | "UNPUBLISHED" | "ALL">("UNPUBLISHED");
  const [previewDraft, setPreviewDraft] = useState<AIDraftItem | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isBulkLoading, setIsBulkLoading] = useState(false);

  const fetchDrafts = () => {
    getDraftsAction().then((data) => {
      setDrafts(data);
      // Clean up selected IDs that no longer exist
      setSelectedIds((prev) => prev.filter((id) => data.some((d) => d.id === id)));
    });
  };

  useEffect(() => {
    fetchDrafts();
  }, []);

  const handleReview = async (id: string, state: AIDraftReviewState) => {
    await reviewDraftAction(id, state);
    fetchDrafts();
    if (previewDraft?.id === id) setPreviewDraft(null);
  };

  const handleBulkReview = async (state: AIDraftReviewState) => {
    if (selectedIds.length === 0) return;
    setIsBulkLoading(true);
    try {
      await bulkReviewDraftsAction(selectedIds, state);
      setSelectedIds([]);
      fetchDrafts();
    } finally {
      setIsBulkLoading(false);
    }
  };

  // Filter out Published and Rejected items from default Active Queue view
  const filtered =
    filter === "UNPUBLISHED"
      ? drafts.filter((d) => d.reviewState !== "Published" && d.reviewState !== "Rejected")
      : filter === "ALL"
      ? drafts
      : drafts.filter((d) => d.reviewState === filter);

  const isAllSelected = filtered.length > 0 && filtered.every((d) => selectedIds.includes(d.id));

  const toggleSelectAll = () => {
    if (isAllSelected) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filtered.map((d) => d.id));
    }
  };

  const handleSelectionOption = (option: string) => {
    if (option === "NONE") {
      setSelectedIds([]);
    } else if (option === "ACTIVE") {
      setSelectedIds(drafts.filter((d) => d.reviewState !== "Published" && d.reviewState !== "Rejected").map((d) => d.id));
    } else if (option === "PENDING") {
      setSelectedIds(drafts.filter((d) => d.reviewState === "Pending").map((d) => d.id));
    } else if (option === "APPROVED") {
      setSelectedIds(drafts.filter((d) => d.reviewState === "Approved").map((d) => d.id));
    } else if (option === "REJECTED") {
      setSelectedIds(drafts.filter((d) => d.reviewState === "Rejected").map((d) => d.id));
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  return (
    <div className="space-y-6">
      <Card className="border-border/80 bg-card shadow-xs">
        <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3">
          <div>
            <CardTitle className="text-base font-bold">AI Draft Review Queue</CardTitle>
            <CardDescription className="text-xs">
              Review and bulk manage AI-generated content before publishing to production.
            </CardDescription>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2">
              <select
                onChange={(e) => {
                  handleSelectionOption(e.target.value);
                  e.target.value = "";
                }}
                defaultValue=""
                className="p-1.5 rounded-lg border border-primary/40 bg-primary/5 text-primary text-xs font-bold focus:outline-none"
              >
                <option value="" disabled>
                  Selection Mode...
                </option>
                <option value="ACTIVE">Select All Active (Non-Rejected)</option>
                <option value="PENDING">Select All Pending Only</option>
                <option value="APPROVED">Select All Approved Only</option>
                <option value="REJECTED">Select All Rejected</option>
                <option value="NONE">Deselect All</option>
              </select>

              {filtered.length > 0 && (
                <Button
                  type="button"
                  variant="outline"
                  size="xs"
                  onClick={toggleSelectAll}
                  className="gap-1.5 font-bold text-xs"
                >
                  {isAllSelected ? (
                    <CheckSquare className="h-4 w-4 text-primary" />
                  ) : (
                    <Square className="h-4 w-4 text-muted-foreground" />
                  )}
                  {isAllSelected ? "Deselect All" : `Select Visible (${filtered.length})`}
                </Button>
              )}
            </div>

            <div className="flex items-center gap-1.5">
              <Filter className="h-3.5 w-3.5 text-muted-foreground" />
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value as AIDraftReviewState | "UNPUBLISHED" | "ALL")}
                className="p-1.5 rounded-lg border border-border bg-background text-xs font-semibold"
              >
                <option value="UNPUBLISHED">Active Queue (Unpublished & Non-Rejected)</option>
                <option value="Pending">Pending Only</option>
                <option value="Approved">Approved Only</option>
                <option value="Published">Published History</option>
                <option value="Rejected">Rejected History</option>
                <option value="ALL">Show All States</option>
              </select>
            </div>
          </div>
        </CardHeader>

        {/* Bulk Action Toolbar */}
        {selectedIds.length > 0 && (
          <div className="mx-6 mb-3 p-3 rounded-xl border border-primary/40 bg-primary/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <div className="font-bold text-primary flex items-center gap-2">
              <CheckSquare className="h-4 w-4" />
              <span>{selectedIds.length} item(s) selected</span>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Button
                size="xs"
                variant="secondary"
                disabled={isBulkLoading}
                onClick={() => handleBulkReview("Approved")}
                className="gap-1 font-bold text-emerald-600"
              >
                <CheckCircle2 className="h-3.5 w-3.5" />
                Approve Selected ({selectedIds.length})
              </Button>

              <Button
                size="xs"
                disabled={isBulkLoading}
                onClick={() => handleBulkReview("Published")}
                className="gap-1 font-bold shadow-xs"
              >
                <Sparkles className="h-3.5 w-3.5" />
                Publish Selected to DB ({selectedIds.length})
              </Button>

              <Button
                size="xs"
                variant="ghost"
                disabled={isBulkLoading}
                onClick={() => handleBulkReview("Rejected")}
                className="gap-1 text-destructive font-semibold"
              >
                <XCircle className="h-3.5 w-3.5" />
                Reject Selected
              </Button>
            </div>
          </div>
        )}

        <CardContent className="space-y-3">
          {filtered.length === 0 ? (
            <div className="p-8 rounded-xl border border-dashed border-border/80 text-center space-y-2">
              <Sparkles className="h-8 w-8 text-muted-foreground/50 mx-auto" />
              <div className="text-xs font-bold text-foreground">No Active Drafts in Queue</div>
              <p className="text-[11px] text-muted-foreground max-w-xs mx-auto">
                {filter === "UNPUBLISHED"
                  ? "All drafts have been published, rejected, or reviewed! Run a new generation job to produce fresh content."
                  : "No content items matching the selected filter."}
              </p>
            </div>
          ) : (
            filtered.map((d) => {
              const isSelected = selectedIds.includes(d.id);
              const isPending = d.reviewState === "Pending";
              const isApproved = d.reviewState === "Approved";
              const isPublished = d.reviewState === "Published";
              const isRejected = d.reviewState === "Rejected";

              return (
                <div
                  key={d.id}
                  className={`p-4 rounded-xl border transition-all space-y-2 ${
                    isSelected
                      ? "border-primary/80 bg-primary/5 shadow-xs"
                      : "border-border/80 bg-muted/20 hover:border-border"
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <button
                        type="button"
                        onClick={() => toggleSelect(d.id)}
                        className="mt-0.5 shrink-0 text-muted-foreground hover:text-primary transition-colors"
                      >
                        {isSelected ? (
                          <CheckSquare className="h-4 w-4 text-primary" />
                        ) : (
                          <Square className="h-4 w-4" />
                        )}
                      </button>

                      <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-extrabold text-sm text-foreground">
                            &quot;<FormattedMath text={d.title} />&quot;
                          </span>
                          <Badge
                            variant={
                              isPublished
                                ? "accent"
                                : isApproved
                                ? "amber"
                                : isRejected
                                ? "destructive"
                                : "outline"
                            }
                            className="text-[10px]"
                          >
                            {d.reviewState.toUpperCase()}
                          </Badge>
                          {d.isPossibleDuplicate && (
                            <Badge variant="destructive" className="text-[10px] gap-1">
                              <AlertTriangle className="h-3 w-3" />
                              Possible Duplicate
                            </Badge>
                          )}
                        </div>

                        <div className="text-xs text-muted-foreground">
                          Type: <strong>{d.contentType}</strong> • Model: <strong>{d.model}</strong> • Tokens: <strong>{d.tokenCount}</strong>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0 pl-7 sm:pl-0">
                      <Button
                        size="xs"
                        variant="outline"
                        onClick={() => setPreviewDraft(d)}
                        className="gap-1 text-xs"
                      >
                        <Eye className="h-3.5 w-3.5" />
                        Preview
                      </Button>

                      {isPending && (
                        <>
                          <Button
                            size="xs"
                            variant="secondary"
                            onClick={() => handleReview(d.id, "Approved")}
                            className="gap-1 text-xs text-emerald-600 font-bold"
                          >
                            <CheckCircle2 className="h-3.5 w-3.5" />
                            Approve
                          </Button>
                          <Button
                            size="xs"
                            variant="ghost"
                            onClick={() => handleReview(d.id, "Rejected")}
                            className="gap-1 text-xs text-destructive"
                          >
                            <XCircle className="h-3.5 w-3.5" />
                            Reject
                          </Button>
                        </>
                      )}

                      {isApproved && (
                        <Button
                          size="xs"
                          onClick={() => handleReview(d.id, "Published")}
                          className="gap-1 text-xs font-bold shadow-xs"
                        >
                          <Sparkles className="h-3.5 w-3.5" />
                          Publish to Production
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </CardContent>
      </Card>

      {/* Preview Modal */}
      {previewDraft && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-xs p-4">
          <div className="max-w-xl w-full bg-card border border-border rounded-2xl shadow-2xl p-6 space-y-4">
            <div className="flex justify-between items-center border-b border-border pb-3">
              <h3 className="font-bold text-base">Draft Preview: {previewDraft.title}</h3>
              <Button size="xs" variant="ghost" onClick={() => setPreviewDraft(null)}>
                <XCircle className="h-4 w-4" />
              </Button>
            </div>

            <div className="p-4 rounded-xl border border-border/80 bg-muted/20 space-y-2 text-xs">
              <div className="font-bold text-foreground">Content Payload JSON:</div>
              <pre className="p-3 rounded-lg bg-background font-mono text-[11px] overflow-x-auto text-foreground">
                {JSON.stringify(previewDraft.contentData, null, 2)}
              </pre>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-border">
              <Button size="sm" variant="outline" onClick={() => setPreviewDraft(null)}>
                Close
              </Button>
              <Button
                size="sm"
                onClick={() => handleReview(previewDraft.id, "Published")}
                className="gap-1.5 font-bold shadow-md"
              >
                <Sparkles className="h-4 w-4" />
                Approve & Publish Now
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
