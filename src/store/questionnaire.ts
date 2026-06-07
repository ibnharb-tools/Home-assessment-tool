"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

/**
 * Questionnaire store.
 *
 * NOTE: For Phase 2 (landing) this holds the captured address only. It is
 * expanded in Phase 3 with the full multi-step questionnaire shape (property,
 * energy connection, appliances, goals, photos) and in later phases with the
 * assessment result. Persisted to sessionStorage so the data survives the
 * landing -> questionnaire -> results navigation without a backend round-trip.
 */
interface QuestionnaireState {
  address: string;
  setAddress: (address: string) => void;
  reset: () => void;
}

export const useQuestionnaireStore = create<QuestionnaireState>()(
  persist(
    (set) => ({
      address: "",
      setAddress: (address) => set({ address }),
      reset: () => set({ address: "" }),
    }),
    {
      name: "everstead-questionnaire",
      // sessionStorage: cleared when the tab closes (assessment is ephemeral
      // until the user creates an account to save it).
      storage: {
        getItem: (name) => {
          if (typeof window === "undefined") return null;
          const v = sessionStorage.getItem(name);
          return v ? JSON.parse(v) : null;
        },
        setItem: (name, value) => {
          if (typeof window === "undefined") return;
          sessionStorage.setItem(name, JSON.stringify(value));
        },
        removeItem: (name) => {
          if (typeof window === "undefined") return;
          sessionStorage.removeItem(name);
        },
      },
    }
  )
);
