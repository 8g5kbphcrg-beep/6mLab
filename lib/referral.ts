import { createHash } from "node:crypto";
import type Stripe from "stripe";
import { DAY, toOrder } from "@/lib/feedback";

// Referral between teammates. Every buyer gets a personal code (e.g. LUCAS-7K2Q) to share: whoever
// orders with it gets FRIEND_PERCENT off, and the buyer who shared it then receives, by email, a
// single-use code of SPONSOR_PERCENT off their next program (one per teammate who orders).
// Everything is kept in Stripe: the shared code knows its owner (metadata sponsor = their
// PaymentIntent), and the owner's PaymentIntent keeps their code (par_code) and how many teammates
// ordered with it (par_n).
export const FRIEND_PERCENT = 15;
export const SPONSOR_PERCENT = 15;

const coupon = async (s: Stripe, id: string, percent: number, name: string) => {
  try { await s.coupons.retrieve(id); } catch { await s.coupons.create({ id, percent_off: percent, duration: "once", name }); }
  return id;
};
const exists = async (s: Stripe, code: string) => !!(await s.promotionCodes.list({ code, limit: 1 })).data[0];
const nameOf = (firstName: string) => (firstName.normalize("NFD").replace(/[^A-Za-z]/g, "").toUpperCase() || "6M").slice(0, 8);
// 4 letters and digits drawn from an id, without the ones that look alike (0/O, 1/I/L).
const tail = (id: string, salt = 0) => {
  const abc = "23456789ABCDEFGHJKMNPQRSTUVWXYZ";
  const h = createHash("sha256").update(`${id}:${salt}`).digest();
  return [0, 1, 2, 3].map((i) => abc[h[i] % abc.length]).join("");
};

// The buyer's code to share, created once and saved on their PaymentIntent.
export async function referralCode(s: Stripe, pi: string, firstName: string, known?: string): Promise<string> {
  if (known) return known;
  // The rare code already taken by another buyer (same first name) gets other letters.
  let code = "";
  for (let salt = 0; ; salt++) {
    code = `${nameOf(firstName)}-${tail(pi, salt)}`;
    const found = (await s.promotionCodes.list({ code, limit: 1 })).data[0];
    if (found?.metadata?.sponsor === pi) break;
    if (!found) {
      const c = await coupon(s, `FILLEUL${FRIEND_PERCENT}`, FRIEND_PERCENT, `Parrainage : -${FRIEND_PERCENT} % offert par un coéquipier`);
      await s.promotionCodes.create({ promotion: { type: "coupon", coupon: c }, code, metadata: { sponsor: pi } });
      break;
    }
  }
  await s.paymentIntents.update(pi, { metadata: { par_code: code } });
  return code;
}

export type Reward = { email: string; lang: "fr" | "en"; firstName: string; code: string; friend: string; count: number };

// After a paid order: if it used a teammate's code, that teammate's reward code (or null). The
// reward code is drawn from the order, so a webhook sent twice by Stripe gives it once.
// No reward when the code's owner uses it on their own order.
export async function sponsorReward(s: Stripe, session: Stripe.Checkout.Session): Promise<Reward | null> {
  const promo = session.discounts?.map((d) => d.promotion_code).find(Boolean);
  if (!promo) return null;
  const pc = typeof promo === "string" ? await s.promotionCodes.retrieve(promo) : promo;
  const sponsorPi = pc.metadata?.sponsor;
  if (!sponsorPi) return null;
  const sponsor = toOrder(await s.paymentIntents.retrieve(sponsorPi, { expand: ["latest_charge"] }));
  const buyer = (session.customer_details?.email ?? "").toLowerCase();
  if (!sponsor.email || sponsor.email.toLowerCase() === buyer || session.payment_intent === sponsorPi) return null;
  const code = `MERCI-${nameOf(sponsor.firstName)}-${tail(session.id)}`;
  if (await exists(s, code)) return null;
  const c = await coupon(s, `PARRAIN${SPONSOR_PERCENT}`, SPONSOR_PERCENT, `Parrainage : merci (-${SPONSOR_PERCENT} %)`);
  await s.promotionCodes.create({ promotion: { type: "coupon", coupon: c }, code, max_redemptions: 1, expires_at: Math.floor(Date.now() / 1000) + 365 * DAY, metadata: { reward_for: sponsorPi } });
  const count = Number(sponsor.meta.par_n || 0) + 1;
  await s.paymentIntents.update(sponsorPi, { metadata: { par_n: String(count) } });
  return { email: sponsor.email, lang: sponsor.lang, firstName: sponsor.firstName, code, friend: session.metadata?.firstName ?? "", count };
}
