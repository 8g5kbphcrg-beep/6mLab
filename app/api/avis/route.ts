import { NextRequest, NextResponse } from "next/server";
import { cleanAnswers, promoCode, PROMO_PERCENT, stripe, toOrder, validToken, type Stage } from "@/lib/feedback";
import { mailReady, sendPromoCode } from "@/lib/email";

// Saves a feedback questionnaire in the order's metadata (Stripe), then shows the thank-you page.
// After the final one, creates the customer's discount code and emails it.
export async function POST(req: NextRequest) {
  const form = await req.formData();
  const pi = String(form.get("pi") ?? ""), t = String(form.get("t") ?? ""), lang = form.get("lang") === "en" ? "en" : "fr";
  const stage: Stage = form.get("stage") === "end" ? "end" : "mid";
  const page = (extra = "") => NextResponse.redirect(`${req.nextUrl.origin}/${lang}/avis/${pi}?etape=${stage === "mid" ? 1 : 2}&t=${encodeURIComponent(t)}${extra}`, 303);
  const s = stripe();
  if (!s || !/^pi_\w+$/.test(pi) || !validToken(pi, stage, t)) return new NextResponse("Lien invalide", { status: 400 });
  const o = toOrder(await s.paymentIntents.retrieve(pi, { expand: ["latest_charge"] }));
  if (o.meta[stage === "mid" ? "m_at" : "f_at"]) return page();
  const answers = cleanAnswers(stage, o.goals, form);
  if (!answers) return page("&erreur=1");
  const now = new Date().toISOString().slice(0, 16);
  if (stage === "end") {
    const code = await promoCode(s, o);
    await s.paymentIntents.update(pi, { metadata: { ...answers, f_at: now, f_code: code } });
    if (o.email && mailReady()) await sendPromoCode({ email: o.email, lang: o.lang, firstName: o.firstName }, code, PROMO_PERCENT).catch((e) => console.error("[avis] promo mail", e));
  } else {
    await s.paymentIntents.update(pi, { metadata: { ...answers, m_at: now } });
  }
  return page();
}
