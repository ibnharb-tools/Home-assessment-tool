"use client";

import { useEffect, useState } from "react";

/**
 * Returns true once the component has mounted on the client. Used to defer
 * rendering of components that need real DOM dimensions (e.g. Recharts
 * ResponsiveContainer), which otherwise log width/height warnings during
 * static prerender where the container has no size.
 */
export function useMounted(): boolean {
  const [mounted, setMounted] = useState(false);
  // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time mount flag
  useEffect(() => setMounted(true), []);
  return mounted;
}
