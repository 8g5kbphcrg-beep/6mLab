import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { locales, type Lang } from "@/lib/dict";
import { programs, programSlugs, type ProgramSlug } from "@/lib/programs";
import { prices, RUNNING_PRICE } from "@/lib/checkout";
import { comboTitle, validGoals } from "@/lib/goals";
import { legalPaths } from "@/lib/legal";

export async function POST(req: NextRequest) {
  const form = await req.formData();
  const lang = (locales as readonly string[]).includes(String(form.get("lang"))) ? (form.get("lang") as Lang) : "fr";
  const slug = form.get("program") as ProgramSlug;
  const goals = form.getAll("goal").map(String);
  const running = form.get("running") === "on";
  const origin = req.nextUrl.origin;
  const back = (reason: string) =>
    NextResponse.redirect(`${origin}/${lang}/programmes/${programSlugs.includes(slug) ? slug : ""}?paiement=${reason}#acheter`, 303);

  if (!programSlugs.includes(slug) || !validGoals(goals) || form.get("consent") !== "on") return back("invalide");

  const key = process.env.STRIPE_SECRET_KEY;
  // Live payments stay off until the legal pages are filled in (SIRET, address, mediator).
  if (!key || (key.startsWith("sk_live_") && process.env.STRIPE_ALLOW_LIVE !== "1")) return back("indisponible");

  const p = programs[lang][slug];
  const meta = { program: slug, goals: goals.join("+"), running: running ? "oui" : "non", lang };
  const stripe = new Stripe(key);
  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      locale: lang,
      line_items: [{
        quantity: 1,
        price_data: {
          currency: "eur",
          unit_amount: prices[slug],
          product_data: { name: `6M Lab · ${p.name}`, description: `${comboTitle(goals, lang)} · ${p.duration}` },
        },
      }, ...(running ? [{
        quantity: 1,
        price_data: {
          currency: "eur",
          unit_amount: RUNNING_PRICE,
          product_data: { name: lang === "fr" ? "Option course à pied" : "Running option", description: lang === "fr" ? "Séances de 30 à 45 min" : "30 to 45 min sessions" },
        },
      }] : [])],
      metadata: { ...meta, consent: new Date().toISOString() },
      payment_intent_data: { metadata: meta },
      custom_text: {
        submit: {
          message: lang === "fr"
            ? `En payant, tu acceptes les CGV (${origin}${legalPaths.fr.cgv}) et renonces à ton droit de rétractation une fois le programme envoyé.`
            : `By paying, you accept the terms of sale (${origin}${legalPaths.en.cgv}) and waive your right of withdrawal once the program has been sent.`,
        },
      },
      success_url: `${origin}/${lang}/merci?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/${lang}/programmes/${slug}#acheter`,
    });
    return NextResponse.redirect(session.url!, 303);
  } catch (e) {
    console.error("[checkout]", e);
    return back("indisponible");
  }
}
