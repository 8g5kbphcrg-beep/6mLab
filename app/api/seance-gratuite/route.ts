import { NextRequest, NextResponse } from "next/server";
import { locales, SITE, type Lang } from "@/lib/dict";
import { stripe } from "@/lib/feedback";
import { addLead, unsubUrl, validEmail } from "@/lib/leads";
import { mailReady, sendFreeSession } from "@/lib/email";

// Free session form (home page): saves the email as a lead in Stripe and sends the session PDF.
// The 3 tips follow with the daily cron.
export async function POST(req: NextRequest) {
  const form = await req.formData();
  const lang = (locales as readonly string[]).includes(String(form.get("lang"))) ? (form.get("lang") as Lang) : "fr";
  const email = String(form.get("email") ?? "").trim().toLowerCase();
  const page = (q: string) => NextResponse.redirect(`${req.nextUrl.origin}/${lang}/seance-gratuite${q}`, 303);
  // "site" is a hidden field left empty by people and filled in by spam bots.
  if (form.get("site")) return page("");
  if (!validEmail(email)) return page("?erreur=email");
  const s = stripe();
  if (!s || !mailReady()) return page("?erreur=indisponible");
  try {
    const lead = await addLead(s, email, lang);
    await sendFreeSession(email, lang, unsubUrl(SITE, lang, lead.id));
    return page("");
  } catch (e) {
    console.error("[seance-gratuite]", e);
    return page("?erreur=indisponible");
  }
}
