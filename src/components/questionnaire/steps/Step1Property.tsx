"use client";

import { useQuestionnaireStore } from "@/store/questionnaire";
import { PROPERTY_TYPES } from "@/lib/questionnaire-options";
import { Field } from "../Field";
import { SelectableCard } from "../SelectableCard";
import { NumberStepper } from "../NumberStepper";
import { SegmentedControl } from "../SegmentedControl";
import { Input } from "@/components/ui";
import type { AreaUnit, Ownership, PropertyType } from "@/types";

export function Step1Property() {
  const { data, setData } = useQuestionnaireStore();

  return (
    <div className="space-y-8">
      <Field label="What type of property is it?">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {PROPERTY_TYPES.map((p) => (
            <SelectableCard
              key={p.id}
              label={p.label}
              iconName={p.icon}
              selected={data.propertyType === p.id}
              onSelect={() => setData({ propertyType: p.id as PropertyType })}
            />
          ))}
        </div>
      </Field>

      <div className="grid gap-8 sm:grid-cols-2">
        <Field label="Number of rooms">
          <NumberStepper
            value={data.rooms}
            min={1}
            max={50}
            onChange={(rooms) => setData({ rooms })}
          />
        </Field>

        <Field label="People living there">
          <NumberStepper
            value={data.occupants}
            min={1}
            max={50}
            onChange={(occupants) => setData({ occupants })}
          />
        </Field>
      </div>

      <Field
        label="Approximate floor area"
        hint="A rough estimate is fine — we'll work with it."
      >
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="flex-1">
            <Input
              type="number"
              inputMode="numeric"
              min={0}
              placeholder="e.g. 1500"
              value={data.floorArea ?? ""}
              onChange={(e) =>
                setData({
                  floorArea:
                    e.target.value === "" ? undefined : Number(e.target.value),
                })
              }
            />
          </div>
          <div className="sm:w-44">
            <SegmentedControl<AreaUnit>
              ariaLabel="Area unit"
              options={[
                { id: "sqft", label: "sq ft" },
                { id: "sqm", label: "sq m" },
              ]}
              value={data.areaUnit}
              onChange={(areaUnit) => setData({ areaUnit })}
            />
          </div>
        </div>
      </Field>

      <Field label="Do you own or rent?">
        <div className="sm:max-w-xs">
          <SegmentedControl<Ownership>
            ariaLabel="Ownership"
            options={[
              { id: "own", label: "Own" },
              { id: "rent", label: "Rent" },
            ]}
            value={data.ownership}
            onChange={(ownership) => setData({ ownership })}
          />
        </div>
      </Field>
    </div>
  );
}
