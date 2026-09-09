import React from "react";
import { Metadata } from "next";
import { Plus, Search, Filter, FolderTree, Edit } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ModuleService } from "@/features/modules/services/module-service";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Module Management | Mentis Admin",
  description: "Create, edit, and organize learning modules.",
};

const moduleService = new ModuleService();

export default async function AdminModulesPage() {
  const modules = await moduleService.getModules();

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary">
            <FolderTree className="h-4 w-4" />
            <span>Content Architecture</span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight">Module Management</h1>
          <p className="text-muted-foreground text-sm">Organize curriculum modules and difficulty tiers.</p>
        </div>

        <Link href="/admin/modules/new">
          <Button className="gap-2 font-bold shadow-md">
            <Plus className="h-4 w-4" />
            Create New Module
          </Button>
        </Link>
      </div>

      {/* Filter & Search Bar */}
      <Card className="border-border/80 bg-card shadow-xs">
        <CardContent className="p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-80">
            <Search className="h-4 w-4 absolute left-3 top-3 text-muted-foreground" />
            <Input placeholder="Search modules..." className="pl-9 text-xs font-medium" />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Badge variant="outline" className="text-xs gap-1 py-1.5 px-3">
              <Filter className="h-3 w-3" />
              All Statuses
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Modules Table / List */}
      <div className="space-y-4">
        {modules.map((mod) => (
          <Card key={mod.id} className="border-border/80 bg-card shadow-xs">
            <CardContent className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-lg text-foreground">{mod.title}</span>
                  <Badge variant={mod.status === "Published" ? "accent" : "outline"} className="text-[10px]">
                    {mod.status.toUpperCase()}
                  </Badge>
                  <Badge variant="secondary" className="text-[10px]">
                    {mod.difficulty}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground max-w-xl leading-relaxed">{mod.description}</p>
                <div className="flex items-center gap-4 text-xs text-muted-foreground pt-1">
                  <span>{mod.lessonsCount} Lessons</span>
                  <span>•</span>
                  <span>{mod.estimatedMinutes} Mins Study Time</span>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <Link href={`/admin/modules/${mod.id}/edit`}>
                  <Button size="xs" variant="outline" className="gap-1 font-semibold text-xs">
                    <Edit className="h-3.5 w-3.5" />
                    Edit
                  </Button>
                </Link>

                <Link href={`/admin/lessons?moduleId=${mod.id}`}>
                  <Button size="xs" variant="secondary" className="gap-1 font-semibold text-xs">
                    View Lessons ({mod.lessonsCount})
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
