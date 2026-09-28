import { NextRequest, NextResponse } from "next/server";
import { redis, redisReady } from "@/lib/redis";
import { ACCESS_COOKIE, DEVICE_COOKIE, accessCookie, newDevice } from "@/lib/access";
import { clubPi, openClub } from "@/lib/club-access";

// Opens the animations on this device with a club code (lib/club-access.ts), from the page of an
// exercise or of the library: back to that page with the access cookie, or with ?acces=<reason>
// (club-inconnu, club-fini, club-plein, trop, indisponible).
const NEXT = /^\/(fr|en)\/exercices(\/[a-z0-9-]+){0,2}$/;

export async function POST(req: NextRequest) {
  const form = await req.formData();
  const next = NEXT.test(String(form.get("next"))) ? String(form.get("next")) : "/fr/exercices";
  const back = (why: string) => NextResponse.redirect(`${req.nextUrl.origin}${next}?acces=${why}`, 303);
  // 10 tries per hour and per connection (shared with the customer login), so codes cannot be guessed.
  if (redisReady()) {
    const ip = (req.headers.get("x-forwarded-for") ?? "").split(",")[0].trim() || "?";
    const k = `rl:esp:${ip}:${Math.floor(Date.now() / 3600000)}`;
    try {
      const [n] = await redis([["INCR", k], ["EXPIRE", k, 3600]]);
      if (Number(n) > 10) return back("trop");
    } catch {}
  } else return back("indisponible");
  const device = req.cookies.get(DEVICE_COOKIE)?.value || newDevice();
  try {
    const r = await openClub(String(form.get("code") ?? ""), device);
    if (!r.ok) return back(r.why);
    const res = NextResponse.redirect(`${req.nextUrl.origin}${next}`, 303);
    const opts = { httpOnly: true, secure: req.nextUrl.protocol === "https:", sameSite: "lax" as const, path: "/" };
    res.cookies.set(ACCESS_COOKIE, accessCookie(clubPi(r.code), device, r.end), { ...opts, expires: new Date(r.end) });
    res.cookies.set(DEVICE_COOKIE, device, { ...opts, maxAge: 400 * 86400 });
    return res;
  } catch (e) {
    console.error("[acces-club]", e);
    return back("indisponible");
  }
}
