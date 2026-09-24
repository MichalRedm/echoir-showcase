/**
 * @fileoverview Sanitized React 18 production component demonstrating the single-source-of-truth
 * vector geometry pattern for Echoir's official brand emblem ("The Singing Score").
 *
 * Key Architectural Highlights:
 * - Decouples raw Bézier curve coordinate geometry (`logoGeometry.json`) from React JSX rendering.
 * - Dynamic SVG `useId` gradient isolation preventing SVG `<defs>` collisions across multiple DOM instances.
 * - Multi-variant rendering: transparent mark, high-DPI squircle app tile, and high-contrast light mode.
 * - Strict WCAG accessibility compliance with descriptive aria labels and semantic SVG roles.
 */

import { useId } from "react";
import logoGeometry from "./logoGeometry.json";

/**
 * Properties for configuring the {@link LogoIcon} component.
 */
export interface LogoIconProps {
  /** Dimension in pixels (applied to width and height). Defaults to `28`. */
  size?: number | string;
  /**
   * Visual presentation variant:
   * - `"mark"`: Transparent background with dark-theme optimized glow (default).
   * - `"app_icon"`: Rounded dark squircle container with border highlight.
   * - `"light"`: High-contrast palette for light backgrounds.
   */
  variant?: "mark" | "app_icon" | "light";
  /** Additional CSS class names. */
  className?: string;
  /** Accessible title for screen readers. Defaults to `"Echoir logo"`. */
  ariaLabel?: string;
}

/**
 * Official Echoir Brand Logo Icon ("The Singing Score").
 *
 * @remarks
 * Combines an open choral songbook with the central treble clef whose vertical stem
 * forms the spine hinge of the score. Uses geometry defined in {@link logoGeometry}.
 */
export function LogoIcon({
  size = 28,
  variant = "mark",
  className = "",
  ariaLabel = "Echoir logo",
}: LogoIconProps) {
  const rawId = useId();
  const id = rawId.replace(/:/g, "_");

  const isLight = variant === "light";
  const isAppIcon = variant === "app_icon";

  const bookStroke = isLight ? "rgba(99, 102, 241, 0.22)" : "rgba(255, 255, 255, 0.14)";
  const staffStroke = isLight ? "rgba(99, 102, 241, 0.42)" : "rgba(255, 255, 255, 0.36)";

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 512 512"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      role="img"
      aria-label={ariaLabel}
    >
      <defs>
        {isAppIcon && (
          <linearGradient id={`bg_grad_${id}`} x1="0" y1="0" x2="512" y2="512" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#1e1b4b" />
            <stop offset="55%" stopColor="#100e1f" />
            <stop offset="100%" stopColor="#08070d" />
          </linearGradient>
        )}

        <linearGradient id={`book_l_${id}`} x1="110" y1="160" x2="256" y2="360" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor={isLight ? "#e0e7ff" : "#4338ca"} />
          <stop offset="100%" stopColor={isLight ? "#c7d2fe" : "#2e1065"} />
        </linearGradient>

        <linearGradient id={`book_r_${id}`} x1="256" y1="160" x2="402" y2="360" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor={isLight ? "#ede9fe" : "#3730a3"} />
          <stop offset="100%" stopColor={isLight ? "#ddd6fe" : "#1e1b4b"} />
        </linearGradient>

        <linearGradient id={`clef_grad_${id}`} x1="256" y1="78" x2="256" y2="400" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#34d399" />
          <stop offset="28%" stopColor="#10b981" />
          <stop offset="68%" stopColor="#38bdf8" />
          <stop offset="100%" stopColor="#6366f1" />
        </linearGradient>

        <filter id={`shadow_${id}`} x="60" y="30" width="380" height="440" filterUnits="userSpaceOnUse">
          <feDropShadow dx="0" dy="6" stdDeviation="10" floodColor="#000000" floodOpacity="0.45" />
        </filter>
      </defs>

      {isAppIcon && (
        <>
          <rect width="512" height="512" rx="112" fill={`url(#bg_grad_${id})`} />
          <rect
            x="1.5"
            y="1.5"
            width="509"
            height="509"
            rx="110.5"
            stroke="rgba(255,255,255,0.14)"
            strokeWidth="3"
            fill="none"
          />
        </>
      )}

      {isLight && <rect width="512" height="512" rx="112" fill="#ffffff" />}

      {/* Left Folio */}
      <path
        d={logoGeometry.book.left}
        fill={`url(#book_l_${id})`}
        stroke={bookStroke}
        strokeWidth={logoGeometry.strokeWidths.book}
      />

      {/* Right Folio */}
      <path
        d={logoGeometry.book.right}
        fill={`url(#book_r_${id})`}
        stroke={bookStroke}
        strokeWidth={logoGeometry.strokeWidths.book}
      />

      {/* Left Staves */}
      {logoGeometry.staves.left.map((d, i) => (
        <path
          key={`stave_l_${i}`}
          d={d}
          stroke={staffStroke}
          strokeWidth={logoGeometry.strokeWidths.staves}
          strokeLinecap="round"
          fill="none"
        />
      ))}

      {/* Right Staves */}
      {logoGeometry.staves.right.map((d, i) => (
        <path
          key={`stave_r_${i}`}
          d={d}
          stroke={staffStroke}
          strokeWidth={logoGeometry.strokeWidths.staves}
          strokeLinecap="round"
          fill="none"
        />
      ))}

      {/* Clef Emblem with Drop Shadow */}
      <g filter={`url(#shadow_${id})`}>
        {/* Spine Stem */}
        <path
          d={logoGeometry.clef.spine}
          stroke={`url(#clef_grad_${id})`}
          strokeWidth={logoGeometry.strokeWidths.clef}
          strokeLinecap="round"
        />

        {/* Sweeping Hook */}
        <path
          d={logoGeometry.clef.hook}
          stroke={`url(#clef_grad_${id})`}
          strokeWidth={logoGeometry.strokeWidths.clef}
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />

        {/* Tilted Notehead */}
        <ellipse
          cx={logoGeometry.clef.notehead.cx}
          cy={logoGeometry.clef.notehead.cy}
          rx={logoGeometry.clef.notehead.rx}
          ry={logoGeometry.clef.notehead.ry}
          transform={`rotate(${logoGeometry.clef.notehead.rotate} ${logoGeometry.clef.notehead.cx} ${logoGeometry.clef.notehead.cy})`}
          fill={`url(#clef_grad_${id})`}
        />

        {/* Top Crown Loop */}
        <path
          d={logoGeometry.clef.crown}
          stroke={`url(#clef_grad_${id})`}
          strokeWidth={logoGeometry.strokeWidths.clef}
          strokeLinecap="round"
          fill="none"
        />

        {/* Left Outer Belly */}
        <path
          d={logoGeometry.clef.leftBelly}
          stroke={`url(#clef_grad_${id})`}
          strokeWidth={logoGeometry.strokeWidths.clef}
          strokeLinecap="round"
          fill="none"
        />

        {/* Sculpture Tapered Crest Center Loop with Pike */}
        <path
          d={logoGeometry.clef.crest}
          fill={`url(#clef_grad_${id})`}
        />
      </g>
    </svg>
  );
}

export default LogoIcon;
