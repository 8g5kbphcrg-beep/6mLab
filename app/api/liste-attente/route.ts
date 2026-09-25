import { NextRequest, NextResponse } from "next/server";
import { locales, type Lang } from "@/lib/dict";
import { stripe } from "@/lib/feedback";
import { addLead, validEmail } from "@/lib/leads";

// Waiting list of the Fitness & well-being program (home page). No email now: one email on
// launch day.
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
    await addLead(s, email, lang, "forme");
    return page("");
  } catch (e) {
    console.error("[liste-attente]", e);
    return page("?erreur=indisponible");
  }
}
