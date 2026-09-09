"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Settings, LogOut, ChevronDown } from "lucide-react";
import { logoutAction } from "@/features/auth/actions/auth-actions";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/components/providers/language-provider";

interface UserNavProps {
  userEmail?: string;
  userName?: string;
  avatarUrl?: string;
}

export function UserNav({ userEmail, userName, avatarUrl }: UserNavProps) {
  const { t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  const displayName = userName || "User";
  const displayEmail = userEmail || "";

  const initials = displayName
    .trim()
    .split(/\s+/)
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase() || "U";

  return (
    <div className="relative">
      <Button
        variant="ghost"
        className="flex items-center gap-2 p-1.5 rounded-full hover:bg-muted"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
      >
        {avatarUrl ? (
          <img
            src={avatarUrl}
            alt={displayName}
            className="h-8 w-8 rounded-full object-cover border border-primary/20"
          />
        ) : (
          <div className="h-8 w-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-semibold text-xs">
            {initials}
          </div>
        )}
        <div className="hidden md:flex flex-col text-left">
          <span className="text-xs font-semibold leading-none">{displayName}</span>
          {displayEmail && (
            <span className="text-[10px] text-muted-foreground leading-tight mt-0.5 max-w-[140px] truncate">
              {displayEmail}
            </span>
          )}
        </div>
        <ChevronDown className="h-3.5 w-3.5 text-muted-foreground hidden sm:block" />
      </Button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-56 rounded-xl border border-border bg-card shadow-lg z-50 p-1 divide-y divide-border/60">
            <div className="px-3 py-2">
              <p className="text-xs font-semibold">{displayName}</p>
              {displayEmail && (
                <p className="text-[11px] text-muted-foreground truncate">{displayEmail}</p>
              )}
            </div>

            <div className="py-1">
              <Link
                href="/settings"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium rounded-lg hover:bg-muted transition-colors text-foreground"
              >
                <Settings className="h-3.5 w-3.5 text-muted-foreground" />
                {t.nav.accountSettings}
              </Link>
            </div>

            <div className="pt-1">
              <button
                onClick={async () => {
                  setIsOpen(false);
                  await logoutAction();
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium rounded-lg text-destructive hover:bg-destructive/10 transition-colors"
              >
                <LogOut className="h-3.5 w-3.5" />
                {t.nav.signOut}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
