import React from "react";
import Link from "next/link";
import { Sparkles } from "lucide-react";
import { MentisLogo } from "@/components/ui/mentis-logo";
import { ThemeToggle } from "@/components/layout/theme-toggle";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-background text-foreground">
      {/* Left Column - Hero Brand Banner */}
      <div className="hidden lg:flex flex-col justify-between p-12 bg-gradient-to-br from-primary/10 via-primary/5 to-background border-r border-border relative overflow-hidden">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-primary/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex items-center gap-3 relative z-10">
          <MentisLogo size={40} className="shadow-lg shadow-primary/25 rounded-xl" />
          <span className="font-extrabold text-2xl tracking-tight text-foreground font-sans">
            Mentis
          </span>
        </div>

        <div className="space-y-6 relative z-10 my-auto max-w-lg">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/20 bg-primary/10 text-primary text-xs font-semibold">
            <Sparkles className="h-3.5 w-3.5" />
            Adaptive Brain Training
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight leading-tight">
            Master mental math & psychometric tests with confidence.
          </h1>
          <p className="text-muted-foreground text-base leading-relaxed">
            Join thousands of learners sharpening their speed, logical reasoning, and accuracy through targeted daily drills and AI-driven adaptive roadmaps.
          </p>
          <div className="grid grid-cols-3 gap-4 pt-4">
            <div className="p-4 rounded-xl bg-card/60 border border-border/50">
              <div className="text-2xl font-bold text-primary">3x</div>
              <div className="text-xs text-muted-foreground">Faster Calculation</div>
            </div>
            <div className="p-4 rounded-xl bg-card/60 border border-border/50">
              <div className="text-2xl font-bold text-emerald-500">95%</div>
              <div className="text-xs text-muted-foreground">Accuracy Target</div>
            </div>
            <div className="p-4 rounded-xl bg-card/60 border border-border/50">
              <div className="text-2xl font-bold text-primary">15m</div>
              <div className="text-xs text-muted-foreground">Daily Practice</div>
            </div>
          </div>
        </div>

        <div className="text-xs text-muted-foreground relative z-10 flex justify-between items-center">
          <span>&copy; {new Date().getFullYear()} Mentis Platform. All rights reserved.</span>
        </div>
      </div>

      {/* Right Column - Auth Form Container */}
      <div className="flex flex-col min-h-screen justify-between p-6 sm:p-10 lg:p-12 relative">
        <div className="flex justify-between items-center w-full">
          <Link href="/" className="flex items-center gap-2 lg:hidden">
            <MentisLogo size={32} className="rounded-lg shadow-xs" />
            <span className="font-extrabold text-xl tracking-tight text-foreground font-sans">Mentis</span>
          </Link>
          <div className="ml-auto flex items-center gap-2">
            <ThemeToggle />
          </div>
        </div>

        <div className="my-auto w-full max-w-md mx-auto py-8">
          {children}
        </div>

        <div className="text-center text-xs text-muted-foreground lg:hidden">
          &copy; {new Date().getFullYear()} Mentis Platform.
        </div>
      </div>
    </div>
  );
}
