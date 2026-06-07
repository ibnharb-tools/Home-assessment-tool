"use client";

import { useQuestionnaireStore } from "@/store/questionnaire";
import { GOALS, BUDGETS, TIMEFRAMES } from "@/lib/questionnaire-options";
import { Field } from "../Field";
import { SelectableCard } from "../SelectableCard";
import { cn } from "@/lib/utils";

export function Step4Goals() {
  const { data, setData, toggleArrayValue } = useQuestionnaireStore();

  return (
    <div className="space-y-8">
      <Field
        label="What matters most to you?"
        hint="Select all that apply."
      >
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {GOALS.map((g) => (
            <SelectableCard
              key={g.id}
              label={g.label}
              iconName={g.icon}
              multi
              selected={data.goals.includes(g.id)}
              onSelect={() => toggleArrayValue("goals", g.id)}
            />
          ))}
        </div>
      </Field>

      <Field label="What's your budget range?">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {BUDGETS.map((b) => (
            <Pill
              key={b.id}
              label={b.label}
              selected={data.budget === b.id}
              onClick={() => setData({ budget: b.id })}
            />
          ))}
        </div>
      </Field>

      <Field label="When are you looking to act?">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {TIMEFRAMES.map((t) => (
            <Pill
              key={t.id}
              label={t.label}
              selected={data.timeframe === t.id}
              onClick={() => setData({ timeframe: t.id })}
            />
          ))}
        </div>
      </Field>
    </div>
  );
}

function Pill({
  label,
  selected,
  onClick,
}: {
  label: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      onClick={onClick}
      className={cn(
        "min-h-[44px] rounded-btn border px-4 py-2.5 text-center text-sm font-medium transition-colors duration-200",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-energy/60",
        selected
          ? "border-line-glow bg-surface text-energy glow-energy"
          : "border-line bg-elevated text-ink-soft hover:border-energy-dim hover:text-ink"
      )}
    >
      {label}
    </button>
  );
}
