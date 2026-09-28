import { createHash } from "node:crypto";
import type Stripe from "stripe";
import { DAY, toOrder } from "@/lib/feedback";

// Referral between teammates. Every buyer gets a personal code (e.g. LUCAS-7K2Q) to share: whoever
// orders with it gets FRIEND_PERCENT off right away. The buyer who shared it earns POINTS_PER_FRIEND
// points per teammate, and every POINTS_FOR_REWARD points (3 teammates) a single-use code of
// SPONSOR_PERCENT off their next program, so the discounts do not pile up.
// Against cheating, a teammate's order only counts VALIDATION_DAYS after it was paid, if it was not
// refunded, and if its email and its card are neither the sponsor's nor those of a teammate who
// already counted (Stripe gives each card a fingerprint). Checked by the daily cron.
// Everything is kept in Stripe: the shared code knows its owner (metadata sponsor = their
// PaymentIntent). The teammate's PaymentIntent keeps who referred them (par_by) and where it stands
// (par_st: attente, ok, doublon, rembourse). The sponsor's keeps their code (par_code), their points
// (par_pts), their counted teammates (par_n) and short hashes of those teammates' emails and cards
// (par_seen).
export const FRIEND_PERCENT = 15;
export const SPONSOR_PERCENT = 15;
export const POINTS_PER_FRIEND = 50;
export const POINTS_FOR_REWARD = 150;
export const VALIDATION_DAYS = 7;

// Stripe coupon names are 40 characters at most.
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
// Short one-way hash of an email or a card fingerprint: enough to spot a repeat, reveals nothing.
const mark = (v: string | null | undefined) => (v ? createHash("sha256").update(`par:${v.trim().toLowerCase()}`).digest("hex").slice(0, 8) : "");
const charge = (pi: Stripe.PaymentIntent) => (typeof pi.latest_charge === "object" ? pi.latest_charge : null);
const marksOf = (pi: Stripe.PaymentIntent) => {
  const c = charge(pi);
  return [mark(c?.billing_details?.email ?? pi.receipt_email), mark(c?.payment_method_details?.card?.fingerprint)].filter(Boolean);
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
      const c = await coupon(s, `FILLEUL${FRIEND_PERCENT}`, FRIEND_PERCENT, `Parrainage coéquipier (-${FRIEND_PERCENT} %)`);
      await s.promotionCodes.create({ promotion: { type: "coupon", coupon: c }, code, metadata: { sponsor: pi } });
      break;
    }
  }
  await s.paymentIntents.update(pi, { metadata: { par_code: code } });
  return code;
}

// After a paid order (webhook): if it used a teammate's code, it waits for the check (par_st).
export async function recordReferral(s: Stripe, session: Stripe.Checkout.Session) {
  const promo = session.discounts?.map((d) => d.promotion_code).find(Boolean);
  if (!promo || typeof session.payment_intent !== "string") return;
  const pc = typeof promo === "string" ? await s.promotionCodes.retrieve(promo) : promo;
  const sponsor = pc.metadata?.sponsor;
  if (!sponsor || sponsor === session.payment_intent) return;
  await s.paymentIntents.update(session.payment_intent, { metadata: { par_by: sponsor, par_st: "attente" } });
}

export type PointsNews = { email: string; lang: "fr" | "en"; firstName: string; friend: string; points: number; code: string | null };

// Daily cron: the teammates' orders that waited long enough, checked one by one. Returns the emails
// to send to the sponsors (points earned, and the code when they reach POINTS_FOR_REWARD).
export async function settleReferrals(s: Stripe, now: number, fail: (id: string, e: unknown) => void): Promise<PointsNews[]> {
  const res = await s.paymentIntents.search({ query: `status:'succeeded' AND metadata['par_st']:'attente'`, limit: 100, expand: ["data.latest_charge"] });
  const news: PointsNews[] = [];
  for (const f of res.data.sort((a, b) => a.created - b.created)) {
    if (now - f.created < VALIDATION_DAYS * DAY) continue;
    try {
      const sp = await s.paymentIntents.retrieve(f.metadata.par_by, { expand: ["latest_charge"] });
      const c = charge(f), refunded = !!c && (c.refunded || c.amount_refunded > 0);
      const seen = (sp.metadata.par_seen ?? "").split(",").filter(Boolean);
      const mine = marksOf(f), taken = new Set([...seen, ...marksOf(sp)]);
      const st = refunded ? "rembourse" : mine.length === 0 || mine.some((m) => taken.has(m)) ? "doublon" : "ok";
      // The teammate is marked first: if the next step fails, the sponsor misses points rather than
      // getting them twice.
      await s.paymentIntents.update(f.id, { metadata: { par_st: st } });
      if (st !== "ok") continue;
      let points = Number(sp.metadata.par_pts || 0) + POINTS_PER_FRIEND, code: string | null = null;
      const o = toOrder(sp);
      if (points >= POINTS_FOR_REWARD) {
        code = `MERCI-${nameOf(o.firstName)}-${tail(f.id)}`;
        if (!(await exists(s, code))) {
          const cp = await coupon(s, `PARRAIN${SPONSOR_PERCENT}`, SPONSOR_PERCENT, `Parrainage : merci (-${SPONSOR_PERCENT} %)`);
          await s.promotionCodes.create({ promotion: { type: "coupon", coupon: cp }, code, max_redemptions: 1, expires_at: now + 365 * DAY, metadata: { reward_for: sp.id } });
        }
        points -= POINTS_FOR_REWARD;
      }
      // Metadata values are 500 characters at most: the oldest marks go first (about 25 teammates kept).
      const all = [...seen, ...mine].join(","), keep = all.length > 450 ? all.slice(-450).replace(/^[^,]*,/, "") : all;
      await s.paymentIntents.update(sp.id, { metadata: { par_pts: String(points), par_n: String(Number(sp.metadata.par_n || 0) + 1), par_seen: keep, ...(code ? { par_r: String(Number(sp.metadata.par_r || 0) + 1) } : {}) } });
      if (o.email) news.push({ email: o.email, lang: o.lang, firstName: o.firstName, friend: f.metadata.firstName ?? "", points, code });
    } catch (e) {
      fail(f.id, e);
    }
  }
  return news;
}
