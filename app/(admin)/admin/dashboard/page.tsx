import React from "react";
import { Users, HelpCircle, Sparkles, Shield, Layers, Clock, BarChart3 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export default async function AdminDashboardPage() {
  const supabase = await createClient();

  const [{ count: userCount }, { count: attemptCount }, { count: moduleCount }, { count: questionCount }] = await Promise.all([
    supabase.from("profiles").select("*", { count: "exact", head: true }),
    supabase.from("quiz_attempts").select("*", { count: "exact", head: true }),
    supabase.from("modules").select("*", { count: "exact", head: true }),
    supabase.from("questions").select("*", { count: "exact", head: true }),
  ]);

  const stats = [
    { title: "Total Registered Users", value: (userCount ?? 0).toString(), sub: "Active learners", icon: Users, color: "text-primary bg-primary/10" },
    { title: "Total Quiz Attempts", value: (attemptCount ?? 0).toString(), sub: "Completed speed drills", icon: HelpCircle, color: "text-emerald-500 bg-emerald-500/10" },
    { title: "Curriculum Modules", value: (moduleCount ?? 1).toString(), sub: "Published modules", icon: Layers, color: "text-amber-500 bg-amber-500/10" },
    { title: "Question Bank Size", value: (questionCount ?? 10).toString(), sub: "Active question items", icon: Clock, color: "text-blue-500 bg-blue-500/10" },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary">
            <Shield className="h-4 w-4" />
            <span>Administrator Dashboard</span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight">System Control Center</h1>
          <p className="text-muted-foreground text-sm">Manage curriculum, question bank, AI generation, and user access.</p>
        </div>

        <div className="flex items-center gap-2">
          <Link href="/admin/ai">
            <Button size="sm" className="gap-2 font-bold shadow-md">
              <Sparkles className="h-4 w-4" />
              AI Studio
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Widgets */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, i) => {
          const Icon = s.icon;
          return (
            <Card key={i} className="border-border/80 bg-card p-5 flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-xs font-semibold text-muted-foreground">{s.title}</p>
                <div className="text-2xl font-extrabold text-foreground">{s.value}</div>
                <p className="text-[11px] text-muted-foreground">{s.sub}</p>
              </div>
              <div className={`p-3 rounded-2xl ${s.color}`}>
                <Icon className="h-5 w-5" />
              </div>
            </Card>
          );
        })}
      </div>

      {/* Quick Navigation Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Link href="/admin/modules">
          <Card className="border-border/80 bg-card p-5 hover:border-primary/40 transition-all cursor-pointer space-y-2">
            <div className="flex items-center gap-2 text-primary font-bold text-sm">
              <Layers className="h-4 w-4" />
              <span>Modules & Lessons</span>
            </div>
            <p className="text-xs text-muted-foreground">Manage curriculum structure, topics, and lesson blocks.</p>
          </Card>
        </Link>

        <Link href="/admin/questions">
          <Card className="border-border/80 bg-card p-5 hover:border-primary/40 transition-all cursor-pointer space-y-2">
            <div className="flex items-center gap-2 text-primary font-bold text-sm">
              <HelpCircle className="h-4 w-4" />
              <span>Question Bank</span>
            </div>
            <p className="text-xs text-muted-foreground">Central question drill bank with CSV import/export.</p>
          </Card>
        </Link>

        <Link href="/admin/users">
          <Card className="border-border/80 bg-card p-5 hover:border-primary/40 transition-all cursor-pointer space-y-2">
            <div className="flex items-center gap-2 text-primary font-bold text-sm">
              <Users className="h-4 w-4" />
              <span>User Roster</span>
            </div>
            <p className="text-xs text-muted-foreground">Manage user profiles, roles, and learning stats.</p>
          </Card>
        </Link>

        <Link href="/admin/analytics">
          <Card className="border-border/80 bg-card p-5 hover:border-primary/40 transition-all cursor-pointer space-y-2">
            <div className="flex items-center gap-2 text-primary font-bold text-sm">
              <BarChart3 className="h-4 w-4" />
              <span>Analytics</span>
            </div>
            <p className="text-xs text-muted-foreground">Platform intelligence, quiz scores, and AI statistics.</p>
          </Card>
        </Link>
      </div>
    </div>
  );
}
