"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  BookOpen,
  Calculator,
  HelpCircle,
  BarChart3,
  Map,
  Flame,
  Activity,
} from "lucide-react";
import { MentisLogo } from "@/components/ui/mentis-logo";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "./theme-toggle";
import { LanguageToggle } from "./language-toggle";
import { UserNav } from "./user-nav";
import { createClient } from "@/lib/supabase/client";
import { useLanguage } from "@/components/providers/language-provider";

export interface HeaderProps {
  userName?: string;
  userEmail?: string;
  avatarUrl?: string;
  streakDays?: number;
}

export function Header({
  userName: initialUserName,
  userEmail: initialUserEmail,
  avatarUrl: initialAvatarUrl,
  streakDays: initialStreakDays,
}: HeaderProps) {
  const pathname = usePathname();
  const { t } = useLanguage();
  const [clientData, setClientData] = useState<{
    userName?: string;
    userEmail?: string;
    avatarUrl?: string;
    streakDays?: number;
  }>({});

  const userName = initialUserName ?? clientData.userName ?? "";
  const userEmail = initialUserEmail ?? clientData.userEmail ?? "";
  const avatarUrl = initialAvatarUrl ?? clientData.avatarUrl ?? "";
  const streakDays = initialStreakDays ?? clientData.streakDays ?? 0;

  const navItems = [
    { label: t.nav.dashboard, href: "/dashboard", icon: LayoutDashboard },
    { label: t.nav.learn, href: "/learn", icon: BookOpen },
    { label: t.nav.arithmetic, href: "/arithmetic", icon: Calculator },
    { label: t.nav.kraepelin, href: "/kraepelin", icon: Activity },
    { label: t.nav.quiz, href: "/quiz", icon: HelpCircle },
    { label: t.nav.analytics, href: "/analytics", icon: BarChart3 },
    { label: t.nav.roadmap, href: "/roadmap", icon: Map },
  ];

  useEffect(() => {
    // Only attempt client-side user retrieval if not provided by server context
    if (initialUserEmail === undefined && initialUserName === undefined) {
      const supabase = createClient();
      supabase.auth.getUser().then(async (res) => {
        const user = res.data?.user;
        if (user) {
          const fallbackName =
            user.user_metadata?.full_name || user.email?.split("@")[0] || "Learner";

          const { data: profile } = await supabase
            .from("profiles")
            .select("full_name, avatar_url, current_streak")
            .eq("user_id", user.id)
            .single();

          setClientData({
            userEmail: user.email || "",
            userName: profile?.full_name || fallbackName,
            avatarUrl: profile?.avatar_url || "",
            streakDays: profile?.current_streak ?? 0,
          });
        }
      });
    }
  }, [initialUserEmail, initialUserName]);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/80 bg-background/80 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6">
        {/* Brand Logo */}
        <div className="flex items-center gap-8">
          <Link href="/dashboard" className="flex items-center gap-2.5 group">
            <div className="transition-transform group-hover:scale-105">
              <MentisLogo size={36} className="shadow-md shadow-primary/25 rounded-xl" />
            </div>
            <span className="font-extrabold text-xl tracking-tight text-foreground font-sans">
              Mentis
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive =
                pathname === item.href || pathname.startsWith(`${item.href}/`);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-2 px-3 py-2 text-xs font-semibold rounded-lg transition-colors",
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Right Action Items */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Streak Counter */}
          <div className="flex items-center gap-1.5 px-2 py-1 sm:px-3 sm:py-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400 text-xs font-bold shadow-xs shrink-0">
            <Flame className="h-4 w-4 fill-amber-500 text-amber-500" />
            <span>{streakDays} <span className="hidden sm:inline">{t.nav.dayStreak}</span></span>
          </div>

          <LanguageToggle size="sm" />
          <ThemeToggle />
          <UserNav
            userName={userName}
            userEmail={userEmail}
            avatarUrl={avatarUrl}
          />
        </div>
      </div>

      {/* Mobile Navigation bar at bottom of header */}
      <div className="md:hidden flex items-center justify-between overflow-x-auto no-scrollbar border-t border-border/60 bg-card/75 backdrop-blur-sm px-2 py-1.5">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center gap-0.5 px-2 py-1 text-[10px] font-medium rounded-md transition-colors shrink-0 touch-tap",
                isActive ? "text-primary font-extrabold bg-primary/10" : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Icon className="h-4 w-4" />
              <span className="truncate max-w-[64px]">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </header>
  );
}
