/**
 * Geocoding via Nominatim (OpenStreetMap). No API key required.
 * Nominatim usage policy requires a descriptive User-Agent / Referer.
 */

export interface GeocodeResult {
  latitude: number;
  longitude: number;
  displayName: string;
}

const NOMINATIM = "https://nominatim.openstreetmap.org/search";

export async function geocodeAddress(
  address: string
): Promise<GeocodeResult | null> {
  const url = `${NOMINATIM}?q=${encodeURIComponent(
    address
  )}&format=json&limit=1&addressdetails=0`;

  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent": "Everstead/1.0 (renewable energy assessment MVP)",
        Accept: "application/json",
      },
      // Coordinates for an address are stable; cache for a day.
      next: { revalidate: 86400 },
    });
    if (!res.ok) return null;
    const data = (await res.json()) as Array<{
      lat: string;
      lon: string;
      display_name: string;
    }>;
    if (!Array.isArray(data) || data.length === 0) return null;
    const top = data[0];
    return {
      latitude: parseFloat(top.lat),
      longitude: parseFloat(top.lon),
      displayName: top.display_name,
    };
  } catch {
    return null;
  }
}
