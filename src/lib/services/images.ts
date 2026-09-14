/**
 * Beeldverwerking in de browser. Foto's worden verkleind en als JPEG-data-URL
 * opgeslagen. Met echte image storage (S3, R2, Supabase) vervang je
 * `storeImage` door een upload die een publieke URL teruggeeft.
 */

const MAX_BYTES = 20 * 1024 * 1024;

export class ImageError extends Error {}

export async function fileToDataUrl(file: File, maxSize = 1400, quality = 0.82): Promise<string> {
  if (!file.type.startsWith("image/")) throw new ImageError("Kies een afbeelding (JPG, PNG, WEBP of HEIC).");
  if (file.size > MAX_BYTES) throw new ImageError("Deze foto is groter dan 20 MB.");

  const url = URL.createObjectURL(file);
  try {
    const img = await new Promise<HTMLImageElement>((resolve, reject) => {
      const el = new Image();
      el.onload = () => resolve(el);
      el.onerror = () => reject(new ImageError("Deze afbeelding kon niet worden gelezen."));
      el.src = url;
    });
    const scale = Math.min(1, maxSize / Math.max(img.naturalWidth, img.naturalHeight));
    const w = Math.max(1, Math.round(img.naturalWidth * scale));
    const h = Math.max(1, Math.round(img.naturalHeight * scale));
    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new ImageError("Je browser ondersteunt geen beeldbewerking.");
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, w, h);
    ctx.drawImage(img, 0, 0, w, h);
    return canvas.toDataURL("image/jpeg", quality);
  } finally {
    URL.revokeObjectURL(url);
  }
}

export async function storeImage(file: File): Promise<string> {
  return fileToDataUrl(file);
}
