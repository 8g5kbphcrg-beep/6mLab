import { unstable_cache } from "next/cache";
import { offerOf } from "@/lib/access";
import { paidOrders, stripe, type FeedbackOrder } from "@/lib/feedback";

// Published reviews: final questionnaires whose author agreed to publication (f_pub) and that
// 6M Lab chose to show (f_show, admin page). The average covers every final questionnaire, not
// only the published ones.
export type Review = { id: string; firstName: string; program: FeedbackOrder["program"]; stars: number; text: string; date: string };
// ratings: the same average for each offer on sale (the pack apart from its two programs), for the
// structured data of each program page (lib/seo.tsx).
export type Rating = { count: number; average: number };
export type ReviewData = { count: number; average: number; reviews: Review[]; ratings: Record<string, Rating> };

export const getReviews = unstable_cache(async (): Promise<ReviewData> => {
  const s = stripe();
  if (!s) return { count: 0, average: 0, reviews: [], ratings: {} };
  try {
    const done = (await paidOrders(s)).filter((o) => o.meta.f_at && o.meta.f_stars);
    const reviews = done
      .filter((o) => o.meta.f_pub === "1" && o.meta.f_show === "1" && o.meta.f_text)
      .map((o) => ({ id: o.id, firstName: o.firstName, program: o.program, stars: Number(o.meta.f_stars), text: o.meta.f_text, date: o.meta.f_at.slice(0, 10) }));
    const average = done.length ? done.reduce((a, o) => a + Number(o.meta.f_stars), 0) / done.length : 0;
    const ratings: Record<string, Rating> = {};
    for (const o of done) {
      const r = (ratings[offerOf(o.meta)] ??= { count: 0, average: 0 });
      r.average = (r.average * r.count + Number(o.meta.f_stars)) / (r.count + 1);
      r.count++;
    }
    return { count: done.length, average, reviews, ratings };
  } catch (e) {
    console.error("[reviews]", e);
    return { count: 0, average: 0, reviews: [], ratings: {} };
  }
}, ["reviews"], { revalidate: 3600, tags: ["reviews"] });

// The rating of an offer for its product data, only while the reviews block (components/Reviews.tsx)
// shows it on the page, as search engines require.
export async function offerRating(offer: string): Promise<Rating | undefined> {
  const { reviews, ratings } = await getReviews();
  return reviews.length && ratings[offer]?.count ? ratings[offer] : undefined;
}
