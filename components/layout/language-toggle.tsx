"use client";

import React from "react";
import { Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/components/providers/language-provider";

interface LanguageToggleProps {
  className?: string;
  variant?: "outline" | "ghost" | "default";
  size?: "default" | "sm" | "xs";
}

export function LanguageToggle({
  className = "",
  variant = "outline",
  size = "sm",
}: LanguageToggleProps) {
  const { language, toggleLanguage, t } = useLanguage();

  return (
    <Button
      type="button"
      variant={variant}
      size={size}
      onClick={toggleLanguage}
      className={`gap-1.5 font-bold tracking-tight text-xs transition-all shadow-2xs hover:scale-105 active:scale-95 ${className}`}
      title={t.common.switchLang}
    >
      <Globe className="h-3.5 w-3.5 text-primary" />
      <span className="flex items-center gap-1">
        {language === "id" ? (
          <>
            <span className="text-sm">🇮🇩</span>
            <span className="font-extrabold">ID</span>
          </>
        ) : (
          <>
            <span className="text-sm">🇬🇧</span>
            <span className="font-extrabold">EN</span>
          </>
        )}
      </span>
    </Button>
  );
}
