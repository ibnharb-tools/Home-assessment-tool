"use client";

import { useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ImagePlus, X, Loader2, AlertCircle } from "lucide-react";
import { useQuestionnaireStore } from "@/store/questionnaire";
import { fileToDownscaledDataUrl } from "@/lib/image";
import { Field } from "../Field";
import { cn } from "@/lib/utils";

const MAX_PHOTOS = 6;

export function Step5Photos() {
  const { data, setData } = useQuestionnaireStore();
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const photos = data.photos;
  const atLimit = photos.length >= MAX_PHOTOS;

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setError(null);
    const remaining = MAX_PHOTOS - photos.length;
    const incoming = Array.from(files)
      .filter((f) => f.type.startsWith("image/"))
      .slice(0, remaining);

    if (incoming.length === 0) {
      setError("Please choose image files (JP, PNG, etc.).");
      return;
    }

    setProcessing(true);
    try {
      const urls = await Promise.all(
        incoming.map((f) => fileToDownscaledDataUrl(f))
      );
      setData({ photos: [...photos, ...urls] });
    } catch {
      setError("Something went wrong reading those images. Try again.");
    } finally {
      setProcessing(false);
    }
  };

  const removePhoto = (idx: number) =>
    setData({ photos: photos.filter((_, i) => i !== idx) });

  return (
    <div className="space-y-6">
      <Field
        label="Add photos of your property (optional)"
        hint="Upload 2–6 photos from different angles. This helps our AI understand your roof, orientation, and available space. You can skip this step."
      >
        {/* Dropzone */}
        <button
          type="button"
          onClick={() => !atLimit && inputRef.current?.click()}
          onDragOver={(e) => {
            e.preventDefault();
            if (!atLimit) setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragOver(false);
            if (!atLimit) handleFiles(e.dataTransfer.files);
          }}
          disabled={atLimit}
          className={cn(
            "flex w-full flex-col items-center justify-center gap-3 rounded-panel border-2 border-dashed p-10 text-center transition-all duration-200",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-energy/60",
            dragOver
              ? "border-energy bg-surface glow-energy"
              : "border-line bg-elevated hover:border-energy-dim hover:bg-surface/60",
            atLimit && "cursor-not-allowed opacity-60"
          )}
        >
          <span className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-surface text-energy">
            {processing ? (
              <Loader2 size={24} className="animate-spin" />
            ) : (
              <ImagePlus size={24} />
            )}
          </span>
          <span className="font-medium text-ink">
            {atLimit
              ? "Maximum of 6 photos reached"
              : processing
                ? "Processing images…"
                : "Drag & drop, or tap to upload"}
          </span>
          <span className="text-sm text-ink-faint">
            JPG or PNG · up to {MAX_PHOTOS} photos
          </span>
        </button>

        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => {
            handleFiles(e.target.files);
            e.target.value = "";
          }}
        />

        {error && (
          <p className="mt-3 flex items-center gap-2 text-sm text-danger">
            <AlertCircle size={15} /> {error}
          </p>
        )}
      </Field>

      {/* Thumbnails */}
      <AnimatePresence>
        {photos.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4"
          >
            {photos.map((src, idx) => (
              <motion.div
                key={src.slice(-24) + idx}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="group relative aspect-square overflow-hidden rounded-card border border-line"
              >
                {/* eslint-disable-next-line @next/next/no-img-element -- user-uploaded data URL, not a remote asset */}
                <img
                  src={src}
                  alt={`Property photo ${idx + 1}`}
                  className="h-full w-full object-cover"
                />
                <button
                  type="button"
                  aria-label={`Remove photo ${idx + 1}`}
                  onClick={() => removePhoto(idx)}
                  className="absolute right-2 top-2 inline-flex h-7 w-7 items-center justify-center rounded-full bg-black/60 text-white opacity-0 backdrop-blur transition-opacity duration-150 hover:bg-black/80 focus-visible:opacity-100 group-hover:opacity-100"
                >
                  <X size={14} />
                </button>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
