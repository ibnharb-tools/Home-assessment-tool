/**
 * Minimal className combiner. Accepts strings, falsy values, and arrays;
 * filters out falsy entries and joins with spaces. Keeps us dependency-free
 * (no clsx / tailwind-merge) for the simple conditional-class needs here.
 */
export type ClassValue = string | number | false | null | undefined | ClassValue[];

export function cn(...inputs: ClassValue[]): string {
  const out: string[] = [];
  for (const input of inputs) {
    if (!input) continue;
    if (Array.isArray(input)) {
      const inner = cn(...input);
      if (inner) out.push(inner);
    } else {
      out.push(String(input));
    }
  }
  return out.join(" ");
}

/** Format a number as a localized currency string (USD, no decimals by default). */
export function formatCurrency(value: number, fractionDigits = 0): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  }).format(value);
}

/** Sum a RoomCounts-like object into a total room count. */
export function totalRooms(rooms: {
  bedrooms: number;
  bathrooms: number;
  living: number;
  kitchens: number;
  garages: number;
  other: number;
}): number {
  return (
    rooms.bedrooms +
    rooms.bathrooms +
    rooms.living +
    rooms.kitchens +
    rooms.garages +
    rooms.other
  );
}

/** Format a number with thousands separators. */
export function formatNumber(value: number, fractionDigits = 0): string {
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  }).format(value);
}
