import { NextRequest, NextResponse } from "next/server";
import { DAY, formUrl, paidOrders, PROMO_PERCENT, stripe, whenDays, type Stage } from "@/lib/feedback";
import { mailReady, sendFeedbackRequest, sendTip, TIP_DAYS } from "@/lib/email";
import { recentLeads, unsubUrl } from "@/lib/leads";
import { SITE } from "@/lib/dict";

// Runs once a day (vercel.json): sends the feedback emails that are due, 2 weeks after the
// purchase and at the end of the program. Each email goes out once (s_mid / s_end in the order's
// metadata). Emails that are more than 10 days late are skipped, so switching this on does not
// flood past customers. Also sends the 3 tips to people who asked for the free session (t1, t2,
// t3 in the lead's metadata), at most one per person and per day.
export async function GET(req: NextRequest) {
  if (!process.env.CRON_SECRET || req.headers.get("authorization") !== `Bearer ${process.env.CRON_SECRET}`) return new NextResponse("Unauthorized", { status: 401 });
  const s = stripe();
  if (!s || !mailReady()) return NextResponse.json({ skipped: "not configured" });
  const now = Math.floor(Date.now() / 1000);
  const sent: string[] = [];
  for (const o of await paidOrders(s, now - 100 * DAY)) {
    if (!o.email) continue;
    for (const stage of ["mid", "end"] as Stage[]) {
      const key = stage === "mid" ? "s_mid" : "s_end";
      const age = (now - o.created) / DAY, due = whenDays(stage, o.program);
      if (o.meta[key] || age < due || age > due + 10) continue;
      try {
        await sendFeedbackRequest({ email: o.email, lang: o.lang, firstName: o.firstName, program: o.program }, stage, formUrl(SITE, o.lang, o.id, stage), PROMO_PERCENT);
        await s.paymentIntents.update(o.id, { metadata: { [key]: new Date().toISOString().slice(0, 10) } });
        sent.push(`${o.id}:${stage}`);
      } catch (e) { console.error("[feedback cron]", o.id, e); }
    }
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
    } catch (e) { console.error("[tips cron]", l.id, e); }
  }
  return NextResponse.json({ sent });
}
