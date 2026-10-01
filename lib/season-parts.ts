// The handball season in 3 parts, sold one by one or together ("Saison complète"):
// - Pré-saison: July and August (2 months);
// - 1re partie de saison: September to the end of the Christmas holidays (4 months);
// - 2e partie de saison: January to mid-June, finals included (5.5 months). The regular seasons
//   end in May from U15 to seniors, but regional finals and national finals run until mid-June.
// Then 2 weeks of real break in late June before the next Pré-saison.
// Prices follow the work each part asks for, not only its length: the Pré-saison (3 to 4 hard
// sessions a week) costs the most per month. The Saison complète is the next 3 parts in a row with
// 20 % off (199,99 € instead of 249,97 €, or 3 × 66,99 €). Buying a part already under way: either
// the whole PDF at full price, or a PDF that starts at the current week, at the part's price for
// the share of weeks left (rounded up to the next ,99).
import type { ProgramSlug } from "@/lib/programs";

export const PARTS = ["pre-saison", "premiere-partie", "deuxieme-partie"] as const satisfies readonly ProgramSlug[];
export type Part = (typeof PARTS)[number];

export const PACK_OFF = 0.2;
export const PRICES: Record<Part, number> = { "pre-saison": 5999, "premiere-partie": 8999, "deuxieme-partie": 9999 };
export const MONTHS: Record<Part, number> = { "pre-saison": 2, "premiere-partie": 4, "deuxieme-partie": 5.5 };
// Length of each part in weeks (the PDF plans and the animations access).
export const WEEKS: Record<Part, number> = { "pre-saison": 8, "premiere-partie": 18, "deuxieme-partie": 23 };

// Rounded up to the next ,99: 52,49 € → 52,99 €; 199,98 € → 199,99 €.
export const to99 = (cents: number) => Math.ceil((Math.round(cents) + 1) / 100) * 100 - 1;
export const partPrice = (p: Part) => PRICES[p];

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

// For a part under way: the week it is at (1-based), the weeks left and their price (the part's
// price for the share of weeks left). Null when the part has not started or is in its first week:
// full price then.
export function prorata(slot: Slot, now = Date.now()): { week: number; weeks: number; price: number } | null {
  if (!slot.current) return null;
  const t = today(now);
  const week = Math.floor((t - slot.start) / (7 * DAY)) + 1;
  if (week <= 1) return null;
  const weeks = Math.max(1, WEEKS[slot.part] - week + 1);
  return { week, weeks, price: to99((PRICES[slot.part] * weeks) / WEEKS[slot.part]) };
}

// The Saison complète price: 20 % off the 3 parts; the first one counts for its weeks left when
// the buyer takes the pro-rata version.
export function packPrice(slots: Slot[], useProrata: boolean, now = Date.now()) {
  const pr = useProrata ? prorata(slots[0], now) : null;
  const full = (pr ? pr.price : partPrice(slots[0].part)) + partPrice(slots[1].part) + partPrice(slots[2].part);
  return { price: to99(full * (1 - PACK_OFF)), full };
}
// The whole season at full price, for the pages: 199,99 € instead of 249,97 €.
export const PACK_FULL = PARTS.reduce((a, p) => a + partPrice(p), 0);
export const PACK_PRICE = to99(PACK_FULL * (1 - PACK_OFF));
export const PACK_WEEKS = PARTS.reduce((a, p) => a + WEEKS[p], 0);
// 3 payments: the pack price split in 3, each rounded up to ,99 (3 × 66,99 €).
export const PACK_INSTALMENT = to99(PACK_PRICE / 3);

// "4 janvier" / "4 January", and "1er juillet" in French, for the pages and emails.
export const dayLabel = (ms: number, lang: "fr" | "en") => {
  const s = new Date(ms).toLocaleDateString(lang === "fr" ? "fr-FR" : "en-GB", { day: "numeric", month: "long", timeZone: "UTC" });
  return lang === "fr" ? s.replace(/^1 /, "1er ") : s;
};

// What a buyer is offered today, for a part or the Saison complète: the parts and their dates,
// the price of the whole thing, and (when the first part is under way) the pro-rata option.
// Shown by the page (BuyForm) and recomputed by the checkout, which never trusts the form.
export type Quote = {
  slots: Slot[];
  price: number;
  before: number | null;
  pr: { week: number; weeks: number; price: number; before: number | null } | null;
};
export function quote(what: Part | "pack", now = Date.now()): Quote {
  if (what !== "pack") {
    const slot = slotOf(what, now);
    const p = prorata(slot, now);
    return { slots: [slot], price: PRICES[what], before: null, pr: p && { ...p, before: null } };
  }
  const slots = packSlots(now);
  const whole = packPrice(slots, false, now), p = prorata(slots[0], now), part = p && packPrice(slots, true, now);
  return { slots, price: whole.price, before: whole.full, pr: p && part ? { ...p, price: part.price, before: part.full } : null };
}
