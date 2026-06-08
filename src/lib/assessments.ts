"use client";

import type { SupabaseClient } from "@supabase/supabase-js";
import type { Assessment, QuestionnaireData } from "@/types";

/**
 * Saved-assessment data access (Supabase `assessments` table — see
 * supabase/schema.sql). Each row is owned by a user via RLS.
 */

export interface SavedAssessmentRow {
  id: string;
  user_id: string;
  created_at: string;
  address: string;
  latitude: number | null;
  longitude: number | null;
  questionnaire_data: QuestionnaireData;
  assessment_result: Assessment;
  nickname: string | null;
}

export async function saveAssessment(
  supabase: SupabaseClient,
  userId: string,
  data: QuestionnaireData,
  assessment: Assessment,
  nickname?: string
): Promise<{ id: string }> {
  // Strip photo data URLs before persisting — they can be large and aren't
  // needed in the saved record (insights are already in the assessment).
  const { photos, ...questionnaire } = data;
  void photos;

  const { data: row, error } = await supabase
    .from("assessments")
    .insert({
      user_id: userId,
      address: assessment.meta?.address ?? data.address,
      latitude: assessment.meta?.latitude ?? null,
      longitude: assessment.meta?.longitude ?? null,
      questionnaire_data: { ...questionnaire, photos: [] },
      assessment_result: assessment,
      nickname: nickname ?? null,
    })
    .select("id")
    .single();

  if (error) throw new Error(error.message);
  return { id: row.id as string };
}

export async function listAssessments(
  supabase: SupabaseClient
): Promise<SavedAssessmentRow[]> {
  const { data, error } = await supabase
    .from("assessments")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return (data ?? []) as SavedAssessmentRow[];
}

export async function getAssessment(
  supabase: SupabaseClient,
  id: string
): Promise<SavedAssessmentRow | null> {
  const { data, error } = await supabase
    .from("assessments")
    .select("*")
    .eq("id", id)
    .single();
  if (error) return null;
  return data as SavedAssessmentRow;
}
