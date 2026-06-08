"use client";

import type { ReactNode } from "react";
import { useMounted } from "@/lib/useMounted";

/**
 * Renders a fixed-height frame and only mounts its (Recharts) children on the
 * client, once the container has real dimensions. Keeps the reserved height so
 * there's no layout shift, and avoids the ResponsiveContainer width/height
 * warning during static prerender.
 */
export function ChartReady({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const mounted = useMounted();
  return <div className={className}>{mounted ? children : null}</div>;
}
