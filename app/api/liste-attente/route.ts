import { NextRequest, NextResponse } from "next/server";
import { locales, type Lang } from "@/lib/dict";
import { stripe } from "@/lib/feedback";
import { addLead, validEmail } from "@/lib/leads";

// Waiting list of the Fitness & well-being program (home page and questionnaire). No email now:
// one email on launch day. The questionnaire answers (q_*) are saved with the email; the body
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
export async function POST(req: NextRequest) {
  const form = await req.formData();
  const lang = (locales as readonly string[]).includes(String(form.get("lang"))) ? (form.get("lang") as Lang) : "fr";
  const email = String(form.get("email") ?? "").trim().toLowerCase();
  const page = (q: string) => NextResponse.redirect(`${req.nextUrl.origin}/${lang}/liste-attente${q}`, 303);
  if (form.get("site")) return page("");
  if (!validEmail(email)) return page("?erreur=email");
  const s = stripe();
  if (!s) return page("?erreur=indisponible");
  try {
    await addLead(s, email, lang, "forme", answers(form));
    return page("");
  } catch (e) {
    console.error("[liste-attente]", e);
    return page("?erreur=indisponible");
  }
}
