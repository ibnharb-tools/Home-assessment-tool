import type {
  FloorPlan,
  PlacedAppliance,
  PlacedRoom,
  PlacedSystem,
  QuestionnaireData,
  RenewableSystem,
  RoomKind,
} from "@/types";
import { APPLIANCES, ROOM_TYPES } from "./questionnaire-options";

/**
 * Deterministic 2D floor-plan generator. Turns the questionnaire (room counts,
 * floors, appliances, and optionally chosen renewable systems) into a structured
 * layout the UI renders live as the user answers. Pure data, no rendering —
 * coordinates are grid units (~1 m); the renderer scales to pixels.
 *
 * Visual reference for the renderer: https://floor-plan.ai/2d-floor-plan
 */

// Room footprints (grid units) by kind.
const ROOM_SIZE: Record<RoomKind, { w: number; h: number }> = {
  living: { w: 5, h: 4 },
  kitchens: { w: 4, h: 3 },
  bedrooms: { w: 4, h: 3 },
  bathrooms: { w: 3, h: 2 },
  garages: { w: 5, h: 4 },
  other: { w: 4, h: 3 },
};

const ROOM_LABEL: Record<RoomKind, string> = Object.fromEntries(
  ROOM_TYPES.map((r) => [r.id, r.label.replace(/s$/, "")])
) as Record<RoomKind, string>;

// Which room kind each appliance belongs in (first match wins).
const APPLIANCE_ROOM: Record<string, RoomKind> = {
  refrigerator: "kitchens",
  freezer: "kitchens",
  stove: "kitchens",
  microwave: "kitchens",
  dishwasher: "kitchens",
  washer: "bathrooms",
  dryer: "bathrooms",
  water_heater: "bathrooms",
  ac: "living",
  electric_heat: "living",
  heat_pump: "living",
  tv: "living",
  computer: "living",
  lighting: "living",
  ev_charger: "garages",
  well_pump: "garages",
  other: "other",
};

const FOOTPRINT_W = 16; // shelf-pack width per floor (grid units)

function applianceMeta(id: string) {
  const a = APPLIANCES.find((x) => x.id === id);
  return { label: a?.label ?? id, icon: a?.icon ?? "Plus" };
}

/** Expand RoomCounts into an ordered list of room-kind instances. */
function roomInstances(data: QuestionnaireData): RoomKind[] {
  const r = data.rooms;
  const out: RoomKind[] = [];
  const push = (kind: RoomKind, n: number) => {
    for (let i = 0; i < n; i++) out.push(kind);
  };
  // Ground-floor-first ordering.
  push("garages", r.garages);
  push("kitchens", r.kitchens);
  push("living", r.living);
  push("bathrooms", r.bathrooms);
  push("bedrooms", r.bedrooms);
  push("other", r.other);
  return out;
}

/** Assign room instances to floors: communal rooms on the ground floor, sleeping
 *  rooms on the upper floors (round-robin) when there is more than one floor. */
function assignFloors(rooms: RoomKind[], floors: number): RoomKind[][] {
  const n = Math.max(1, floors);
  const byFloor: RoomKind[][] = Array.from({ length: n }, () => []);
  if (n === 1) {
    byFloor[0] = rooms;
    return byFloor;
  }
  let upper = 1;
  let groundBath = false;
  for (const kind of rooms) {
    if (kind === "garages" || kind === "kitchens" || kind === "living") {
      byFloor[0].push(kind);
    } else if (kind === "bathrooms" && !groundBath) {
      byFloor[0].push(kind); // one bathroom on the ground floor
      groundBath = true;
    } else {
      byFloor[upper].push(kind);
      upper = upper >= n - 1 ? 1 : upper + 1; // round-robin upper floors
    }
  }
  return byFloor;
}

