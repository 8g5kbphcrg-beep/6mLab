// The handball season in 3 parts, sold one by one or together ("Saison complète"):
// - Pré-saison: July and August (2 months);
// - 1re partie de saison: September to the end of the Christmas holidays (4 months);
// - 2e partie de saison: January to mid-June, finals included (5.5 months). The regular seasons
//   end in May from U15 to seniors, but regional finals and national finals run until mid-June.
// Then 2 weeks of real break in late June before the next Pré-saison.
// Price: 15 € a month, rounded up to the next 0.99. The Saison complète is the next 3 parts in a
// row with 20 % off. Buying a part already under way: either the whole PDF at full price, or a
// PDF that starts at the current week, at the price of the months left (rounded up to half a
// month).
import type { ProgramSlug } from "@/lib/programs";

export const PARTS = ["pre-saison", "premiere-partie", "deuxieme-partie"] as const satisfies readonly ProgramSlug[];
export type Part = (typeof PARTS)[number];

export const MONTHLY = 1500;
export const PACK_OFF = 0.2;
export const MONTHS: Record<Part, number> = { "pre-saison": 2, "premiere-partie": 4, "deuxieme-partie": 5.5 };
// Length of each part in weeks (the PDF plans and the animations access).
export const WEEKS: Record<Part, number> = { "pre-saison": 8, "premiere-partie": 18, "deuxieme-partie": 23 };

// 15 € a month rounded up to the next ,99: 30 € → 29,99 €, 82,50 € → 82,99 €.
export const to99 = (cents: number) => Math.ceil(Math.round(cents) / 100) * 100 - 1;
export const partPrice = (p: Part) => to99(MONTHS[p] * MONTHLY);

const DAY = 86400000;
// Dates of a part in the season that starts in July of `year` (UTC midnight, inclusive start,
// exclusive end).
export function partDates(p: Part, year: number): { start: number; end: number } {
  const d = (y: number, m: number, day: number) => Date.UTC(y, m - 1, day);
  if (p === "pre-saison") return { start: d(year, 7, 1), end: d(year, 9, 1) };
  if (p === "premiere-partie") return { start: d(year, 9, 1), end: d(year + 1, 1, 4) };
  return { start: d(year + 1, 1, 4), end: d(year + 1, 6, 15) };
}
// The season a date belongs to (it starts on July 1).
const seasonOf = (now: number) => { const t = new Date(now); return t.getUTCMonth() >= 6 ? t.getUTCFullYear() : t.getUTCFullYear() - 1; };
// Today at midnight, Paris time, as UTC midnight of the same calendar day.
export const today = (now = Date.now()) => {
  const [y, m, d] = new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Paris" }).format(new Date(now)).split("-").map(Number);
  return Date.UTC(y, m - 1, d);
};

export type Slot = { part: Part; year: number; start: number; end: number; current: boolean };

// The part under way today, or null during the late-June break.
export function currentSlot(now = Date.now()): Slot | null {
  const t = today(now), y = seasonOf(t);
  for (const part of PARTS) {
    const { start, end } = partDates(part, y);
    if (t >= start && t < end) return { part, year: y, start, end, current: true };
  }
  return null;
}

// The next time a part runs: the one under way, or the next one.
export function slotOf(part: Part, now = Date.now()): Slot {
  const t = today(now);
  for (const y of [seasonOf(t) - 1, seasonOf(t), seasonOf(t) + 1]) {
    const { start, end } = partDates(part, y);
    if (t < end) return { part, year: y, start, end, current: t >= start };
  }
  throw new Error("unreachable");
}

// The 3 parts of a Saison complète bought today: the one under way (or the next one during the
// break), then the two after it.
export function packSlots(now = Date.now()): Slot[] {
  const first = currentSlot(now) ?? slotOf("pre-saison", now);
  const out: Slot[] = [first];
  let { part, year } = first;
  while (out.length < 3) {
    const i = PARTS.indexOf(part);
    part = PARTS[(i + 1) % 3];
    if (part === "pre-saison") year++;
    const { start, end } = partDates(part, year);
    out.push({ part, year, start, end, current: false });
  }
  return out;
}

// For a part under way: the week it is at (1-based) and the months left, rounded up to half a
// month. Null when the part has not started or only just started (first week): full price then.
export function prorata(slot: Slot, now = Date.now()): { week: number; months: number; price: number } | null {
  if (!slot.current) return null;
  const t = today(now);
  const week = Math.floor((t - slot.start) / (7 * DAY)) + 1;
  if (week <= 1) return null;
  const left = (slot.end - t) / (slot.end - slot.start);
  const months = Math.max(0.5, Math.ceil(left * MONTHS[slot.part] * 2) / 2);
  if (months >= MONTHS[slot.part]) return null;
  return { week, months, price: to99(months * MONTHLY) };
}

// The Saison complète price: 20 % off the 3 parts; the first one counts for its months left when
// the buyer takes the pro-rata version.
export function packPrice(slots: Slot[], useProrata: boolean, now = Date.now()) {
  const pr = useProrata ? prorata(slots[0], now) : null;
  const months = (pr ? pr.months : MONTHS[slots[0].part]) + MONTHS[slots[1].part] + MONTHS[slots[2].part];
  const full = (pr ? pr.price : partPrice(slots[0].part)) + partPrice(slots[1].part) + partPrice(slots[2].part);
  return { price: to99(months * MONTHLY * (1 - PACK_OFF)), full, months };
}
// The whole season at full price, for the pages (137,99 € instead of 172,97 €).
export const PACK_FULL = PARTS.reduce((a, p) => a + partPrice(p), 0);
export const PACK_PRICE = to99(PARTS.reduce((a, p) => a + MONTHS[p], 0) * MONTHLY * (1 - PACK_OFF));
export const PACK_MONTHS = PARTS.reduce((a, p) => a + MONTHS[p], 0);
// 3 payments: the pack price split in 3, each rounded up to ,99 (3 × 45,99 €).
export const PACK_INSTALMENT = to99(PACK_PRICE / 3);

// "4 janvier" / "January 4", for the pages and emails.
export const dayLabel = (ms: number, lang: "fr" | "en") => new Date(ms).toLocaleDateString(lang === "fr" ? "fr-FR" : "en-GB", { day: "numeric", month: "long", timeZone: "UTC" });
