export function cn(...classes: (string | false | null | undefined)[]): string {
  return classes.filter(Boolean).join(" ");
}

export function formatMinutes(total: number): string {
  if (!Number.isFinite(total) || total <= 0) return "—";
  if (total < 60) return `${Math.round(total)} min`;
  const h = Math.floor(total / 60);
  const m = Math.round(total % 60);
  return m ? `${h} u ${m} min` : `${h} u`;
}

export function formatTimer(seconds: number): string {
  const s = Math.max(0, Math.ceil(seconds));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  const mm = String(m).padStart(h ? 2 : 1, "0");
  const ss = String(sec).padStart(2, "0");
  return h ? `${h}:${mm}:${ss}` : `${mm}:${ss}`;
}

const FRACTIONS: [number, string][] = [
  [0.25, "¼"],
  [1 / 3, "⅓"],
  [0.5, "½"],
  [2 / 3, "⅔"],
  [0.75, "¾"],
];

/** 1.5 → "1½", 0.333 → "⅓", 12.5 → "12,5", 312.4 → "310" */
export function formatQuantity(q: number | null): string {
  if (q === null || !Number.isFinite(q)) return "";
  if (q >= 100) return String(Math.round(q / 5) * 5);
  if (q >= 10) return String(Math.round(q));
  const whole = Math.floor(q);
  const frac = q - whole;
  if (frac < 0.06) return String(whole);
  if (frac > 0.94) return String(whole + 1);
  const match = FRACTIONS.find(([v]) => Math.abs(v - frac) < 0.06);
  if (match) return `${whole || ""}${match[1]}`;
  return q.toFixed(1).replace(".", ",");
}

const dateFormatter = new Intl.DateTimeFormat("nl-NL", { day: "numeric", month: "long", year: "numeric" });
const weekdayFormatter = new Intl.DateTimeFormat("nl-NL", { weekday: "long", day: "numeric", month: "long" });
const monthFormatter = new Intl.DateTimeFormat("nl-NL", { month: "long", year: "numeric" });

export function formatDate(iso: string | Date): string {
  return dateFormatter.format(typeof iso === "string" ? new Date(iso) : iso);
}

export function formatWeekday(date: Date): string {
  const s = weekdayFormatter.format(date);
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export function formatMonth(date: Date): string {
  return monthFormatter.format(date);
}

export function isSameDay(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

export function isToday(iso: string): boolean {
  return isSameDay(new Date(iso), new Date());
}

export function relativeDay(iso: string): string {
  const d = new Date(iso);
  const now = new Date();
  const startOf = (x: Date) => new Date(x.getFullYear(), x.getMonth(), x.getDate()).getTime();
  const diff = Math.round((startOf(now) - startOf(d)) / 86_400_000);
  if (diff === 0) return "Vandaag";
  if (diff === 1) return "Gisteren";
  if (diff > 1 && diff < 7) return `${diff} dagen geleden`;
  return formatDate(d);
}

export function createId(prefix = "id"): string {
  const rnd =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
  return `${prefix}_${rnd}`;
}

export function slugify(input: string): string {
  return input
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

export function plural(n: number, one: string, many: string): string {
  return `${n} ${n === 1 ? one : many}`;
}

export function clamp(n: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, n));
}

export function initials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join("");
}
