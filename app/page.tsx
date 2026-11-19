import Link from "next/link";
import { Brain, Sparkles, ArrowRight, Zap, BarChart3, Map } from "lucide-react";
import { MentisLogo } from "@/components/ui/mentis-logo";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/layout/theme-toggle";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground selection:bg-primary selection:text-primary-foreground">
      {/* Header */}
      <header className="w-full border-b border-border/80 bg-background/80 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-2.5">
            <MentisLogo size={36} className="shadow-md shadow-primary/25 rounded-xl" />
            <span className="font-extrabold text-xl tracking-tight text-foreground font-sans">
              Mentis
            </span>
          </div>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Link href="/login">
              <Button variant="ghost" size="sm" className="font-semibold">
                Log In
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button size="sm" className="gap-2 font-bold shadow-md">
                Launch Dashboard
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1">
        <section className="relative overflow-hidden py-20 lg:py-28 px-4 sm:px-6 container mx-auto text-center">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/10 rounded-full blur-3xl pointer-events-none -z-10 transform-gpu" />

          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary/20 bg-primary/10 text-primary text-xs font-bold mb-6">
            <Sparkles className="h-4 w-4" />
            Adaptive Brain Training Platform
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight max-w-4xl mx-auto leading-[1.1]">
            Master Mental Math & Psychometric Skills.
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Elevate your calculation speed, conquer time pressure, and master logical reasoning with personalized adaptive roadmaps and timed drills.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/register" className="w-full sm:w-auto">
              <Button size="lg" className="w-full sm:w-auto gap-2 font-bold shadow-lg text-base">
                Get Started Free
                <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
            <Link href="/dashboard" className="w-full sm:w-auto">
              <Button variant="outline" size="lg" className="w-full sm:w-auto font-semibold text-base">
                Explore Demo Dashboard
              </Button>
            </Link>
          </div>

          {/* Feature Highlights Grid */}
          <div className="mt-20 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-left max-w-6xl mx-auto">
            <div className="p-6 rounded-2xl border border-border/80 bg-card/60 backdrop-blur-xs shadow-xs space-y-3">
              <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                <Zap className="h-5 w-5" />
              </div>
              <h3 className="font-bold text-lg">Speed Calculation</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Step-by-step techniques and rapid shortcuts to multiply, square, and convert fractions in seconds.
              </p>
            </div>

            <div className="p-6 rounded-2xl border border-border/80 bg-card/60 backdrop-blur-xs shadow-xs space-y-3">
              <div className="h-10 w-10 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
                <Brain className="h-5 w-5" />
              </div>
              <h3 className="font-bold text-lg">Timed Quiz Engine</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                High-pressure countdown drills with keyboard shortcuts and auto-next functionality.
              </p>
            </div>

            <div className="p-6 rounded-2xl border border-border/80 bg-card/60 backdrop-blur-xs shadow-xs space-y-3">
              <div className="h-10 w-10 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
                <BarChart3 className="h-5 w-5" />
              </div>
              <h3 className="font-bold text-lg">Weakness Diagnostics</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Real-time tracking of response speeds, accuracy trends, and spaced repetition review queues.
              </p>
            </div>

            <div className="p-6 rounded-2xl border border-border/80 bg-card/60 backdrop-blur-xs shadow-xs space-y-3">
              <div className="h-10 w-10 rounded-xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center">
                <Map className="h-5 w-5" />
              </div>
              <h3 className="font-bold text-lg">Adaptive Roadmap</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Intelligent study paths customized to your baseline score and target exam timeframe.
              </p>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-border/60 py-8 text-center text-xs text-muted-foreground">
        <div className="container mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <MentisLogo size={20} className="rounded-md" />
            <span className="font-bold text-foreground">Mentis</span>
            <span>&copy; {new Date().getFullYear()} Mentis Platform.</span>
          </div>
          <div className="flex gap-6">
            <Link href="/login" className="hover:underline">Login</Link>
            <Link href="/register" className="hover:underline">Register</Link>
            <Link href="/dashboard" className="hover:underline">Dashboard</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
