"use client";

import React from "react";
import Link from "next/link";
import { RotateCcw, ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ReviewQueueItem } from "../types";

export function ReviewQueueWidget({ queue }: { queue: ReviewQueueItem[] }) {
  return (
    <Card className="border-border/80 bg-card shadow-sm">
      <CardHeader className="pb-2 flex flex-row items-center justify-between">
        <CardTitle className="text-base font-bold flex items-center gap-2">
          <RotateCcw className="h-4 w-4 text-amber-500" />
          Spaced Repetition Review Queue
        </CardTitle>
        <Badge variant="outline" className="text-[10px]">
          {queue.length} Pending
        </Badge>
      </CardHeader>

      <CardContent className="space-y-3">
        {queue.length === 0 ? (
          <div className="p-4 text-center border border-dashed border-border/60 rounded-lg space-y-1">
            <p className="text-xs font-semibold text-foreground">No Items Due For Review 🎉</p>
            <p className="text-[11px] text-muted-foreground">
              You are all caught up! Practice drills to populate your spaced repetition queue.
            </p>
          </div>
        ) : (
          queue.map((item) => (
            <div
              key={item.id}
              className="p-3 rounded-lg border border-border/60 bg-muted/20 flex items-center justify-between gap-3 text-xs"
            >
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="text-[10px]">
                    Due: {item.nextReviewAt}
                  </Badge>
                  <span className="font-bold text-foreground">{item.moduleTitle}</span>
                </div>
                <p className="text-muted-foreground line-clamp-1">{item.questionText}</p>
              </div>

              <Link href="/quiz">
                <Button size="xs" variant="outline" className="gap-1 font-semibold shrink-0">
                  Review
                  <ArrowRight className="h-3 w-3" />
                </Button>
              </Link>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
