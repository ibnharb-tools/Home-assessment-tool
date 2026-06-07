"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useQuestionnaireStore } from "@/store/questionnaire";
import { GRID_OPTIONS, EXISTING_RENEWABLES } from "@/lib/questionnaire-options";
import { Field } from "../Field";
import { SelectableCard } from "../SelectableCard";
import { SegmentedControl } from "../SegmentedControl";
import { Input } from "@/components/ui";
import { Zap } from "lucide-react";
import type { GridConnection } from "@/types";

export function Step2Energy() {
  const { data, setData, toggleArrayValue } = useQuestionnaireStore();

  return (
    <div className="space-y-8">
      <Field label="How is your property connected to the grid?">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {GRID_OPTIONS.map((g) => (
            <SelectableCard
              key={g.id}
              label={g.label}
              description={g.desc}
              iconName={g.icon}
              selected={data.gridConnection === g.id}
              onSelect={() =>
                setData({ gridConnection: g.id as GridConnection })
              }
            />
          ))}
        </div>
      </Field>

      <Field label="Do you currently have any renewable energy?">
        <div className="sm:max-w-xs">
          <SegmentedControl
            ariaLabel="Has renewables"
            options={[
              { id: "yes", label: "Yes" },
              { id: "no", label: "No" },
            ]}
            value={data.hasRenewables ? "yes" : "no"}
            onChange={(v) => setData({ hasRenewables: v === "yes" })}
          />
        </div>

        <AnimatePresence initial={false}>
          {data.hasRenewables && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25 }}
              className="overflow-hidden"
            >
              <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
                {EXISTING_RENEWABLES.map((r) => (
                  <SelectableCard
                    key={r.id}
                    label={r.label}
                    iconName={r.icon}
                    multi
                    selected={data.existingRenewables.includes(r.id)}
                    onSelect={() =>
                      toggleArrayValue("existingRenewables", r.id)
                    }
                  />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </Field>

      <Field
        label="Average daily electricity usage (optional)"
        hint="Don't know? No problem — we'll estimate it from your appliances."
      >
        <div className="sm:max-w-xs">
          <Input
            type="number"
            inputMode="decimal"
            min={0}
            icon={<Zap size={18} />}
            placeholder="e.g. 18"
            trailing={<span className="text-sm text-ink-faint">kWh</span>}
            value={data.dailyKwh ?? ""}
            onChange={(e) =>
              setData({
                dailyKwh:
                  e.target.value === "" ? undefined : Number(e.target.value),
              })
            }
          />
        </div>
      </Field>
    </div>
  );
}
