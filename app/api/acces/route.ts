import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/feedback";
import { ACCESS_COOKIE, DEVICE_COOKIE, accessCookie, findOrderById, newDevice, openAccess } from "@/lib/access";
import { ordersOf, readSession, SESSION_COOKIE } from "@/lib/client-auth";

// Opens the animations of one order on this device (see lib/access.ts), from the customer area,
// where the customer is logged in with their email and a code (lib/client-auth.ts). "confirm" is
// sent by the confirmation screen before the very first opening (the countdown cannot be paused).
// Goes to the page asked for (the library, or the exercise of a PDF's eye) with the access
// cookie, or back to the customer area with ?acces=<reason> (remboursee, trop-tard, expiree,
// appareils, indisponible).
const NEXT = /^\/(fr|en)\/exercices(\/[a-z0-9-]+){0,2}$/;

export async function POST(req: NextRequest) {
  const form = await req.formData();
  const lang = form.get("lang") === "en" ? "en" : "fr";
  const next = NEXT.test(String(form.get("next"))) ? String(form.get("next")) : `/${lang}/exercices`;
  const back = (q: Record<string, string>) => NextResponse.redirect(`${req.nextUrl.origin}/${lang}/espace-client?${new URLSearchParams(q)}`, 303);
  const email = readSession(req.cookies.get(SESSION_COOKIE)?.value);
  if (!email) return back({ next });
  const s = stripe();
  if (!s) return back({ acces: "indisponible" });
  const pi = String(form.get("pi") ?? "");
  const device = req.cookies.get(DEVICE_COOKIE)?.value || newDevice();
  try {
    // Only an order of the logged-in email.
    if (!(await ordersOf(s, email)).some((o) => o.pi === pi)) return back({ acces: "indisponible" });
    const r = await openAccess(s, await findOrderById(s, pi), device, form.get("confirm") === "1");
    if (!r.ok) return back({ acces: r.why, ...(r.why === "a-confirmer" ? { activer: pi } : {}), next });
    const res = NextResponse.redirect(`${req.nextUrl.origin}${next}`, 303);
    const opts = { httpOnly: true, secure: req.nextUrl.protocol === "https:", sameSite: "lax" as const, path: "/" };
    res.cookies.set(ACCESS_COOKIE, accessCookie(pi, device, r.end), { ...opts, expires: new Date(r.end) });
    res.cookies.set(DEVICE_COOKIE, device, { ...opts, maxAge: 400 * 86400 });
    return res;
  } catch (e) {
    console.error("[acces]", e);
    return back({ acces: "indisponible" });
  }
}
