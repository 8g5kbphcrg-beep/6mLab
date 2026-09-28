import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/feedback";
import { redis, redisReady } from "@/lib/redis";
import { ACCESS_COOKIE, CLIENT_COOKIE, CLIENT_DAYS, DEVICE_COOKIE, accessCookie, cleanRef, clientCookie, findOrder, newDevice, openAccess } from "@/lib/access";

// Opens the customer area on this device (see lib/access.ts). Sends back to the page asked for:
// with the access cookie when it is open, or with ?acces=<reason> (a-confirmer: the confirmation
// screen before the first opening; inconnue, remboursee, trop-tard, expiree, appareils, trop:
// too many tries, indisponible).
const NEXT = /^\/(fr|en)\/exercices(\/[a-z0-9-]+){0,2}$/;

export async function POST(req: NextRequest) {
  const form = await req.formData();
  const next = NEXT.test(String(form.get("next"))) ? String(form.get("next")) : "/fr/exercices";
  const ref = cleanRef(String(form.get("ref") ?? ""));
  const back = (q: Record<string, string>) => NextResponse.redirect(`${req.nextUrl.origin}${next}?${new URLSearchParams(q)}`, 303);

  // 10 tries per hour and per connection, so references cannot be guessed.
  if (redisReady()) {
    const ip = (req.headers.get("x-forwarded-for") ?? "").split(",")[0].trim() || "?";
    const key = `rl:acc:${ip}:${Math.floor(Date.now() / 3600000)}`;
    try {
      const [n] = await redis([["INCR", key], ["EXPIRE", key, 3600]]);
      if (Number(n) > 10) return back({ acces: "trop" });
    } catch {}
  }
  const s = stripe();
  if (!s) return back({ acces: "indisponible" });
  const device = req.cookies.get(DEVICE_COOKIE)?.value || newDevice();
  try {
    const o = await findOrder(s, ref);
    const r = await openAccess(s, o, device, form.get("confirm") === "1");
    if (!r.ok) return back({ acces: r.why, ...(r.why === "a-confirmer" && o ? { ref, offre: o.offer } : {}) });
    const res = NextResponse.redirect(`${req.nextUrl.origin}${next}`, 303);
    const opts = { httpOnly: true, secure: req.nextUrl.protocol === "https:", sameSite: "lax" as const, path: "/" };
    res.cookies.set(ACCESS_COOKIE, accessCookie(o!.pi, device, r.end), { ...opts, expires: new Date(r.end) });
    res.cookies.set(DEVICE_COOKIE, device, { ...opts, maxAge: 400 * 86400 });
    // Opening the animations also opens the customer area on this device.
    res.cookies.set(CLIENT_COOKIE, clientCookie(o!.pi), { ...opts, maxAge: CLIENT_DAYS * 86400 });
    return res;
  } catch (e) {
    console.error("[acces]", e);
    return back({ acces: "indisponible" });
  }
}
