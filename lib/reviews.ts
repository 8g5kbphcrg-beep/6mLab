import { unstable_cache } from "next/cache";
import { paidOrders, stripe, type FeedbackOrder } from "@/lib/feedback";

// Published reviews: final questionnaires whose author agreed to publication (f_pub) and that
// 6M Lab chose to show (f_show, admin page). The average covers every final questionnaire, not
// only the published ones.
export type Review = { id: string; firstName: string; program: FeedbackOrder["program"]; stars: number; text: string; date: string };
export type ReviewData = { count: number; average: number; reviews: Review[] };

export const getReviews = unstable_cache(async (): Promise<ReviewData> => {
  const s = stripe();
  if (!s) return { count: 0, average: 0, reviews: [] };
  try {
    const done = (await paidOrders(s)).filter((o) => o.meta.f_at && o.meta.f_stars);
    const reviews = done
      .filter((o) => o.meta.f_pub === "1" && o.meta.f_show === "1" && o.meta.f_text)
      .map((o) => ({ id: o.id, firstName: o.firstName, program: o.program, stars: Number(o.meta.f_stars), text: o.meta.f_text, date: o.meta.f_at.slice(0, 10) }));
    const average = done.length ? done.reduce((a, o) => a + Number(o.meta.f_stars), 0) / done.length : 0;
    return { count: done.length, average, reviews };
  } catch (e) {
    console.error("[reviews]", e);
    return { count: 0, average: 0, reviews: [] };
  }
}, ["reviews"], { revalidate: 3600, tags: ["reviews"] });
