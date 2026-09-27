import type Stripe from "stripe";
import type { Lang } from "@/lib/dict";
import { programs, programSlugs, type ProgramSlug } from "@/lib/programs";
import { goalsTitle, validGoals } from "@/lib/goals";
import { DAY } from "@/lib/feedback";

// Abandoned carts: payment pages that expired in the last 24 hours (Stripe keeps them open 24 h),
// whose buyer accepted offers by email on that page, and who did not order since. The daily cron
// sees each expiry once, so each cart gets a single reminder; one per email address.
export type Cart = { id: string; email: string; lang: Lang; firstName: string; what: string; total: number; link: string };

export async function abandonedCarts(s: Stripe, now: number): Promise<Cart[]> {
  const expired: Stripe.Checkout.Session[] = [], bought = new Set<string>();
  for await (const cs of s.checkout.sessions.list({ created: { gte: now - 3 * DAY }, limit: 100 })) {
    const email = cs.customer_details?.email?.toLowerCase();
    if (cs.status === "complete" && email) bought.add(email);
    if (cs.status === "expired" && cs.expires_at > now - DAY && cs.expires_at <= now) expired.push(cs);
  }
  const out: Cart[] = [], seen = new Set<string>();
  for (const cs of expired) {
    const email = cs.customer_details?.email?.toLowerCase(), link = cs.after_expiration?.recovery?.url;
    if (!email || !link || cs.consent?.promotions !== "opt_in" || cs.metadata?.relance || bought.has(email) || seen.has(email)) continue;
    seen.add(email);
    const m = cs.metadata ?? {}, lang: Lang = m.lang === "en" ? "en" : "fr";
    const slug = (programSlugs as readonly string[]).includes(m.program) ? (m.program as ProgramSlug) : "pre-saison";
    const name = m.pack === "oui" ? (lang === "fr" ? "Pack Saison complète" : "Full season pack") : programs[lang][slug].name;
    const g = (m.goals ?? "").split("+"), goals = validGoals(g) ? goalsTitle(g, lang) : "";
    out.push({ id: cs.id, email, lang, firstName: m.firstName ?? "", what: goals ? `${name} (${goals})` : name, total: cs.amount_total ?? 0, link });
  }
  return out;
}
