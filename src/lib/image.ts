"use client";

/**
 * Downscale an uploaded image file to a JPEG data URL, capped to maxDim on the
 * longest edge. Keeps sessionStorage payloads small and produces a compact,
 * vision-API-friendly base64 string. Runs entirely client-side via canvas.
 */
export async function fileToDownscaledDataUrl(
  file: File,
  maxDim = 1024,
  quality = 0.72
): Promise<string> {
  const dataUrl = await readFileAsDataUrl(file);
  const img = await loadImage(dataUrl);

  const scale = Math.min(1, maxDim / Math.max(img.width, img.height));
  const w = Math.round(img.width * scale);
  const h = Math.round(img.height * scale);

  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) return dataUrl; // fallback to original
  ctx.drawImage(img, 0, 0, w, h);
  return canvas.toDataURL("image/jpeg", quality);
}

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsDataURL(file);
  });
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("Failed to load image"));
    img.src = src;
  });
}
