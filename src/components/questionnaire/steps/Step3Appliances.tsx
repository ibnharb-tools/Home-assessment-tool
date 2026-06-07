"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useQuestionnaireStore } from "@/store/questionnaire";
import {
  APPLIANCES,
  USAGE_FREQUENCIES,
} from "@/lib/questionnaire-options";
import { Field } from "../Field";
import { SelectableCard } from "../SelectableCard";
import { NumberStepper } from "../NumberStepper";
import { SegmentedControl } from "../SegmentedControl";
import { Icon } from "@/components/ui/Icon";
import type { LightingType, UsageFrequency } from "@/types";

export function Step3Appliances() {
  const { data, setData, toggleAppliance, updateAppliance } =
    useQuestionnaireStore();

  const selected = data.appliances;
  const labelOf = (id: string) =>
    APPLIANCES.find((a) => a.id === id)?.label ?? id;
  const iconOf = (id: string) =>
    APPLIANCES.find((a) => a.id === id)?.icon ?? "Plus";

  return (
    <div className="space-y-8">
      <Field
        label="Which appliances do you use?"
        hint="Select all that apply. We use built-in wattage and usage assumptions, so you don't need any technical details."
      >
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {APPLIANCES.map((a) => (
            <SelectableCard
              key={a.id}
              label={a.label}
              iconName={a.icon}
              multi
              selected={selected.some((s) => s.id === a.id)}
              onSelect={() => toggleAppliance(a.id)}
            />
          ))}
        </div>
      </Field>

      <AnimatePresence initial={false}>
        {selected.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <Field label="How often do you use them?">
              <div className="space-y-3">
                {selected.map((sel) => (
                  <div
                    key={sel.id}
                    className="flex flex-col gap-4 rounded-card border border-line bg-elevated p-4 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-btn bg-surface text-energy">
                        <Icon name={iconOf(sel.id)} size={18} />
                      </span>
                      <span className="font-medium text-ink [overflow-wrap:anywhere]">
                        {labelOf(sel.id)}
                      </span>
                    </div>

                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                      {sel.id === "lighting" ? (
                        <div className="sm:w-72">
                          <SegmentedControl<LightingType>
                            size="sm"
                            ariaLabel="Lighting type"
                            options={[
                              { id: "led", label: "LED" },
                              { id: "incandescent", label: "Incandescent" },
                              { id: "mixed", label: "Mixed" },
                            ]}
                            value={data.lightingType}
                            onChange={(lightingType) =>
                              setData({ lightingType })
                            }
                          />
                        </div>
                      ) : (
                        <NumberStepper
                          value={sel.quantity}
                          min={1}
                          max={20}
                          onChange={(quantity) =>
                            updateAppliance(sel.id, { quantity })
                          }
                        />
                      )}

                      <div className="sm:w-72">
                        <SegmentedControl<UsageFrequency>
                          size="sm"
                          ariaLabel="Usage frequency"
                          options={USAGE_FREQUENCIES}
                          value={sel.frequency}
                          onChange={(frequency) =>
                            updateAppliance(sel.id, { frequency })
                          }
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Field>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
