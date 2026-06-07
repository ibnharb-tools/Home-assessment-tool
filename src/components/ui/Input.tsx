"use client";

import { cn } from "@/lib/utils";
import { forwardRef, type InputHTMLAttributes, type ReactNode } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  hint?: string;
  error?: string;
  /** Optional leading icon node. */
  icon?: ReactNode;
  /** Optional trailing adornment (e.g. unit toggle, button). */
  trailing?: ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, hint, error, icon, trailing, className, id, ...props },
  ref
) {
  const inputId = id || props.name;
  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={inputId}
          className="mb-2 block text-sm font-medium text-ink-soft"
        >
          {label}
        </label>
      )}
      <div
        className={cn(
          "group flex items-center gap-3 rounded-btn bg-surface px-4 py-3 transition-all duration-200",
          "border border-line focus-within:border-line-glow",
          "focus-within:shadow-[inset_0_0_0_1px_var(--border-glow),0_0_18px_color-mix(in_srgb,var(--energy-primary)_20%,transparent)]",
          error && "border-[#ff6b6b]"
        )}
      >
        {icon && <span className="text-ink-faint shrink-0">{icon}</span>}
        <input
          ref={ref}
          id={inputId}
          className={cn(
            "w-full bg-transparent text-ink placeholder:text-ink-faint outline-none",
            "text-base",
            className
          )}
          {...props}
        />
        {trailing && <span className="shrink-0">{trailing}</span>}
      </div>
      {error ? (
        <p className="mt-2 text-sm text-[#ff6b6b]">{error}</p>
      ) : hint ? (
        <p className="mt-2 text-sm text-ink-faint">{hint}</p>
      ) : null}
    </div>
  );
});
