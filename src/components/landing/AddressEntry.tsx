"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowRight, Check, MapPin } from "lucide-react";
import { Button } from "@/components/ui";
import { useQuestionnaireStore } from "@/store/questionnaire";
import { parseCoordinates } from "@/lib/geocode";
import { cn } from "@/lib/utils";

/**
 * The single entry point: a solid address field + integrated "Start
 * Assessment" button. Accepts a street address, a postal/ZIP code, OR raw
 * coordinates ("lat, lon"). Starting an assessment RESETS the store first, so
 * each new visitor begins with a clean board (nothing carries over from a
 * previous person unless they saved to an account).
 */
export function AddressEntry({ className }: { className?: string }) {
  const router = useRouter();
  const reset = useQuestionnaireStore((s) => s.reset);
  const setAddress = useQuestionnaireStore((s) => s.setAddress);
  const [value, setValue] = useState("");
  const [error, setError] = useState(false);

  const handleStart = () => {
    const v = value.trim();
    // Valid if it parses as coordinates, or is a plausible address/postal code.
    const ok = parseCoordinates(v) !== null || v.length >= 3;
    if (!ok) {
      setError(true);
      return;
    }
    reset(); // clear any prior session's assessment
    setAddress(v);
    router.push("/assess");
  };

  return (
    <div className={cn("w-full max-w-xl", className)}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleStart();
        }}
        className="flex flex-col gap-2 sm:flex-row sm:items-center"
      >
        <div
          className={cn(
            "flex min-w-0 flex-1 items-center gap-3 rounded-btn border bg-elevated px-4",
            "min-h-[52px] transition-colors duration-150",
            "focus-within:outline-none focus-within:border-energy",
            error ? "border-danger" : "border-line"
          )}
        >
          <MapPin size={20} className="shrink-0 text-energy" />
          <input
            type="text"
            value={value}
            onChange={(e) => {
              setValue(e.target.value);
              if (error) setError(false);
            }}
            placeholder="Address, postal code, or coordinates"
            aria-label="Property address, postal code, or coordinates"
            className="w-full bg-transparent py-3 text-base text-ink placeholder:text-ink-soft outline-none"
          />
        </div>
        <Button
          type="submit"
          size="lg"
          className="shrink-0 min-h-[52px] max-sm:w-full"
        >
          Start Assessment <ArrowRight size={18} />
        </Button>
      </form>

      {/* Reserved helper row — fixed height so the error swap doesn't shift layout. */}
      <div className="mt-3 flex min-h-[1.25rem] items-center gap-2 text-sm">
        {error ? (
          <span className="text-danger">
            Enter an address, postal code, or coordinates like
            {" "}&ldquo;45.42, -75.70&rdquo;.
          </span>
        ) : (
          <span className="inline-flex items-center gap-2 text-ink-faint">
            <Check size={15} className="text-savings" />
            Free to try. No account needed.
          </span>
        )}
      </div>
    </div>
  );
}
