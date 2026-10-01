import { NextRequest, NextResponse } from "next/server";
import { locales, type Lang } from "@/lib/dict";
import { programs, programSlugs, type ProgramSlug } from "@/lib/programs";
import { buy, genders, places, RUNNING_PRICE, SECOND_GOAL_PRICE, type Gender, type Place } from "@/lib/checkout";
import { quote, today, WEEKS } from "@/lib/season-parts";
import { goalName, goalsTitle, hasSecondGoal, validGoals } from "@/lib/goals";
import { legalPaths } from "@/lib/legal";
import { stripe as stripeClient } from "@/lib/feedback";
import { cleanSrc } from "@/lib/analytics";
import { alert, why } from "@/lib/alert";

export async function POST(req: NextRequest) {
  const form = await req.formData();
  const lang = (locales as readonly string[]).includes(String(form.get("lang"))) ? (form.get("lang") as Lang) : "fr";
  const slug = form.get("program") as ProgramSlug;
  const goals = form.getAll("goal").map(String);
  const running = form.get("running") === "on";
  const pack = form.get("pack") === "on";
  const firstName = String(form.get("firstName") ?? "").trim().slice(0, 50);
  const age = Number(form.get("age"));
  const gender = String(form.get("gender")) as Gender;
  const lieu = String(form.get("lieu")) as Place;
  // Language of the program PDF (the page's unless changed in the form).
  const plang: Lang = form.get("plang") === "en" ? "en" : form.get("plang") === "fr" ? "fr" : lang;
  // Under 18: placed by a parent or legal guardian, who gives their name and ticks their consent
  // (terms of sale, lib/legal.ts); both are kept on the order.
  const parentName = String(form.get("parentName") ?? "").trim().slice(0, 80);
  const parentOk = age >= 18 || (form.get("parent") === "on" && parentName.length >= 3);
  const profileOk = firstName.length > 0 && Number.isInteger(age) && age >= 10 && age <= 99 && genders.includes(gender) && parentOk;
  const origin = req.nextUrl.origin;
  const page = pack ? "saison-complete" : programSlugs.includes(slug) ? slug : "";
  // Today's offer, recomputed here (the form only says which one was chosen): the whole program,
  // or from the current week when the part is under way (lib/season-parts.ts).
  const q = quote(pack ? "pack" : programSlugs.includes(slug) ? slug : "pre-saison");
  const pr = form.get("debut") === "semaine" ? q.pr : null;
  const amount = pr ? pr.price : q.price;
  // The parts of the order in order, and the weeks of program it covers (the animations access).
  const parts = q.slots.map((sl) => sl.part);
  // A Saison complète counts in calendar weeks, from today (or the start of its first part) to the
  // end of its last part, so the late-June break is covered too.
  const last = q.slots[q.slots.length - 1];
  const weeks = pack
    ? Math.ceil((last.end - Math.max(today(), q.slots[0].start)) / (7 * 86400000))
    : pr ? pr.weeks : WEEKS[parts[0]];
  const back = (reason: string) => NextResponse.redirect(`${origin}/${lang}/programmes/${page}?paiement=${reason}#acheter`, 303);

  if (!programSlugs.includes(slug) || !validGoals(goals) || !places.includes(lieu) || !profileOk || form.get("consent") !== "on") return back("invalide");

  const key = process.env.STRIPE_SECRET_KEY;
  // Live payments stay off until the legal pages are filled in (SIRET, address, mediator).
  if (!key || (key.startsWith("sk_live_") && process.env.STRIPE_ALLOW_LIVE !== "1")) return back("indisponible");

  const p = programs[lang][parts[0]];
  // src: where the visit came from (utm link or referring site), for the sales by source in the admin.
  const src = cleanSrc(String(form.get("src") ?? "direct"));
  const meta = { program: parts[0], goals: goals.join("+"), running: running ? "oui" : "non", lieu, plang, ...(pack ? { pack: "oui", parts: parts.join(","), starts: q.slots.map((sl) => new Date(sl.start).toISOString().slice(0, 10)).join(",") } : {}), ...(pr ? { debut: String(pr.week) } : {}), weeks: String(weeks), firstName, age: String(age), ...(age < 18 ? { parent: parentName } : {}), gender, lang, src };
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
          unit_amount: amount,
          product_data: pack
            ? { name: lang === "fr" ? "6M Lab · Saison complète" : "6M Lab · Full season", description: `${goalsTitle(goals, lang)} · ${parts.map((x, i) => `${programs[lang][x].name}${i === 0 && pr ? ` (${buy[lang].fromWeek(pr.week).toLowerCase()})` : ""}`).join(" + ")} · ${buy[lang].places[lieu][0]}` }
            : { name: `6M Lab · ${p.name}`, description: `${goalsTitle(goals, lang)} · ${pr ? buy[lang].fromWeek(pr.week) : p.duration} · ${buy[lang].places[lieu][0]}` },
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
    await alert("checkout", "Un client n'a pas pu accéder à la page de paiement", [`Programme : ${slug}${pack ? " (pack)" : ""}, langue ${lang}`, `Erreur : ${why(e)}`, "", "Le client a vu « paiement indisponible ». Vérifie Stripe (clé STRIPE_SECRET_KEY dans Vercel, compte actif)."]);
    return back("indisponible");
  }
}
