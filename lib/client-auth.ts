import { createHash, createHmac, randomInt, timingSafeEqual } from "node:crypto";
import type Stripe from "stripe";
import { DAY } from "@/lib/feedback";
import { redis, redisReady } from "@/lib/redis";
import { ACTIVATE_WITHIN_DAYS, offerOf, type Offer } from "@/lib/access";

// Customer area login: the customer gives the email of their order and receives a 6-digit code
// (valid CODE_MINUTES, MAX_TRIES tries). Once checked, a signed cookie opens the area for the
// visit only (no expiry date, so the browser forgets it when closed) and SESSION_MINUTES at most.
// Orders are found by a hash of the buyer's email saved on their PaymentIntent (metadata em);
// orders paid before it existed are found through their Checkout Session, then tagged.
export const CODE_MINUTES = 10;
export const MAX_TRIES = 5;
export const SESSION_MINUTES = 60;
export const SESSION_COOKIE = "6m_ses";
export const OTP_COOKIE = "6m_otp";

const secret = () => process.env.ACCESS_SECRET || process.env.FEEDBACK_SECRET || process.env.STRIPE_WEBHOOK_SECRET || "";
const sign = (v: string) => createHmac("sha256", secret()).update(`ses:${v}`).digest("base64url").slice(0, 32);
const same = (a: string, b: string) => a.length === b.length && timingSafeEqual(Buffer.from(a), Buffer.from(b));
export const cleanEmail = (e: string) => e.trim().toLowerCase().slice(0, 254);
// Saved on the PaymentIntent: finds the orders of an email without storing it a second time.
export const emailMark = (email: string) => createHash("sha256").update(`em:${cleanEmail(email)}`).digest("hex").slice(0, 24);

// Signed cookie "<email in base64url>.<expiry in ms>.<signature>".
export const sessionCookie = (email: string, now = Date.now()) => {
  const v = `${Buffer.from(cleanEmail(email)).toString("base64url")}.${now + SESSION_MINUTES * 60000}`;
  return `${v}.${sign(v)}`;
};
export function readSession(cookie: string | undefined, now = Date.now()): string | null {
  if (!cookie || !secret()) return null;
  const [e, exp, sig] = cookie.split(".");
  if (!e || !exp || !sig || !same(sign(`${e}.${exp}`), sig) || Number(exp) < now) return null;
  return Buffer.from(e, "base64url").toString();
}
// Short signed cookie between the two steps: which email the code was sent to.
export const otpCookie = (email: string) => `${Buffer.from(cleanEmail(email)).toString("base64url")}.${sign(`otp.${cleanEmail(email)}`)}`;
export function readOtpCookie(cookie: string | undefined): string | null {
  if (!cookie || !secret()) return null;
  const [e, sig] = cookie.split(".");
  if (!e || !sig) return null;
  const email = Buffer.from(e, "base64url").toString();
  return same(sign(`otp.${email}`), sig) ? email : null;
}

export type ClientOrder = { pi: string; created: number; offer: Offer; program: string; start: number | null; refunded: boolean; meta: Record<string, string> };
const toClient = (pi: Stripe.PaymentIntent): ClientOrder => {
  const charge = typeof pi.latest_charge === "object" ? pi.latest_charge : null;
  return { pi: pi.id, created: pi.created * 1000, offer: offerOf(pi.metadata), program: pi.metadata.program, start: pi.metadata.acc_start ? Date.parse(pi.metadata.acc_start) : null, refunded: !!charge?.refunded, meta: pi.metadata };
};

// Every paid 6M Lab order of an email, oldest first. scan (at login): also looks through the
// Checkout Sessions, for orders paid before the mark existed or not yet searchable.
export async function ordersOf(s: Stripe, email: string, scan = false): Promise<ClientOrder[]> {
  const mark = emailMark(email);
  const found = new Map<string, Stripe.PaymentIntent>();
  try {
    for (const pi of (await s.paymentIntents.search({ query: `metadata['em']:'${mark}'`, limit: 20, expand: ["data.latest_charge"] })).data) found.set(pi.id, pi);
  } catch {}
  const since = Math.floor(Date.now() / 1000) - (ACTIVATE_WITHIN_DAYS + 30) * DAY;
  let n = 0;
  if (scan) for await (const cs of s.checkout.sessions.list({ created: { gte: since }, limit: 100 })) {
    if (cs.payment_status === "paid" && typeof cs.payment_intent === "string" && cleanEmail(cs.customer_details?.email ?? "") === cleanEmail(email) && !found.has(cs.payment_intent)) {
      found.set(cs.payment_intent, await s.paymentIntents.update(cs.payment_intent, { metadata: { em: mark }, expand: ["latest_charge"] }));
    }
    if (++n >= 3000) break;
  }
  return [...found.values()].filter((pi) => pi.status === "succeeded" && pi.metadata?.program).map(toClient).sort((a, b) => a.created - b.created);
}

// ---- 6-digit codes (Redis) ---------------------------------------------------------------
const key = (email: string) => `otp:${emailMark(email)}`;

// A new code for this email, or the reason there is none (too many codes asked, no Redis).
export async function newCode(email: string): Promise<{ code: string } | { error: "trop" | "indisponible" }> {
  if (!redisReady()) return { error: "indisponible" };
  const hour = `otpn:${emailMark(email)}:${Math.floor(Date.now() / 3600000)}`;
  const [n] = await redis([["INCR", hour], ["EXPIRE", hour, 3600]]);
  if (Number(n) > 5) return { error: "trop" };
  const code = String(randomInt(0, 1_000_000)).padStart(6, "0");
  await redis([["SET", key(email), `${code}:0`, "EX", CODE_MINUTES * 60]]);
  return { code };
}

// Checks a code: ok, wrong (tries left), or expired / used up.
export async function checkCode(email: string, given: string): Promise<"ok" | "faux" | "expire"> {
  if (!redisReady()) return "expire";
  const [v] = await redis([["GET", key(email)]]);
  if (typeof v !== "string") return "expire";
  const [code, tries] = v.split(":");
  if (/^\d{6}$/.test(given) && same(code, given)) {
    await redis([["DEL", key(email)]]);
    return "ok";
  }
  if (Number(tries) + 1 >= MAX_TRIES) {
    await redis([["DEL", key(email)]]);
    return "expire";
  }
  await redis([["SET", key(email), `${code}:${Number(tries) + 1}`, "KEEPTTL"]]);
  return "faux";
}
