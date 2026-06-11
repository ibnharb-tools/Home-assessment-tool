"use client";

import { useMemo, useState, useEffect } from "react";
import { AnimatePresence, motion, useMotionValue } from "framer-motion";
import { buildFloorPlan } from "@/lib/floorplan";
import { Icon } from "@/components/ui/Icon";
import type { QuestionnaireData, PlacedRoom, RenewableSystem } from "@/types";
import { cn } from "@/lib/utils";

const CANVAS_SIZE = 500; // square canvas px
const PAD = 1.5;          // grid-unit breathing room around the plan

const ROOM_STYLE: Record<string, { bg: string; border: string; text: string }> = {
  living: { bg: "bg-energy/8", border: "border-energy/35", text: "text-energy" },
  kitchens: { bg: "bg-solar/8", border: "border-solar/35", text: "text-solar" },
  bedrooms: { bg: "bg-wind/8", border: "border-wind/35", text: "text-wind" },
  bathrooms: { bg: "bg-energy-dim/8", border: "border-energy-dim/35", text: "text-energy-dim" },
  garages: { bg: "bg-surface/60", border: "border-line", text: "text-ink-faint" },
  other: { bg: "bg-surface/40", border: "border-line", text: "text-ink-faint" },
};

const SYSTEM_META: Record<string, { icon: string; label: string; cls: string }> = {
  solar: { icon: "Sun", label: "Solar", cls: "bg-solar/15 border-solar/40 text-solar" },
  wind: { icon: "Wind", label: "Wind", cls: "bg-wind/15 border-wind/40 text-wind" },
  geothermal: { icon: "Waves", label: "Geo", cls: "bg-energy/15 border-energy/40 text-energy" },
  battery: { icon: "BatteryCharging", label: "Battery", cls: "bg-savings/15 border-savings/40 text-savings" },
};

interface PosOverride { x: number; y: number; }
interface Overrides {
  positions: Record<string, PosOverride>;
  floors: Record<string, number>;
}

