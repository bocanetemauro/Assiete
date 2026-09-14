"use client";

import { Pause, Play, Plus, RotateCcw } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { cn, formatTimer } from "@/lib/utils";
import { useToast } from "@/components/ui/Toast";

/** Nauwkeurige afteltimer op basis van tijdstempels (loopt correct door bij tab-wissel). */
export function useCountdown(total: number, onDone?: () => void) {
  const [remaining, setRemaining] = useState(total);
  const [running, setRunning] = useState(false);
  const remainingRef = useRef(total);
  const endAt = useRef<number | null>(null);
  const doneRef = useRef(onDone);
  doneRef.current = onDone;

  const set = (value: number) => {
    remainingRef.current = value;
    setRemaining(value);
  };

  useEffect(() => {
    endAt.current = null;
    setRunning(false);
    set(total);
  }, [total]);

  useEffect(() => {
    if (!running) return;
    const tick = () => {
      if (endAt.current === null) return;
      const left = Math.max(0, (endAt.current - Date.now()) / 1000);
      set(left);
      if (left <= 0) {
        endAt.current = null;
        setRunning(false);
        doneRef.current?.();
      }
    };
    tick();
    const id = window.setInterval(tick, 250);
    return () => window.clearInterval(id);
  }, [running]);

  const start = useCallback(() => {
    const base = remainingRef.current <= 0 ? total : remainingRef.current;
    endAt.current = Date.now() + base * 1000;
    set(base);
    setRunning(true);
  }, [total]);

  const pause = useCallback(() => {
    endAt.current = null;
    setRunning(false);
  }, []);

  const reset = useCallback(() => {
    endAt.current = null;
    setRunning(false);
    set(total);
  }, [total]);

  const add = useCallback((seconds: number) => {
    if (endAt.current !== null) endAt.current += seconds * 1000;
    set(remainingRef.current + seconds);
  }, []);

  return { remaining, running, done: remaining <= 0, start, pause, reset, add, progress: total > 0 ? Math.min(1, 1 - remaining / total) : 0 };
}

export function playChime() {
  try {
    const Ctx = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (Ctx) {
      const ctx = new Ctx();
      [880, 1175, 1568].forEach((freq, i) => {
        const t = ctx.currentTime + i * 0.28;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.value = freq;
        gain.gain.setValueAtTime(0.0001, t);
        gain.gain.exponentialRampToValueAtTime(0.22, t + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.55);
        osc.connect(gain).connect(ctx.destination);
        osc.start(t);
        osc.stop(t + 0.6);
      });
      window.setTimeout(() => void ctx.close(), 1600);
    }
  } catch {
    /* audio niet beschikbaar */
  }
  if (typeof navigator !== "undefined" && "vibrate" in navigator) navigator.vibrate([180, 80, 180]);
}

export function TimerRing({ progress, size = 44, stroke = 3, className, trackClassName = "text-line", barClassName = "text-brass" }: { progress: number; size?: number; stroke?: number; className?: string; trackClassName?: string; barClassName?: string }) {
  const r = (size - stroke) / 2;
  const c = Math.round(2 * Math.PI * r * 100) / 100;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className={cn("-rotate-90", className)} aria-hidden>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="currentColor" strokeWidth={stroke} className={trackClassName} />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke="currentColor"
        strokeWidth={stroke}
        strokeLinecap="round"
        strokeDasharray={c}
        strokeDashoffset={Math.round(c * (1 - progress) * 100) / 100}
        className={cn(barClassName, "transition-[stroke-dashoffset] duration-300 ease-linear")}
      />
    </svg>
  );
}

/** Compacte timer naast een bereidingsstap. */
export function InlineTimer({ seconds, label, className }: { seconds: number; label: string; className?: string }) {
  const toast = useToast();
  const timer = useCountdown(seconds, () => {
    playChime();
    toast({ title: "Timer klaar", description: label, tone: "success" });
  });
  const idle = !timer.running && Math.ceil(timer.remaining) === seconds;

  return (
    <div className={cn("inline-flex items-center gap-3 rounded-full border py-1.5 pl-1.5 pr-3 transition-colors duration-300", timer.running ? "border-brass/40 bg-brass/[0.06]" : "border-line bg-cream", className)}>
      <button
        type="button"
        onClick={timer.running ? timer.pause : timer.start}
        className="relative grid size-11 place-items-center rounded-full bg-ink text-ivory transition hover:bg-ink-soft"
        aria-label={timer.running ? `Pauzeer timer: ${label}` : `Start timer: ${label}`}
      >
        {!idle && <TimerRing progress={timer.progress} size={44} stroke={2.5} className="absolute inset-0" trackClassName="text-ivory/15" barClassName="text-brass-soft" />}
        {timer.running ? <Pause className="size-4" /> : <Play className="ml-0.5 size-4" />}
      </button>
      <span className="font-serif text-[1.35rem] tabular-nums leading-none">{formatTimer(timer.remaining)}</span>
      {idle ? (
        <span className="eyebrow text-[9px] text-muted">Timer</span>
      ) : (
        <span className="flex items-center">
          <button type="button" onClick={() => timer.add(60)} className="grid size-9 place-items-center rounded-full text-muted hover:bg-ink/5 hover:text-ink" aria-label="Eén minuut toevoegen">
            <Plus className="size-4" />
          </button>
          <button type="button" onClick={timer.reset} className="grid size-9 place-items-center rounded-full text-muted hover:bg-ink/5 hover:text-ink" aria-label="Timer resetten">
            <RotateCcw className="size-4" />
          </button>
        </span>
      )}
    </div>
  );
}
