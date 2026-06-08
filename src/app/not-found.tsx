import Link from "next/link";
import { Logo, Button } from "@/components/ui";

export default function NotFound() {
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <div className="ambient-glow pointer-events-none absolute inset-0 -z-10" />
      <div className="orb orb-energy orb-float -z-10 left-1/3 top-1/4 h-64 w-64" />

      <Logo size="lg" asLink={false} />
      <p className="caption mt-10 text-energy">Error 404</p>
      <h1 className="mt-3 font-display text-4xl font-extrabold md:text-5xl">
        This page drifted off-grid
      </h1>
      <p className="mt-3 max-w-md text-ink-soft">
        The page you&apos;re looking for doesn&apos;t exist or has moved. Let&apos;s
        get you back to charting your clean energy future.
      </p>
      <Link href="/" className="mt-8">
        <Button size="lg">Back to home</Button>
      </Link>
    </main>
  );
}
