import { createHmac, timingSafeEqual } from "node:crypto";
import type Stripe from "stripe";
import type { Lang } from "@/lib/dict";

// People who asked for the free session on the home page. No database: each one is a Stripe
// customer with metadata lead=seance, lang, lead_at, and t1/t2/t3 once each tip is sent, or
// unsub=1 after unsubscribing.

export type Lead = { id: string; email: string; lang: Lang; created: number; meta: Record<string, string> };
const toLead = (c: Stripe.Customer): Lead => ({ id: c.id, email: c.email ?? "", lang: c.metadata?.lang === "en" ? "en" : "fr", created: c.created, meta: c.metadata ?? {} });

export const validEmail = (e: string) => e.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);

// Finds the lead for this email, or creates it. A lead who had unsubscribed and asks again is
// subscribed again. kind: "seance" (free session, then 3 tips), "forme", "foot" or "basket"
// (waiting lists: one email on launch day, nothing before), "sport" (a sport proposed on the home
// page, metadata sport; the email is optional there).
// extra: more metadata to save (the questionnaire answers), replacing earlier ones.
export type LeadKind = "seance" | "forme" | "foot" | "basket" | "sport";
export async function addLead(s: Stripe, email: string, lang: Lang, kind: LeadKind = "seance", extra: Record<string, string> = {}): Promise<Lead> {
  // customers.list is up to date immediately (search can lag by a minute).
  const c = (await s.customers.list({ email, limit: 20 })).data.find((x) => x.metadata?.lead === kind);
  if (c) {
    return toLead(c.metadata?.unsub || Object.keys(extra).length ? await s.customers.update(c.id, { metadata: { unsub: "", ...extra } }) : c);
  }
  return toLead(await s.customers.create({ email, metadata: { lead: kind, lang, lead_at: new Date().toISOString(), ...extra } }));
}

// Leads created since `since` (Stripe search, newest first).
export async function recentLeads(s: Stripe, since: number, kind: LeadKind = "seance"): Promise<Lead[]> {
  const out: Lead[] = [];
  let page: string | undefined;
  do {
    const res = await s.customers.search({ query: `metadata['lead']:'${kind}' AND created>${since}`, limit: 100, page });
    out.push(...res.data.map(toLead));
    page = res.next_page ?? undefined;
  } while (page && out.length < 5000);
  return out;
}

// Signed unsubscribe links.
const secret = () => process.env.FEEDBACK_SECRET || process.env.STRIPE_WEBHOOK_SECRET || "";
const sign = (id: string) => createHmac("sha256", secret()).update(`unsub:${id}`).digest("base64url").slice(0, 22);
export const unsubUrl = (site: string, lang: Lang, id: string) => `${site}/api/desinscription?c=${id}&t=${sign(id)}&lang=${lang}`;
export const validUnsub = (id: string, t: string) => {
  if (!secret() || !t) return false;
  const a = Buffer.from(sign(id)), b = Buffer.from(t);
  return a.length === b.length && timingSafeEqual(a, b);
};
