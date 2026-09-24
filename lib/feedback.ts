import { createHmac, timingSafeEqual } from "node:crypto";
import Stripe from "stripe";
import type { Lang } from "@/lib/dict";
import { goalName, type GoalId } from "@/lib/goals";
import type { ProgramSlug } from "@/lib/programs";

// Customer feedback, asked twice by email: 2 weeks after the purchase ("mid") and at the end of
// the program ("end"). No database: answers are stored in the metadata of the order's Stripe
// PaymentIntent (keys below, values up to 500 characters), where the admin page reads them.

export type Stage = "mid" | "end";
export const DAY = 86400;
// When each email goes out, in days after the purchase.
export const whenDays = (stage: Stage, program: ProgramSlug) => (stage === "mid" ? 14 : program === "pre-saison" ? 56 : 84);
export const PROMO_PERCENT = 15;

// STRIPE_API_HOST (e.g. "localhost:12111") points to a local Stripe mock, for tests only.
const mock = process.env.STRIPE_API_HOST?.split(":");
export const stripe = () => (process.env.STRIPE_SECRET_KEY ? new Stripe(process.env.STRIPE_SECRET_KEY, mock ? { host: mock[0], port: Number(mock[1]), protocol: "http" } : undefined) : null);

// Signed links: only the customer who received the email can answer for their order.
const secret = () => process.env.FEEDBACK_SECRET || process.env.STRIPE_WEBHOOK_SECRET || "";
export const token = (pi: string, stage: Stage) => createHmac("sha256", secret()).update(`${pi}:${stage}`).digest("base64url").slice(0, 22);
export const validToken = (pi: string, stage: Stage, t: string) => {
  if (!secret() || !t) return false;
  const a = Buffer.from(token(pi, stage)), b = Buffer.from(t);
  return a.length === b.length && timingSafeEqual(a, b);
};
export const formUrl = (site: string, lang: Lang, pi: string, stage: Stage) => `${site}/${lang}/avis/${pi}?etape=${stage === "mid" ? 1 : 2}&t=${token(pi, stage)}`;

type Opt = [value: string, fr: string, en: string];
export type Question = { key: string; kind: "choice" | "stars" | "nps" | "text" | "consent"; fr: string; en: string; opts?: Opt[]; optional?: boolean };

const progress: Opt[] = [["beaucoup", "Oui, beaucoup", "Yes, a lot"], ["un-peu", "Un peu", "A little"], ["pas-vraiment", "Pas vraiment", "Not really"], ["trop-tot", "Trop tôt pour le dire", "Too early to tell"]];

export const questions = (stage: Stage, goals: GoalId[]): Question[] =>
  stage === "mid"
    ? [
        { key: "m_clear", kind: "choice", fr: "Les séances sont-elles claires ?", en: "Are the sessions clear?", opts: [["oui", "Oui", "Yes"], ["a-peu-pres", "À peu près", "More or less"], ["non", "Non", "No"]] },
        { key: "m_level", kind: "choice", fr: "Le niveau est-il adapté ?", en: "Is the level right for you?", opts: [["facile", "Trop facile", "Too easy"], ["bien", "Bien", "Just right"], ["dur", "Trop dur", "Too hard"]] },
        { key: "m_anim", kind: "choice", fr: "Les animations des exercices t'aident-elles ?", en: "Do the exercise animations help?", opts: [["oui", "Oui", "Yes"], ["un-peu", "Un peu", "A little"], ["non", "Non", "No"], ["pas-vues", "Je ne les ai pas vues", "I haven't seen them"]] },
        { key: "m_note", kind: "text", fr: "Un problème ou une question ?", en: "Any problem or question?", optional: true },
      ]
    : [
        { key: "f_stars", kind: "stars", fr: "Ta note globale", en: "Your overall rating" },
        ...goals.filter((g) => g !== "reathletisation").map((g): Question => ({ key: `fp_${g}`, kind: "choice", fr: `As-tu progressé en ${goalName(g, "fr").toLowerCase()} ?`, en: `Did you improve in ${goalName(g, "en").toLowerCase()}?`, opts: progress })),
        { key: "f_nps", kind: "nps", fr: "Recommanderais-tu 6M Lab à un coéquipier ou une coéquipière ?", en: "Would you recommend 6M Lab to a teammate?" },
        { key: "f_best", kind: "text", fr: "L'exercice que tu as préféré", en: "Your favourite exercise", optional: true },
        { key: "f_change", kind: "text", fr: "Un exercice que tu changerais", en: "An exercise you would change", optional: true },
        { key: "f_improve", kind: "text", fr: "Qu'est-ce qu'on devrait améliorer ?", en: "What should we improve?", optional: true },
        { key: "f_text", kind: "text", fr: "Ton témoignage en quelques phrases", en: "Your review in a few sentences", optional: true },
        { key: "f_pub", kind: "consent", fr: "J'accepte que mon témoignage soit publié sur le site avec mon prénom.", en: "I agree that my review may be published on the website with my first name.", optional: true },
      ];