/** Shelf-pack a floor's rooms into the footprint width. */
function packFloor(
  kinds: RoomKind[],
  floor: number
): { rooms: PlacedRoom[]; width: number; height: number } {
  const rooms: PlacedRoom[] = [];
  let x = 0;
  let y = 0;
  let shelfH = 0;
  let maxX = 0;
  const counters: Record<string, number> = {};

  for (const kind of kinds) {
    const { w, h } = ROOM_SIZE[kind];
    if (x + w > FOOTPRINT_W && x > 0) {
      // wrap to next shelf
      y += shelfH;
      x = 0;
      shelfH = 0;
    }
    counters[kind] = (counters[kind] ?? 0) + 1;
    const total = kinds.filter((k) => k === kind).length;
    const label =
      total > 1 ? `${ROOM_LABEL[kind]} ${counters[kind]}` : ROOM_LABEL[kind];
    rooms.push({
      id: `f${floor}-${kind}-${counters[kind]}`,
      kind,
      label,
      floor,
      x,
      y,
      w,
      h,
    });
    x += w;
    shelfH = Math.max(shelfH, h);
    maxX = Math.max(maxX, x);
  }
  return { rooms, width: maxX, height: y + shelfH };
}

function placeAppliances(
  data: QuestionnaireData,
  rooms: PlacedRoom[]
): PlacedAppliance[] {
  const placed: PlacedAppliance[] = [];
  const perRoom: Record<string, number> = {};
  for (const sel of data.appliances) {
    const kind = APPLIANCE_ROOM[sel.id] ?? "other";
    // Prefer a room of the right kind; fall back to living, then any room.
    const room =
      rooms.find((r) => r.kind === kind) ??
      rooms.find((r) => r.kind === "living") ??
      rooms[0];
    if (!room) continue;
    const meta = applianceMeta(sel.id);
    const i = (perRoom[room.id] = (perRoom[room.id] ?? 0) + 1) - 1;
    const cols = Math.max(1, room.w - 1);
    placed.push({
      id: `${room.id}-${sel.id}`,
      applianceId: sel.id,
      label: meta.label,
      icon: meta.icon,
      roomId: room.id,
      floor: room.floor,
      x: room.x + 0.6 + (i % cols),
      y: room.y + 0.6 + Math.floor(i / cols) * 0.9,
    });
  }
  return placed;
}

function placeSystems(
  systems: RenewableSystem[],
  width: number,
  height: number,
  floors: number,
  rooms: PlacedRoom[]
): PlacedSystem[] {
  const out: PlacedSystem[] = [];
  const top = floors - 1;
  for (const s of systems) {
    if (s === "solar") {
      out.push({ id: "sys-solar", system: "solar", label: "Solar panels", floor: top, x: width * 0.5, y: -1.2, outdoor: false });
    } else if (s === "wind") {
      out.push({ id: "sys-wind", system: "wind", label: "Wind turbine", floor: 0, x: width + 3, y: height - 2, outdoor: true });
    } else if (s === "geothermal") {
      out.push({ id: "sys-geo", system: "geothermal", label: "Geothermal loop", floor: 0, x: -3, y: height + 2, outdoor: true });
    } else if (s === "battery") {
      const garage = rooms.find((r) => r.kind === "garages");
      out.push({
        id: "sys-battery",
        system: "battery",
        label: "Battery",
        floor: garage?.floor ?? 0,
        x: garage ? garage.x + garage.w - 1.2 : width + 2,
        y: garage ? garage.y + garage.h - 1.2 : height - 1,
        outdoor: !garage,
      });
    }
  }
  return out;
}

export function buildFloorPlan(
  data: QuestionnaireData,
  systems: RenewableSystem[] = []
): FloorPlan {
  const floors = Math.max(1, data.floors || 1);
  const byFloor = assignFloors(roomInstances(data), floors);

  let allRooms: PlacedRoom[] = [];
  let width = 0;
  let height = 0;
  byFloor.forEach((kinds, floor) => {
    const packed = packFloor(kinds, floor);
    allRooms = allRooms.concat(packed.rooms);
    width = Math.max(width, packed.width);
    height = Math.max(height, packed.height);
  });
  // Sensible minimum footprint even with no rooms yet.
  width = Math.max(width, 8);
  height = Math.max(height, 6);

  const appliances = placeAppliances(data, allRooms);
  const placedSystems = placeSystems(systems, width, height, floors, allRooms);

  return {
    floors,
    width,
    height,
    rooms: allRooms,
    appliances,
    systems: placedSystems,
  };
}
