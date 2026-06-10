import { NextResponse } from "next/server";
import type { Assessment, QuestionnaireData } from "@/types";
import { geocodeAddress } from "@/lib/geocode";
import { getClimateData } from "@/lib/climate";
import { getResources, type ResourceBundle } from "@/lib/resources";
import { buildAssessment, hasAnthropicKey } from "@/lib/anthropic";
import { buildMockAssessment } from "@/lib/mock";
import { logAssessment } from "@/lib/logging";

// The AI call can take a while; allow up to 60s on platforms that honor this.
export const maxDuration = 60;

export async function POST(req: Request) {
  let data: QuestionnaireData;
  try {
    const body = await req.json();
    data = body.questionnaireData as QuestionnaireData;
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  if (!data?.address || data.address.trim().length < 3) {
    return NextResponse.json(
      { error: "An address is required to generate an assessment." },
      { status: 422 }
    );
  }

  // 1) Geocode the address. If geocoding is unavailable (service down, rate
  //    limited, or blocked), degrade gracefully rather than hard-failing —
  //    we still produce an estimate using the address text and regional
  //    defaults, flagged as approximate.
  const geo = await geocodeAddress(data.address);
  const located = geo !== null;
  const resolved = geo ?? {
    latitude: 0,
    longitude: 0,
    displayName: data.address,
  };

  // 2) Fetch climate (NASA POWER) AND the higher-fidelity resource models
  //    (PVGIS PV yield, optional NREL PVWatts, modelled wind AEP) in parallel.
  //    All resilient — any failure degrades to the climate/heuristic path.
  const emptyResources: ResourceBundle = {
    solarPV: null,
    solarPVWatts: null,
    wind: null,
  };
  const [climate, resources] = located
    ? await Promise.all([
        getClimateData(resolved.latitude, resolved.longitude),
        getResources(resolved.latitude, resolved.longitude).catch(
          () => emptyResources
        ),
      ])
    : [
        {
          solarIrradiance: null,
          windSpeed10m: null,
          windSpeed50m: null,
          avgTempC: null,
          source: "none" as const,
        },
        emptyResources,
      ];

  const generatedAt = new Date().toISOString();
  const locationWarning = located
    ? null
    : "We couldn't pinpoint that exact address, so this estimate uses typical regional values. Results will be more precise once the location service is available.";

  const meta = {
    address: resolved.displayName,
    latitude: resolved.latitude,
    longitude: resolved.longitude,
    generatedAt,
  };

  // 3) Build the assessment — live AI when a key is present, otherwise mock.
  if (hasAnthropicKey()) {
    try {
      const assessment = await buildAssessment(data, resolved, climate, resources);
      const withMeta: Assessment = {
        ...assessment,
        meta: { ...meta, mock: false },
      };
      await logAssessment(data, withMeta);
      return NextResponse.json({ assessment: withMeta, warning: locationWarning });
    } catch (err) {
      // Fall back to the mock so the demo never hard-fails; surface a note.
      console.error("AI assessment failed, falling back to mock:", err);
      const mock = buildMockAssessment(data, resolved, climate, resources);
      const withMeta: Assessment = { ...mock, meta: { ...meta, mock: true } };
      await logAssessment(data, withMeta);
      return NextResponse.json({
        assessment: withMeta,
        warning:
          locationWarning ??
          "The AI engine was unavailable, so this is a sample assessment based on your inputs.",
      });
    }
  }

  // No key configured — deterministic mock.
  const mock = buildMockAssessment(data, resolved, climate, resources);
  const withMeta: Assessment = { ...mock, meta: { ...meta, mock: true } };
  await logAssessment(data, withMeta);
  return NextResponse.json({ assessment: withMeta, warning: locationWarning });
}
