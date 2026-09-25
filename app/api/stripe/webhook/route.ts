import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import type { Lang } from "@/lib/dict";
import type { ProgramSlug } from "@/lib/programs";
import type { GoalId } from "@/lib/goals";
import { mailReady, notifyOwner, sendConfirmation, type Order } from "@/lib/email";

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

    // Stripe retries a webhook until it gets a 2xx (and the event keeps its original metadata),
    // so the live session is checked and flagged once emailed.
    const emailed = s.payment_status === "paid" && mailReady() ? (await stripe.checkout.sessions.retrieve(s.id)).metadata?.emailed : "skip";
    if (!emailed && s.customer_details?.email) {
      const order: Order = {
        id: s.id,
        email: s.customer_details.email,
        lang: (m.lang === "en" ? "en" : "fr") as Lang,
        program: m.program as ProgramSlug,
        goals: (m.goals ?? "").split("+") as GoalId[],
        running: m.running === "oui",
        pack: m.pack === "oui",
        firstName: m.firstName ?? "",
        age: m.age ?? "",
        gender: m.gender ?? "",
        amount: s.amount_total ?? 0,
      };
      try {
        const delivered = await sendConfirmation(order);
        await stripe.checkout.sessions.update(s.id, { metadata: { ...m, emailed: delivered ? "programme" : "confirmation" } });
        await notifyOwner(order, delivered).catch((e) => console.error("[notify]", e));
      } catch (e) {
        console.error("[email]", e);
        // The reason (e.g. "Invalid login: 535 ...") shows up in Stripe's webhook log; it never contains the password.
        return NextResponse.json({ error: "email failed", reason: e instanceof Error ? e.message.slice(0, 200) : String(e) }, { status: 500 });
      }
    }
  }
  return NextResponse.json({ received: true });
}
