"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { Logo, ThemeToggle, Button } from "@/components/ui";
import { cn } from "@/lib/utils";

const links = [
  { label: "How it works", href: "#how-it-works" },
  { label: "Capabilities", href: "#capabilities" },
];

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <motion.nav
        initial={{ y: -24, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className={cn(
          "mx-auto flex max-w-[1200px] items-center justify-between px-6 transition-all duration-300 md:px-8",
          scrolled
            ? "mt-3 rounded-panel glass-strong py-3"
            : "mt-0 bg-transparent py-5"
        )}
      >
        <Logo />

        {/* Desktop links */}
        <div className="hidden items-center gap-1 md:flex">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="rounded-full px-4 py-2 text-sm font-medium text-ink-soft transition-colors hover:bg-surface/60 hover:text-ink"
            >
              {l.label}
            </Link>
          ))}
          <div className="mx-2 h-6 w-px bg-line" />
          <ThemeToggle />
          <Link href="/my-assessments" className="ml-1">
            <Button variant="ghost" size="sm">
              Sign in
            </Button>
          </Link>
        </div>

        {/* Mobile controls */}
        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />
          <button
            type="button"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((o) => !o)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full glass border border-line text-ink"
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </motion.nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="mx-4 mt-2 rounded-panel glass-strong p-4 md:hidden"
          >
            <div className="flex flex-col gap-1">
              {links.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="rounded-btn px-4 py-3 text-base font-medium text-ink-soft hover:bg-surface/60 hover:text-ink"
                >
                  {l.label}
                </Link>
              ))}
              <Link
                href="/my-assessments"
                onClick={() => setOpen(false)}
                className="rounded-btn px-4 py-3 text-base font-medium text-energy hover:bg-surface/60"
              >
                Sign in
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
