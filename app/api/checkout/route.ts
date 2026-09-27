import { NextRequest, NextResponse } from "next/server";
import { locales, type Lang } from "@/lib/dict";
import { programs, programSlugs, type ProgramSlug } from "@/lib/programs";
import { buy, genders, PACK_PRICE, places, prices, RUNNING_PRICE, SECOND_GOAL_PRICE, type Gender, type Place } from "@/lib/checkout";
import { goalName, goalsTitle, hasSecondGoal, validGoals } from "@/lib/goals";
import { legalPaths } from "@/lib/legal";
import { stripe as stripeClient } from "@/lib/feedback";
import { cleanSrc } from "@/lib/analytics";

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
  const lieu = String(form.get("lieu")) as Place;
  // Language of the program PDF (the page's unless changed in the form).
  const plang: Lang = form.get("plang") === "en" ? "en" : form.get("plang") === "fr" ? "fr" : lang;
  const profileOk = firstName.length > 0 && Number.isInteger(age) && age >= 10 && age <= 99 && genders.includes(gender);
  const origin = req.nextUrl.origin;
  const page = pack ? "saison-complete" : programSlugs.includes(slug) ? slug : "";
  const back = (reason: string) => NextResponse.redirect(`${origin}/${lang}/programmes/${page}?paiement=${reason}#acheter`, 303);

  if (!programSlugs.includes(slug) || !validGoals(goals) || !places.includes(lieu) || !profileOk || form.get("consent") !== "on") return back("invalide");

  const key = process.env.STRIPE_SECRET_KEY;
  // Live payments stay off until the legal pages are filled in (SIRET, address, mediator).
  if (!key || (key.startsWith("sk_live_") && process.env.STRIPE_ALLOW_LIVE !== "1")) return back("indisponible");

  const p = programs[lang][slug];
  // src: where the visit came from (utm link or referring site), for the sales by source in the admin.
  const src = cleanSrc(String(form.get("src") ?? "direct"));
  const meta = { program: slug, goals: goals.join("+"), running: running ? "oui" : "non", lieu, plang, ...(pack ? { pack: "oui" } : {}), firstName, age: String(age), gender, lang, src };
  const stripe = stripeClient()!;
  try {
    // Abandoned carts (app/api/cron): Stripe asks the buyer whether they accept offers by email,
    // and keeps a link that recreates the same order after the page has expired. If the account
    // cannot collect that consent, the payment page opens without it.
    const recovery = { consent_collection: { promotions: "auto" as const }, after_expiration: { recovery: { enabled: true } } };
    const create = (extra: typeof recovery | object) => stripe.checkout.sessions.create({
      ...extra,
      mode: "payment",
      locale: lang,
      line_items: [{
        quantity: 1,
        price_data: {
          currency: "eur",
          unit_amount: pack ? PACK_PRICE : prices[slug],
          product_data: pack
            ? { name: lang === "fr" ? "6M Lab · Pack Saison complète" : "6M Lab · Full season pack", description: `${goalsTitle(goals, lang)} · ${p.name} (${p.duration}) + ${programs[lang]["maintien-saison"].name} (${programs[lang]["maintien-saison"].duration}) · ${buy[lang].places[lieu][0]}` }
            : { name: `6M Lab · ${p.name}`, description: `${goalsTitle(goals, lang)} · ${p.duration} · ${buy[lang].places[lieu][0]}` },
        },
      }, ...(hasSecondGoal(goals) ? [{
        quantity: 1,
        price_data: {
          currency: "eur",
          unit_amount: SECOND_GOAL_PRICE,
          product_data: { name: lang === "fr" ? "Deuxième objectif" : "Second goal", description: goalName(goals[1], lang) },
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
      cancel_url: `${origin}/${lang}/programmes/${page}#acheter`,
    });
    const session = await create(recovery).catch((e) => {
      console.error("[checkout] without recovery:", e?.message);
      return create({});
    });
    return NextResponse.redirect(session.url!, 303);
  } catch (e) {
    console.error("[checkout]", e);
    return back("indisponible");
  }
}
