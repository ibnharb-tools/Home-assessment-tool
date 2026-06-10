import { createClient } from "@supabase/supabase-js";
import type { Assessment, QuestionnaireData } from "@/types";

/**
 * Best-effort assessment logging for later review and prompt refinement. Always
 * logs a compact line to the server console (captured by Vercel); additionally
 * inserts a row into Supabase `assessment_logs` when configured. Wrapped so a
 * logging failure never affects the assessment response.
 *
 * Run supabase/schema.sql to create the table (insert-only via RLS).
 */
export async function logAssessment(
  data: QuestionnaireData,
  assessment: Assessment
): Promise<void> {
  const summary = {
    address: assessment.meta?.address ?? data.address,
    lat: assessment.meta?.latitude,
    lon: assessment.meta?.longitude,
    mock: assessment.meta?.mock ?? null,
    propertyType: data.propertyType,
    budget: data.budget,
    shariah: Boolean(data.shariahCompliant),
    annualKwh: assessment.energyProfile?.estimatedAnnualKwh,
    netCost: assessment.financial?.netCost,
    paybackYears: assessment.financial?.paybackYears,
    recommended: assessment.recommendations
      ?.filter((r) => r.recommended)
      .map((r) => r.technology),
    at: assessment.meta?.generatedAt ?? new Date().toISOString(),
  };

  // Always: structured console log.
  console.log("[assessment]", JSON.stringify(summary));

  // Optional: persist to Supabase for later analysis.
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return;
  try {
    const sb = createClient(url, key);
    await sb.from("assessment_logs").insert({
      address: summary.address,
      latitude: summary.lat ?? null,
      longitude: summary.lon ?? null,
      mock: summary.mock,
      questionnaire_data: data,
      result_summary: summary,
    });
  } catch {
    // ignore — logging must never break the assessment
  }
}
