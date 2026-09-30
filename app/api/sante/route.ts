import { NextResponse } from "next/server";
import { redis, redisReady } from "@/lib/redis";

// Health check for the outside monitoring (.github/workflows/surveillance.yml, or any uptime
// service): 200 when the site answers and its database (Redis) responds, 503 otherwise. It only
// says what works, never a setting or a secret.
export const dynamic = "force-dynamic";

export async function GET() {
  let db = "non branchée";
  if (redisReady()) {
    try {
      const [pong] = await redis([["PING"]]);
      db = pong === null ? "erreur" : "ok";
    } catch {
      db = "erreur";
    }
  }
  const ok = db !== "erreur";
  return NextResponse.json({ ok, site: "ok", base: db, at: new Date().toISOString() }, { status: ok ? 200 : 503, headers: { "Cache-Control": "no-store" } });
}
