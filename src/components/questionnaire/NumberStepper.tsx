"use client";

import { Minus, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

interface NumberStepperProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  label?: string;
  className?: string;
}

export function NumberStepper({
  value,
  onChange,
  min = 0,
  max = 99,
  step = 1,
  label,
  className,
}: NumberStepperProps) {
  const clamp = (v: number) => Math.max(min, Math.min(max, v));
  const dec = () => onChange(clamp(value - step));
  const inc = () => onChange(clamp(value + step));

  return (
    <div className={cn("w-full", className)}>
      {label && (
        <span className="mb-2 block text-sm font-medium text-ink-soft">
          {label}
        </span>
      )}
      <div className="inline-flex items-center gap-1 rounded-btn border border-line bg-surface p-1">
        <StepButton ariaLabel="Decrease" onClick={dec} disabled={value <= min}>
          <Minus size={18} />
        </StepButton>
        <input
          type="number"
          value={value}
          min={min}
          max={max}
          onChange={(e) => {
            const n = Number(e.target.value);
            if (!Number.isNaN(n)) onChange(clamp(n));
          }}
          aria-label={label}
          className="w-14 bg-transparent text-center font-mono text-lg font-medium text-ink outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
        />
        <StepButton ariaLabel="Increase" onClick={inc} disabled={value >= max}>
          <Plus size={18} />
        </StepButton>
      </div>
    </div>
  );
}

function StepButton({
  children,
  onClick,
  disabled,
  ariaLabel,
}: {
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
  ariaLabel: string;
}) {
  return (
    <button
      type="button"
      aria-label={ariaLabel}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "inline-flex h-10 w-10 items-center justify-center rounded-[9px] text-ink",
        "transition-colors duration-150 hover:bg-elevated hover:text-energy",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-energy/60",
        "disabled:opacity-40 disabled:pointer-events-none"
      )}
    >
      {children}
    </button>
  );
}
