import Link from "next/link";
import { Logo } from "@/components/ui";

export function Footer() {
  return (
    <footer className="glass-strong border-t border-line">
      <div className="mx-auto flex max-w-[1200px] flex-col items-center justify-between gap-6 px-6 py-10 md:flex-row md:px-8">
        <div className="flex flex-col items-center gap-3 md:items-start">
          <Logo />
          <p className="text-sm text-ink-faint">
            The future of energy, intelligently designed.
          </p>
        </div>

        <nav className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-ink-soft">
          <Link href="#how-it-works" className="hover:text-ink">
            How it works
          </Link>
          {/* Placeholder links for MVP */}
          <Link href="#" className="hover:text-ink">
            Privacy
          </Link>
          <Link href="#" className="hover:text-ink">
            Contact
          </Link>
        </nav>
      </div>
      <div className="border-t border-line py-5 text-center text-xs text-ink-faint">
        © {new Date().getFullYear()} Everstead. All rights reserved.
      </div>
    </footer>
  );
}
