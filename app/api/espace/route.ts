import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/feedback";
import { redis, redisReady } from "@/lib/redis";
import { CLIENT_COOKIE, CLIENT_DAYS, cleanRef, clientCookie, findOrder } from "@/lib/access";

// Opens the customer area on this device with the order reference (lib/access.ts, clientCookie),
// without starting the access to the animations. "sortie" logs out. Sends back to the customer
// area, with ?erreur=<reason> when it did not open (inconnue, remboursee, trop, indisponible).
export async function POST(req: NextRequest) {
  const form = await req.formData();
  const lang = form.get("lang") === "en" ? "en" : "fr";
  const page = (q = "") => NextResponse.redirect(`${req.nextUrl.origin}/${lang}/espace-client${q}`, 303);
  const opts = { httpOnly: true, secure: req.nextUrl.protocol === "https:", sameSite: "lax" as const, path: "/" };
  if (form.get("sortie")) {
    const res = page();
    res.cookies.set(CLIENT_COOKIE, "", { ...opts, maxAge: 0 });
    return res;
  }
  // 10 tries per hour and per connection (shared with the animations), so references cannot be guessed.
  if (redisReady()) {
    const ip = (req.headers.get("x-forwarded-for") ?? "").split(",")[0].trim() || "?";
    const key = `rl:acc:${ip}:${Math.floor(Date.now() / 3600000)}`;
    try {
      const [n] = await redis([["INCR", key], ["EXPIRE", key, 3600]]);
      if (Number(n) > 10) return page("?erreur=trop");
    } catch {}
  }
  const s = stripe();
  if (!s) return page("?erreur=indisponible");
  try {
    const o = await findOrder(s, cleanRef(String(form.get("ref") ?? "")));
    if (!o) return page("?erreur=inconnue");
    if (o.refunded) return page("?erreur=remboursee");
    const res = page();
    res.cookies.set(CLIENT_COOKIE, clientCookie(o.pi), { ...opts, maxAge: CLIENT_DAYS * 86400 });
    return res;
  } catch (e) {
    console.error("[espace]", e);
    return page("?erreur=indisponible");
  }
}
