"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";

/**
 * ============================================================================
 * LOGO PLACEHOLDER — user will replace with provided logo image.
 * Swap the contents of this component when the final logo is ready.
 *
 * For now it renders the wordmark "Everstead" in Sora 800 with a subtle
 * energy-gradient text fill and a small glowing spark mark beside it.
 * It is theme-aware (legible in both light and dark).
 * ============================================================================
 */
interface LogoProps {
  className?: string;
  /** Render as a link to home (default) or plain mark. */
  asLink?: boolean;
  size?: "sm" | "md" | "lg";
}

const sizes = {
  sm: "text-lg",
  md: "text-xl",
  lg: "text-2xl",
};

export function Logo({ className, asLink = true, size = "md" }: LogoProps) {
  const content = (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      {/* Glowing spark mark */}
      <span className="relative inline-flex h-7 w-7 items-center justify-center">
        <span className="absolute inset-0 rounded-[9px] bg-gradient-energy opacity-90" />
        <span className="absolute inset-0 rounded-[9px] bg-gradient-energy blur-md opacity-60" />
        <svg
          viewBox="0 0 24 24"
          className="relative h-4 w-4 text-[var(--bg-deepest)]"
          fill="currentColor"
          aria-hidden
        >
          {/* energy bolt */}
          <path d="M13 2 4.5 13.5H11l-1.5 8.5L20 9.5h-6.5L13 2Z" />
        </svg>
      </span>
      <span
        className={cn(
          "font-display font-extrabold tracking-tight text-gradient-energy",
          sizes[size]
        )}
      >
        Everstead
      </span>
    </span>
  );

  if (asLink) {
    return (
      <Link href="/" aria-label="Everstead home" className="inline-flex">
        {content}
      </Link>
    );
  }
  return content;
}
