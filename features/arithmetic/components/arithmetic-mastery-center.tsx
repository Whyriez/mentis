"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Calculator,
  Zap,
  Plus,
  Minus,
  Divide,
  Percent,
  BookmarkCheck,
  BookOpen,
  ChevronRight,
  LayoutDashboard,
  HelpCircle,
  Activity,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ArithmeticTopicId } from "../types";
import { ArithmeticMasteryDashboard } from "./arithmetic-mastery-dashboard";
import { MultiplicationTopicView } from "./multiplication-topic-view";
import { AdditionTopicView } from "./addition-topic-view";
import { SubtractionTopicView } from "./subtraction-topic-view";
import { DivisionTopicView } from "./division-topic-view";
import { PercentagesTopicView } from "./percentages-topic-view";
import { QuickReferenceView } from "./quick-reference-view";
import { MemorizationView } from "./memorization-view";
import { ArithmeticQuizView } from "./arithmetic-quiz-view";
import { ArithmeticOperation, ArithmeticTier } from "../services/arithmetic-generator";
import { useLanguage } from "@/components/providers/language-provider";
import { LanguageToggle } from "@/components/layout/language-toggle";

type ActiveTab =
  | "DASHBOARD"
  | "multiplication"
  | "addition"
  | "subtraction"
  | "division"
  | "percentages"
  | "QUICK_REF"
  | "MEMORIZE"
  | "QUIZ";

