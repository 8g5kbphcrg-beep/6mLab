import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

// Receives Stripe events. For now a paid order is only logged: delivery by email is done by hand
// from the Stripe dashboard until automatic sending is built.
export async function POST(req: NextRequest) {
  const key = process.env.STRIPE_SECRET_KEY;
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  const sig = req.headers.get("stripe-signature");
  if (!key || !secret || !sig) return NextResponse.json({ error: "not configured" }, { status: 400 });

  let event: Stripe.Event;
  try {
    event = await new Stripe(key).webhooks.constructEventAsync(await req.text(), sig, secret);
  } catch {
    return NextResponse.json({ error: "bad signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const s = event.data.object;
    console.log("[order]", JSON.stringify({
      id: s.id, email: s.customer_details?.email, amount: s.amount_total, paid: s.payment_status, ...s.metadata,
    }));
  }
  return NextResponse.json({ received: true });
}
