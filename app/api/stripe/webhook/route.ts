import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import type { Lang } from "@/lib/dict";
import type { ProgramSlug } from "@/lib/programs";
import type { GoalId } from "@/lib/goals";
import { mailReady, notifyOwner, sendConfirmation, type Order } from "@/lib/email";
import { personCode, recordReferral } from "@/lib/referral";
import { emailMark } from "@/lib/client-auth";
import { partOf, refOf } from "@/lib/access";
import { alert, why } from "@/lib/alert";
import { SITE } from "@/lib/dict";

// Receives Stripe events. On a paid checkout it emails the customer (confirmation, plus the
// program PDFs once they exist in programmes/) and sends 6M Lab an order summary.
export async function POST(req: NextRequest) {
  const key = process.env.STRIPE_SECRET_KEY;
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  const sig = req.headers.get("stripe-signature");
  if (!key || !secret || !sig) return NextResponse.json({ error: "not configured" }, { status: 400 });

  const stripe = new Stripe(key);
  let event: Stripe.Event;
  try {
    event = await stripe.webhooks.constructEventAsync(await req.text(), sig, secret);
  } catch {
    return NextResponse.json({ error: "bad signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const s = event.data.object;
    const m = s.metadata ?? {};
    console.log("[order]", JSON.stringify({ id: s.id, email: s.customer_details?.email, amount: s.amount_total, paid: s.payment_status, ...m }));

    // Saved on the PaymentIntent: the order reference (end of the session id, shown in the
    // confirmation email and on the PDFs) and a hash of the buyer's email, which finds their
    // orders when they log in to the customer area (lib/client-auth.ts).
    if (s.payment_status === "paid" && typeof s.payment_intent === "string") {
      await stripe.paymentIntents.update(s.payment_intent, { metadata: { ref: refOf(s.id).toLowerCase(), ...(s.customer_details?.email ? { em: emailMark(s.customer_details.email) } : {}) } }).catch((e) => console.error("[ref]", e));
      // Referral (lib/referral.ts): if this order used a teammate's code, it is noted; the daily
      // cron checks it after a week and gives that teammate their points. A failure here must not
      // hold back the customer's program.
      try {
        await recordReferral(stripe, s);
      } catch (e) {
        await alert(`par:${s.id}`, "Parrainage : une commande avec un code de parrainage n'a pas pu être notée", [`Commande ${refOf(s.id)} (${m.firstName ?? ""}, ${s.customer_details?.email ?? ""})`, `Erreur : ${why(e)}`, "", "Le parrain ne recevra pas ses 50 points pour ce coéquipier. Dis-le à Claude : il peut les ajouter à la main dans Stripe (par_pts)."]);
      }
    }

    // Stripe retries a webhook until it gets a 2xx (and the event keeps its original metadata),
    // so the live session is checked and flagged once emailed.
    const emailed = s.payment_status === "paid" && mailReady() ? (await stripe.checkout.sessions.retrieve(s.id)).metadata?.emailed : "skip";
    if (!emailed && s.customer_details?.email) {
      const order: Order = {
        id: s.id,
        email: s.customer_details.email,
        lang: (m.lang === "en" ? "en" : "fr") as Lang,
        // Orders placed before the choice existed got the program in the language of the page.
        plang: (m.plang === "en" || (!m.plang && m.lang === "en") ? "en" : "fr") as Lang,
        program: partOf(m),
        goals: (m.goals ?? "").split("+") as GoalId[],
        running: m.running === "oui",
        // Orders placed before the choice existed got the home version.
        lieu: m.lieu === "salle" ? "salle" : "maison",
        pack: m.pack === "oui",
        parts: m.parts ? (m.parts.split(",") as ProgramSlug[]) : undefined,
        starts: m.starts ? m.starts.split(",").map((d) => Date.parse(d)) : undefined,
        debut: Number(m.debut) > 1 ? Number(m.debut) : undefined,
        weeks: Number(m.weeks) > 0 ? Number(m.weeks) : undefined,
        firstName: m.firstName ?? "",
        age: m.age ?? "",
        gender: m.gender ?? "",
        parent: m.parent || undefined,
        amount: s.amount_total ?? 0,
      };
      // The buyer's own code to share, shown in the confirmation email.
      if (typeof s.payment_intent === "string") order.referral = await personCode(stripe, s.payment_intent, order.firstName, emailMark(order.email)).catch((e) => { console.error("[parrainage]", e); return undefined; });
      try {
        const delivered = await sendConfirmation(order);
        await stripe.checkout.sessions.update(s.id, { metadata: { ...m, emailed: delivered ? "programme" : "confirmation" } });
        await notifyOwner(order, delivered).catch((e) => console.error("[notify]", e));
      } catch (e) {
        console.error("[email]", e);
        await alert(`order:${s.id}`, "Paiement reçu, mais le programme n'est pas parti", [
          `Client : ${order.firstName} <${order.email}>`,
          `Commande : ${order.program}${order.pack ? " (Saison complète)" : ""}, ${(order.amount / 100).toFixed(2)} €, référence ${refOf(s.id)}`,
          `Erreur : ${why(e)}`,
          "",
          "Stripe va réessayer tout seul pendant 3 jours. Si l'erreur continue, envoie le programme à la main :",
          `${SITE}/admin/avis (bouton « PDF du programme » à côté de la commande).`,
          "Si l'erreur parle de connexion ou de mot de passe (535, Invalid login) : le mot de passe pour app iCloud (MAIL_PASSWORD) est à refaire, voir l'aide-mémoire.",
        ]);
        // The reason (e.g. "Invalid login: 535 ...") shows up in Stripe's webhook log; it never contains the password.
        return NextResponse.json({ error: "email failed", reason: e instanceof Error ? e.message.slice(0, 200) : String(e) }, { status: 500 });
      }
    }
  }
  return NextResponse.json({ received: true });
}