// ── Draggable room tile ─────────────────────────────────────────────────────
function RoomTile({
  room,
  cellPx,
  planW,
  planH,
  floorCount,
  posOverride,
  interactive,
  onPositionChange,
  onFloorChange,
}: {
  room: PlacedRoom;
  cellPx: number;
  planW: number;
  planH: number;
  floorCount: number;
  posOverride?: PosOverride;
  interactive: boolean;
  onPositionChange: (id: string, x: number, y: number) => void;
  onFloorChange: (id: string, floor: number) => void;
}) {
  const s = ROOM_STYLE[room.kind] ?? ROOM_STYLE.other;
  const effectiveX = posOverride?.x ?? room.x;
  const effectiveY = posOverride?.y ?? room.y;

  const mx = useMotionValue((effectiveX + PAD) * cellPx);
  const my = useMotionValue((effectiveY + PAD) * cellPx);

  // Keep motion values in sync when plan recalculates or canvas resizes
  useEffect(() => { mx.set((effectiveX + PAD) * cellPx); }, [effectiveX, cellPx]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => { my.set((effectiveY + PAD) * cellPx); }, [effectiveY, cellPx]); // eslint-disable-line react-hooks/exhaustive-deps

  const w = room.w * cellPx;
  const h = room.h * cellPx;
  const showLabel = Math.min(w, h) >= 36;
  const fontSize = Math.max(9, Math.min(14, cellPx * 0.44));

  const [isHovered, setIsHovered] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  return (
    <motion.div
      key={room.id}
      initial={{ scale: 0.75, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.75, opacity: 0 }}
      transition={{ type: "spring", stiffness: 380, damping: 26 }}
      drag={interactive}
      dragMomentum={false}
      dragElastic={0}
      dragConstraints={{
        left: PAD * cellPx,
        top: PAD * cellPx,
        right: (planW - room.w + PAD) * cellPx,
        bottom: (planH - room.h + PAD) * cellPx,
      }}
      style={{
        x: mx,
        y: my,
        position: "absolute",
        left: 0,
        top: 0,
        width: w,
        height: h,
        zIndex: isDragging || isHovered ? 20 : 1,
        touchAction: "none",
      }}
      className={cn(
        "flex items-center justify-center overflow-visible rounded-[5px] border shadow-sm select-none",
        s.bg,
        s.border,
        interactive ? (isDragging ? "cursor-grabbing" : "cursor-grab") : "cursor-default"
      )}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => !isDragging && setIsHovered(false)}
      onDragStart={() => { setIsDragging(true); setIsHovered(true); }}
      onDragEnd={() => {
        setIsDragging(false);
        setIsHovered(false);
        const gx = Math.max(0, Math.min(planW - room.w, (mx.get() - PAD * cellPx) / cellPx));
        const gy = Math.max(0, Math.min(planH - room.h, (my.get() - PAD * cellPx) / cellPx));
        onPositionChange(room.id, gx, gy);
      }}
    >
      {showLabel && (
        <span
          className={cn(
            "pointer-events-none break-words px-1.5 text-center font-sans font-semibold leading-tight",
            s.text
          )}
          style={{ fontSize }}
        >
          {room.label}
        </span>
      )}

      {/* Floor-switch controls shown on hover */}
      <AnimatePresence>
        {interactive && isHovered && !isDragging && floorCount > 1 && (
          <motion.div
            initial={{ opacity: 0, y: 4, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.9 }}
            transition={{ duration: 0.1 }}
            className="absolute -bottom-8 left-1/2 flex -translate-x-1/2 gap-1 whitespace-nowrap rounded-md border border-line bg-elevated px-2 py-1 shadow-lg"
            style={{ zIndex: 30 }}
            onPointerDown={(e) => e.stopPropagation()}
          >
            {room.floor > 0 && (
              <button
                type="button"
                className="rounded px-1.5 py-0.5 text-[9px] font-bold text-ink-soft transition-colors hover:text-energy"
                onClick={(e) => { e.stopPropagation(); onFloorChange(room.id, room.floor - 1); }}
              >
                ↓ {room.floor - 1 === 0 ? "Ground" : `Floor ${room.floor - 1}`}
              </button>
            )}
            {room.floor < floorCount - 1 && (
              <button
                type="button"
                className="rounded px-1.5 py-0.5 text-[9px] font-bold text-ink-soft transition-colors hover:text-energy"
                onClick={(e) => { e.stopPropagation(); onFloorChange(room.id, room.floor + 1); }}
              >
                ↑ Floor {room.floor + 1}
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ── Main component ──────────────────────────────────────────────────────────
export function FloorPlanPreview({
  data,
  systems = [],
  className,
  interactive = true,
}: {
  data: QuestionnaireData;
  systems?: RenewableSystem[];
  className?: string;
  interactive?: boolean;
}) {
  const [activeFloor, setActiveFloor] = useState(0);
  const [overrides, setOverrides] = useState<Overrides>({ positions: {}, floors: {} });

  const plan = useMemo(
    () => buildFloorPlan(data, systems),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [JSON.stringify(data), JSON.stringify(systems)]
  );

  // Reset overrides whenever the room composition changes
  const roomsKey = plan.rooms.map((r) => r.id).join(",");
  useEffect(() => {
    setOverrides({ positions: {}, floors: {} });
  }, [roomsKey]); // eslint-disable-line react-hooks/exhaustive-deps

  const floorCount = plan.floors;
  const floor = Math.min(activeFloor, floorCount - 1);

  // Cell size: fit plan (+ padding) within CANVAS_SIZE on both axes
  const totalW = plan.width + PAD * 2;
  const totalH = plan.height + PAD * 2;
  const cellPx = Math.max(16, Math.min(44, Math.min(CANVAS_SIZE / totalW, CANVAS_SIZE / totalH)));
  const canvasW = totalW * cellPx;
  const canvasH = totalH * cellPx;

  // Effective room floor (with overrides applied)
  const effectiveRooms = plan.rooms.map((r) => ({
    ...r,
    floor: overrides.floors[r.id] ?? r.floor,
  }));

  const rooms = effectiveRooms.filter((r) => r.floor === floor);
  const appliances = plan.appliances.filter((a) => {
    const parent = effectiveRooms.find((r) => r.id === a.roomId);
    return (parent?.floor ?? a.floor) === floor;
  });
  const floorSystems = plan.systems.filter(
    (s) => s.floor === floor || (s.outdoor && floor === 0)
  );

  const isEmpty = rooms.length === 0;

  const handlePositionChange = (id: string, x: number, y: number) => {
    setOverrides((prev) => ({
      ...prev,
      positions: { ...prev.positions, [id]: { x, y } },
    }));
  };

  const handleFloorChange = (id: string, newFloor: number) => {
    setOverrides((prev) => {
      const { [id]: _removed, ...restPos } = prev.positions;
      return {
        floors: { ...prev.floors, [id]: newFloor },
        positions: restPos,
      };
    });
    setActiveFloor(newFloor);
  };

  return (
    <div
      className={cn(
        "overflow-hidden rounded-[18px] border border-line bg-elevated shadow-sm",
        className
      )}
      style={{ width: CANVAS_SIZE }}
    >
      {/* Header */}
      <div className="flex h-11 items-center justify-between border-b border-line px-4">
        <span className="caption text-ink-faint">Floor plan</span>
        <div className="flex items-center gap-3">
          {interactive && (
            <span className="text-[10px] text-ink-faint">Drag to arrange</span>
          )}
          {floorCount > 1 && (
            <div className="flex gap-1">
              {Array.from({ length: floorCount }).map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setActiveFloor(i)}
                  className={cn(
                    "rounded-md px-2.5 py-1 text-[11px] font-semibold transition-colors",
                    floor === i
                      ? "bg-energy text-[var(--accent-ink)]"
                      : "text-ink-faint hover:text-ink"
                  )}
                >
                  {i === 0 ? "G" : `F${i}`}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Canvas — always 500×500, plan centered within */}
      <div
        className="relative overflow-hidden"
        style={{
          width: CANVAS_SIZE,
          height: CANVAS_SIZE,
          backgroundImage: `
            linear-gradient(to right, color-mix(in srgb, var(--energy-primary) 7%, transparent) 1px, transparent 1px),
            linear-gradient(to bottom, color-mix(in srgb, var(--energy-primary) 7%, transparent) 1px, transparent 1px)
          `,
          backgroundSize: `${cellPx}px ${cellPx}px`,
          backgroundPosition: `${((CANVAS_SIZE - canvasW) / 2) % cellPx}px ${((CANVAS_SIZE - canvasH) / 2) % cellPx}px`,
        }}
      >
        {isEmpty ? (
          <div className="flex h-full items-center justify-center text-sm text-ink-faint">
            Add rooms to see your layout
          </div>
        ) : (
          /* Plan area — centered in the 500×500 canvas */
          <div
            className="relative"
            style={{
              position: "absolute",
              width: canvasW,
              height: canvasH,
              left: (CANVAS_SIZE - canvasW) / 2,
              top: (CANVAS_SIZE - canvasH) / 2,
            }}
          >
            {/* Rooms */}
            <AnimatePresence mode="popLayout">
              {rooms.map((room) => (
                <RoomTile
                  key={room.id}
                  room={room}
                  cellPx={cellPx}
                  planW={plan.width}
                  planH={plan.height}
                  floorCount={floorCount}
                  posOverride={overrides.positions[room.id]}
                  interactive={interactive}
                  onPositionChange={handlePositionChange}
                  onFloorChange={handleFloorChange}
                />
              ))}
            </AnimatePresence>

            {/* Appliance dots — move with room overrides on update */}
            <AnimatePresence>
              {appliances.map((appl) => {
                const parent = effectiveRooms.find((r) => r.id === appl.roomId);
                const posOvr = parent ? overrides.positions[parent.id] : undefined;
                const dx = posOvr ? posOvr.x - (parent?.x ?? 0) : 0;
                const dy = posOvr ? posOvr.y - (parent?.y ?? 0) : 0;
                const ax = (appl.x + dx + PAD) * cellPx - 12;
                const ay = (appl.y + dy + PAD) * cellPx - 12;
                return (
                  <motion.div
                    key={appl.id}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1, x: ax, y: ay }}
                    exit={{ scale: 0, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 500, damping: 28 }}
                    title={appl.label}
                    className="pointer-events-none absolute flex h-[22px] w-[22px] items-center justify-center rounded-full bg-elevated ring-1 ring-line shadow-sm"
                    style={{ left: 0, top: 0 }}
                  >
                    <Icon name={appl.icon} size={12} className="text-energy" strokeWidth={2.5} />
                  </motion.div>
                );
              })}
            </AnimatePresence>

            {/* System badges */}
            <AnimatePresence>
              {floorSystems.map((sys) => {
                const meta = SYSTEM_META[sys.system] ?? SYSTEM_META.battery;
                const rawX = (sys.x + PAD) * cellPx - 26;
                const rawY = (sys.y + PAD) * cellPx - 13;
                const bx = Math.max(4, Math.min(canvasW - 60, rawX));
                const by = Math.max(4, Math.min(canvasH - 26, rawY));
                return (
                  <motion.div
                    key={sys.id}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 450, damping: 28, delay: 0.05 }}
                    style={{ position: "absolute", left: bx, top: by }}
                    className={cn(
                      "flex items-center gap-1 rounded-md border px-2 py-1 text-[10px] font-semibold shadow-sm",
                      meta.cls
                    )}
                  >
                    <Icon name={meta.icon} size={11} strokeWidth={2.5} />
                    {meta.label}
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Footer */}
      {!isEmpty && (
        <div className="border-t border-line px-4 py-2 text-center text-[11px] text-ink-faint">
          {plan.floors} floor{plan.floors !== 1 ? "s" : ""} · ~{plan.width}
          &thinsp;&times;&thinsp;{plan.height}&thinsp;m
          {interactive && (
            <span className="ml-2 opacity-60">· Hover a room to change floors</span>
          )}
        </div>
      )}
    </div>
  );
}
