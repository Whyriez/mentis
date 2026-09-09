"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  KraepelinColumnData,
  KraepelinConfig,
  KraepelinPair,
} from "../types";
import { KraepelinGenerator } from "../services/kraepelin-generator";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Clock,
  ArrowUp,
  ArrowDown,
  Pause,
  Play,
  LogOut,
  FastForward,
  Volume2,
  VolumeX,
} from "lucide-react";
import { useLanguage } from "@/components/providers/language-provider";

interface KraepelinTestEngineProps {
  config: KraepelinConfig;
  onComplete: (columns: KraepelinColumnData[]) => void;
  onCancel: () => void;
}

export function KraepelinTestEngine({
  config,
  onComplete,
  onCancel,
}: KraepelinTestEngineProps) {
  const { t } = useLanguage();
  const k = t.kraepelin;

  // Initialize columns
  const [columns, setColumns] = useState<KraepelinColumnData[]>(() =>
    KraepelinGenerator.generateTest(config)
  );

  const [currentColIdx, setCurrentColIdx] = useState<number>(0);
  const [currentPairIdx, setCurrentPairIdx] = useState<number>(0);
  const [secondsLeft, setSecondsLeft] = useState<number>(config.secondsPerColumn);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [showSwitchBanner, setShowSwitchBanner] = useState<boolean>(false);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(config.soundEnabled);

  // References for scrolling & completion safety
  const activePairRef = useRef<HTMLDivElement | null>(null);
  const columnScrollContainerRef = useRef<HTMLDivElement | null>(null);
  const horizontalGridRef = useRef<HTMLDivElement | null>(null);
  const columnsRef = useRef(columns);
  columnsRef.current = columns;
  const currentColIdxRef = useRef(currentColIdx);
  currentColIdxRef.current = currentColIdx;
  const isCompletedRef = useRef(false);

  const handleFinish = useCallback(() => {
    if (isCompletedRef.current) return;
    isCompletedRef.current = true;
    onComplete(columnsRef.current);
  }, [onComplete]);

  // Web Audio chime for "PINDAH!" signal
  const playSwitchChime = useCallback(() => {
    if (!soundEnabled) return;
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(880, ctx.currentTime); // A5 note
      osc.frequency.exponentialRampToValueAtTime(1320, ctx.currentTime + 0.15); // E6

      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.3);
    } catch {
      // AudioContext muted or unsupported
    }
  }, [soundEnabled]);

  // Handle jumping to next column (when time expires or manually)
  const advanceToNextColumn = useCallback(() => {
    if (currentColIdxRef.current + 1 >= columnsRef.current.length) {
      handleFinish();
      return;
    }

    playSwitchChime();
    setShowSwitchBanner(true);

    setTimeout(() => {
      setShowSwitchBanner(false);
    }, 1200);

    setCurrentColIdx((prevCol) => prevCol + 1);
    setCurrentPairIdx(0);
    setSecondsLeft(config.secondsPerColumn);
  }, [config.secondsPerColumn, playSwitchChime, handleFinish]);

  // Main countdown timer effect
  useEffect(() => {
    if (isPaused) return;

    const timer = setInterval(() => {
      setSecondsLeft((prevSec) => {
        if (prevSec <= 1) {
          // Defer advance/finish outside state updater to prevent setState in render
          setTimeout(() => {
            if (currentColIdxRef.current + 1 >= columnsRef.current.length) {
              handleFinish();
            } else {
              advanceToNextColumn();
            }
          }, 0);
          return config.secondsPerColumn;
        }
        return prevSec - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isPaused, config.secondsPerColumn, advanceToNextColumn, handleFinish]);

  // Keep active pair scrolled into view smoothly
  useEffect(() => {
    if (activePairRef.current) {
      activePairRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [currentPairIdx, currentColIdx]);

  // Keep active column scrolled into view horizontally
  useEffect(() => {
    if (horizontalGridRef.current) {
      const activeColEl = horizontalGridRef.current.children[currentColIdx] as HTMLElement | undefined;
      if (activeColEl) {
        activeColEl.scrollIntoView({
          behavior: "smooth",
          inline: "center",
          block: "nearest",
        });
      }
    }
  }, [currentColIdx]);

  // Answer registration function
  const handleInputDigit = useCallback(
    (digit: number) => {
      if (isPaused || currentColIdx >= columns.length) return;

      const currentColumn = columns[currentColIdx];
      if (!currentColumn || currentPairIdx >= currentColumn.pairs.length) {
        // Reached top of column early -> advance to next column
        advanceToNextColumn();
        return;
      }

      const pair = currentColumn.pairs[currentPairIdx];
      const isCorrect = digit === pair.correctAnswer;

      const updatedColumns = [...columns];
      updatedColumns[currentColIdx].pairs[currentPairIdx] = {
        ...pair,
        userAnswer: digit,
        isCorrect,
      };

      if (isCorrect) {
        updatedColumns[currentColIdx].correctCount++;
      } else {
        updatedColumns[currentColIdx].errorCount++;
      }
      updatedColumns[currentColIdx].answeredCount++;

      setColumns(updatedColumns);

      // Auto-advance to next pair in the column
      const nextPair = currentPairIdx + 1;
      if (nextPair >= currentColumn.pairs.length) {
        // Reached end of column before timer expires
        advanceToNextColumn();
      } else {
        setCurrentPairIdx(nextPair);
      }
    },
    [isPaused, currentColIdx, currentPairIdx, columns, advanceToNextColumn]
  );

  // Skip pair handler
  const handleSkipPair = useCallback(() => {
    if (isPaused || currentColIdx >= columns.length) return;
    const currentColumn = columns[currentColIdx];
    if (!currentColumn) return;

    const nextPair = currentPairIdx + 1;
    if (nextPair >= currentColumn.pairs.length) {
      advanceToNextColumn();
    } else {
      setCurrentPairIdx(nextPair);
    }
  }, [isPaused, currentColIdx, currentPairIdx, columns, advanceToNextColumn]);

  // Back / Undo last answer in current column
  const handleUndo = useCallback(() => {
    if (isPaused || currentPairIdx <= 0) return;
    const prevPair = currentPairIdx - 1;
    const updatedColumns = [...columns];
    const pair = updatedColumns[currentColIdx].pairs[prevPair];

    if (pair.userAnswer !== null) {
      if (pair.isCorrect) updatedColumns[currentColIdx].correctCount--;
      else updatedColumns[currentColIdx].errorCount--;
      updatedColumns[currentColIdx].answeredCount--;
      pair.userAnswer = null;
      pair.isCorrect = null;
    }

    setColumns(updatedColumns);
    setCurrentPairIdx(prevPair);
  }, [isPaused, currentPairIdx, columns, currentColIdx]);

  // Physical keyboard event listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isPaused) return;

      if (e.key >= "0" && e.key <= "9") {
        e.preventDefault();
        handleInputDigit(parseInt(e.key, 10));
      } else if (e.key === "Backspace") {
        e.preventDefault();
        handleUndo();
      } else if (e.key === " " || e.key === "ArrowRight") {
        e.preventDefault();
        handleSkipPair();
      } else if (e.key.toLowerCase() === "p") {
        setIsPaused((p) => !p);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isPaused, handleInputDigit, handleUndo, handleSkipPair]);

  const activeColumn = columns[currentColIdx] || columns[0];
  const timerPercent = (secondsLeft / config.secondsPerColumn) * 100;

  return (
    <div className="max-w-5xl mx-auto space-y-4 pb-12 select-none">
      {/* Top Status Bar */}
      <Card className="border-border/80 bg-card/90 backdrop-blur-md sticky top-18 z-30 shadow-md">
        <div className="p-3 sm:p-4 flex items-center justify-between gap-3">
          {/* Column Indicator */}
          <div className="flex items-center gap-2">
            <Badge variant="default" className="text-xs px-2.5 py-1 font-bold">
              {k.columnIndicator} {currentColIdx + 1} / {columns.length}
            </Badge>

            <span className="text-xs text-muted-foreground hidden sm:inline flex items-center gap-1">
              {config.mode === "kraepelin" ? (
                <>
                  <ArrowUp className="h-3.5 w-3.5 text-emerald-500" />
                  Bawah ke Atas
                </>
              ) : (
                <>
                  <ArrowDown className="h-3.5 w-3.5 text-blue-500" />
                  Atas ke Bawah
                </>
              )}
            </span>
          </div>

          {/* Column Timer */}
          <div className="flex items-center gap-2.5 flex-1 max-w-xs px-2">
            <Clock className="h-4 w-4 text-amber-500 shrink-0" />
            <div className="flex-1 space-y-1">
              <div className="flex justify-between text-[11px] font-bold">
                <span className="text-muted-foreground">{k.timeRemaining}</span>
                <span className={secondsLeft <= 5 ? "text-rose-500 font-extrabold animate-pulse" : "text-foreground"}>
                  {secondsLeft}s
                </span>
              </div>
              <Progress value={timerPercent} className="h-1.5" />
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-1.5 shrink-0">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSoundEnabled(!soundEnabled)}
              title={soundEnabled ? "Mute audio" : "Enable audio"}
              className="h-8 w-8 text-muted-foreground"
            >
              {soundEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
            </Button>

            <Button
              variant="outline"
              size="xs"
              onClick={() => setIsPaused(!isPaused)}
              className="gap-1 font-semibold text-xs h-8"
            >
              {isPaused ? <Play className="h-3.5 w-3.5" /> : <Pause className="h-3.5 w-3.5" />}
              <span className="hidden sm:inline">{isPaused ? k.resume : k.pause}</span>
            </Button>

            <Button
              variant="ghost"
              size="xs"
              onClick={onCancel}
              className="text-muted-foreground hover:text-rose-500 h-8"
            >
              <LogOut className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      </Card>

      {/* Switch Column Banner Notification */}
      {showSwitchBanner && (
        <div className="fixed top-28 left-1/2 -translate-x-1/2 z-50 animate-bounce duration-300 pointer-events-none">
          <div className="px-6 py-2.5 rounded-full bg-amber-500 text-amber-950 font-black text-lg tracking-wider shadow-2xl flex items-center gap-2 border-2 border-amber-300">
            <FastForward className="h-6 w-6 fill-current animate-pulse" />
            <span>{k.switchSignal}</span>
          </div>
        </div>
      )}

      {/* Main Column Display Area */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start">
        {/* Horizontal Columns Container */}
        <div className="md:col-span-8 lg:col-span-9 bg-card rounded-2xl border border-border/80 p-4 shadow-sm relative overflow-hidden">
          <div
            ref={horizontalGridRef}
            className="flex items-stretch justify-start gap-4 sm:gap-6 overflow-x-auto no-scrollbar py-2 min-h-[420px]"
          >
            {columns.map((col, cIdx) => {
              const isActiveCol = cIdx === currentColIdx;
              const isFinishedCol = cIdx < currentColIdx;

              return (
                <div
                  key={col.columnIndex}
                  className={`min-w-[84px] sm:min-w-[96px] rounded-xl border p-2 flex flex-col items-center transition-all ${
                    isActiveCol
                      ? "border-primary bg-primary/5 shadow-md ring-2 ring-primary/20 scale-[1.02]"
                      : isFinishedCol
                      ? "border-border/60 bg-muted/20 opacity-60"
                      : "border-border/40 bg-muted/10 opacity-30"
                  }`}
                >
                  {/* Column Header */}
                  <div className="text-[10px] font-bold text-muted-foreground border-b border-border/60 w-full text-center pb-1.5 mb-2">
                    C{col.columnIndex + 1}
                  </div>

                  {/* Vertical Numbers & Pairs */}
                  <div
                    ref={isActiveCol ? columnScrollContainerRef : null}
                    className="flex flex-col items-center gap-0 w-full overflow-y-auto max-h-[360px] no-scrollbar py-2"
                  >
                    {config.mode === "kraepelin" ? (
                      /* Kraepelin: Bottom to Top */
                      <div className="flex flex-col-reverse items-center gap-0 w-full">
                        {col.pairs.map((p, pIdx) => (
                          <KraepelinPairRow
                            key={p.pairIndex}
                            pair={p}
                            isActivePair={isActiveCol && pIdx === currentPairIdx}
                            isKraepelin={true}
                            pairRef={isActiveCol && pIdx === currentPairIdx ? activePairRef : null}
                          />
                        ))}
                      </div>
                    ) : (
                      /* Pauli: Top to Bottom */
                      <div className="flex flex-col items-center gap-0 w-full">
                        {col.pairs.map((p, pIdx) => (
                          <KraepelinPairRow
                            key={p.pairIndex}
                            pair={p}
                            isActivePair={isActiveCol && pIdx === currentPairIdx}
                            isKraepelin={false}
                            pairRef={isActiveCol && pIdx === currentPairIdx ? activePairRef : null}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <p className="text-center text-xs text-muted-foreground mt-3 flex items-center justify-center gap-1">
            <span>{k.autoAdvanceTip}</span>
          </p>
        </div>

        {/* Tactile Virtual Numpad & Quick Input Controls */}
        <div className="md:col-span-4 lg:col-span-3 space-y-3">
          {/* Active Target Card */}
          <Card className="border-primary/40 bg-primary/5 p-4 text-center">
            <div className="text-xs text-muted-foreground font-semibold">
              Pasangan Aktif (Jumlahkan Satuan):
            </div>
            {activeColumn && activeColumn.pairs[currentPairIdx] ? (
              <div className="flex items-center justify-center gap-3 text-3xl font-black text-foreground mt-2">
                <span className="h-12 w-12 rounded-xl bg-background border border-border flex items-center justify-center shadow-xs">
                  {activeColumn.pairs[currentPairIdx].num1}
                </span>
                <span className="text-primary text-xl">+</span>
                <span className="h-12 w-12 rounded-xl bg-background border border-border flex items-center justify-center shadow-xs">
                  {activeColumn.pairs[currentPairIdx].num2}
                </span>
              </div>
            ) : (
              <div className="text-sm font-bold text-muted-foreground mt-2">Siap Pindah Kolom</div>
            )}
          </Card>

          {/* On-Screen Tactile Numpad */}
          <div className="p-3 rounded-2xl border border-border bg-card shadow-sm space-y-2">
            <div className="grid grid-cols-3 gap-2">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => handleInputDigit(num)}
                  className="h-13 rounded-xl bg-muted/30 hover:bg-primary hover:text-primary-foreground border border-border/80 text-xl font-extrabold transition-all active:scale-95 touch-tap shadow-2xs"
                >
                  {num}
                </button>
              ))}

              <button
                type="button"
                onClick={handleUndo}
                className="h-13 rounded-xl bg-muted/60 hover:bg-muted text-xs font-bold transition-all active:scale-95 touch-tap flex items-center justify-center"
              >
                ⌫ Undo
              </button>

              <button
                type="button"
                onClick={() => handleInputDigit(0)}
                className="h-13 rounded-xl bg-muted/30 hover:bg-primary hover:text-primary-foreground border border-border/80 text-xl font-extrabold transition-all active:scale-95 touch-tap shadow-2xs"
              >
                0
              </button>

              <button
                type="button"
                onClick={handleSkipPair}
                className="h-13 rounded-xl bg-muted/60 hover:bg-muted text-xs font-bold transition-all active:scale-95 touch-tap flex items-center justify-center text-muted-foreground"
              >
                Lewati
              </button>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={advanceToNextColumn}
              className="w-full text-xs font-semibold gap-1.5 h-9"
            >
              <FastForward className="h-3.5 w-3.5" />
              <span>Paksa Pindah Kolom Sekarang</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Individual vertical row representing a pair of numbers with answer bubble in the middle
 */
function KraepelinPairRow({
  pair,
  isActivePair,
  isKraepelin,
  pairRef,
}: {
  pair: KraepelinPair;
  isActivePair: boolean;
  isKraepelin: boolean;
  pairRef: React.RefObject<HTMLDivElement | null> | null;
}) {
  const topNum = pair.num1;
  const bottomNum = pair.num2;
  const hasAnswer = pair.userAnswer !== null;

  return (
    <div
      ref={pairRef}
      className={`flex flex-col items-center w-full py-1 rounded-lg transition-all ${
        isActivePair
          ? "bg-primary/20 ring-2 ring-primary scale-105 my-1"
          : "hover:bg-muted/30"
      }`}
    >
      {/* Top Number */}
      <span className={`text-base font-extrabold ${isActivePair ? "text-primary scale-110" : "text-foreground"}`}>
        {topNum}
      </span>

      {/* Answer Badge / Indicator */}
      <div
        className={`h-5 px-2 min-w-[20px] rounded-full text-[11px] font-black flex items-center justify-center my-0.5 transition-all ${
          hasAnswer
            ? "bg-primary text-primary-foreground shadow-2xs"
            : isActivePair
            ? "border border-dashed border-primary text-primary animate-pulse"
            : "text-transparent"
        }`}
      >
        {hasAnswer ? pair.userAnswer : "?"}
      </div>

      {/* Bottom Number */}
      <span className={`text-base font-extrabold ${isActivePair ? "text-primary scale-110" : "text-foreground"}`}>
        {bottomNum}
      </span>
    </div>
  );
}
