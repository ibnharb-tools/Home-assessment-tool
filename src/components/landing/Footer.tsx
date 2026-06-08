import Link from "next/link";
import { Logo } from "@/components/ui";

export function Footer() {
  return (
    <footer className="border-t border-line">
      <div className="mx-auto max-w-[1200px] px-6 py-20 md:px-8">
        {/* Statement close (Ft5) */}
        <p className="max-w-[20ch] font-display text-3xl font-bold leading-[1.1] tracking-tight md:text-5xl">
          The future of energy, intelligently designed.
        </p>

        <div className="mt-16 flex flex-col gap-8 border-t border-line pt-8 md:flex-row md:items-center md:justify-between">
          <Logo />
          <nav className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-ink-soft">
            <Link href="/#how-it-works" className="hover:text-ink">
              How it works
            </Link>
            <Link href="/about" className="hover:text-ink">
              About
            </Link>
            <Link href="/future" className="hover:text-ink">
              What&apos;s next
            </Link>
            <Link href="#" className="hover:text-ink">
              Privacy
            </Link>
          </nav>
          <p className="text-xs text-ink-faint">
            © {new Date().getFullYear()} Everstead
          </p>
        </div>
      </div>
    </footer>
  );
}
