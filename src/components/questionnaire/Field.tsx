import type { ReactNode } from "react";

/** Consistent label + helper wrapper for a questionnaire field group. */
export function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <div>
      <div className="mb-3">
        <h3 className="font-display text-lg font-semibold text-ink">{label}</h3>
        {hint && <p className="mt-1 text-sm text-ink-faint">{hint}</p>}
      </div>
      {children}
    </div>
  );
}