export function ArithmeticMasteryCenter() {
  const { language, t } = useLanguage();
  const [activeTab, setActiveTab] = useState<ActiveTab>("DASHBOARD");
  const [quizOperation, setQuizOperation] = useState<ArithmeticOperation>("multiplication");
  const [quizTier, setQuizTier] = useState<ArithmeticTier>("1-10");

  const startQuizFor = (op: ArithmeticOperation, tier: ArithmeticTier) => {
    setQuizOperation(op);
    setQuizTier(tier);
    setActiveTab("QUIZ");
  };

  const getBreadcrumbLabel = () => {
    if (activeTab === "DASHBOARD") return t.arithmetic.overview;
    if (activeTab === "multiplication") return t.arithmetic.multiplication;
    if (activeTab === "addition") return t.arithmetic.addition;
    if (activeTab === "subtraction") return t.arithmetic.subtraction;
    if (activeTab === "division") return t.arithmetic.division;
    if (activeTab === "percentages") return t.arithmetic.percentages;
    if (activeTab === "QUICK_REF") return t.arithmetic.cheatSheet;
    if (activeTab === "MEMORIZE") return t.arithmetic.memorize;
    if (activeTab === "QUIZ") return t.arithmetic.quizDrills;
    return activeTab;
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header & Breadcrumb Navigation Bar */}
      <div className="flex items-center justify-between gap-4 flex-wrap pb-2 border-b border-border/40">
        <div className="flex items-center gap-2 text-xs text-muted-foreground font-semibold flex-wrap">
          <button
            type="button"
            onClick={() => setActiveTab("DASHBOARD")}
            className="hover:text-primary transition-colors flex items-center gap-1.5 font-bold"
          >
            <Calculator className="h-4 w-4 text-primary" />
            <span>{t.arithmetic.breadcrumb}</span>
          </button>

          {activeTab !== "DASHBOARD" && (
            <>
              <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="text-foreground font-extrabold">
                {getBreadcrumbLabel()}
              </span>
            </>
          )}
        </div>

        <div className="flex items-center gap-2">
          <LanguageToggle size="xs" />
        </div>
      </div>

      {/* Main Tab Navigation Bar */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1 pb-2 border-b border-border/60 -mx-4 px-4 sm:mx-0 sm:px-0 scroll-smooth touch-tap">
        <Button
          size="sm"
          variant={activeTab === "DASHBOARD" ? "default" : "ghost"}
          onClick={() => setActiveTab("DASHBOARD")}
          className="gap-1.5 font-bold text-xs shrink-0"
        >
          <LayoutDashboard className="h-3.5 w-3.5" /> {t.arithmetic.overview}
        </Button>

        <Button
          size="sm"
          variant={activeTab === "QUIZ" ? "default" : "outline"}
          onClick={() => setActiveTab("QUIZ")}
          className="gap-1.5 font-bold text-xs shrink-0 bg-primary/10 hover:bg-primary/20 text-primary border-primary/40"
        >
          <Zap className="h-3.5 w-3.5 fill-current" /> {t.arithmetic.quizDrills}
        </Button>

        <Link href="/kraepelin">
          <Button
            size="sm"
            variant="outline"
            className="gap-1.5 font-bold text-xs shrink-0 border-amber-500/40 text-amber-600 dark:text-amber-400 bg-amber-500/10 hover:bg-amber-500/20"
          >
            <Activity className="h-3.5 w-3.5" />
            <span>Tes Koran (Kraepelin)</span>
          </Button>
        </Link>

        <div className="h-4 w-px bg-border mx-1 shrink-0" />

        <Button
          size="sm"
          variant={activeTab === "multiplication" ? "default" : "ghost"}
          onClick={() => setActiveTab("multiplication")}
          className="gap-1.5 font-bold text-xs shrink-0"
        >
          <Zap className="h-3.5 w-3.5 text-amber-500" /> {t.arithmetic.multiplication}
        </Button>

        <Button
          size="sm"
          variant={activeTab === "subtraction" ? "default" : "ghost"}
          onClick={() => setActiveTab("subtraction")}
          className="gap-1.5 font-bold text-xs shrink-0"
        >
          <Minus className="h-3.5 w-3.5 text-rose-500" /> {t.arithmetic.subtraction}
        </Button>

        <Button
          size="sm"
          variant={activeTab === "division" ? "default" : "ghost"}
          onClick={() => setActiveTab("division")}
          className="gap-1.5 font-bold text-xs shrink-0"
        >
          <Divide className="h-3.5 w-3.5 text-blue-500" /> {t.arithmetic.division}
        </Button>

        <Button
          size="sm"
          variant={activeTab === "addition" ? "default" : "ghost"}
          onClick={() => setActiveTab("addition")}
          className="gap-1.5 font-bold text-xs shrink-0"
        >
          <Plus className="h-3.5 w-3.5 text-emerald-500" /> {t.arithmetic.addition}
        </Button>

        <Button
          size="sm"
          variant={activeTab === "percentages" ? "default" : "ghost"}
          onClick={() => setActiveTab("percentages")}
          className="gap-1.5 font-bold text-xs shrink-0"
        >
          <Percent className="h-3.5 w-3.5 text-violet-500" /> {t.arithmetic.percentages}
        </Button>

        <div className="h-4 w-px bg-border mx-1 shrink-0" />

        <Button
          size="sm"
          variant={activeTab === "MEMORIZE" ? "default" : "outline"}
          onClick={() => setActiveTab("MEMORIZE")}
          className="gap-1.5 font-bold text-xs shrink-0"
        >
          <BookmarkCheck className="h-3.5 w-3.5" /> {t.arithmetic.memorize}
        </Button>

        <Button
          size="sm"
          variant={activeTab === "QUICK_REF" ? "default" : "outline"}
          onClick={() => setActiveTab("QUICK_REF")}
          className="gap-1.5 font-bold text-xs shrink-0"
        >
          <BookOpen className="h-3.5 w-3.5 text-primary" /> {t.arithmetic.cheatSheet}
        </Button>
      </div>

      {/* Main Tab View Rendering */}
      {activeTab === "DASHBOARD" && (
        <ArithmeticMasteryDashboard
          onSelectTopic={(topicId) => setActiveTab(topicId)}
          onOpenQuickRef={() => setActiveTab("QUICK_REF")}
          onOpenMemorize={() => setActiveTab("MEMORIZE")}
          onStartQuiz={(op, tier) => startQuizFor(op || "multiplication", tier || "1-10")}
        />
      )}

      {activeTab === "QUIZ" && (
        <ArithmeticQuizView
          initialOperation={quizOperation}
          initialTier={quizTier}
          onBackToOverview={() => setActiveTab("DASHBOARD")}
        />
      )}

      {activeTab === "multiplication" && (
        <MultiplicationTopicView
          onStartQuiz={(tier) => startQuizFor("multiplication", tier)}
        />
      )}

      {activeTab === "subtraction" && (
        <SubtractionTopicView
          onStartQuiz={(tier) => startQuizFor("subtraction", tier)}
        />
      )}

      {activeTab === "division" && (
        <DivisionTopicView
          onStartQuiz={(tier) => startQuizFor("division", tier)}
        />
      )}

      {activeTab === "addition" && (
        <AdditionTopicView
          onStartQuiz={(tier) => startQuizFor("addition", tier)}
        />
      )}

      {activeTab === "percentages" && <PercentagesTopicView />}
      {activeTab === "QUICK_REF" && <QuickReferenceView />}
      {activeTab === "MEMORIZE" && <MemorizationView />}
    </div>
  );
}
