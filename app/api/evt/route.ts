import { NextRequest, NextResponse } from "next/server";
import { EVENTS, cleanSrc, parisDay, type Evt } from "@/lib/analytics";
import { redis, redisReady } from "@/lib/redis";

// Counts one funnel event (see lib/analytics.ts): adds 1 to "event|detail|source" in the day's
// hash. No IP, no identifier, nothing about the visitor is stored. Robots are ignored.
const BOT = /bot|crawl|spider|slurp|preview|headless|lighthouse|pingdom|monitor|facebookexternalhit|embedly|whatsapp/i;

export async function POST(req: NextRequest) {
  const done = new NextResponse(null, { status: 204 });
  if (!redisReady() || BOT.test(req.headers.get("user-agent") ?? "")) return done;
  let body: { e?: string; d?: string; s?: string };
  try {
    body = JSON.parse(await req.text());
  } catch {
    return done;
  }
  if (!EVENTS.includes(body.e as Evt)) return done;
  const detail = String(body.d ?? "").toLowerCase().replace(/[^a-z0-9_-]+/g, "").slice(0, 40);
  const key = `a:${parisDay()}`;
  try {
    await redis([["HINCRBY", key, `${body.e}|${detail}|${cleanSrc(String(body.s ?? ""))}`, 1], ["EXPIRE", key, 60 * 60 * 24 * 395]]);
  } catch (e) {
    console.error("[evt]", e);
  }
  return done;
}
