import { NextRequest, NextResponse } from "next/server";
import { locales, type Lang } from "@/lib/dict";
import { programs, programSlugs, type ProgramSlug } from "@/lib/programs";
import { genders, PACK_EXTRA, prices, RUNNING_PRICE, SECOND_GOAL_PRICE, type Gender } from "@/lib/checkout";
import { goalName, goalsTitle, hasSecondGoal, validGoals } from "@/lib/goals";
import { legalPaths } from "@/lib/legal";
import { stripe as stripeClient } from "@/lib/feedback";

export async function POST(req: NextRequest) {
  const form = await req.formData();
  const lang = (locales as readonly string[]).includes(String(form.get("lang"))) ? (form.get("lang") as Lang) : "fr";
  const slug = form.get("program") as ProgramSlug;
  const goals = form.getAll("goal").map(String);
  const running = form.get("running") === "on";
  const pack = form.get("pack") === "on" && slug === "pre-saison";
  const firstName = String(form.get("firstName") ?? "").trim().slice(0, 50);
  const age = Number(form.get("age"));
  const gender = String(form.get("gender")) as Gender;
  const profileOk = firstName.length > 0 && Number.isInteger(age) && age >= 10 && age <= 99 && genders.includes(gender);
  const origin = req.nextUrl.origin;
  const back = (reason: string) =>
    NextResponse.redirect(`${origin}/${lang}/programmes/${programSlugs.includes(slug) ? slug : ""}?paiement=${reason}#acheter`, 303);

  if (!programSlugs.includes(slug) || !validGoals(goals) || !profileOk || form.get("consent") !== "on") return back("invalide");

  const key = process.env.STRIPE_SECRET_KEY;
  // Live payments stay off until the legal pages are filled in (SIRET, address, mediator).
  if (!key || (key.startsWith("sk_live_") && process.env.STRIPE_ALLOW_LIVE !== "1")) return back("indisponible");

  const p = programs[lang][slug];
  const meta = { program: slug, goals: goals.join("+"), running: running ? "oui" : "non", ...(pack ? { pack: "oui" } : {}), firstName, age: String(age), gender, lang };
  const stripe = stripeClient()!;
  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      locale: lang,
      line_items: [{
        quantity: 1,
        price_data: {
          currency: "eur",
          unit_amount: prices[slug],
          product_data: { name: `6M Lab · ${p.name}`, description: `${goalsTitle(goals, lang)} · ${p.duration}` },
        },
      }, ...(hasSecondGoal(goals) ? [{
        quantity: 1,
        price_data: {
          currency: "eur",
          unit_amount: SECOND_GOAL_PRICE,
          product_data: { name: lang === "fr" ? "Deuxième objectif" : "Second goal", description: goalName(goals[1], lang) },
        },
      }] : []), ...(pack ? [{
        quantity: 1,
        price_data: {
          currency: "eur",
          unit_amount: PACK_EXTRA,
          product_data: { name: `6M Lab · ${programs[lang]["maintien-saison"].name}`, description: lang === "fr" ? `Pack Saison complète · ${goalsTitle(goals, lang)} · 12 semaines` : `Full season pack · ${goalsTitle(goals, lang)} · 12 weeks` },
        },
      }] : []), ...(running ? [{
        quantity: 1,
        price_data: {
          currency: "eur",
          unit_amount: RUNNING_PRICE,
          product_data: { name: lang === "fr" ? "Option course à pied" : "Running option", description: lang === "fr" ? "Séances de 30 à 45 min" : "30 to 45 min sessions" },
        },
      }] : [])],
      allow_promotion_codes: true,
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
