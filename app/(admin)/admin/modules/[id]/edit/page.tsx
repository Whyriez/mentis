"use client";

import React, { useState } from "react";
import { ArrowLeft, Save } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updateModuleAction } from "@/features/modules/actions/module-actions";
import { ModuleDifficulty } from "@/features/modules/types";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function EditModulePage() {
  const router = useRouter();
  const [title, setTitle] = useState("Mental Multiplication & Speed Drills");
  const [slug, setSlug] = useState("multiplication");
  const [description, setDescription] = useState("Master rapid double-digit and triple-digit multiplication using mental shortcuts.");
  const [difficulty, setDifficulty] = useState<ModuleDifficulty>("Intermediate");
  const [estimatedMinutes, setEstimatedMinutes] = useState(45);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await updateModuleAction("mod-multiplication", {
        title,
        slug,
        description,
        difficulty,
        estimatedMinutes,
      });

      if (res.success) {
        router.push("/admin/modules");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div className="flex items-center gap-3">
        <Link href="/admin/modules">
          <Button variant="ghost" size="xs">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight">Edit Module</h1>
          <p className="text-xs text-muted-foreground">Update learning module parameters.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <Card className="border-border/80 bg-card shadow-md">
          <CardHeader>
            <CardTitle className="text-base font-bold">Module Settings</CardTitle>
            <CardDescription className="text-xs">Update title, difficulty tier, and duration.</CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="space-y-1.5">
              <Label className="text-xs font-bold">Module Title</Label>
              <Input
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="text-sm font-semibold"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-bold">URL Slug</Label>
              <Input
                required
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                className="text-sm font-mono"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-bold">Description</Label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="w-full p-2.5 rounded-lg border border-border bg-background text-xs font-medium focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs font-bold">Difficulty Tier</Label>
                <select
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value as ModuleDifficulty)}
                  className="w-full p-2.5 rounded-lg border border-border bg-background text-xs font-semibold"
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-bold">Estimated Study Minutes</Label>
                <Input
                  type="number"
                  value={estimatedMinutes}
                  onChange={(e) => setEstimatedMinutes(parseInt(e.target.value) || 30)}
                  className="text-xs font-semibold"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-border flex justify-end gap-2">
              <Link href="/admin/modules">
                <Button type="button" variant="outline" size="sm" className="font-semibold text-xs">
                  Cancel
                </Button>
              </Link>

              <Button type="submit" disabled={isLoading} size="sm" className="gap-2 font-bold shadow-md">
                <Save className="h-3.5 w-3.5" />
                {isLoading ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
