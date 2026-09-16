/**
 * Beeldverwerking in de browser: foto's worden verkleind tot een JPEG-blob
 * voordat ze naar Supabase Storage gaan. Dat scheelt uploadtijd en houdt de
 * bestanden ruim onder de limiet van de bucket (6 MB).
 */

const MAX_BYTES = 20 * 1024 * 1024;

export class ImageError extends Error {}

async function drawToCanvas(file: File, maxSize: number): Promise<HTMLCanvasElement> {
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
    return canvas;
  } finally {
    URL.revokeObjectURL(url);
  }
}

/** Kleine voorvertoning voor in het formulier, voordat er geüpload wordt. */
export async function fileToDataUrl(file: File, maxSize = 1400, quality = 0.82): Promise<string> {
  return (await drawToCanvas(file, maxSize)).toDataURL("image/jpeg", quality);
}

/** Verkleinde JPEG om te uploaden. */
export async function fileToJpegBlob(file: File, maxSize = 1600, quality = 0.84): Promise<Blob> {
  const canvas = await drawToCanvas(file, maxSize);
  const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/jpeg", quality));
  if (!blob) throw new ImageError("De foto kon niet worden verwerkt.");
  return blob;
}

/** Zet een data-URL uit het formulier terug om naar een blob om te uploaden. */
export async function dataUrlToBlob(dataUrl: string): Promise<Blob> {
  const res = await fetch(dataUrl);
  return res.blob();
}
