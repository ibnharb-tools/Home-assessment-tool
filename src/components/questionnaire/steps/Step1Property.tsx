"use client";

import { useQuestionnaireStore } from "@/store/questionnaire";
import { PROPERTY_TYPES, ROOM_TYPES } from "@/lib/questionnaire-options";
import { Field } from "../Field";
import { SelectableCard } from "../SelectableCard";
import { NumberStepper } from "../NumberStepper";
import { SegmentedControl } from "../SegmentedControl";
import { Input } from "@/components/ui";
import { Icon } from "@/components/ui/Icon";
import { totalRooms } from "@/lib/utils";
import type { AreaUnit, Ownership, PropertyType, RoomCounts } from "@/types";

export function Step1Property() {
  const { data, setData } = useQuestionnaireStore();

  const setRoom = (key: keyof RoomCounts, value: number) =>
    setData({ rooms: { ...data.rooms, [key]: value } });

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

      <Field
        label="How many rooms of each type?"
        hint={`We'll total these up (currently ${totalRooms(data.rooms)} room${totalRooms(data.rooms) === 1 ? "" : "s"}).`}
      >
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {ROOM_TYPES.map((rt) => (
            <div
              key={rt.id}
              className="flex items-center justify-between gap-3 rounded-card border border-line bg-elevated p-4"
            >
              <span className="flex min-w-0 items-center gap-2.5">
                <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-btn bg-surface text-energy">
                  <Icon name={rt.icon} size={18} />
                </span>
                <span className="truncate text-sm font-medium text-ink">
                  {rt.label}
                </span>
              </span>
              <NumberStepper
                value={data.rooms[rt.id as keyof RoomCounts]}
                min={0}
                max={30}
                onChange={(v) => setRoom(rt.id as keyof RoomCounts, v)}
              />
            </div>
          ))}
        </div>
      </Field>

      <div className="grid gap-8 sm:grid-cols-2">
        <Field label="How many floors?">
          <NumberStepper
            value={data.floors}
            min={1}
            max={6}
            onChange={(floors) => setData({ floors })}
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