// Keeps only known answers, in the expected format.
export function cleanAnswers(stage: Stage, goals: GoalId[], form: FormData): Record<string, string> | null {
  const out: Record<string, string> = {};
  for (const q of questions(stage, goals)) {
    const v = String(form.get(q.key) ?? "").trim();
    if (q.kind === "choice" && q.opts!.some((o) => o[0] === v)) out[q.key] = v;
    else if (q.kind === "stars" && /^[1-5]$/.test(v)) out[q.key] = v;
    else if (q.kind === "nps" && /^(10|[0-9])$/.test(v)) out[q.key] = v;
    else if (q.kind === "text" && v) out[q.key] = v.replace(/\s+/g, " ").slice(0, 480);
    else if (q.kind === "consent") out[q.key] = v === "on" ? "1" : "0";
    else if (!q.optional) return null;
  }
  return out;
}

// A 6M Lab order, as read from Stripe.
export type FeedbackOrder = {
  id: string; created: number; lang: Lang; program: ProgramSlug; goals: GoalId[]; firstName: string; email: string | null; meta: Record<string, string>;
};
export const toOrder = (pi: Stripe.PaymentIntent): FeedbackOrder => {
  const m = pi.metadata ?? {};
  const charge = typeof pi.latest_charge === "object" ? pi.latest_charge : null;
  return {
    id: pi.id, created: pi.created, lang: m.lang === "en" ? "en" : "fr", program: m.program as ProgramSlug,
    goals: (m.goals ?? "").split("+").filter(Boolean) as GoalId[], firstName: m.firstName ?? "", email: charge?.billing_details?.email ?? pi.receipt_email ?? null, meta: m,
  };
};

// Every paid 6M Lab order (Stripe search, newest first). Stripe's search language can't mix AND
// and OR in one query, so each program is searched separately.
export async function paidOrders(s: Stripe, since?: number): Promise<FeedbackOrder[]> {
  const out: FeedbackOrder[] = [];
  for (const program of ["pre-saison", "maintien-saison"]) {
    const query = `status:'succeeded' AND metadata['program']:'${program}'${since ? ` AND created>${since}` : ""}`;
    let page: string | undefined;
    do {
      const res = await s.paymentIntents.search({ query, limit: 100, page, expand: ["data.latest_charge"] });
      out.push(...res.data.map(toOrder));
      page = res.next_page ?? undefined;
    } while (page && out.length < 2000);
  }
  return out.sort((a, b) => b.created - a.created);
}

// A single-use discount code for the next program, given after the final questionnaire.
export async function promoCode(s: Stripe, o: FeedbackOrder): Promise<string> {
  const couponId = `AVIS${PROMO_PERCENT}`;
  try { await s.coupons.retrieve(couponId); } catch { await s.coupons.create({ id: couponId, percent_off: PROMO_PERCENT, duration: "once", name: `Merci pour ton avis (-${PROMO_PERCENT} %)` }); }
  const code = `MERCI-${(o.firstName.normalize("NFD").replace(/[^A-Za-z]/g, "").toUpperCase() || "6M").slice(0, 8)}-${o.id.replace(/[^A-Za-z0-9]/g, "").slice(-5).toUpperCase()}`;
  const found = await s.promotionCodes.list({ code, limit: 1 });
  if (found.data[0]) return code;
  await s.promotionCodes.create({ promotion: { type: "coupon", coupon: couponId }, code, max_redemptions: 1, expires_at: Math.floor(Date.now() / 1000) + 365 * DAY });
  return code;
}
