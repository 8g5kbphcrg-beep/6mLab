import { NextRequest, NextResponse } from "next/server";
import { locales } from "@/lib/dict";
import { redis } from "@/lib/redis";

// Wrong admin passwords allowed per address and per quarter of an hour, before the admin answers
// "too many tries" whatever the password.
const ADMIN_TRIES = 10, ADMIN_WINDOW = 15 * 60;

// Compares two texts in a time that does not depend on where they differ (their SHA-256 digests).
async function same(a: string, b: string) {
  const [x, y] = await Promise.all([a, b].map(async (s) => new Uint8Array(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(s)))));
  let d = 0;
  for (let i = 0; i < x.length; i++) d |= x[i] ^ y[i];
  return d === 0;
}

// A change sent to the admin (a form, a button) must come from the site itself: the browser sends
// the admin password on its own, so another site could otherwise make it act in your name.
function fromSite(req: NextRequest) {
  const origin = req.headers.get("origin");
  if (origin) {
    try {
      const host = new URL(origin).host;
      return host === req.headers.get("host") || host === req.headers.get("x-forwarded-host");
    } catch { return false; }
  }
  const site = req.headers.get("sec-fetch-site");
  return !site || site === "same-origin" || site === "none";
}

async function admin(req: NextRequest) {
  if (req.method !== "GET" && req.method !== "HEAD" && !fromSite(req)) return new NextResponse("Demande refusée", { status: 403 });
  const pass = process.env.ADMIN_PASSWORD, h = req.headers.get("authorization");
  const ask = () => new NextResponse("Accès réservé", { status: 401, headers: { "WWW-Authenticate": 'Basic realm="6M Lab admin", charset="UTF-8"' } });
  if (!pass || !h?.startsWith("Basic ")) return ask();
  const ip = (req.headers.get("x-forwarded-for") ?? "").split(",")[0].trim() || "?", key = `rl:adm:${ip}`;
  // Without Redis (or if it fails), the password alone still protects the admin.
  const tries = await redis([["GET", key]]).then(([n]) => Number(n ?? 0), () => 0);
  if (tries >= ADMIN_TRIES) return new NextResponse("Trop d'essais : réessaie dans 15 minutes.", { status: 429, headers: { "Retry-After": String(ADMIN_WINDOW) } });
  let given = "";
  try { given = atob(h.slice(6)); } catch {}
  if (await same(given, `6mlab:${pass}`)) return NextResponse.next();
  await redis([["INCR", key], ["EXPIRE", key, ADMIN_WINDOW]]).catch(() => {});
  return ask();
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  // Private admin pages: password prompt (see lib/admin.ts).
  if (pathname === "/admin" || pathname.startsWith("/admin/")) return admin(req);
  if (locales.some((l) => pathname === `/${l}` || pathname.startsWith(`/${l}/`))) return;
  const wantsFr = (req.headers.get("accept-language") ?? "").toLowerCase().startsWith("fr");
  const url = req.nextUrl.clone();
  url.pathname = `/${wantsFr ? "fr" : "en"}${pathname === "/" ? "" : pathname}`;
  return NextResponse.redirect(url);
}

// Every admin address is checked, files included (the club PDFs end in .pdf, which the first
// pattern leaves out).
export const config = { matcher: ["/((?!_next|api|apple-icon|.*\\..*).*)", "/admin/:path*"] };
