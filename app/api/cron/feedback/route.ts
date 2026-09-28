import { NextRequest, NextResponse } from "next/server";
import { DAY, formUrl, paidOrders, PROMO_PERCENT, stripe, whenDays, type Stage } from "@/lib/feedback";
import { mailReady, sendAccessEnding, sendCartReminder, sendFeedbackRequest, sendReferralPoints, sendSeasonMail, sendTip, TIP_DAYS } from "@/lib/email";
import { settleReferrals } from "@/lib/referral";
import { nextStep } from "@/lib/next-step";
import { abandonedCarts } from "@/lib/cart";
import { dueCampaign } from "@/lib/season-mail";
import { endOf, offerOf } from "@/lib/access";
import { recentLeads, unsubUrl } from "@/lib/leads";
import { SITE } from "@/lib/dict";
import { alert, why } from "@/lib/alert";

// Runs once a day (vercel.json): sends the feedback emails that are due, 2 weeks after the
// purchase and at the end of the program. Each email goes out once (s_mid / s_end in the order's
// metadata). Emails that are more than 10 days late are skipped, so switching this on does not
// flood past customers. Also sends the 3 tips to people who asked for the free session (t1, t2,
// t3 in the lead's metadata), at most one per person and per day. And warns customers 7 days
// before their access to the animations ends (s_acc). And reminds, once, the buyers whose payment
// page expired in the last 24 hours without an order (lib/cart.ts). And, around the key dates of the
// season, the email of that moment to the subscribers who accepted it (lib/season-mail.ts), at
// most 150 a day so a run stays short; the rest go out on the following days of the week. And the
// referral points, once a teammate's order is a week old (lib/referral.ts).
export async function GET(req: NextRequest) {
  if (!process.env.CRON_SECRET || req.headers.get("authorization") !== `Bearer ${process.env.CRON_SECRET}`) return new NextResponse("Unauthorized", { status: 401 });
  const s = stripe();
  if (!s || !mailReady()) return NextResponse.json({ skipped: "not configured" });
  const now = Math.floor(Date.now() / 1000);
  const sent: string[] = [];
  // Failures of this run, sent as one alert at the end.
  const failed: string[] = [];
  const fail = (what: string, id: string, e: unknown) => { console.error(`[${what}]`, id, e); failed.push(`${what} ${id} : ${why(e)}`); };
  for (const o of await paidOrders(s, now - 100 * DAY)) {
    if (!o.email) continue;
    for (const stage of ["mid", "end"] as Stage[]) {
      const key = stage === "mid" ? "s_mid" : "s_end";
      const age = (now - o.created) / DAY, due = whenDays(stage, o.program);
      if (o.meta[key] || age < due || age > due + 10) continue;
      try {
        // At the end of the program, the email also says what comes next (lib/next-step.ts); not for
        // the pack, whose questionnaire comes at the end of its pre-season, the Maintien already paid.
        await sendFeedbackRequest({ email: o.email, lang: o.lang, firstName: o.firstName, program: o.program }, stage, formUrl(SITE, o.lang, o.id, stage), PROMO_PERCENT, stage === "end" && offerOf(o.meta) !== "pack" ? nextStep(offerOf(o.meta), now * 1000, o.goals, o.lang) : undefined);
        await s.paymentIntents.update(o.id, { metadata: { [key]: new Date().toISOString().slice(0, 10) } });
        sent.push(`${o.id}:${stage}`);
      } catch (e) { fail("feedback cron", o.id, e); }
    }
  }
  for (const o of await paidOrders(s, now - 560 * DAY)) {
    if (!o.email || !o.meta.acc_start || o.meta.s_acc) continue;
    const offer = offerOf(o.meta), end = endOf({ offer, start: Date.parse(o.meta.acc_start) });
    const left = (end - now * 1000) / (DAY * 1000);
    if (left <= 0 || left > 7) continue;
    try {
      await sendAccessEnding({ email: o.email, lang: o.lang, firstName: o.firstName, offer, goals: o.goals }, end);
      await s.paymentIntents.update(o.id, { metadata: { s_acc: new Date().toISOString().slice(0, 10) } });
      sent.push(`${o.id}:acc`);
    } catch (e) { fail("access cron", o.id, e); }
  }
  for (const l of await recentLeads(s, now - 20 * DAY)) {
    if (!l.email || l.meta.unsub) continue;
    const age = (now - l.created) / DAY;
    const n = TIP_DAYS.findIndex((d, i) => !l.meta[`t${i + 1}`] && age >= d && age <= d + 5);
    if (n < 0) continue;
    try {
      await sendTip(l.email, l.lang, (n + 1) as 1 | 2 | 3, unsubUrl(SITE, l.lang, l.id));
      await s.customers.update(l.id, { metadata: { [`t${n + 1}`]: new Date().toISOString().slice(0, 10) } });
      sent.push(`${l.id}:t${n + 1}`);
    } catch (e) { fail("tips cron", l.id, e); }
  }
  const due = dueCampaign();
  if (due) {
    const key = `c_${due.c.id}`, year = String(due.year);
    let n = 0;
    for (const l of await recentLeads(s, 0)) {
      if (n >= 150) break;
      if (!l.email || l.meta.unsub || l.meta.saison !== "1" || l.meta[key] === year || l.created > due.start || !l.meta.t3) continue;
      try {
        await sendSeasonMail(l.email, l.lang, due.c, unsubUrl(SITE, l.lang, l.id));
        await s.customers.update(l.id, { metadata: { [key]: year } });
        sent.push(`${l.id}:${due.c.id}`);
        n++;
      } catch (e) { fail("season cron", l.id, e); }
    }
  }
  for (const c of await abandonedCarts(s, now)) {
    try {
      await sendCartReminder(c, c.link);
      await s.checkout.sessions.update(c.id, { metadata: { relance: new Date().toISOString().slice(0, 10) } }).catch(() => {});
      sent.push(`${c.id}:panier`);
    } catch (e) { fail("cart cron", c.id, e); }
  }
  // Referral points (lib/referral.ts): teammates' orders checked a week after payment.
  for (const n of await settleReferrals(s, now, (id, e) => fail("referral cron", id, e))) {
    try {
      await sendReferralPoints(n);
      sent.push(`${n.email.slice(0, 3)}…:points`);
    } catch (e) { fail("referral mail", n.email, e); }
  }
  if (failed.length) await alert(`cron:${new Date().toISOString().slice(0, 10)}`, `${failed.length} email(s) automatique(s) n'ont pas pu partir`, [...failed.slice(0, 20), "", "Ils seront retentés au prochain passage (chaque jour), tant qu'ils sont dans leur fenêtre d'envoi."]);
  return NextResponse.json({ sent, failed: failed.length });
}
