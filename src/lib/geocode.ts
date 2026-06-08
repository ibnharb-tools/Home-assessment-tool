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

/**
 * Detect a raw "lat, lon" (or "lat lon") coordinate string and parse it.
 * Returns null if the input isn't a valid coordinate pair.
 */
export function parseCoordinates(input: string): GeocodeResult | null {
  const m = input
    .trim()
    .match(/^(-?\d{1,2}(?:\.\d+)?)\s*[, ]\s*(-?\d{1,3}(?:\.\d+)?)$/);
  if (!m) return null;
  const lat = parseFloat(m[1]);
  const lon = parseFloat(m[2]);
  if (Number.isNaN(lat) || Number.isNaN(lon)) return null;
  if (lat < -90 || lat > 90 || lon < -180 || lon > 180) return null;
  return {
    latitude: lat,
    longitude: lon,
    displayName: `${lat.toFixed(4)}, ${lon.toFixed(4)}`,
  };
}

export async function geocodeAddress(
  address: string
): Promise<GeocodeResult | null> {
  // 1) If the user entered coordinates directly, use them — most precise.
  const coords = parseCoordinates(address);
  if (coords) return coords;

  // 2) Otherwise geocode the address or postal code via Nominatim.
  //    addressdetails=1 helps Nominatim resolve postal codes more precisely.
  const url = `${NOMINATIM}?q=${encodeURIComponent(
    address
  )}&format=json&limit=1&addressdetails=1`;

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
