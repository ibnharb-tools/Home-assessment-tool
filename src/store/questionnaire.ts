"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type {
  Assessment,
  ApplianceSelection,
  QuestionnaireData,
  UsageFrequency,
} from "@/types";

export type AssessmentStatus = "idle" | "loading" | "done" | "error";

const TOTAL_STEPS = 5;

const defaultData: QuestionnaireData = {
  address: "",
  // Step 1
  propertyType: undefined,
  rooms: { bedrooms: 2, bathrooms: 1, living: 1, kitchens: 1, garages: 0, other: 0 },
  floors: 1,
  floorArea: undefined,
  areaUnit: "sqft",
  occupants: 2,
  ownership: "own",
  // Step 2
  gridConnection: undefined,
  hasRenewables: false,
  existingRenewables: [],
  dailyKwh: undefined,
  // Step 3
  appliances: [],
  lightingType: "led",
  // Step 4
  goals: [],
  budget: undefined,
  timeframe: undefined,
  shariahCompliant: false,
  // Step 5
  photos: [],
};

interface QuestionnaireState {
  data: QuestionnaireData;
  currentStep: number; // 0-indexed
  totalSteps: number;

  // assessment (populated in Phase 4)
  assessment: Assessment | null;
  status: AssessmentStatus;
  error: string | null;

  // mutations
  setAddress: (address: string) => void;
  setData: (patch: Partial<QuestionnaireData>) => void;
  toggleAppliance: (id: string) => void;
  updateAppliance: (id: string, patch: Partial<ApplianceSelection>) => void;
  toggleArrayValue: (
    key: "existingRenewables" | "goals",
    value: string
  ) => void;

  // navigation
  setStep: (step: number) => void;
  next: () => void;
  prev: () => void;

  // assessment lifecycle
  setStatus: (status: AssessmentStatus) => void;
  setAssessment: (assessment: Assessment | null) => void;
  setError: (error: string | null) => void;

  reset: () => void;
}

export const useQuestionnaireStore = create<QuestionnaireState>()(
  persist(
    (set, get) => ({
      data: defaultData,
      currentStep: 0,
      totalSteps: TOTAL_STEPS,

      assessment: null,
      status: "idle",
      error: null,

      setAddress: (address) =>
        set((s) => ({ data: { ...s.data, address } })),

      setData: (patch) => set((s) => ({ data: { ...s.data, ...patch } })),

      toggleAppliance: (id) =>
        set((s) => {
          const exists = s.data.appliances.some((a) => a.id === id);
          const appliances = exists
            ? s.data.appliances.filter((a) => a.id !== id)
            : [
                ...s.data.appliances,
                { id, quantity: 1, frequency: "daily" as UsageFrequency },
              ];
          return { data: { ...s.data, appliances } };
        }),

      updateAppliance: (id, patch) =>
        set((s) => ({
          data: {
            ...s.data,
            appliances: s.data.appliances.map((a) =>
              a.id === id ? { ...a, ...patch } : a
            ),
          },
        })),

      toggleArrayValue: (key, value) =>
        set((s) => {
          const arr = s.data[key];
          const next = arr.includes(value)
            ? arr.filter((v) => v !== value)
            : [...arr, value];
          return { data: { ...s.data, [key]: next } };
        }),

      setStep: (step) =>
        set({ currentStep: Math.max(0, Math.min(TOTAL_STEPS - 1, step)) }),
      next: () =>
        set({
          currentStep: Math.min(TOTAL_STEPS - 1, get().currentStep + 1),
        }),
      prev: () => set({ currentStep: Math.max(0, get().currentStep - 1) }),

      setStatus: (status) => set({ status }),
      setAssessment: (assessment) => set({ assessment }),
      setError: (error) => set({ error }),

      reset: () =>
        set({
          data: defaultData,
          currentStep: 0,
          assessment: null,
          status: "idle",
          error: null,
        }),
    }),
    {
      name: "everstead-questionnaire",
      // Persist only the durable questionnaire inputs + step position. The
      // transient assessment lifecycle (`status`/`assessment`/`error`) is
      // intentionally NOT persisted: otherwise a reload mid-request would
      // restore status='loading' and the results page — which only fetches when
      // status is 'idle' — would hang on the loader forever. With these left
      // out, a reload resets to 'idle' and re-runs the assessment from `data`.
      partialize: (state) => ({
        data: state.data,
        currentStep: state.currentStep,
      }),
      // sessionStorage: the assessment is ephemeral until the user creates an
      // account to save it (per spec). Survives the landing -> questionnaire ->
      // results flow within a tab.
      storage: createJSONStorage(() =>
        typeof window !== "undefined"
          ? window.sessionStorage
          : // no-op storage for SSR
            {
              getItem: () => null,
              setItem: () => {},
              removeItem: () => {},
            }
      ),
    }
  )
);
