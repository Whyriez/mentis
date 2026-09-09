"use client";

import React from "react";

interface FormattedMathProps {
  text: string;
  className?: string;
  as?: React.ElementType;
}

/**
 * Helper to transform raw text math expressions (e.g. 7^92, 75^2, sqrt(144), 378 / 6)
 * into rich HTML formatted math with superscript, square root overbar, and clean operators.
 */
export function formatMathText(rawText: string): React.ReactNode[] {
  if (!rawText) return [];

  // Step 1: Normalize operator symbols (e.g. * -> ×, / -> ÷ in math contexts)
  let normalized = rawText
    .replace(/\s\*\s/g, " × ")
    .replace(/\s\/\s/g, " ÷ ");

  // Step 2: Handle sqrt(xxx) -> √{xxx}
  normalized = normalized.replace(/sqrt\(([^)]+)\)/gi, "√{$1}");

  // Step 3: Match tokens: superscripts x^y or (x^y), sqrt √{xxx}, or normal text
  // Pattern matches:
  // - ^([0-9a-zA-Z]+)
  // - ^\(([0-9a-zA-Z+-\s]+)\)
  // - √{([^}]+)}
  const parts: React.ReactNode[] = [];
  const regex = /(\(([0-9a-zA-Z]+)\^([0-9a-zA-Z]+)\)|([0-9a-zA-Z]+)\^([0-9a-zA-Z]+)|\^([0-9a-zA-Z]+)|√\{([^}]+)\}|√([0-9]+))/g;

  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(normalized)) !== null) {
    // Push preceding plain text
    if (match.index > lastIndex) {
      parts.push(normalized.substring(lastIndex, match.index));
    }

    const fullMatch = match[0];
    const parenBase = match[2];
    const parenExp = match[3];
    const base = match[4];
    const exp = match[5];
    const soloExp = match[6];
    const sqrtContent = match[7] || match[8];

    if (parenBase && parenExp) {
      // e.g. (7^92) -> 7<sup>92</sup>
      parts.push(
        <span key={`math-${match.index}`} className="inline-flex items-baseline font-mono font-bold">
          {parenBase}
          <sup className="text-[0.75em] text-primary -top-[0.45em] ml-0.5 font-bold">{parenExp}</sup>
        </span>
      );
    } else if (base && exp) {
      // e.g. 75^2 -> 75<sup>2</sup>
      parts.push(
        <span key={`math-${match.index}`} className="inline-flex items-baseline font-mono font-bold">
          {base}
          <sup className="text-[0.75em] text-primary -top-[0.45em] ml-0.5 font-bold">{exp}</sup>
        </span>
      );
    } else if (soloExp) {
      // e.g. ^92 -> <sup>92</sup>
      parts.push(
        <sup key={`math-${match.index}`} className="text-[0.75em] text-primary -top-[0.45em] font-bold">
          {soloExp}
        </sup>
      );
    } else if (sqrtContent) {
      // e.g. sqrt(144) -> √144 with overline
      parts.push(
        <span key={`math-${match.index}`} className="inline-flex items-center font-mono font-bold">
          <span className="text-primary mr-0.5 text-base font-black">√</span>
          <span className="border-t-2 border-primary/80 pt-0.5 px-0.5 tracking-wider">{sqrtContent}</span>
        </span>
      );
    } else {
      parts.push(fullMatch);
    }

    lastIndex = regex.lastIndex;
  }

  // Push remaining text
  if (lastIndex < normalized.length) {
    parts.push(normalized.substring(lastIndex));
  }

  return parts;
}

export function FormattedMath({ text, className = "", as: Component = "span" }: FormattedMathProps) {
  const formattedElements = formatMathText(text);

  return <Component className={className}>{formattedElements}</Component>;
}
