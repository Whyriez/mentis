import React from "react";
import { cn } from "@/lib/utils";

export interface MentisLogoProps extends React.SVGProps<SVGSVGElement> {
  size?: number;
  variant?: "squircle" | "mark";
}

/**
 * Mentis Custom Vector Brand Logo
 * Features:
 * - Neural "M" geometry representing cognitive cerebral lobes & mental calculation
 * - Interconnected synapse nodes (cyan & emerald pulse)
 * - Scalable from 16px (favicon) to 64px+ (hero display)
 */
export function MentisLogo({
  size = 36,
  className,
  variant = "squircle",
  ...props
}: MentisLogoProps) {
  const id = React.useId().replace(/:/g, "");
  const gradientId = `mentis-grad-${id}`;

  if (variant === "mark") {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={cn("shrink-0", className)}
        {...props}
      >
        <path
          d="M13 35V17C13 14.5 15 12.5 17.5 12.5C19.5 12.5 21.2 13.8 21.8 15.6L24 22L26.2 15.6C26.8 13.8 28.5 12.5 30.5 12.5C33 12.5 35 14.5 35 17V35"
          stroke="currentColor"
          strokeWidth="3.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="24" cy="23" r="2.8" fill="#10B981" />
        <circle cx="17.5" cy="17" r="2" fill="#38BDF8" />
        <circle cx="30.5" cy="17" r="2" fill="#38BDF8" />
      </svg>
    );
  }

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("shrink-0", className)}
      {...props}
    >
      <defs>
        <linearGradient
          id={gradientId}
          x1="0"
          y1="0"
          x2="48"
          y2="48"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="#4F46E5" />
          <stop offset="100%" stopColor="#3730A3" />
        </linearGradient>
      </defs>

      {/* Squircle base with subtle inner border */}
      <rect width="48" height="48" rx="12" fill={`url(#${gradientId})`} />
      <rect
        x="0.75"
        y="0.75"
        width="46.5"
        height="46.5"
        rx="11.25"
        stroke="#818CF8"
        strokeOpacity="0.3"
        strokeWidth="1.5"
      />

      {/* Neural M Architecture */}
      <path
        d="M13 35V17C13 14.5 15 12.5 17.5 12.5C19.5 12.5 21.2 13.8 21.8 15.6L24 22L26.2 15.6C26.8 13.8 28.5 12.5 30.5 12.5C33 12.5 35 14.5 35 17V35"
        stroke="#FFFFFF"
        strokeWidth="3.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Synapse Nodes */}
      <circle cx="24" cy="23" r="2.8" fill="#10B981" />
      <circle cx="17.5" cy="17" r="2" fill="#38BDF8" />
      <circle cx="30.5" cy="17" r="2" fill="#38BDF8" />
    </svg>
  );
}
