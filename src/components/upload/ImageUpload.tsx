"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Camera, ImagePlus, LoaderCircle, RefreshCw, Trash, X } from "lucide-react";
import { useRef, useState, type DragEvent } from "react";
import { storeImage } from "@/lib/services/images";
import { cn } from "@/lib/utils";

function useImagePicker(onPicked: (url: string) => void) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);

  const handleFiles = async (files: FileList | File[] | null) => {
    const list = files ? Array.from(files) : [];
    if (!list.length) return;
    setBusy(true);
    setError(null);
    try {
      for (const file of list) onPicked(await storeImage(file));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Uploaden is mislukt.");
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  const dropProps = {
    onDragOver: (e: DragEvent) => {
      e.preventDefault();
      setDragging(true);
    },
    onDragLeave: () => setDragging(false),
    onDrop: (e: DragEvent) => {
      e.preventDefault();
      setDragging(false);
      void handleFiles(e.dataTransfer.files);
    },
  };

  return { inputRef, busy, error, dragging, handleFiles, dropProps, open: () => inputRef.current?.click() };
}

export function ImageUpload({
  value,
  onChange,
  label = "Upload een foto",
  hint = "Sleep een foto hierheen of tik om te kiezen",
  className,
  aspect = "aspect-[4/3]",
  dark = false,
  compact = false,
}: {
  value: string | null;
  onChange: (url: string | null) => void;
  label?: string;
  hint?: string;
  className?: string;
  aspect?: string;
  dark?: boolean;
  compact?: boolean;
}) {
  const picker = useImagePicker((url) => onChange(url));

  return (
    <div className={className}>
      <input ref={picker.inputRef} type="file" accept="image/*" className="sr-only" onChange={(e) => void picker.handleFiles(e.target.files)} tabIndex={-1} aria-hidden />
      <AnimatePresence mode="wait" initial={false}>
        {value ? (
          <motion.div key="preview" initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className={cn("group relative overflow-hidden rounded-3xl", aspect)}>
            <img src={value} alt="Voorbeeld van je foto" className="h-full w-full object-cover" />
            <div className="absolute inset-x-3 bottom-3 flex justify-end gap-2">
              <button type="button" onClick={picker.open} className="inline-flex h-10 items-center gap-2 rounded-full bg-ivory/90 px-4 text-[13px] font-semibold text-ink backdrop-blur hover:bg-white">
                <RefreshCw className="size-3.5" /> Vervang
              </button>
              <button type="button" onClick={() => onChange(null)} className="grid size-10 place-items-center rounded-full bg-ivory/90 text-ink backdrop-blur hover:bg-white" aria-label="Foto verwijderen">
                <Trash className="size-4" />
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.button
            key="drop"
            type="button"
            onClick={picker.open}
            {...picker.dropProps}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={cn(
              "flex w-full flex-col items-center justify-center gap-3 rounded-3xl border-2 border-dashed p-6 text-center transition-colors duration-300",
              compact ? "min-h-32" : aspect,
              dark
                ? picker.dragging
                  ? "border-brass-soft bg-ivory/10"
                  : "border-ivory/20 bg-ivory/[0.04] hover:border-ivory/40"
                : picker.dragging
                  ? "border-brass bg-brass/5"
                  : "border-line bg-cream hover:border-ink/25",
            )}
          >
            <span className={cn("grid size-14 place-items-center rounded-full", dark ? "bg-ivory/10 text-brass-soft" : "bg-paper text-brass")}>
              {picker.busy ? <LoaderCircle className="size-6 animate-spin" /> : compact ? <ImagePlus className="size-6" /> : <Camera className="size-6" />}
            </span>
            <span className={cn("font-serif text-2xl leading-tight", dark ? "text-ivory" : "text-ink")}>{picker.busy ? "Foto verwerken…" : label}</span>
            {!compact && <span className={cn("max-w-xs text-[13px]", dark ? "text-ivory/55" : "text-muted")}>{hint}</span>}
          </motion.button>
        )}
      </AnimatePresence>
      {picker.error && <p className={cn("mt-2 text-[13px] font-medium", dark ? "text-brass-soft" : "text-bordeaux")}>{picker.error}</p>}
    </div>
  );
}

export function MultiImageUpload({ values, onChange, max = 6 }: { values: string[]; onChange: (urls: string[]) => void; max?: number }) {
  const latest = useRef(values);
  latest.current = values;
  const picker = useImagePicker((url) => {
    const next = [...latest.current, url].slice(0, max);
    latest.current = next;
    onChange(next);
  });

  return (
    <div>
      <input ref={picker.inputRef} type="file" accept="image/*" multiple className="sr-only" onChange={(e) => void picker.handleFiles(e.target.files)} tabIndex={-1} aria-hidden />
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        <AnimatePresence>
          {values.map((url, i) => (
            <motion.div key={url.slice(-40) + i} layout initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="group relative aspect-square overflow-hidden rounded-2xl">
              <img src={url} alt={`Foto ${i + 1}`} className="h-full w-full object-cover" />
              {i === 0 && <span className="eyebrow absolute left-2 top-2 rounded-full bg-ink/80 px-2.5 py-1 text-[9px] text-ivory">Omslag</span>}
              <button
                type="button"
                onClick={() => onChange(values.filter((_, idx) => idx !== i))}
                className="absolute right-2 top-2 grid size-9 place-items-center rounded-full bg-ivory/90 text-ink shadow-sm hover:bg-white"
                aria-label={`Verwijder foto ${i + 1}`}
              >
                <X className="size-4" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
        {values.length < max && (
          <button
            type="button"
            onClick={picker.open}
            {...picker.dropProps}
            className={cn(
              "flex aspect-square flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed text-center transition-colors",
              picker.dragging ? "border-brass bg-brass/5" : "border-line bg-cream hover:border-ink/25",
            )}
          >
            {picker.busy ? <LoaderCircle className="size-6 animate-spin text-brass" /> : <ImagePlus className="size-6 text-brass" />}
            <span className="text-[13px] font-semibold">{values.length ? "Nog een foto" : "Foto's toevoegen"}</span>
            <span className="text-[11px] text-muted">
              {values.length}/{max}
            </span>
          </button>
        )}
      </div>
      {picker.error && <p className="mt-2 text-[13px] font-medium text-bordeaux">{picker.error}</p>}
    </div>
  );
}
