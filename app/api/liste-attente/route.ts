import { NextRequest, NextResponse } from "next/server";
import type Stripe from "stripe";
import { locales, type Lang } from "@/lib/dict";
import { stripe } from "@/lib/feedback";
import { addLead, validEmail, type LeadKind } from "@/lib/leads";

// Waiting lists (no email now: one email on launch day): Fitness & well-being (questionnaire),
// football and basketball (home page). Also the sports proposed on the home page (kind=sport,
// field sport, email optional), counted in the admin page. The questionnaire answers (q_*) are saved with the email; the body
// type, pain, height and weight only with the consent box ticked.
const KEYS = ["q_name", "q_age", "q_sex", "q_goal", "q_zone", "q_level", "q_place", "q_freq", "q_dur"];
const HEALTH = ["q_cur", "q_target", "q_pain", "q_height", "q_weight"];
function answers(form: FormData): Record<string, string> {
  const keys = form.get("q_consent") === "1" ? [...KEYS, ...HEALTH, "q_consent"] : KEYS;
  const out: Record<string, string> = {};
  for (const k of keys) {
    const v = String(form.get(k) ?? "").trim().slice(0, 60);
    if (v && v !== "-1") out[k] = v;
  }
  if (Object.keys(out).length) out.q_at = new Date().toISOString();
  return out;
}
// Each proposal is counted, even from the same person (one per sport): with an email, it joins
// that person's proposals; without, it is saved alone.
async function proposeSport(s: Stripe, email: string, lang: Lang, sport: string) {
  const at = new Date().toISOString();
  if (!email) return s.customers.create({ metadata: { lead: "sport" satisfies LeadKind, lang, lead_at: at, sport } });
  const c = (await s.customers.list({ email, limit: 20 })).data.find((x) => x.metadata?.lead === "sport" && x.metadata?.sport?.toLowerCase() === sport.toLowerCase());
  return c ?? s.customers.create({ email, metadata: { lead: "sport" satisfies LeadKind, lang, lead_at: at, sport } });
}
export async function POST(req: NextRequest) {
  const form = await req.formData();
  const lang = (locales as readonly string[]).includes(String(form.get("lang"))) ? (form.get("lang") as Lang) : "fr";
  const email = String(form.get("email") ?? "").trim().toLowerCase();
  const kind = (["foot", "basket", "sport"] as const).find((k) => k === form.get("kind")) ?? "forme";
  const sport = String(form.get("sport") ?? "").replace(/\s+/g, " ").trim().slice(0, 40);
  const page = (q: string) => NextResponse.redirect(`${req.nextUrl.origin}/${lang}/liste-attente?quoi=${kind}${q}`, 303);
  if (form.get("site")) return page("");
  if (kind === "sport" ? !sport || (email && !validEmail(email)) : !validEmail(email)) return page(kind === "sport" && !sport ? "&erreur=sport" : "&erreur=email");
  const s = stripe();
  if (!s) return page("&erreur=indisponible");
  try {
    if (kind === "sport") await proposeSport(s, email, lang, sport);
    else await addLead(s, email, lang, kind, kind === "forme" ? answers(form) : {});
    return page("");
  } catch (e) {
    console.error("[liste-attente]", e);
    return page("?erreur=indisponible");
  }
}
