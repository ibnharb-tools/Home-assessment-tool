"use client";

import { useTheme } from "next-themes";
import { AnimatePresence, motion } from "framer-motion";
import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

/**
 * Animated light/dark theme toggle. Sun/moon icon transitions smoothly.
 * Avoids hydration mismatch by only rendering the resolved icon after mount.
 */
export function ThemeToggle({ className }: { className?: string }) {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const isDark = resolvedTheme === "dark";
  // Before mount the theme is unknown on the server, so keep the label neutral
  // and stable to avoid a hydration mismatch; resolve it once mounted.
  const label = !mounted
    ? "Toggle theme"
    : isDark
      ? "Switch to light mode"
      : "Switch to dark mode";

  return (
    <button
      type="button"
      suppressHydrationWarning
      aria-label={label}
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className={cn(
        "relative inline-flex h-10 w-10 items-center justify-center rounded-full",
        "glass border border-line text-ink-soft",
        "transition-colors duration-200 hover:text-ink",
        className
      )}
    >
      <AnimatePresence mode="wait" initial={false}>
        {mounted && (
          <motion.span
            key={isDark ? "moon" : "sun"}
            initial={{ rotate: -90, opacity: 0, scale: 0.5 }}
            animate={{ rotate: 0, opacity: 1, scale: 1 }}
            exit={{ rotate: 90, opacity: 0, scale: 0.5 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="absolute inline-flex"
          >
            {isDark ? (
              <Moon size={18} className="text-energy" />
            ) : (
              <Sun size={18} className="text-solar" />
            )}
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  );
}
