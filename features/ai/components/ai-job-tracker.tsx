"use client";

import React, { useState, useEffect } from "react";
import { Cpu, RefreshCw, Inbox } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AIGenerationJob } from "../types";
import { getJobsAction } from "../actions/ai-actions";

export function AIJobTracker() {
  const [jobs, setJobs] = useState<AIGenerationJob[]>([]);

  const fetchJobs = () => {
    getJobsAction().then((data) => setJobs([...data]));
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  return (
    <Card className="border-border/80 bg-card shadow-xs">
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <div>
          <CardTitle className="text-base font-bold flex items-center gap-2">
            <Cpu className="h-4 w-4 text-primary" />
            Background Generation Job Queue
          </CardTitle>
          <CardDescription className="text-xs">Monitor running and completed Gemini generation jobs.</CardDescription>
        </div>

        <Button variant="outline" size="xs" onClick={fetchJobs} className="gap-1 font-semibold text-xs">
          <RefreshCw className="h-3 w-3" />
          Refresh Status
        </Button>
      </CardHeader>

      <CardContent className="space-y-3">
        {jobs.length === 0 ? (
          <div className="p-8 rounded-xl border border-dashed border-border/80 text-center space-y-2">
            <Inbox className="h-8 w-8 text-muted-foreground/50 mx-auto" />
            <div className="text-xs font-bold text-foreground">No Generation Jobs Recorded</div>
            <p className="text-[11px] text-muted-foreground max-w-xs mx-auto">
              Submit a batch generation request using the studio form to trigger real-time Gemini generation.
            </p>
          </div>
        ) : (
          jobs.map((job) => {
            const isDone = job.status === "Completed";
            const isRunning = job.status === "Running";

            return (
              <div key={job.id} className="p-4 rounded-xl border border-border/80 bg-muted/20 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-sm text-foreground">{job.contentType} Generation Job</span>
                    <Badge variant={isDone ? "accent" : isRunning ? "amber" : "outline"} className="text-[10px]">
                      {job.status.toUpperCase()}
                    </Badge>
                    <Badge variant="outline" className="text-[10px]">
                      {job.model}
                    </Badge>
                  </div>
                  <span className="text-[11px] text-muted-foreground">{job.createdAt}</span>
                </div>

                {/* Progress Bar */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[11px] font-semibold text-muted-foreground">
                    <span>Progress: {job.completedCount} / {job.amount} Items</span>
                    <span>{job.amount > 0 ? Math.round((job.completedCount / job.amount) * 100) : 0}%</span>
                  </div>

                  <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all ${isDone ? "bg-emerald-500" : "bg-primary animate-pulse"}`}
                      style={{ width: `${job.amount > 0 ? (job.completedCount / job.amount) * 100 : 0}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })
        )}
      </CardContent>
    </Card>
  );
}
