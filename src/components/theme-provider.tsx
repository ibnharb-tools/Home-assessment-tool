"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import { MotionConfig } from "framer-motion";
import { ReactLenis } from "lenis/react";
import type { ComponentProps } from "react";

/**
 * App-wide theme provider.
 *
 * Uses next-themes with the `data-theme` attribute (matching the CSS in
 * globals.css which keys off [data-theme="light"] / [data-theme="dark"]).
 *
 * Defaults to LIGHT per the design spec. System preference is intentionally
 * not auto-applied so first-time visitors always get the bright, airy light
 * theme; users can switch and the choice is persisted to localStorage.
 */
export function ThemeProvider({
  children,
  ...props
}: ComponentProps<typeof NextThemesProvider>) {
  return (
    <NextThemesProvider
      attribute="data-theme"
      defaultTheme="light"
      enableSystem={false}
      disableTransitionOnChange={false}
      {...props}
    >
      <MotionConfig reducedMotion="user">
        <ReactLenis root options={{ lerp: 0.065, smoothWheel: true }}>
          {children}
        </ReactLenis>
      </MotionConfig>
    </NextThemesProvider>
  );
}
