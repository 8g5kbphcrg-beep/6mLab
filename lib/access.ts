import { createHmac, randomBytes, timingSafeEqual } from "node:crypto";
import type Stripe from "stripe";
import { DAY } from "@/lib/feedback";

// Customer area: the exercise animations (library and the eye links of the program PDFs) are for
// paying customers only, while their program lasts.
// - Key: the order reference from the confirmation email (last 12 characters of the Stripe
//   Checkout Session id), checked against Stripe: paid, not refunded.
// - The access starts the first time the customer opens it (after a confirmation screen), not at
//   purchase, and lasts the program plus 2 weeks: Pré-saison 10 weeks, Maintien 14, Pack 22. It
//   must be started within 12 months of the purchase and cannot be paused.
// - 3 devices at most per order (a random id per browser), reset from the admin page.
// State is kept on the order's PaymentIntent metadata: ref (lower case), acc_start (ISO date),
// acc_dev (device ids, comma separated). Each device then gets a signed cookie valid until the
// end of the access, so the pages do not call Stripe on every visit.

export const MARGIN_WEEKS = 2;
export const MAX_DEVICES = 3;
export const ACTIVATE_WITHIN_DAYS = 365;
export const ACCESS_COOKIE = "6m_acc";
export const DEVICE_COOKIE = "6m_dev";

// Exercises of the free session: open to everyone (the session PDF and its emails link to them).
export const FREE_EXERCISES = ["cheville-mur", "ouverture-hanche", "equilibre", "saut-reception", "pont-fessier", "nordic", "gainage-lateral", "ytw"];

export type Offer = "pre-saison" | "maintien-saison" | "pack";
export const PROGRAM_WEEKS: Record<Offer, number> = { "pre-saison": 8, "maintien-saison": 12, pack: 20 };
export const accessWeeks = (o: Offer) => PROGRAM_WEEKS[o] + MARGIN_WEEKS;
export const offerOf = (m: Record<string, string>): Offer => (m.pack === "oui" ? "pack" : m.program === "maintien-saison" ? "maintien-saison" : "pre-saison");
export const refOf = (sessionId: string) => sessionId.slice(-12);
export const cleanRef = (s: string) => s.replace(/[^A-Za-z0-9]/g, "").slice(-12).toLowerCase();

export type Order = { pi: string; created: number; offer: Offer; start: number | null; devices: string[]; refunded: boolean; firstName: string; lang: string };
export const endOf = (o: Pick<Order, "offer" | "start">, start = o.start) => (start ?? 0) + accessWeeks(o.offer) * 7 * DAY * 1000;

// The order behind a reference, or null. Looks up the ref saved on the PaymentIntent; orders
// paid before that existed are found through their Checkout Session, then tagged.
export async function findOrder(s: Stripe, raw: string): Promise<Order | null> {
  const ref = cleanRef(raw);
  if (ref.length !== 12) return null;
  let pi: Stripe.PaymentIntent | null = null;
  try {
    pi = (await s.paymentIntents.search({ query: `metadata['ref']:'${ref}'`, limit: 1, expand: ["data.latest_charge"] })).data[0] ?? null;
  } catch {}
  if (!pi) {
    const since = Math.floor(Date.now() / 1000) - (ACTIVATE_WITHIN_DAYS + 30) * DAY;
    let n = 0;
    for await (const cs of s.checkout.sessions.list({ created: { gte: since }, limit: 100 })) {
      if (cs.id.slice(-12).toLowerCase() === ref && cs.payment_status === "paid" && typeof cs.payment_intent === "string") {
        pi = await s.paymentIntents.update(cs.payment_intent, { metadata: { ref }, expand: ["latest_charge"] });
        break;
      }
      if (++n >= 5000) break;
    }
  }
  return pi ? toOrder(pi) : null;
}

// The order of a PaymentIntent (from the customer area), or null.
export async function findOrderById(s: Stripe, pi: string): Promise<Order | null> {
  return /^pi_\w+$/.test(pi) ? toOrder(await s.paymentIntents.retrieve(pi, { expand: ["latest_charge"] })) : null;
}

function toOrder(pi: Stripe.PaymentIntent): Order | null {
  if (pi.status !== "succeeded" || !pi.metadata?.program) return null;
  const m = pi.metadata;
  const charge = typeof pi.latest_charge === "object" ? pi.latest_charge : null;
  return {
    pi: pi.id, created: pi.created * 1000, offer: offerOf(m), start: m.acc_start ? Date.parse(m.acc_start) : null,
    devices: (m.acc_dev ?? "").split(",").filter(Boolean), refunded: !!charge?.refunded, firstName: m.firstName ?? "", lang: m.lang ?? "fr",
  };
}

export type Check =
  | { ok: true; end: number; start: number }
  | { ok: false; why: "inconnue" | "remboursee" | "trop-tard" | "expiree" | "appareils" | "a-confirmer"; end?: number; start?: number };

// What happens when this device opens the access now (confirmed: the customer said yes on the
// confirmation screen). Saves the start and the device on the order when it is allowed.
export async function openAccess(s: Stripe, o: Order | null, device: string, confirmed: boolean, now = Date.now()): Promise<Check> {
  if (!o) return { ok: false, why: "inconnue" };
  if (o.refunded) return { ok: false, why: "remboursee" };
  if (o.start === null) {
    if (now - o.created > ACTIVATE_WITHIN_DAYS * DAY * 1000) return { ok: false, why: "trop-tard" };
    if (!confirmed) return { ok: false, why: "a-confirmer", start: now, end: endOf(o, now) };
    await s.paymentIntents.update(o.pi, { metadata: { acc_start: new Date(now).toISOString(), acc_dev: device } });
    return { ok: true, start: now, end: endOf(o, now) };
  }
  const end = endOf(o);
  if (now > end) return { ok: false, why: "expiree", start: o.start, end };
  if (!o.devices.includes(device)) {
    if (o.devices.length >= MAX_DEVICES) return { ok: false, why: "appareils", start: o.start, end };
    await s.paymentIntents.update(o.pi, { metadata: { acc_dev: [...o.devices, device].join(",") } });
  }
  return { ok: true, start: o.start, end };
}

// Signed cookie: "<pi>.<device>.<end in ms>.<signature>".
const secret = () => process.env.ACCESS_SECRET || process.env.FEEDBACK_SECRET || process.env.STRIPE_WEBHOOK_SECRET || "";
const sign = (v: string) => createHmac("sha256", secret()).update(`acc:${v}`).digest("base64url").slice(0, 32);
export const accessCookie = (pi: string, device: string, end: number) => {
  const v = `${pi}.${device}.${end}`;
  return `${v}.${sign(v)}`;
};
// The end of the access (ms) when the cookie is valid and not expired, else null.
export function readAccess(cookie: string | undefined, device: string | undefined, now = Date.now()): number | null {
  if (!cookie || !secret()) return null;
  const parts = cookie.split(".");
  if (parts.length !== 4) return null;
  const [pi, dev, end, sig] = parts;
  const a = Buffer.from(sign(`${pi}.${dev}.${end}`)), b = Buffer.from(sig);
  if (a.length !== b.length || !timingSafeEqual(a, b) || (device && dev !== device)) return null;
  const e = Number(end);
  return e > now ? e : null;
}
export const newDevice = () => randomBytes(6).toString("base64url");

