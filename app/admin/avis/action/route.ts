import { NextRequest, NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { formUrl, PROMO_PERCENT, stripe, toOrder, type Stage } from "@/lib/feedback";
import { mailReady, sendFeedbackRequest } from "@/lib/email";
import { SITE } from "@/lib/dict";
import { nextStep } from "@/lib/next-step";
import { offerOf } from "@/lib/access";

// Admin actions (behind the password in proxy.ts): publish or hide a review, send a
// questionnaire now, free the devices of a customer's access.
export async function POST(req: NextRequest) {
  const form = await req.formData();
  const pi = String(form.get("pi") ?? ""), action = String(form.get("action") ?? "");
  const s = stripe();
  if (!s || !/^pi_\w+$/.test(pi)) return new NextResponse("Requête invalide", { status: 400 });
  if (action === "show" || action === "hide") {
    await s.paymentIntents.update(pi, { metadata: { f_show: action === "show" ? "1" : "" } });
    // Expired at once: the review shows (or hides) on the site straight away.
    revalidateTag("reviews", { expire: 0 });
  } else if (action === "reset-dev") {
    // Frees the devices of a customer's access (new phone…): the next ones can open it again.
    await s.paymentIntents.update(pi, { metadata: { acc_dev: "" } });
  } else if (action === "send-mid" || action === "send-end") {
    const stage: Stage = action === "send-mid" ? "mid" : "end";
    const o = toOrder(await s.paymentIntents.retrieve(pi, { expand: ["latest_charge"] }));
    if (!o.email || !mailReady()) return new NextResponse("Email indisponible", { status: 400 });
    await sendFeedbackRequest({ email: o.email, lang: o.lang, firstName: o.firstName, program: o.program }, stage, formUrl(SITE, o.lang, o.id, stage), PROMO_PERCENT, stage === "end" && offerOf(o.meta) !== "pack" ? nextStep(offerOf(o.meta), Date.now(), o.goals, o.lang) : undefined);
    await s.paymentIntents.update(pi, { metadata: { [stage === "mid" ? "s_mid" : "s_end"]: new Date().toISOString().slice(0, 10) } });
  }
  return NextResponse.redirect(`${req.nextUrl.origin}/admin/avis`, 303);
}
