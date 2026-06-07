"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowRight, Check, MapPin } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui";
import { useQuestionnaireStore } from "@/store/questionnaire";
import { cn } from "@/lib/utils";

/**
 * The single clear entry point: a glass address input with an integrated
 * "Start Assessment" button. Captures the address into the store and routes
 * to the questionnaire. Reused on the hero and closing CTA sections.
 */
export function AddressEntry({ className }: { className?: string }) {
  const router = useRouter();
  const setAddress = useQuestionnaireStore((s) => s.setAddress);
  const [value, setValue] = useState("");
  const [error, setError] = useState(false);

  const handleStart = () => {
    if (value.trim().length < 4) {
      setError(true);
      return;
    }
    setAddress(value.trim());
    router.push("/assess");
  };

  return (
    <div className={cn("w-full max-w-xl", className)}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleStart();
        }}
        className={cn(
          "group flex flex-col gap-3 rounded-panel glass p-2 sm:flex-row sm:items-center sm:gap-2",
          "transition-shadow duration-300",
          "focus-within:shadow-[0_0_36px_color-mix(in_srgb,var(--energy-primary)_28%,transparent)]",
          error && "border border-[#ff6b6b]"
        )}
      >
        <div className="flex flex-1 items-center gap-3 px-4 py-2">
          <MapPin size={20} className="shrink-0 text-energy" />
          <input
            type="text"
            value={value}
            onChange={(e) => {
              setValue(e.target.value);
              if (error) setError(false);
            }}
            placeholder="Enter your address to begin"
            aria-label="Property address"
            className="w-full bg-transparent text-base text-ink placeholder:text-ink-faint outline-none"
          />
        </div>
        <Button type="submit" size="lg" className="shrink-0">
          Start Assessment <ArrowRight size={18} />
        </Button>
      </form>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="mt-3 flex items-center justify-center gap-2 text-sm text-ink-faint sm:justify-start"
      >
        <Check size={15} className="text-savings" />
        {error ? (
          <span className="text-[#ff6b6b]">
            Please enter a valid address to continue.
          </span>
        ) : (
          <span>Free to try. No account needed.</span>
        )}
      </motion.div>
    </div>
  );
}
